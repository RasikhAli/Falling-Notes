export const TOTAL_KEYS = 88;
export const MIDI_START = 21; // A0
export const MIDI_END = 108; // C8

// 3D Scene Geometry Dimensions
export const PIANO_WIDTH = 120; // Total width across 52 white keys
export const WHITE_KEY_WIDTH = PIANO_WIDTH / 52; // ~2.3077
export const WHITE_KEY_LENGTH = 8.8; // Length along Y
export const WHITE_KEY_DEPTH = 1.4; // Thickness along Z

export const BLACK_KEY_WIDTH = WHITE_KEY_WIDTH * 0.58; // ~1.34
export const BLACK_KEY_LENGTH = 5.4; // Length along Y
export const BLACK_KEY_DEPTH = 1.9; // Raised in Z on top of white keys

// Piano Hit Line (Where falling notes strike the keyboard)
// Elevated to -10.5 so keys span to -19.3, leaving the bottom of the screen completely free for controls
export const PIANO_HIT_Y = -10.5;

export interface KeyInfo {
  midi: number;
  isBlack: boolean;
  x: number;
  label: string;
  noteName: string;
  octave: number;
  swara: string;
  swaraHindi: string;
  shortcutPiano?: string;
  shortcutHarmonium?: string;
}

export interface Note {
  id: string;
  midi: number;
  time: number;
  duration: number;
  velocity: number;
  isLive?: boolean;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SWARAS = [
  { en: "Sa", hi: "सा" },
  { en: "re", hi: "रे॒" },
  { en: "Re", hi: "रे" },
  { en: "ga", hi: "ग॒" },
  { en: "Ga", hi: "ग" },
  { en: "Ma", hi: "म" },
  { en: "Ma'", hi: "म॑" },
  { en: "Pa", hi: "प" },
  { en: "dha", hi: "ध॒" },
  { en: "Dha", hi: "ध" },
  { en: "ni", hi: "नि॒" },
  { en: "Ni", hi: "नि" }
];

// Piano keyboard mapping
const PIANO_SHORTCUTS: { [midi: number]: string } = {
  // Octave 3
  48: "Z", 49: "S", 50: "X", 51: "D", 52: "C", 53: "V", 54: "G", 55: "B", 56: "H", 57: "N", 58: "J", 59: "M",
  // Octave 4 & 5
  60: "A", 61: "W", 62: "S", 63: "E", 64: "D", 65: "F", 66: "T", 67: "G", 68: "Y", 69: "H", 70: "U", 71: "J",
  72: "K", 73: "O", 74: "L", 75: "P", 76: ";", 77: "'"
};

// Harmonium keyboard mapping
const HARMONIUM_SHORTCUTS: { [midi: number]: string } = {
  55: "`", 56: "1", 57: "Q", 58: "2", 59: "W",
  60: "E", 61: "4", 62: "R", 63: "5", 64: "T", 65: "Y", 66: "7", 67: "U", 68: "8", 69: "I", 70: "9", 71: "O",
  72: "P", 73: "-", 74: "[", 75: "=", 76: "]", 77: "\\"
};

export const keys: KeyInfo[] = [];

// Populate 88 keys
for (let i = MIDI_START; i <= MIDI_END; i++) {
  const noteInOctave = i % 12;
  const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave);
  const name = NOTE_NAMES[noteInOctave];
  const octave = Math.floor(i / 12) - 1;
  const swaraData = SWARAS[noteInOctave];

  // Saptak marking for Swara: Mandra (dot below / quote before), Taar (quote after)
  let swaraFormatted = swaraData.en;
  const swaraHindiFormatted = swaraData.hi;
  if (octave < 4) {
    swaraFormatted = `'${swaraData.en}`;
  } else if (octave > 4) {
    swaraFormatted = `${swaraData.en}'`;
  }

  keys.push({
    midi: i,
    isBlack,
    x: 0,
    label: `${name}${octave}`,
    noteName: name,
    octave,
    swara: swaraFormatted,
    swaraHindi: swaraHindiFormatted,
    shortcutPiano: PIANO_SHORTCUTS[i],
    shortcutHarmonium: HARMONIUM_SHORTCUTS[i]
  });
}

// Compute mathematically precise X positions for all 52 white keys
let whiteKeyIndex = 0;
const whiteKeyPositions: { [midi: number]: number } = {};

keys.forEach((key) => {
  if (!key.isBlack) {
    const xPos = -PIANO_WIDTH / 2 + (whiteKeyIndex + 0.5) * WHITE_KEY_WIDTH;
    key.x = xPos;
    whiteKeyPositions[key.midi] = xPos;
    whiteKeyIndex++;
  }
});

// Position black keys centered accurately between their adjacent white key neighbors
keys.forEach((key) => {
  if (key.isBlack) {
    const prevWhite = whiteKeyPositions[key.midi - 1];
    const nextWhite = whiteKeyPositions[key.midi + 1];
    if (prevWhite !== undefined && nextWhite !== undefined) {
      key.x = (prevWhite + nextWhite) / 2;
    } else if (prevWhite !== undefined) {
      key.x = prevWhite + WHITE_KEY_WIDTH / 2;
    } else if (nextWhite !== undefined) {
      key.x = nextWhite - WHITE_KEY_WIDTH / 2;
    }
  }
});
