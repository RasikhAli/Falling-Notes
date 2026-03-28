export const TOTAL_KEYS = 88;
export const MIDI_START = 21; // A0
export const MIDI_END = 108; // C8

export const PIANO_WIDTH = 120; // Units in 3D scene
export const WHITE_KEY_WIDTH = PIANO_WIDTH / 52;
export const BLACK_KEY_WIDTH = WHITE_KEY_WIDTH * 0.6;
export const WHITE_KEY_HEIGHT = 1;
export const WHITE_KEY_LENGTH = 5;
export const BLACK_KEY_HEIGHT = 1.6;
export const BLACK_KEY_LENGTH = 3;

export const NOTE_FALL_SPEED = 10; // Units per second
export const VISIBLE_RANGE_Y = 50; // How far up notes start

export interface KeyInfo {
  midi: number;
  isBlack: boolean;
  x: number;
  label: string;
}

const getLabel = (midi: number) => {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const name = noteNames[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
};

export const keys: KeyInfo[] = [];
let whiteKeyCount = 0;

for (let i = MIDI_START; i <= MIDI_END; i++) {
  const noteInOctave = i % 12;
  const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave);
  
  keys.push({
    midi: i,
    isBlack,
    x: 0, // Will calculate below
    label: getLabel(i)
  });
}

// Calculate X positions
let currentX = -PIANO_WIDTH / 2 + WHITE_KEY_WIDTH / 2;
keys.forEach((key, index) => {
  if (!key.isBlack) {
    key.x = currentX;
    
    // Check if next key is black to position it correctly relative to this white key
    const nextKey = keys[index + 1];
    if (nextKey && nextKey.isBlack) {
      nextKey.x = currentX + WHITE_KEY_WIDTH / 2;
    }
    
    currentX += WHITE_KEY_WIDTH;
  }
});
