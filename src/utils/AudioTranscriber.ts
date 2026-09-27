import type { Note } from './Constants';

/**
 * High-Performance, Musical Audio-to-Note Transcriber.
 * Uses Cooley-Tukey Radix-2 FFT with Harmonic Product Spectrum (HPS).
 * Extracts accurate, musical notes (pitch, onset, duration, velocity) from audio/video files
 * in milliseconds with zero UI stutter.
 */
class FastFFT {
  private size: number;
  private cosTable: Float32Array;
  private sinTable: Float32Array;
  private bitReverse: Uint32Array;

  constructor(size: number) {
    this.size = size;
    const half = size / 2;
    this.cosTable = new Float32Array(half);
    this.sinTable = new Float32Array(half);
    for (let i = 0; i < half; i++) {
      const angle = (-2 * Math.PI * i) / size;
      this.cosTable[i] = Math.cos(angle);
      this.sinTable[i] = Math.sin(angle);
    }

    this.bitReverse = new Uint32Array(size);
    const bits = Math.round(Math.log2(size));
    for (let i = 0; i < size; i++) {
      let rev = 0;
      for (let j = 0; j < bits; j++) {
        rev = (rev << 1) | ((i >> j) & 1);
      }
      this.bitReverse[i] = rev;
    }
  }

  public transform(real: Float32Array, imag: Float32Array): void {
    const n = this.size;
    for (let i = 0; i < n; i++) {
      const j = this.bitReverse[i];
      if (j > i) {
        const tr = real[i]; real[i] = real[j]; real[j] = tr;
        const ti = imag[i]; imag[i] = imag[j]; imag[j] = ti;
      }
    }

    for (let len = 2; len <= n; len <<= 1) {
      const halfLen = len >> 1;
      const step = n / len;
      for (let i = 0; i < n; i += len) {
        for (let j = 0; j < halfLen; j++) {
          const tableIdx = j * step;
          const uR = real[i + j];
          const uI = imag[i + j];
          const vR = real[i + j + halfLen] * this.cosTable[tableIdx] - imag[i + j + halfLen] * this.sinTable[tableIdx];
          const vI = real[i + j + halfLen] * this.sinTable[tableIdx] + imag[i + j + halfLen] * this.cosTable[tableIdx];

          real[i + j] = uR + vR;
          imag[i + j] = uI + vI;
          real[i + j + halfLen] = uR - vR;
          imag[i + j + halfLen] = uI - vI;
        }
      }
    }
  }
}

export class AudioTranscriber {
  private static noteCounter = 0;
  private static fftInstance: FastFFT | null = null;
  private static fftSize = 2048;

  private static getFFT(): FastFFT {
    if (!this.fftInstance) {
      this.fftInstance = new FastFFT(this.fftSize);
    }
    return this.fftInstance;
  }

