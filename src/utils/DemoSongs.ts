import type { Note } from './Constants';

export interface DemoSong {
  name: string;
  mode: 'piano' | 'harmonium';
  notes: Note[];
}

export const DEMO_SONGS: DemoSong[] = [
  {
    name: "Für Elise (Beethoven) - Piano Solo",
    mode: 'piano',
    notes: [
      // Intro motif
      { id: 'fe-1', midi: 76, time: 0.0, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-2', midi: 75, time: 0.28, duration: 0.25, velocity: 0.8 }, // D#5
      { id: 'fe-3', midi: 76, time: 0.56, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-4', midi: 75, time: 0.84, duration: 0.25, velocity: 0.8 }, // D#5
      { id: 'fe-5', midi: 76, time: 1.12, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-6', midi: 71, time: 1.40, duration: 0.25, velocity: 0.75 }, // B4
      { id: 'fe-7', midi: 74, time: 1.68, duration: 0.25, velocity: 0.75 }, // D5
      { id: 'fe-8', midi: 72, time: 1.96, duration: 0.25, velocity: 0.8 }, // C5
      { id: 'fe-9', midi: 69, time: 2.24, duration: 0.60, velocity: 0.85 }, // A4
      
      // Left hand arpeggio 1 (A minor)
      { id: 'fe-lh-1', midi: 45, time: 2.24, duration: 0.8, velocity: 0.6 }, // A2
      { id: 'fe-lh-2', midi: 52, time: 2.50, duration: 0.8, velocity: 0.55 }, // E3
      { id: 'fe-lh-3', midi: 57, time: 2.76, duration: 0.8, velocity: 0.55 }, // A3

      // Melody continues
      { id: 'fe-10', midi: 60, time: 3.00, duration: 0.28, velocity: 0.7 }, // C4
      { id: 'fe-11', midi: 64, time: 3.30, duration: 0.28, velocity: 0.7 }, // E4
      { id: 'fe-12', midi: 69, time: 3.60, duration: 0.28, velocity: 0.75 }, // A4
      { id: 'fe-13', midi: 71, time: 3.90, duration: 0.60, velocity: 0.8 }, // B4

      // Left hand arpeggio 2 (E major)
      { id: 'fe-lh-4', midi: 40, time: 3.90, duration: 0.8, velocity: 0.6 }, // E2
      { id: 'fe-lh-5', midi: 52, time: 4.15, duration: 0.8, velocity: 0.55 }, // E3
      { id: 'fe-lh-6', midi: 56, time: 4.40, duration: 0.8, velocity: 0.55 }, // G#3

      // Melody continues
      { id: 'fe-14', midi: 64, time: 4.65, duration: 0.28, velocity: 0.7 }, // E4
      { id: 'fe-15', midi: 68, time: 4.95, duration: 0.28, velocity: 0.7 }, // G#4
      { id: 'fe-16', midi: 71, time: 5.25, duration: 0.28, velocity: 0.75 }, // B4
      { id: 'fe-17', midi: 72, time: 5.55, duration: 0.60, velocity: 0.85 }, // C5

      // Left hand arpeggio 3 (A minor)
      { id: 'fe-lh-7', midi: 45, time: 5.55, duration: 0.8, velocity: 0.6 }, // A2
      { id: 'fe-lh-8', midi: 52, time: 5.80, duration: 0.8, velocity: 0.55 }, // E3
      { id: 'fe-lh-9', midi: 57, time: 6.05, duration: 0.8, velocity: 0.55 }, // A3

      // Melody repeats motif
      { id: 'fe-18', midi: 64, time: 6.30, duration: 0.28, velocity: 0.7 }, // E4
      { id: 'fe-19', midi: 76, time: 6.60, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-20', midi: 75, time: 6.88, duration: 0.25, velocity: 0.8 }, // D#5
      { id: 'fe-21', midi: 76, time: 7.16, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-22', midi: 75, time: 7.44, duration: 0.25, velocity: 0.8 }, // D#5
      { id: 'fe-23', midi: 76, time: 7.72, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-24', midi: 71, time: 8.00, duration: 0.25, velocity: 0.75 }, // B4
      { id: 'fe-25', midi: 74, time: 8.28, duration: 0.25, velocity: 0.75 }, // D5
      { id: 'fe-26', midi: 72, time: 8.56, duration: 0.25, velocity: 0.8 }, // C5
      { id: 'fe-27', midi: 69, time: 8.84, duration: 0.90, velocity: 0.9 }, // A4
    ]
  },
  {
    name: "Interstellar Theme (Hans Zimmer) - Piano",
    mode: 'piano',
    notes: [
      // Cycle 1: A minor (A2 bass + E4-A4-B4 melody)
      { id: 'is-b1', midi: 45, time: 0.0, duration: 3.8, velocity: 0.6 }, // A2
      { id: 'is-1', midi: 64, time: 0.0, duration: 0.45, velocity: 0.7 }, // E4
      { id: 'is-2', midi: 69, time: 0.5, duration: 0.45, velocity: 0.75 }, // A4
      { id: 'is-3', midi: 71, time: 1.0, duration: 0.45, velocity: 0.8 }, // B4
      { id: 'is-4', midi: 64, time: 1.5, duration: 0.45, velocity: 0.7 }, // E4
      { id: 'is-5', midi: 69, time: 2.0, duration: 0.45, velocity: 0.75 }, // A4
      { id: 'is-6', midi: 71, time: 2.5, duration: 0.45, velocity: 0.8 }, // B4
      { id: 'is-7', midi: 72, time: 3.0, duration: 0.8, velocity: 0.85 }, // C5

      // Cycle 2: F major (F2 bass + E4-A4-C5 melody)
      { id: 'is-b2', midi: 41, time: 4.0, duration: 3.8, velocity: 0.65 }, // F2
      { id: 'is-8', midi: 64, time: 4.0, duration: 0.45, velocity: 0.7 }, // E4
      { id: 'is-9', midi: 69, time: 4.5, duration: 0.45, velocity: 0.75 }, // A4
      { id: 'is-10', midi: 72, time: 5.0, duration: 0.45, velocity: 0.85 }, // C5
      { id: 'is-11', midi: 64, time: 5.5, duration: 0.45, velocity: 0.7 }, // E4
      { id: 'is-12', midi: 69, time: 6.0, duration: 0.45, velocity: 0.75 }, // A4
      { id: 'is-13', midi: 72, time: 6.5, duration: 0.45, velocity: 0.85 }, // C5
      { id: 'is-14', midi: 74, time: 7.0, duration: 0.8, velocity: 0.9 }, // D5

      // Cycle 3: G major (G2 bass + G4-B4-D5 melody)
      { id: 'is-b3', midi: 43, time: 8.0, duration: 3.8, velocity: 0.65 }, // G2
      { id: 'is-15', midi: 67, time: 8.0, duration: 0.45, velocity: 0.75 }, // G4
      { id: 'is-16', midi: 71, time: 8.5, duration: 0.45, velocity: 0.8 }, // B4
      { id: 'is-17', midi: 74, time: 9.0, duration: 0.45, velocity: 0.85 }, // D5
      { id: 'is-18', midi: 67, time: 9.5, duration: 0.45, velocity: 0.75 }, // G4
      { id: 'is-19', midi: 71, time: 10.0, duration: 0.45, velocity: 0.8 }, // B4
      { id: 'is-20', midi: 74, time: 10.5, duration: 0.45, velocity: 0.9 }, // D5
      { id: 'is-21', midi: 76, time: 11.0, duration: 1.0, velocity: 0.95 }, // E5
    ]
  },
  {
    name: "Tum Hi Ho (Bollywood Melody) - Harmonium",
    mode: 'harmonium',
    notes: [
      // Hum tere bin ab reh nahi sakte... (Key C# minor / Tonic C#4 = 61)
      { id: 'th-1', midi: 61, time: 0.0, duration: 0.4, velocity: 0.85 },  // C#4 (Hum)
      { id: 'th-2', midi: 63, time: 0.45, duration: 0.4, velocity: 0.85 }, // D#4 (te-)
      { id: 'th-3', midi: 64, time: 0.90, duration: 0.7, velocity: 0.9 },  // E4   (-re)
      { id: 'th-4', midi: 63, time: 1.65, duration: 0.35, velocity: 0.8 }, // D#4 (bin)
      { id: 'th-5', midi: 61, time: 2.05, duration: 0.4, velocity: 0.85 }, // C#4 (ab)
      { id: 'th-6', midi: 59, time: 2.50, duration: 0.6, velocity: 0.85 }, // B3  (reh)
      { id: 'th-7', midi: 61, time: 3.15, duration: 0.4, velocity: 0.85 }, // C#4 (na-)
      { id: 'th-8', midi: 63, time: 3.60, duration: 0.4, velocity: 0.85 }, // D#4 (-hi)
      { id: 'th-9', midi: 64, time: 4.05, duration: 0.8, velocity: 0.9 },  // E4  (sak-)
      { id: 'th-10', midi: 63, time: 4.90, duration: 0.8, velocity: 0.8 }, // D#4 (-te)
      // Tere bina kya wajood mera...
      { id: 'th-11', midi: 64, time: 5.80, duration: 0.4, velocity: 0.85 }, // E4
      { id: 'th-12', midi: 66, time: 6.25, duration: 0.4, velocity: 0.85 }, // F#4
      { id: 'th-13', midi: 68, time: 6.70, duration: 0.8, velocity: 0.95 }, // G#4
      { id: 'th-14', midi: 66, time: 7.55, duration: 0.4, velocity: 0.85 }, // F#4
      { id: 'th-15', midi: 64, time: 8.00, duration: 0.4, velocity: 0.85 }, // E4
      { id: 'th-16', midi: 63, time: 8.45, duration: 0.7, velocity: 0.85 }, // D#4
      { id: 'th-17', midi: 61, time: 9.20, duration: 1.2, velocity: 0.95 }, // C#4
    ]
  },
  {
    name: "Raag Yaman Bandish - Harmonium Classic",
    mode: 'harmonium',
    notes: [
      // Classical Raag Yaman Aaroh/Avaroh & Pakad: N R G m' D N S'
      { id: 'ym-1', midi: 59, time: 0.0, duration: 0.6, velocity: 0.85 },  // 'Ni (Mandram)
      { id: 'ym-2', midi: 62, time: 0.65, duration: 0.6, velocity: 0.85 }, // Re
      { id: 'ym-3', midi: 64, time: 1.30, duration: 0.8, velocity: 0.9 },  // Ga (Nyas)
      { id: 'ym-4', midi: 62, time: 2.15, duration: 0.4, velocity: 0.75 }, // Re
      { id: 'ym-5', midi: 64, time: 2.60, duration: 0.5, velocity: 0.8 },  // Ga
      { id: 'ym-6', midi: 66, time: 3.15, duration: 0.6, velocity: 0.9 },  // Tivra Ma
      { id: 'ym-7', midi: 69, time: 3.80, duration: 0.8, velocity: 0.95 }, // Dha
      { id: 'ym-8', midi: 67, time: 4.65, duration: 0.8, velocity: 0.85 }, // Pa
      { id: 'ym-9', midi: 66, time: 5.50, duration: 0.5, velocity: 0.8 },  // Tivra Ma
      { id: 'ym-10', midi: 64, time: 6.05, duration: 0.6, velocity: 0.85 }, // Ga
      { id: 'ym-11', midi: 62, time: 6.70, duration: 0.5, velocity: 0.8 }, // Re
      { id: 'ym-12', midi: 64, time: 7.25, duration: 0.5, velocity: 0.8 }, // Ga
      { id: 'ym-13', midi: 62, time: 7.80, duration: 0.6, velocity: 0.8 }, // Re
      { id: 'ym-14', midi: 60, time: 8.45, duration: 1.2, velocity: 0.95 }, // Sa
      // High phrase
      { id: 'ym-15', midi: 67, time: 9.70, duration: 0.6, velocity: 0.85 }, // Pa
      { id: 'ym-16', midi: 71, time: 10.35, duration: 0.6, velocity: 0.9 }, // Ni
      { id: 'ym-17', midi: 72, time: 11.00, duration: 1.4, velocity: 1.0 }, // Taar Sa'
    ]
  }
];
