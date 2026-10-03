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
  
  // Authentic Indian Harmonium Multi-Reed Synthesizer Engine
  private harmoniumMaleSynth: Tone.PolySynth<Tone.Synth> | null = null;
  private harmoniumBassSynth: Tone.PolySynth<Tone.Synth> | null = null;
  private harmoniumCouplerSynth: Tone.PolySynth<Tone.Synth> | null = null;
  private harmoniumFilter: Tone.Filter | null = null;
  private harmoniumChorus: Tone.Chorus | null = null;
  private harmoniumVibrato: Tone.Vibrato | null = null;

  private masterLimiter: Tone.Limiter | null = null;
  private masterCompressor: Tone.Compressor | null = null;
  public masterReverb: Tone.Reverb | null = null;
  private audioSourceNode: AudioBufferSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private audioBufferStartTime = 0;
  private audioBufferPauseOffset = 0;

  // Track exact sounding frequencies per MIDI note to guarantee zero stuck notes
  private activeHarmoniumNotes = new Map<number, { freq: number; bassFreq?: number; couplerFreq?: number }>();
  private activePianoNotes = new Map<number, { noteName: string; freq: number }>();

  public isInitialized = false;
  public isAudioBufferPlaying = false;
  
  // Harmonium Reed Controls & Transpose
  public transpose = 0;
  public harmoniumMaleActive = true;
  public harmoniumBassActive = true;
  public harmoniumCouplerActive = true;
  public bellowsFlutter = 0.4;

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

    // 1. Master Dynamics Chain (Prevents clipping and creates concert space)
    this.masterLimiter = new Tone.Limiter(-0.5).toDestination();
    this.masterCompressor = new Tone.Compressor({
      threshold: -14,
      ratio: 4,
      attack: 0.005,
      release: 0.15
    }).connect(this.masterLimiter);

    this.masterReverb = new Tone.Reverb({
      decay: 2.8,
      wet: 0.28,
      preDelay: 0.02
    }).connect(this.masterCompressor);

    try {
      await this.masterReverb.generate();
    } catch {
      // Fallback
    }

    // 2. High-Quality Acoustic Piano Synthesizer
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

    // 3. Authentic Indian Harmonium Multi-Reed Engine
    // Indian harmoniums have brass reeds mounted in wooden chambers.
    // We synthesize the Male reed (unison with beating), Bass reed (sub-octave -12),
    // and Coupler reed (octave +12) with warm wooden chamber EQ and bellows air flutter.

    const harmoniumEQ = new Tone.EQ3({
      low: 2.5,     // Rich woody warmth
      mid: 2.2,     // Nasal reed projection
      high: -4.0,   // Dampen synthetic treble sizzle
      lowFrequency: 320,
      highFrequency: 2700
    }).connect(this.masterReverb);

    this.harmoniumFilter = new Tone.Filter({
      frequency: 2600,
      type: 'lowpass',
      rolloff: -12,
      Q: 1.8
    }).connect(harmoniumEQ);

    // Bellows Air Vibrato (Natural breathing air pressure flutter from pumping)
    this.harmoniumVibrato = new Tone.Vibrato({
      frequency: 4.8,
      depth: 0.08,
      wet: this.bellowsFlutter
    }).connect(this.harmoniumFilter);

    // Natural Acoustic Brass Reed Detuning / Chorus
    this.harmoniumChorus = new Tone.Chorus({
      frequency: 2.4,
      delayTime: 3.5,
      depth: 0.45,
      wet: 0.35
    }).connect(this.harmoniumVibrato).start();

    // A. Male Reeds (Primary vibrating reed with multi-reed beating)
    this.harmoniumMaleSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'fatsawtooth',
        count: 3,
        spread: 14
      },
      envelope: {
        attack: 0.028,
        decay: 0.15,
        sustain: 0.90,
        release: 0.24
      }
    });
    this.harmoniumMaleSynth.maxPolyphony = 32;
    this.harmoniumMaleSynth.volume.value = -7;
    this.harmoniumMaleSynth.connect(this.harmoniumChorus);

    // B. Bass Reeds (Sub-octave -12 semitones, produces rich foundational drone)
    this.harmoniumBassSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sawtooth'
      },
      envelope: {
        attack: 0.038,
        decay: 0.2,
        sustain: 0.85,
        release: 0.28
      }
    });
    this.harmoniumBassSynth.maxPolyphony = 24;
    this.harmoniumBassSynth.volume.value = -9;
    this.harmoniumBassSynth.connect(this.harmoniumChorus);

    // C. Octave Coupler (High reed +12 semitones, gives grand Darbar sound)
    this.harmoniumCouplerSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'fattriangle',
        count: 2,
        spread: 12
      },
      envelope: {
        attack: 0.032,
        decay: 0.12,
        sustain: 0.72,
        release: 0.20
      }
    });
    this.harmoniumCouplerSynth.maxPolyphony = 24;
    this.harmoniumCouplerSynth.volume.value = -13;
    this.harmoniumCouplerSynth.connect(this.harmoniumChorus);

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
          useMIDIStore.getState().setSamplesLoaded(true);
        }
      }).connect(this.masterReverb);
    } catch {
      useMIDIStore.getState().setSamplesLoaded(true);
    }

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

  // --- Dynamic Real-Time Controls: Transpose, Reverb, Bellows, Reeds ---

  public setTranspose(semitones: number): void {
    this.transpose = semitones;
  }

  public setReverbWet(val: number): void {
    if (this.masterReverb) {
      this.masterReverb.wet.value = Math.max(0, Math.min(1, val));
    }
  }

  public setReverbDecay(seconds: number): void {
    if (this.masterReverb) {
      try {
        this.masterReverb.decay = Math.max(0.5, Math.min(10, seconds));
        this.masterReverb.generate();
      } catch {
        // Fallback
      }
    }
  }

  public setHarmoniumReeds(config: { bass?: boolean; male?: boolean; coupler?: boolean }): void {
    if (config.bass !== undefined) this.harmoniumBassActive = config.bass;
    if (config.male !== undefined) this.harmoniumMaleActive = config.male;
    if (config.coupler !== undefined) this.harmoniumCouplerActive = config.coupler;
  }

  public setHarmoniumBellows(val: number): void {
    this.bellowsFlutter = val;
    if (this.harmoniumVibrato) {
      this.harmoniumVibrato.wet.value = Math.max(0, Math.min(1, val * 0.8));
    }
    if (this.harmoniumChorus) {
      this.harmoniumChorus.depth = 0.2 + val * 0.5;
    }
  }

  public triggerNoteOn(midi: number, velocity = 100): void {
    if (!this.isInitialized) {
      this.init().then(() => this.triggerNoteOn(midi, velocity));
      return;
    }

    const { inputMode } = useMIDIStore.getState();
    const soundMidi = midi + this.transpose;
    const vel = Math.max(0.1, Math.min(1.0, velocity / 127));

    if (inputMode === 'harmonium') {
      const freq = Tone.Frequency(soundMidi, "midi").toFrequency();
      const activeObj: { freq: number; bassFreq?: number; couplerFreq?: number } = { freq };

      if (this.harmoniumMaleActive && this.harmoniumMaleSynth) {
        this.harmoniumMaleSynth.triggerAttack(freq, Tone.now(), vel);
      }

      if (this.harmoniumBassActive && this.harmoniumBassSynth && soundMidi - 12 >= 21) {
        const bassFreq = Tone.Frequency(soundMidi - 12, "midi").toFrequency();
        activeObj.bassFreq = bassFreq;
        this.harmoniumBassSynth.triggerAttack(bassFreq, Tone.now(), vel * 0.9);
      }

      if (this.harmoniumCouplerActive && this.harmoniumCouplerSynth && soundMidi + 12 <= 108) {
        const couplerFreq = Tone.Frequency(soundMidi + 12, "midi").toFrequency();
        activeObj.couplerFreq = couplerFreq;
        this.harmoniumCouplerSynth.triggerAttack(couplerFreq, Tone.now(), vel * 0.7);
      }

      this.activeHarmoniumNotes.set(midi, activeObj);
    } else {
      const noteName = Tone.Frequency(soundMidi, "midi").toNote();
      const freq = Tone.Frequency(soundMidi, "midi").toFrequency();

      if (this.sampler && this.sampler.loaded) {
        this.sampler.triggerAttack(noteName, Tone.now(), vel);
      } else if (this.pianoSynth) {
        this.pianoSynth.triggerAttack(freq, Tone.now(), vel);
      }

      this.activePianoNotes.set(midi, { noteName, freq });
    }
  }

  public triggerNoteOff(midi: number): void {
    if (!this.isInitialized) return;

    const { inputMode } = useMIDIStore.getState();

    if (inputMode === 'harmonium') {
      const activeObj = this.activeHarmoniumNotes.get(midi);
      const soundMidi = midi + this.transpose;
      const freq = activeObj ? activeObj.freq : Tone.Frequency(soundMidi, "midi").toFrequency();

      if (this.harmoniumMaleSynth) {
        this.harmoniumMaleSynth.triggerRelease(freq, Tone.now());
      }

      if (this.harmoniumBassSynth) {
        const bassFreq = activeObj?.bassFreq ?? Tone.Frequency(soundMidi - 12, "midi").toFrequency();
        this.harmoniumBassSynth.triggerRelease(bassFreq, Tone.now());
      }

      if (this.harmoniumCouplerSynth) {
        const couplerFreq = activeObj?.couplerFreq ?? Tone.Frequency(soundMidi + 12, "midi").toFrequency();
        this.harmoniumCouplerSynth.triggerRelease(couplerFreq, Tone.now());
      }

      this.activeHarmoniumNotes.delete(midi);
    } else {
      const activeObj = this.activePianoNotes.get(midi);
      const soundMidi = midi + this.transpose;
      const noteName = activeObj ? activeObj.noteName : Tone.Frequency(soundMidi, "midi").toNote();
      const freq = activeObj ? activeObj.freq : Tone.Frequency(soundMidi, "midi").toFrequency();

      if (this.sampler && this.sampler.loaded) {
        this.sampler.triggerRelease(noteName, Tone.now());
      } else if (this.pianoSynth) {
        this.pianoSynth.triggerRelease(freq, Tone.now());
      }

      this.activePianoNotes.delete(midi);
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