  /**
   * Transcribes an AudioBuffer into clean, accurate musical notes.
   */
  public static async transcribe(
    audioBuffer: AudioBuffer,
    onProgress?: (progress: number) => void
  ): Promise<Note[]> {
    const rawData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const totalSamples = rawData.length;

    // Downsample factor to target ~16,000 Hz (ideal for fast FFT note analysis)
    const downsampleFactor = Math.max(1, Math.round(sampleRate / 16000));
    const effectiveSampleRate = sampleRate / downsampleFactor;
    const effectiveLength = Math.floor(totalSamples / downsampleFactor);

    const pcm = new Float32Array(effectiveLength);
    for (let i = 0; i < effectiveLength; i++) {
      pcm[i] = rawData[i * downsampleFactor];
    }

    const N = this.fftSize;
    const hopSize = 1024; // ~64ms per frame at 16kHz
    const numFrames = Math.floor((effectiveLength - N) / hopSize);

    if (numFrames <= 0) return [];

    const fft = this.getFFT();
    const window = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (N - 1))); // Hanning window
    }

    // Melodic pitch boundaries: A1 (55Hz / MIDI 33) to C7 (2093Hz / MIDI 96)
    const minFreq = 65;
    const maxFreq = 1600;
    const binResolution = effectiveSampleRate / N;
    const minBin = Math.max(2, Math.floor(minFreq / binResolution));
    const maxBin = Math.min(Math.floor(N / 8), Math.ceil(maxFreq / binResolution));

    const real = new Float32Array(N);
    const imag = new Float32Array(N);
    const mag = new Float32Array(N / 2);
    const hps = new Float32Array(maxBin + 1);

    // Frame-level detection storage
    const frameNotes: { midi: number; velocity: number }[] = new Array(numFrames);

    // Calculate overall RMS for adaptive silence gating
    let totalEnergy = 0;
    for (let i = 0; i < effectiveLength; i += 8) {
      totalEnergy += pcm[i] * pcm[i];
    }
    const globalRms = Math.sqrt(totalEnergy / (effectiveLength / 8));
    const silenceGate = Math.max(0.008, globalRms * 0.22);

    for (let f = 0; f < numFrames; f++) {
      if (f % 100 === 0 && onProgress) {
        onProgress(Math.min(0.9, (f / numFrames) * 0.9));
      }

      const offset = f * hopSize;

      // Fast frame RMS
      let frameSumSq = 0;
      for (let j = 0; j < N; j += 4) {
        const val = pcm[offset + j];
        frameSumSq += val * val;
      }
      const frameRms = Math.sqrt((frameSumSq * 4) / N);

      if (frameRms < silenceGate) {
        frameNotes[f] = { midi: -1, velocity: 0 };
        continue;
      }

      // Apply Hanning window
      for (let j = 0; j < N; j++) {
        real[j] = pcm[offset + j] * window[j];
        imag[j] = 0;
      }

      fft.transform(real, imag);

      // Compute log-magnitude spectrum
      for (let k = 0; k < N / 2; k++) {
        const r = real[k];
        const im = imag[k];
        mag[k] = Math.log1p(Math.sqrt(r * r + im * im));
      }

      // Harmonic Product Spectrum (HPS) with 4 harmonics
      // Isolates fundamental pitch by multiplying harmonic frequencies
      let maxHps = -Infinity;
      let bestBin = -1;

      for (let k = minBin; k <= maxBin; k++) {
        // Sum log-magnitudes of fundamental and integer harmonics
        const val = mag[k] + mag[k * 2] * 0.8 + mag[k * 3] * 0.6 + mag[k * 4] * 0.4;
        hps[k] = val;

        if (val > maxHps) {
          maxHps = val;
          bestBin = k;
        }
      }

      // Parabolic interpolation for exact peak frequency
      if (bestBin > minBin && bestBin < maxBin && maxHps > 0.8) {
        const alpha = hps[bestBin - 1];
        const beta = hps[bestBin];
        const gamma = hps[bestBin + 1];
        const denom = alpha - 2 * beta + gamma;
        const delta = denom !== 0 ? (0.5 * (alpha - gamma)) / denom : 0;
        const peakBin = bestBin + delta;
        const freq = peakBin * binResolution;

        if (freq >= 55 && freq <= 1800) {
          const midi = Math.round(69 + 12 * Math.log2(freq / 440));
          if (midi >= 33 && midi <= 96) {
            const velocity = Math.min(1.0, Math.max(0.35, frameRms / (globalRms * 2.2)));
            frameNotes[f] = { midi, velocity };
            continue;
          }
        }
      }

      frameNotes[f] = { midi: -1, velocity: 0 };
    }

    // Assemble continuous frames into clean musical notes
    const extractedNotes: Note[] = [];
    let activeMidi = -1;
    let noteStartFrame = -1;
    let maxVel = 0.5;

    for (let f = 0; f < numFrames; f++) {
      const { midi, velocity } = frameNotes[f];

      if (midi !== activeMidi) {
        // Finalize active note if it meets minimum musical length (140ms)
        if (activeMidi >= 0 && noteStartFrame >= 0) {
          const durationFrames = f - noteStartFrame;
          const durationSeconds = (durationFrames * hopSize) / effectiveSampleRate;

          if (durationSeconds >= 0.14) {
            const startTime = (noteStartFrame * hopSize) / effectiveSampleRate;
            extractedNotes.push({
              id: `tr-${this.noteCounter++}`,
              midi: activeMidi,
              time: Math.round(startTime * 100) / 100,
              duration: Math.max(0.16, Math.round(durationSeconds * 100) / 100),
              velocity: Math.round(maxVel * 100) / 100,
            });
          }
        }

        activeMidi = midi;
        noteStartFrame = f;
        maxVel = velocity;
      } else if (activeMidi >= 0) {
        maxVel = Math.max(maxVel, velocity);
      }
    }

    // Finalize trailing note
    if (activeMidi >= 0 && noteStartFrame >= 0) {
      const durationFrames = numFrames - noteStartFrame;
      const durationSeconds = (durationFrames * hopSize) / effectiveSampleRate;
      if (durationSeconds >= 0.14) {
        const startTime = (noteStartFrame * hopSize) / effectiveSampleRate;
        extractedNotes.push({
          id: `tr-${this.noteCounter++}`,
          midi: activeMidi,
          time: Math.round(startTime * 100) / 100,
          duration: Math.max(0.16, Math.round(durationSeconds * 100) / 100),
          velocity: Math.round(maxVel * 100) / 100,
        });
      }
    }

    // Post-processing: Merge duplicate consecutive notes of same pitch separated by small gap
    const cleanedNotes: Note[] = [];
    for (const note of extractedNotes) {
      if (cleanedNotes.length > 0) {
        const prev = cleanedNotes[cleanedNotes.length - 1];
        const gap = note.time - (prev.time + prev.duration);
        if (prev.midi === note.midi && gap < 0.10) {
          prev.duration = Math.round(((note.time + note.duration) - prev.time) * 100) / 100;
          prev.velocity = Math.max(prev.velocity, note.velocity);
          continue;
        }
      }
      cleanedNotes.push(note);
    }

    if (onProgress) onProgress(1.0);
    return cleanedNotes;
  }
}
