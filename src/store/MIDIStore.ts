import { create } from 'zustand';
import { Midi } from '@tonejs/midi';
import type { Note } from '../utils/Constants';
import { audioEngine } from '../utils/AudioEngine';
import { AudioTranscriber } from '../utils/AudioTranscriber';
import { DEMO_SONGS } from '../utils/DemoSongs';

interface MIDIStore {
  midiData: Midi | null;
  audioBuffer: AudioBuffer | null;
  audioFileName: string | null;
  notes: Note[];
  totalDuration: number;
  activeNotes: Set<number>;
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  liveHistory: Note[];
  activeLiveNotes: Map<number, Note>;
  nextNoteIndex: number;
  isSamplesLoaded: boolean;
  isAudioInitialized: boolean;
  inputMode: 'piano' | 'harmonium';
  liveTime: number;
  showNotesManual: boolean;
  audioPlayMode: 'original_audio' | 'vocal_remover' | 'instrument_only';
  showLabels: 'both' | 'notes' | 'keys' | 'none';
  transpose: number;
  octaveShift: number;
  reverbWet: number;
  reverbDecay: number;
  harmoniumBassReed: boolean;
  harmoniumCoupler: boolean;
  harmoniumBellows: number;
  showSettings: boolean;
  showGuide: boolean;
  showSongSearch: boolean;
  isPerformanceMode: boolean;
  isTranscribing: boolean;
  transcriptionProgress: number;

  loadMIDI: (file: File) => Promise<void>;
  loadAudioOrVideo: (file: File) => Promise<void>;
  loadDemo: (index: number) => void;
  loadCustomSong: (name: string, notes: Note[], mode?: 'piano' | 'harmonium', autoPlay?: boolean) => void;
  togglePlay: () => void;
  reset: () => void;
  clearMidi: () => void;
  seekTo: (time: number) => void;
  setSpeed: (speed: number) => void;
  setAudioPlayMode: (mode: 'original_audio' | 'vocal_remover' | 'instrument_only') => void;
  setShowLabels: (labels: 'both' | 'notes' | 'keys' | 'none') => void;
  toggleNotesManual: () => void;
  setShowNotesManual: (val: boolean) => void;
  toggleSongSearch: () => void;
  setShowSongSearch: (val: boolean) => void;
  updateTime: (deltaSeconds: number) => void;
  triggerNoteOn: (midi: number, velocity?: number, isLive?: boolean) => void;
  triggerNoteOff: (midi: number, isLive?: boolean) => void;
  setSamplesLoaded: (loaded: boolean) => void;
  setAudioInitialized: (val: boolean) => void;
  setInputMode: (mode: 'piano' | 'harmonium') => void;
  setTranspose: (val: number) => void;
  setOctaveShift: (val: number) => void;
  setReverbWet: (val: number) => void;
  setReverbDecay: (val: number) => void;
  setHarmoniumConfig: (config: { bass?: boolean; coupler?: boolean; bellows?: number }) => void;
  toggleSettings: () => void;
  toggleGuide: () => void;
  togglePerformanceMode: () => void;
}

let noteCounter = 0;
// Fast active note expiration tracker: midi -> note end time (seconds)
const activeMidiExpirations = new Map<number, number>();

