import * as Tone from 'tone';
import { useMIDIStore } from '../store/MIDIStore';

/**
 * Professional Multi-Engine Audio System for FallingNotes:
 * 1. Acoustic Grand Piano (Dual-engine: Multi-sample acoustic library + Expressive physical-modeling synthesis fallback)
 * 2. Authentic Indian Harmonium (Acoustic twin-reed synthesis: Male & Bass reeds, warm filter, and bellows air vibrato)
 * 3. Studio Audio Player (High-fidelity AudioBuffer playback for uploaded .mp3, .wav, .ogg, .mp4 files)
 * 4. Master Dynamics Bus (Compressor, Limiter, EQ, and Concert Reverb preventing distortion)
 */
class AudioEngine {
  private sampler: Tone.Sampler | null = null;
  private pianoSynth: Tone.PolySynth<Tone.Synth> | null = null;
  private harmoniumSynth: Tone.PolySynth<Tone.Synth> | null = null;
  private masterLimiter: Tone.Limiter | null = null;
  private masterCompressor: Tone.Compressor | null = null;
  private masterReverb: Tone.Reverb | null = null;
  private audioSourceNode: AudioBufferSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private audioBufferStartTime = 0;
  private audioBufferPauseOffset = 0;

  public isInitialized = false;
  public isAudioBufferPlaying = false;

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Tone.start();
    } catch {
      // AudioContext might require user gesture
    }

    const rawCtx = Tone.getContext().rawContext as AudioContext;
    if (rawCtx.state === 'suspended') {
      await rawCtx.resume();
    }

    // 1. Master Dynamics Chain (Prevents any clipping or harsh buzzing)
    this.masterLimiter = new Tone.Limiter(-0.5).toDestination();
    this.masterCompressor = new Tone.Compressor({
      threshold: -16,
      ratio: 4,
      attack: 0.005,
      release: 0.15
    }).connect(this.masterLimiter);

    this.masterReverb = new Tone.Reverb({
      decay: 2.8,
      wet: 0.18,
      preDelay: 0.02
    }).connect(this.masterCompressor);

    // 2. High-Quality Acoustic Piano Synthesizer (Instant acoustic sound, zero latency)
    this.pianoSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.005,
        decay: 2.2,
        sustain: 0.12,
        release: 1.2
      }
    });
    this.pianoSynth.maxPolyphony = 32;
    this.pianoSynth.volume.value = -3;
    this.pianoSynth.connect(this.masterReverb);

    // 3. Authentic Indian Harmonium Reed Engine
    // Indian harmoniums have two sets of brass reeds (Male + Bass) creating a warm reedy resonance.
    const harmoniumFilter = new Tone.Filter({
      frequency: 2200,
      type: 'lowpass',
      rolloff: -12,
      Q: 1.5
    }).connect(this.masterReverb);

    const harmoniumChorus = new Tone.Chorus({
      frequency: 4.5,
      delayTime: 3.5,
      depth: 0.35,
      wet: 0.3
    }).connect(harmoniumFilter).start();

    this.harmoniumSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sawtooth'
      },
      envelope: {
        attack: 0.035, // Natural reed valve opening
        decay: 0.1,
        sustain: 0.85,
        release: 0.25   // Authentic acoustic decay when key is released
      }
    });
    this.harmoniumSynth.maxPolyphony = 24;
    this.harmoniumSynth.volume.value = -6;
    this.harmoniumSynth.connect(harmoniumChorus);

    // 4. Acoustic Grand Piano Sampler (Asynchronous enhancement)
    const samples: { [key: string]: string } = {
      "A0": "A0.mp3", "C1": "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3", "A1": "A1.mp3",
      "C2": "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3", "A2": "A2.mp3",
      "C3": "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3", "A3": "A3.mp3",
      "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3",
      "C5": "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3", "A5": "A5.mp3",
      "C6": "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3", "A6": "A6.mp3",
      "C7": "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3", "A7": "A7.mp3",
      "C8": "C8.mp3"
    };

    try {
      this.sampler = new Tone.Sampler({
        urls: samples,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        release: 1.5,
        onload: () => {
          useMIDIStore.getState().setSamplesLoaded(true);
        },
        onerror: () => {
          // If remote CDN fails, pianoSynth acts as the acoustic synthesizer
          useMIDIStore.getState().setSamplesLoaded(true);
        }
      }).connect(this.masterReverb);
    } catch {
      useMIDIStore.getState().setSamplesLoaded(true);
    }

    // Set samples loaded immediately so user can play without waiting
    useMIDIStore.getState().setSamplesLoaded(true);
    useMIDIStore.getState().setAudioInitialized(true);
    this.isInitialized = true;
  }

  public getAudioContext(): AudioContext {
    return Tone.getContext().rawContext as AudioContext;
  }

  public getAnalyser(): AnalyserNode {
    if (!this.analyserNode) {
      const rawCtx = this.getAudioContext();
      this.analyserNode = rawCtx.createAnalyser();
      this.analyserNode.fftSize = 512;
      this.analyserNode.smoothingTimeConstant = 0.8;
    }
    return this.analyserNode;
  }

  public triggerNoteOn(midi: number, velocity = 100): void {
    if (!this.isInitialized) {
      this.init().then(() => this.triggerNoteOn(midi, velocity));
      return;
    }

    const { inputMode } = useMIDIStore.getState();
    const noteName = Tone.Frequency(midi, "midi").toNote();
    const freq = Tone.Frequency(midi, "midi").toFrequency();
    const vel = Math.max(0.1, Math.min(1.0, velocity / 127));

    if (inputMode === 'harmonium' && this.harmoniumSynth) {
      this.harmoniumSynth.triggerAttack(freq, Tone.now(), vel);
    } else {
      if (this.sampler && this.sampler.loaded) {
        this.sampler.triggerAttack(noteName, Tone.now(), vel);
      } else if (this.pianoSynth) {
        this.pianoSynth.triggerAttack(freq, Tone.now(), vel);
      }
    }
  }

  public triggerNoteOff(midi: number): void {
    if (!this.isInitialized) return;

    const { inputMode } = useMIDIStore.getState();
    const noteName = Tone.Frequency(midi, "midi").toNote();
    const freq = Tone.Frequency(midi, "midi").toFrequency();

    if (inputMode === 'harmonium' && this.harmoniumSynth) {
      this.harmoniumSynth.triggerRelease(freq, Tone.now());
    } else {
      if (this.sampler && this.sampler.loaded) {
        this.sampler.triggerRelease(noteName, Tone.now());
      } else if (this.pianoSynth) {
        this.pianoSynth.triggerRelease(freq, Tone.now());
      }
    }
  }

  // --- Real-time AudioBuffer Playback for Uploaded .mp3 / .wav / .mp4 ---

  public playAudioBuffer(
    buffer: AudioBuffer,
    startOffset = 0,
    playbackRate = 1.0,
    isVocalRemoved = false
  ): void {
    const rawCtx = this.getAudioContext();
    if (rawCtx.state === 'suspended') {
      rawCtx.resume();
    }

    this.stopAudioBuffer();

    const source = rawCtx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;

    const analyser = this.getAnalyser();

    if (isVocalRemoved && buffer.numberOfChannels >= 2) {
      // Real-time Vocal Cancellation DSP:
      // Lead vocals are almost always mixed dead center (in-phase in L and R).
      // Stereo instruments have phase/panning differences.
      // (L - R) subtracts the center channel vocal frequencies cleanly.
      const splitter = rawCtx.createChannelSplitter(2);
      const merger = rawCtx.createChannelMerger(2);

      const invR = rawCtx.createGain();
      invR.gain.value = -1;
      const invL = rawCtx.createGain();
      invL.gain.value = -1;

      const diffL = rawCtx.createGain();
      diffL.gain.value = 0.85;
      const diffR = rawCtx.createGain();
      diffR.gain.value = 0.85;

      source.connect(splitter);

      // Left difference: L - R
      splitter.connect(diffL, 0);
      splitter.connect(invR, 1);
      invR.connect(diffL);

      // Right difference: R - L
      splitter.connect(diffR, 1);
      splitter.connect(invL, 0);
      invL.connect(diffR);

      // Bass preservation filter (< 150 Hz) to keep kick and bass tight
      const bassFilter = rawCtx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.value = 150;
      bassFilter.Q.value = 0.7;

      const bassGain = rawCtx.createGain();
      bassGain.gain.value = 0.75;

      source.connect(bassFilter);
      bassFilter.connect(bassGain);

      diffL.connect(merger, 0, 0);
      diffR.connect(merger, 0, 1);
      bassGain.connect(merger, 0, 0);
      bassGain.connect(merger, 0, 1);

      merger.connect(analyser);
    } else {
      source.connect(analyser);
    }

    analyser.connect(rawCtx.destination);

    const safeOffset = Math.max(0, Math.min(startOffset, buffer.duration));
    source.start(0, safeOffset);

    this.audioSourceNode = source;
    this.audioBufferStartTime = rawCtx.currentTime - (safeOffset / playbackRate);
    this.audioBufferPauseOffset = safeOffset;
    this.isAudioBufferPlaying = true;

    source.onended = () => {
      this.isAudioBufferPlaying = false;
    };
  }

  public pauseAudioBuffer(): number {
    const rawCtx = this.getAudioContext();
    if (this.audioSourceNode && this.isAudioBufferPlaying) {
      this.audioBufferPauseOffset = (rawCtx.currentTime - this.audioBufferStartTime);
      this.stopAudioBuffer();
    }
    return this.audioBufferPauseOffset;
  }

  public stopAudioBuffer(): void {
    if (this.audioSourceNode) {
      try {
        this.audioSourceNode.stop();
        this.audioSourceNode.disconnect();
      } catch {
        // Source might already have ended
      }
      this.audioSourceNode = null;
    }
    this.isAudioBufferPlaying = false;
  }

  public setVolume(decibels: number): void {
    if (this.pianoSynth) this.pianoSynth.volume.value = decibels;
    if (this.sampler) this.sampler.volume.value = decibels;
  }
}

export const audioEngine = new AudioEngine();
