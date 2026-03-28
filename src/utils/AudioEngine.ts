import * as Tone from 'tone';
import { useMIDIStore } from '../store/MIDIStore';

class AudioEngine {
  private sampler: Tone.Sampler | null = null;
  public isInitialized = false;

  async init() {
    if (this.isInitialized) return;

    // Use a high-quality piano sampler
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

    const baseUrl = "https://tonejs.github.io/audio/salamander/";

    const reverb = new Tone.Reverb({
      decay: 3.5,
      wet: 0.25
    }).toDestination();

    this.sampler = new Tone.Sampler({
      urls: samples,
      baseUrl: baseUrl,
      release: 1,
      onload: () => {
        console.log("Piano samples loaded with Reverb");
        useMIDIStore.getState().setSamplesLoaded(true);
      }
    }).connect(reverb);

    await Tone.start();
    this.isInitialized = true;
  }

  playNote(note: string | number, velocity: number = 0.5) {
    if (!this.sampler || !this.sampler.loaded) return;
    this.sampler.triggerAttack(note, Tone.now(), velocity);
  }

  releaseNote(note: string | number) {
    if (!this.sampler) return;
    this.sampler.triggerRelease(note, Tone.now());
  }

  setVolume(decibels: number) {
    if (!this.sampler) return;
    this.sampler.volume.value = decibels;
  }
}

export const audioEngine = new AudioEngine();
