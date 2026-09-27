import { useEffect } from 'react';
import { useMIDIStore } from '../store/MIDIStore';

/**
 * Universally standard DAW Musical Typing Keyboard (GarageBand/Ableton/FL Studio style)
 * Home row = Natural white keys, Upper row = Sharps/flats placed naturally above the gaps.
 */
const PIANO_KEY_MAP: { [key: string]: number } = {
  // Lower Register (Octave 3: C3 - B3)
  'z': 48, 's': 49, 'x': 50, 'd': 51, 'c': 52, 'v': 53, 'g': 54, 'b': 55, 'h': 56, 'n': 57, 'j': 58, 'm': 59,

  // Main Playing Register (Octave 4: C4 - E5)
  // White keys
  'a': 60, // C4
  'w': 61, // C#4
  'e': 63, // D#4
  'f': 65, // F4
  't': 66, // F#4
  'y': 68, // G#4
  'u': 70, // A#4
  'k': 72, // C5
  'o': 73, // C#5
  'l': 74, // D5
  'p': 75, // D#5
  ';': 76, // E5
  "'": 77, // F5
};

// Also support alternate home row without clash
const PIANO_NATURAL_MAP: { [key: string]: number } = {
  'a': 60, // C4
  's': 62, // D4
  'd': 64, // E4
  'f': 65, // F4
  'g': 67, // G4
  'h': 69, // A4
  'j': 71, // B4
  'k': 72, // C5
  'l': 74, // D5
  ';': 76, // E5
  "'": 77, // F5
};

const PIANO_ACCIDENTAL_MAP: { [key: string]: number } = {
  'w': 61, // C#4
  'e': 63, // D#4
  't': 66, // F#4
  'y': 68, // G#4
  'u': 70, // A#4
  'o': 73, // C#5
  'p': 75, // D#5
};

/**
 * Traditional Indian Harmonium Keyboard Mapping
 * Rooted at Safed 1 (C4 = Sa) with authentic Sargam keys.
 */
const HARMONIUM_KEY_MAP: { [key: string]: number } = {
  // Pre-Octave (Mandra)
  '`': 55, // Mandra Pa (G3)
  '1': 56, // Mandra dha (G#3)
  'q': 57, // Mandra Dha (A3)
  '2': 58, // Mandra ni (A#3)
  'w': 59, // Mandra Ni (B3)

  // Madhya Saptak (Octave 4)
  'e': 60, // Madhya Sa (C4)
  '4': 61, // komal re (C#4)
  'r': 62, // shuddha Re (D4)
  '5': 63, // komal ga (D#4)
  't': 64, // shuddha Ga (E4)
  'y': 65, // shuddha Ma (F4)
  '7': 66, // tivra Ma' (F#4)
  'u': 67, // Madhya Pa (G4)
  '8': 68, // komal dha (G#4)
  'i': 69, // shuddha Dha (A4)
  '9': 70, // komal ni (A#4)
  'o': 71, // shuddha Ni (B4)

  // Taar Saptak (Octave 5)
  'p': 72, // Taar Sa' (C5)
  '-': 73, // Taar re' (C#5)
  '[': 74, // Taar Re' (D5)
  '=': 75, // Taar ga' (D#5)
  ']': 76, // Taar Ga' (E5)
  '\\': 77, // Taar Ma' (F5)
};

export const useInput = (): void => {
  const triggerNoteOn = useMIDIStore((state) => state.triggerNoteOn);
  const triggerNoteOff = useMIDIStore((state) => state.triggerNoteOff);
  const inputMode = useMIDIStore((state) => state.inputMode);
  const transpose = useMIDIStore((state) => state.transpose);
  const octaveShift = useMIDIStore((state) => state.octaveShift);

  useEffect(() => {
    const activeKeys = new Set<string>();

    const getMidiForKey = (key: string): number | undefined => {
      if (inputMode === 'harmonium') {
        const raw = HARMONIUM_KEY_MAP[key];
        if (raw !== undefined) {
          // Base 60 = C4
          const offset = raw - 60;
          return 60 + (octaveShift - 3) * 12 + offset + transpose;
        }
        return undefined;
      }

      // Piano mode: check accidentals first, then natural home row
      let raw = PIANO_ACCIDENTAL_MAP[key];
      if (raw === undefined) {
        raw = PIANO_NATURAL_MAP[key];
      }
      if (raw === undefined) {
        raw = PIANO_KEY_MAP[key];
      }

      if (raw !== undefined) {
        const offset = raw - 60;
        return 60 + (octaveShift - 3) * 12 + offset + transpose;
      }
      return undefined;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input element
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.repeat) return;
      const key = e.key.toLowerCase();

      const midi = getMidiForKey(key);
      if (midi !== undefined && midi >= 21 && midi <= 108) {
        activeKeys.add(key);
        triggerNoteOn(midi, 100, true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (activeKeys.has(key)) {
        activeKeys.delete(key);
        const midi = getMidiForKey(key);
        if (midi !== undefined && midi >= 21 && midi <= 108) {
          triggerNoteOff(midi, true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Web MIDI Controller Integration (USB / Bluetooth MIDI Keyboards)
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((access) => {
        for (const input of access.inputs.values()) {
          input.onmidimessage = (message) => {
            if (!message.data) return;
            const [status, midi, velocity] = Array.from(message.data);
            const command = status & 0xf0;

            if (command === 0x90 && velocity > 0) {
              // Note On
              triggerNoteOn(midi + transpose, velocity, true);
            } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
              // Note Off
              triggerNoteOff(midi + transpose, true);
            }
          };
        }
      }).catch((err) => {
        console.warn("Web MIDI access not available or denied:", err);
      });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerNoteOn, triggerNoteOff, inputMode, transpose, octaveShift]);
};
