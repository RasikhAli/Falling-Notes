import { create } from 'zustand';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
import { audioEngine } from '../utils/AudioEngine';

interface Note {
  id: string;
  midi: number;
  time: number;
  duration: number;
  velocity: number;
  isLive?: boolean;
}

interface MIDIStore {
  midiData: Midi | null;
  notes: Note[];
  activeNotes: Set<number>;
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  liveHistory: Note[];
  activeLiveNotes: Map<number, Note>;
  nextNoteIndex: number;
  isSamplesLoaded: boolean;
  
  loadMIDI: (file: File) => Promise<void>;
  togglePlay: () => void;
  reset: () => void;
  clearMidi: () => void;
  setSpeed: (speed: number) => void;
  updateTime: (deltaSeconds: number) => void;
  triggerNoteOn: (midi: number, velocity?: number, isLive?: boolean) => void;
  triggerNoteOff: (midi: number, isLive?: boolean) => void;
  setSamplesLoaded: (loaded: boolean) => void;
}

let noteCounter = 0;

export const useMIDIStore = create<MIDIStore>((set, get) => ({
  midiData: null,
  notes: [],
  activeNotes: new Set(),
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1,
  liveHistory: [],
  activeLiveNotes: new Map(),
  nextNoteIndex: 0,
  isSamplesLoaded: false,

  loadMIDI: async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const midi = new Midi(arrayBuffer);
      
      const allNotes: Note[] = [];
      midi.tracks.forEach(track => {
        track.notes.forEach(note => {
          allNotes.push({
            id: `f-${noteCounter++}`,
            midi: note.midi,
            time: note.time,
            duration: note.duration,
            velocity: note.velocity,
            isLive: false
          });
        });
      });

      allNotes.sort((a, b) => a.time - b.time);

      set({ 
        midiData: midi, 
        notes: allNotes, 
        isPlaying: false, 
        currentTime: 0,
        nextNoteIndex: 0,
        liveHistory: [] 
      });
    };
    reader.readAsArrayBuffer(file);
  },

  togglePlay: () => {
    const isPlaying = !get().isPlaying;
    set({ isPlaying });
    if (isPlaying) {
      Tone.start();
    }
  },

  reset: () => set({ 
    currentTime: 0, 
    isPlaying: false, 
    activeNotes: new Set(),
    nextNoteIndex: 0,
    liveHistory: [],
    activeLiveNotes: new Map()
  }),

  clearMidi: () => set({
    midiData: null,
    notes: [],
    isPlaying: false,
    currentTime: 0,
    nextNoteIndex: 0,
    liveHistory: []
  }),
  
  setSpeed: (speed: number) => set({ playbackSpeed: speed }),
  setSamplesLoaded: (loaded) => set({ isSamplesLoaded: loaded }),

  updateTime: (deltaSeconds) => {
    const state = get();
    const shouldTick = state.isPlaying || !state.midiData;
    if (!shouldTick) return;

    const newTime = state.currentTime + (deltaSeconds * state.playbackSpeed);
    
    // Optimized note trigger using nextNoteIndex pointer
    if (state.isPlaying) {
      let idx = state.nextNoteIndex;
      while (idx < state.notes.length && state.notes[idx].time <= newTime) {
        const note = state.notes[idx];
        state.triggerNoteOn(note.midi, note.velocity, false);
        
        // Schedule off (Audio is handled by Tone, but visual still needs off)
        // Since durations vary, we still need a set for off or we just check active?
        // Actually, triggerNoteOff for MIDI files should be scheduled if possible or handled in next frames.
        idx++;
      }

      // Handle Note Offs (simplified: check activeNotes vs their end times in intervals)
      // For visual performance, we can just check those that end in this window.
      // Or search using a separate end-time sorted index (overkill for now).
      // We'll stick to a simple filter for activeNotes for now as it's small (< 88).
      state.activeNotes.forEach(midi => {
          // Find the note that is currently active and should end
          // (This is still O(ActiveNotes) which is max 88, so it's fine)
          const activeFileNote = state.notes.find(n => n.midi === midi && !n.isLive && n.time <= state.currentTime && n.time + n.duration <= newTime);
          if (activeFileNote) {
              state.triggerNoteOff(midi, false);
          }
      });

      if (idx !== state.nextNoteIndex) {
          set({ nextNoteIndex: idx });
      }
    }

    // Update ongoing live notes' duration
    const newActiveLive = new Map(state.activeLiveNotes);
    newActiveLive.forEach((note) => {
        note.duration = newTime - note.time;
    });

    set({ currentTime: newTime, activeLiveNotes: newActiveLive });
  },

  triggerNoteOn: (midi: number, velocity: number = 0.5, isLive: boolean = true) => {
    audioEngine.playNote(midi, velocity);
    set((state) => {
      const newActive = new Set(state.activeNotes);
      newActive.add(midi);
      
      const nextState: any = { activeNotes: newActive };

      if (isLive) {
        const newNote: Note = {
          id: `l-${noteCounter++}`,
          midi,
          time: state.currentTime,
          duration: 0.1, // Initial
          velocity,
          isLive: true
        };
        const newActiveLive = new Map(state.activeLiveNotes);
        newActiveLive.set(midi, newNote);
        nextState.activeLiveNotes = newActiveLive;
        
        // Add to history too
        nextState.liveHistory = [...state.liveHistory.slice(-200), newNote];
      }

      return nextState;
    });
  },

  triggerNoteOff: (midi: number, isLive: boolean = true) => {
    audioEngine.releaseNote(midi);
    set((state) => {
      const newActive = new Set(state.activeNotes);
      newActive.delete(midi);
      
      const nextState: any = { activeNotes: newActive };

      if (isLive) {
        const newActiveLive = new Map(state.activeLiveNotes);
        newActiveLive.delete(midi);
        nextState.activeLiveNotes = newActiveLive;
      }

      return nextState;
    });
  }
}));