export const useMIDIStore = create<MIDIStore>((set, get) => ({
  midiData: null,
  audioBuffer: null,
  audioFileName: null,
  notes: [],
  totalDuration: 0,
  activeNotes: new Set(),
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1,
  liveHistory: [],
  activeLiveNotes: new Map(),
  nextNoteIndex: 0,
  isSamplesLoaded: false,
  isAudioInitialized: false,
  inputMode: 'piano',
  liveTime: 0,
  showNotesManual: false,
  // High fidelity studio audio by default on uploaded files
  audioPlayMode: 'original_audio',
  showLabels: 'both',
  transpose: 0,
  octaveShift: 3,
  reverbWet: 0.28,
  reverbDecay: 2.8,
  harmoniumBassReed: true,
  harmoniumCoupler: true,
  harmoniumBellows: 0.4,
  showSettings: false,
  showGuide: false,
  showSongSearch: false,
  isPerformanceMode: false,
  isTranscribing: false,
  transcriptionProgress: 0,

  loadMIDI: async (file) => {
    try {
      audioEngine.stopAudioBuffer();
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);
      const allNotes: Note[] = [];
      let maxTime = 0;

      midi.tracks.forEach((track) => {
        // Skip percussion/drum tracks if tonal tracks exist
        const hasTonalTracks = midi.tracks.some(
          (t) => !t.instrument?.percussion && t.channel !== 9 && t.notes.length > 0
        );
        if (hasTonalTracks && (track.instrument?.percussion || track.channel === 9)) {
          return;
        }

        track.notes.forEach((note) => {
          const endTime = note.time + note.duration;
          if (endTime > maxTime) maxTime = endTime;

          allNotes.push({
            id: `m-${noteCounter++}`,
            midi: note.midi,
            time: note.time,
            duration: Math.max(0.08, note.duration),
            velocity: note.velocity,
          });
        });
      });

      allNotes.sort((a, b) => a.time - b.time);
      activeMidiExpirations.clear();

      set({
        midiData: midi,
        audioBuffer: null,
        audioFileName: file.name,
        notes: allNotes,
        totalDuration: maxTime,
        audioPlayMode: 'instrument_only', // MIDI files are pure instrument notes
        isPlaying: false,
        currentTime: 0,
        nextNoteIndex: 0,
        activeNotes: new Set(),
        liveHistory: []
      });
    } catch (err) {
      console.error("Failed to parse MIDI file:", err);
    }
  },

  loadAudioOrVideo: async (file) => {
    try {
      audioEngine.stopAudioBuffer();
      set({ isTranscribing: true, transcriptionProgress: 0.1 });

      const audioCtx = audioEngine.getAudioContext();
      const arrayBuffer = await file.arrayBuffer();

      set({ transcriptionProgress: 0.3 });
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      set({ transcriptionProgress: 0.5 });
      const extractedNotes = await AudioTranscriber.transcribe(
        decodedBuffer,
        (progress) => set({ transcriptionProgress: 0.5 + progress * 0.45 })
      );

      activeMidiExpirations.clear();
      set({
        midiData: null,
        audioBuffer: decodedBuffer,
        audioFileName: file.name,
        notes: extractedNotes,
        totalDuration: decodedBuffer.duration,
        audioPlayMode: 'original_audio',
        isPlaying: false,
        currentTime: 0,
        nextNoteIndex: 0,
        activeNotes: new Set(),
        liveHistory: [],
        isTranscribing: false,
        transcriptionProgress: 1.0
      });
    } catch (err) {
      console.error("Failed to decode audio/video file:", err);
      set({ isTranscribing: false });
    }
  },

  loadDemo: (index) => {
    const demo = DEMO_SONGS[index] || DEMO_SONGS[0];
    audioEngine.stopAudioBuffer();
    activeMidiExpirations.clear();

    const maxTime = demo.notes.reduce((max, n) => Math.max(max, n.time + n.duration), 0);

    set({
      midiData: null,
      audioBuffer: null,
      audioFileName: demo.name,
      notes: [...demo.notes],
      totalDuration: maxTime,
      inputMode: demo.mode,
      isPlaying: false,
      currentTime: 0,
      nextNoteIndex: 0,
      activeNotes: new Set(),
      liveHistory: []
    });
  },

  loadCustomSong: (name, customNotes, mode, autoPlay = true) => {
    audioEngine.stopAudioBuffer();
    activeMidiExpirations.clear();
    const maxTime = customNotes.reduce((max, n) => Math.max(max, n.time + n.duration), 0);
    const chosenMode = mode || get().inputMode;

    set({
      midiData: null,
      audioBuffer: null,
      audioFileName: name,
      notes: [...customNotes],
      totalDuration: maxTime,
      inputMode: chosenMode,
      isPlaying: false,
      currentTime: 0,
      nextNoteIndex: 0,
      activeNotes: new Set(),
      liveHistory: []
    });

    if (autoPlay) {
      audioEngine.init().then(() => {
        set({ isPlaying: true });
      });
    }
  },

  togglePlay: () => {
    const state = get();
    const willPlay = !state.isPlaying;

    if (willPlay) {
      if (state.audioBuffer) {
        if (state.audioPlayMode === 'original_audio') {
          audioEngine.playAudioBuffer(state.audioBuffer, state.currentTime, state.playbackSpeed, false);
        } else if (state.audioPlayMode === 'vocal_remover') {
          audioEngine.playAudioBuffer(state.audioBuffer, state.currentTime, state.playbackSpeed, true);
        }
      }
    } else {
      if (state.audioBuffer) {
        audioEngine.pauseAudioBuffer();
      }
      // Release any sounding notes
      state.activeNotes.forEach((midi) => audioEngine.triggerNoteOff(midi));
      activeMidiExpirations.clear();
    }

    set({ isPlaying: willPlay });
  },

  reset: () => {
    const state = get();
    if (state.audioBuffer) {
      audioEngine.stopAudioBuffer();
    }
    state.activeNotes.forEach((midi) => audioEngine.triggerNoteOff(midi));
    activeMidiExpirations.clear();

    set({
      currentTime: 0,
      nextNoteIndex: 0,
      activeNotes: new Set(),
      isPlaying: false,
      liveHistory: []
    });
  },

  clearMidi: () => {
    const state = get();
    if (state.audioBuffer) {
      audioEngine.stopAudioBuffer();
    }
    state.activeNotes.forEach((midi) => audioEngine.triggerNoteOff(midi));
    activeMidiExpirations.clear();

    set({
      midiData: null,
      audioBuffer: null,
      audioFileName: null,
      notes: [],
      totalDuration: 0,
      isPlaying: false,
      currentTime: 0,
      nextNoteIndex: 0,
      activeNotes: new Set(),
      liveHistory: []
    });
  },

  seekTo: (time: number) => {
    const state = get();
    const targetTime = Math.max(0, Math.min(time, state.totalDuration || 9999));

    // Stop active sounding notes
    state.activeNotes.forEach((midi) => audioEngine.triggerNoteOff(midi));
    activeMidiExpirations.clear();

    // Find the next note index
    let nextIndex = 0;
    while (nextIndex < state.notes.length && state.notes[nextIndex].time < targetTime) {
      nextIndex++;
    }

    if (state.audioBuffer && state.isPlaying) {
      if (state.audioPlayMode === 'original_audio') {
        audioEngine.playAudioBuffer(state.audioBuffer, targetTime, state.playbackSpeed, false);
      } else if (state.audioPlayMode === 'vocal_remover') {
        audioEngine.playAudioBuffer(state.audioBuffer, targetTime, state.playbackSpeed, true);
      }
    }

    set({
      currentTime: targetTime,
      nextNoteIndex: nextIndex,
      activeNotes: new Set()
    });
  },

  setSpeed: (speed) => {
    const state = get();
    set({ playbackSpeed: speed });
    if (state.isPlaying && state.audioBuffer) {
      if (state.audioPlayMode === 'original_audio') {
        audioEngine.playAudioBuffer(state.audioBuffer, state.currentTime, speed, false);
      } else if (state.audioPlayMode === 'vocal_remover') {
        audioEngine.playAudioBuffer(state.audioBuffer, state.currentTime, speed, true);
      }
    }
  },

  setAudioPlayMode: (mode) => {
    const state = get();
    if (state.isPlaying && state.audioBuffer) {
      if (mode === 'original_audio') {
        audioEngine.playAudioBuffer(state.audioBuffer, state.currentTime, state.playbackSpeed, false);
      } else if (mode === 'vocal_remover') {
        audioEngine.playAudioBuffer(state.audioBuffer, state.currentTime, state.playbackSpeed, true);
      } else {
        audioEngine.stopAudioBuffer();
      }
    }
    set({ audioPlayMode: mode });
  },

  setShowLabels: (labels) => set({ showLabels: labels }),
  toggleNotesManual: () => set((state) => ({ showNotesManual: !state.showNotesManual })),
  setShowNotesManual: (val) => set({ showNotesManual: val }),
  toggleSongSearch: () => set((state) => ({ showSongSearch: !state.showSongSearch })),
  setShowSongSearch: (val) => set({ showSongSearch: val }),

  updateTime: (delta) => {
    const state = get();
    const newLiveTime = state.liveTime + delta;

    // Continuously update live notes durations and prune expired notes
    const newActiveLive = new Map(state.activeLiveNotes);
    if (newActiveLive.size > 0) {
      newActiveLive.forEach((note) => {
        note.duration = Math.max(0.1, newLiveTime - note.time);
      });
    }

    let newLiveHistory = state.liveHistory;
    if (newLiveHistory.length > 0) {
      newLiveHistory = newLiveHistory.filter((note) => newLiveTime - note.time < 12);
    }

    // If song is NOT playing, advance liveTime and return
    if (!state.isPlaying) {
      set({
        liveTime: newLiveTime,
        activeLiveNotes: newActiveLive,
        liveHistory: newLiveHistory,
      });
      return;
    }

    // If song IS playing:
    const newTime = state.currentTime + delta * state.playbackSpeed;
    const newActiveNotes = new Set(state.activeNotes);
    let nextIndex = state.nextNoteIndex;

    const playSynthesizerNotes = state.audioPlayMode === 'instrument_only' || !state.audioBuffer;

    while (nextIndex < state.notes.length && state.notes[nextIndex].time <= newTime) {
      const note = state.notes[nextIndex];
      newActiveNotes.add(note.midi);

      if (playSynthesizerNotes) {
        audioEngine.triggerNoteOn(note.midi, note.velocity * 127);
      }

      // Record expiration time for O(1) release
      const endTime = note.time + note.duration;
      const currentExpiry = activeMidiExpirations.get(note.midi) || 0;
      activeMidiExpirations.set(note.midi, Math.max(currentExpiry, endTime));

      nextIndex++;
    }

    // Release finished notes efficiently
    for (const [midi, endTime] of activeMidiExpirations.entries()) {
      if (newTime >= endTime) {
        newActiveNotes.delete(midi);
        if (playSynthesizerNotes) {
          audioEngine.triggerNoteOff(midi);
        }
        activeMidiExpirations.delete(midi);
      }
    }

    // Auto-pause at end of track
    if (state.totalDuration > 0 && newTime >= state.totalDuration + 1) {
      if (state.audioBuffer) audioEngine.stopAudioBuffer();
      set({ isPlaying: false, currentTime: state.totalDuration, liveTime: newLiveTime });
      return;
    }

    set({
      currentTime: newTime,
      liveTime: newLiveTime,
      activeNotes: newActiveNotes,
      nextNoteIndex: nextIndex,
      activeLiveNotes: newActiveLive,
      liveHistory: newLiveHistory,
    });
  },

  triggerNoteOn: (midi, velocity = 100, isLive = false) => {
    const state = get();
    if (isLive) {
      const newNote: Note = {
        id: `live-${noteCounter++}`,
        midi,
        time: state.liveTime,
        duration: 0.1,
        velocity: velocity / 127,
        isLive: true
      };
      set({
        activeLiveNotes: new Map(state.activeLiveNotes).set(midi, newNote),
        liveHistory: [...state.liveHistory.slice(-250), newNote],
        activeNotes: new Set(state.activeNotes).add(midi)
      });
    } else {
      set({ activeNotes: new Set(state.activeNotes).add(midi) });
    }
    audioEngine.triggerNoteOn(midi, velocity);
  },

  triggerNoteOff: (midi, isLive = true) => {
    const state = get();
    if (isLive) {
      const liveNote = state.activeLiveNotes.get(midi);
      if (liveNote) {
        liveNote.duration = Math.max(0.15, state.liveTime - liveNote.time);
      }
      const nextLive = new Map(state.activeLiveNotes);
      nextLive.delete(midi);
      const nextActive = new Set(state.activeNotes);
      nextActive.delete(midi);
      set({ activeLiveNotes: nextLive, activeNotes: nextActive });
    } else {
      const nextActive = new Set(state.activeNotes);
      nextActive.delete(midi);
      set({ activeNotes: nextActive });
    }
    audioEngine.triggerNoteOff(midi);
  },

  setSamplesLoaded: (loaded) => set({ isSamplesLoaded: loaded }),
  setAudioInitialized: (val) => set({ isAudioInitialized: val }),
  setInputMode: (mode) => set({ inputMode: mode }),
  setTranspose: (val) => {
    audioEngine.setTranspose(val);
    set({ transpose: val });
  },
  setOctaveShift: (val) => set({ octaveShift: val }),
  setReverbWet: (val) => {
    audioEngine.setReverbWet(val);
    set({ reverbWet: val });
  },
  setReverbDecay: (val) => {
    audioEngine.setReverbDecay(val);
    set({ reverbDecay: val });
  },
  setHarmoniumConfig: (config) => {
    audioEngine.setHarmoniumReeds({ bass: config.bass, coupler: config.coupler });
    if (config.bellows !== undefined) audioEngine.setHarmoniumBellows(config.bellows);
    set((state) => ({
      harmoniumBassReed: config.bass !== undefined ? config.bass : state.harmoniumBassReed,
      harmoniumCoupler: config.coupler !== undefined ? config.coupler : state.harmoniumCoupler,
      harmoniumBellows: config.bellows !== undefined ? config.bellows : state.harmoniumBellows,
    }));
  },
  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
  toggleGuide: () => set((state) => ({ showGuide: !state.showGuide })),
  togglePerformanceMode: () => set((state) => ({ isPerformanceMode: !state.isPerformanceMode })),
}));
