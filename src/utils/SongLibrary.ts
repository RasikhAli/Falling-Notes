import type { Note } from './Constants';

export interface SongLine {
  lyrics: string;
  sargam: string;
  sargamHindi: string;
  keysHarmonium: string;
  keysPiano: string;
  notesWestern: string;
}

export interface LibrarySong {
  id: string;
  title: string;
  subtitle: string;
  category: 'harmonium' | 'bollywood' | 'classical' | 'devotional' | 'western';
  mode: 'harmonium' | 'piano';
  scaleKey: string; // e.g. "C# (Kali 1)"
  transpose: number; // Semitone offset from C
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tempo: number; // BPM
  description: string;
  tags: string[];
  lines: SongLine[];
  notes: Note[];
}

export const SONG_LIBRARY: LibrarySong[] = [
  {
    id: 'tum-hi-ho',
    title: 'Tum Hi Ho',
    subtitle: 'Arijit Singh • Aashiqui 2 (Mithoon)',
    category: 'bollywood',
    mode: 'harmonium',
    scaleKey: 'C# (Kali 1)',
    transpose: 1,
    difficulty: 'Beginner',
    tempo: 84,
    description: 'The defining romantic anthem of modern Bollywood. Expressive harmonium melody with tender komal swaras.',
    tags: ['Arijit Singh', 'Romantic', 'Aashiqui 2', 'Bollywood', 'Komal Swaras'],
    lines: [
      {
        lyrics: 'Hum tere bin ab reh nahi sakte',
        sargam: "S' R' g' R' S' n S' R' g' R'",
        sargamHindi: "सां रें गं रें सां नि सां रें गं रें",
        keysHarmonium: 'P [ = [ P O P [ = [',
        keysPiano: 'K L P L K J K L P L',
        notesWestern: 'C#4 D#4 E4 D#4 C#4 B3 C#4 D#4 E4 D#4'
      },
      {
        lyrics: 'Tere bina kya wajood mera',
        sargam: "g' M' P' M' g' R' S'",
        sargamHindi: "गं मं पें मं गं रें सां",
        keysHarmonium: '= ] \\ ] = [ P',
        keysPiano: 'P [ ; [ P L K',
        notesWestern: 'E4 F#4 G#4 F#4 E4 D#4 C#4'
      },
      {
        lyrics: 'Tujhse juda agar ho jayenge',
        sargam: "S' R' g' R' S' n S' R' g' R'",
        sargamHindi: "सां रें गं रें सां नि सां रें गं रें",
        keysHarmonium: 'P [ = [ P O P [ = [',
        keysPiano: 'K L P L K J K L P L',
        notesWestern: 'C#4 D#4 E4 D#4 C#4 B3 C#4 D#4 E4 D#4'
      },
      {
        lyrics: 'Toh khud se hi ho jayenge juda',
        sargam: "g' M' P' M' g' R' S'",
        sargamHindi: "गं मं पें मं गं रें सां",
        keysHarmonium: '= ] \\ ] = [ P',
        keysPiano: 'P [ ; [ P L K',
        notesWestern: 'E4 F#4 G#4 F#4 E4 D#4 C#4'
      },
      {
        lyrics: 'Kyunki tum hi ho, ab tum hi ho',
        sargam: "P' M' g' M', P' M' g' M'",
        sargamHindi: "पें मं गं मं, पें मं गं मं",
        keysHarmonium: '\\ ] = ], \\ ] = ]',
        keysPiano: '; [ P [, ; [ P [',
        notesWestern: 'G#4 F#4 E4 F#4, G#4 F#4 E4 F#4'
      },
      {
        lyrics: 'Zindagi ab tum hi ho',
        sargam: "g' R' S' n S' R' g'",
        sargamHindi: "गं रें सां नि सां रें गं",
        keysHarmonium: '= [ P O P [ =',
        keysPiano: 'P L K J K L P',
        notesWestern: 'E4 D#4 C#4 B3 C#4 D#4 E4'
      },
      {
        lyrics: 'Chain bhi, mera dard bhi',
        sargam: "P' M' g' M', P' M' g' M'",
        sargamHindi: "पें मं गं मं, पें मं गं मं",
        keysHarmonium: '\\ ] = ], \\ ] = ]',
        keysPiano: '; [ P [, ; [ P [',
        notesWestern: 'G#4 F#4 E4 F#4, G#4 F#4 E4 F#4'
      },
      {
        lyrics: 'Meri aashiqui ab tum hi ho',
        sargam: "g' R' S' n S' R' S'",
        sargamHindi: "गं रें सां नि सां रें सां",
        keysHarmonium: '= [ P O P [ P',
        keysPiano: 'P L K J K L K',
        notesWestern: 'E4 D#4 C#4 B3 C#4 D#4 C#4'
      }
    ],
    notes: [
      { id: 'th-1', midi: 61, time: 0.0, duration: 0.4, velocity: 0.85 },  // C#4
      { id: 'th-2', midi: 63, time: 0.45, duration: 0.4, velocity: 0.85 }, // D#4
      { id: 'th-3', midi: 64, time: 0.90, duration: 0.65, velocity: 0.9 }, // E4
      { id: 'th-4', midi: 63, time: 1.60, duration: 0.35, velocity: 0.8 }, // D#4
      { id: 'th-5', midi: 61, time: 2.00, duration: 0.4, velocity: 0.85 }, // C#4
      { id: 'th-6', midi: 59, time: 2.45, duration: 0.6, velocity: 0.85 }, // B3
      { id: 'th-7', midi: 61, time: 3.10, duration: 0.4, velocity: 0.85 }, // C#4
      { id: 'th-8', midi: 63, time: 3.55, duration: 0.4, velocity: 0.85 }, // D#4
      { id: 'th-9', midi: 64, time: 4.00, duration: 0.75, velocity: 0.9 }, // E4
      { id: 'th-10', midi: 63, time: 4.80, duration: 0.8, velocity: 0.8 }, // D#4
      // Phrase 2
      { id: 'th-11', midi: 64, time: 5.70, duration: 0.4, velocity: 0.85 }, // E4
      { id: 'th-12', midi: 66, time: 6.15, duration: 0.4, velocity: 0.85 }, // F#4
      { id: 'th-13', midi: 68, time: 6.60, duration: 0.75, velocity: 0.95 }, // G#4
      { id: 'th-14', midi: 66, time: 7.40, duration: 0.4, velocity: 0.85 }, // F#4
      { id: 'th-15', midi: 64, time: 7.85, duration: 0.4, velocity: 0.85 }, // E4
      { id: 'th-16', midi: 63, time: 8.30, duration: 0.65, velocity: 0.85 }, // D#4
      { id: 'th-17', midi: 61, time: 9.00, duration: 1.2, velocity: 0.95 }, // C#4
      // Chorus: Kyunki tum hi ho
      { id: 'th-18', midi: 68, time: 10.4, duration: 0.45, velocity: 0.95 }, // G#4
      { id: 'th-19', midi: 66, time: 10.9, duration: 0.45, velocity: 0.85 }, // F#4
      { id: 'th-20', midi: 64, time: 11.4, duration: 0.45, velocity: 0.85 }, // E4
      { id: 'th-21', midi: 66, time: 11.9, duration: 0.8, velocity: 0.9 },  // F#4
      // ab tum hi ho
      { id: 'th-22', midi: 68, time: 12.8, duration: 0.45, velocity: 0.95 }, // G#4
      { id: 'th-23', midi: 66, time: 13.3, duration: 0.45, velocity: 0.85 }, // F#4
      { id: 'th-24', midi: 64, time: 13.8, duration: 0.45, velocity: 0.85 }, // E4
      { id: 'th-25', midi: 66, time: 14.3, duration: 0.9, velocity: 0.9 },  // F#4
      // Zindagi ab tum hi ho
      { id: 'th-26', midi: 64, time: 15.3, duration: 0.35, velocity: 0.85 }, // E4
      { id: 'th-27', midi: 63, time: 15.7, duration: 0.35, velocity: 0.85 }, // D#4
      { id: 'th-28', midi: 61, time: 16.1, duration: 0.35, velocity: 0.85 }, // C#4
      { id: 'th-29', midi: 59, time: 16.5, duration: 0.35, velocity: 0.85 }, // B3
      { id: 'th-30', midi: 61, time: 16.9, duration: 0.35, velocity: 0.85 }, // C#4
      { id: 'th-31', midi: 63, time: 17.3, duration: 0.4, velocity: 0.85 }, // D#4
      { id: 'th-32', midi: 64, time: 17.75, duration: 1.2, velocity: 0.95 }, // E4
      // Meri aashiqui ab tum hi ho
      { id: 'th-33', midi: 64, time: 19.1, duration: 0.35, velocity: 0.85 }, // E4
      { id: 'th-34', midi: 63, time: 19.5, duration: 0.35, velocity: 0.85 }, // D#4
      { id: 'th-35', midi: 61, time: 19.9, duration: 0.35, velocity: 0.85 }, // C#4
      { id: 'th-36', midi: 59, time: 20.3, duration: 0.35, velocity: 0.85 }, // B3
      { id: 'th-37', midi: 61, time: 20.7, duration: 0.4, velocity: 0.85 }, // C#4
      { id: 'th-38', midi: 63, time: 21.15, duration: 0.4, velocity: 0.85 }, // D#4
      { id: 'th-39', midi: 61, time: 21.6, duration: 1.8, velocity: 1.0 },  // C#4
    ]
  },
  {
    id: 'raag-yaman',
    title: 'Raag Yaman (Bandish & Pakad)',
    subtitle: 'Hindustani Classical • Kalyan Thaat',
    category: 'classical',
    mode: 'harmonium',
    scaleKey: 'C (Safed 1)',
    transpose: 0,
    difficulty: 'Intermediate',
    tempo: 72,
    description: 'The monarch of evening Ragas with Tivra Ma (म॑) and prominent Ga (ग) and Ni (नि) rest points.',
    tags: ['Raag Yaman', 'Kalyan Thaat', 'Tivra Ma', 'Classical', 'Raga Bandish'],
    lines: [
      {
        lyrics: 'Aaroh / Pakad: Ni Re Ga Ma\' Dha Ni Sa\'',
        sargam: "'N R G M' D N S'",
        sargamHindi: "नि॒ रे ग म॑ ध नि सां",
        keysHarmonium: 'w r t 7 i o p',
        keysPiano: 'j s d t h j k',
        notesWestern: 'B3 D4 E4 F#4 A4 B4 C5'
      },
      {
        lyrics: 'Avaroh: Sa\' Ni Dha Pa Ma\' Ga Re Sa',
        sargam: "S' N D P M' G R S",
        sargamHindi: "सां नि ध प म॑ ग रे सा",
        keysHarmonium: 'p o i u 7 t r e',
        keysPiano: 'k j h g t d s a',
        notesWestern: 'C5 B4 A4 G4 F#4 E4 D4 C4'
      },
      {
        lyrics: 'Eri aali piya bina, sakhi kal na parat',
        sargam: "G R G M' D P M' G, R G R S",
        sargamHindi: "ग रे ग म॑ ध प म॑ ग, रे ग रे सा",
        keysHarmonium: 't r t 7 i u 7 t, r t r e',
        keysPiano: 'd s d t h g t d, s d s a',
        notesWestern: 'E4 D4 E4 F#4 A4 G4 F#4 E4, D4 E4 D4 C4'
      },
      {
        lyrics: 'Pal chhin gadi pal pal, beetat biraha ki rain',
        sargam: "M' D N S', S' N D P M' G R S",
        sargamHindi: "म॑ ध नि सां, सां नि ध प म॑ ग रे सा",
        keysHarmonium: '7 i o p, p o i u 7 t r e',
        keysPiano: 't h j k, k j h g t d s a',
        notesWestern: 'F#4 A4 B4 C5, C5 B4 A4 G4 F#4 E4 D4 C4'
      }
    ],
    notes: [
      { id: 'ym-1', midi: 59, time: 0.0, duration: 0.6, velocity: 0.85 },  // 'Ni (B3)
      { id: 'ym-2', midi: 62, time: 0.65, duration: 0.6, velocity: 0.85 }, // Re (D4)
      { id: 'ym-3', midi: 64, time: 1.30, duration: 0.85, velocity: 0.9 }, // Ga (E4)
      { id: 'ym-4', midi: 62, time: 2.20, duration: 0.4, velocity: 0.75 }, // Re (D4)
      { id: 'ym-5', midi: 64, time: 2.65, duration: 0.5, velocity: 0.8 },  // Ga (E4)
      { id: 'ym-6', midi: 66, time: 3.20, duration: 0.6, velocity: 0.9 },  // Tivra Ma (F#4)
      { id: 'ym-7', midi: 69, time: 3.85, duration: 0.8, velocity: 0.95 }, // Dha (A4)
      { id: 'ym-8', midi: 67, time: 4.70, duration: 0.8, velocity: 0.85 }, // Pa (G4)
      { id: 'ym-9', midi: 66, time: 5.55, duration: 0.5, velocity: 0.8 },  // Tivra Ma (F#4)
      { id: 'ym-10', midi: 64, time: 6.10, duration: 0.6, velocity: 0.85 }, // Ga (E4)
      { id: 'ym-11', midi: 62, time: 6.75, duration: 0.5, velocity: 0.8 }, // Re (D4)
      { id: 'ym-12', midi: 64, time: 7.30, duration: 0.5, velocity: 0.8 }, // Ga (E4)
      { id: 'ym-13', midi: 62, time: 7.85, duration: 0.6, velocity: 0.8 }, // Re (D4)
      { id: 'ym-14', midi: 60, time: 8.50, duration: 1.3, velocity: 0.95 }, // Sa (C4)
      // Taar Saptak phrase
      { id: 'ym-15', midi: 66, time: 10.0, duration: 0.6, velocity: 0.85 }, // Tivra Ma (F#4)
      { id: 'ym-16', midi: 69, time: 10.65, duration: 0.6, velocity: 0.9 }, // Dha (A4)
      { id: 'ym-17', midi: 71, time: 11.30, duration: 0.6, velocity: 0.95 }, // Ni (B4)
      { id: 'ym-18', midi: 72, time: 11.95, duration: 1.4, velocity: 1.0 }, // Taar Sa' (C5)
      { id: 'ym-19', midi: 71, time: 13.40, duration: 0.5, velocity: 0.85 }, // Ni
      { id: 'ym-20', midi: 69, time: 13.95, duration: 0.5, velocity: 0.85 }, // Dha
      { id: 'ym-21', midi: 67, time: 14.50, duration: 0.6, velocity: 0.85 }, // Pa
      { id: 'ym-22', midi: 66, time: 15.15, duration: 0.6, velocity: 0.85 }, // Tivra Ma
      { id: 'ym-23', midi: 64, time: 15.80, duration: 0.7, velocity: 0.9 },  // Ga
      { id: 'ym-24', midi: 62, time: 16.55, duration: 0.6, velocity: 0.85 }, // Re
      { id: 'ym-25', midi: 60, time: 17.20, duration: 1.8, velocity: 0.95 }, // Sa
    ]
  },
  {
    id: 'kal-ho-naa-ho',
    title: 'Kal Ho Naa Ho (Har Ghadi)',
    subtitle: 'Sonu Nigam • Shankar-Ehsaan-Loy',
    category: 'bollywood',
    mode: 'harmonium',
    scaleKey: 'C (Safed 1)',
    transpose: 0,
    difficulty: 'Beginner',
    tempo: 80,
    description: 'Heartwarming, serene melody celebrated worldwide. Perfect for piano or harmonium with soothing natural notes.',
    tags: ['Sonu Nigam', 'Shah Rukh Khan', 'Bollywood', 'Emotional', 'Soulful'],
    lines: [
      {
        lyrics: 'Har ghadi badal rahi hai roop zindagi',
        sargam: 'P P P P D P M G R G M P',
        sargamHindi: 'प प प प ध प म ग रे ग म प',
        keysHarmonium: 'u u u u i u y t r t y u',
        keysPiano: 'g g g g h g f d s d f g',
        notesWestern: 'G4 G4 G4 G4 A4 G4 F4 E4 D4 E4 F4 G4'
      },
      {
        lyrics: 'Chaanv hai kabhi kabhi hai dhoop zindagi',
        sargam: 'P P P P D P M G R G M G',
        sargamHindi: 'प प प प ध प म ग रे ग म ग',
        keysHarmonium: 'u u u u i u y t r t y t',
        keysPiano: 'g g g g h g f d s d f d',
        notesWestern: 'G4 G4 G4 G4 A4 G4 F4 E4 D4 E4 F4 E4'
      },
      {
        lyrics: 'Har pal yahan jee bhar jiyo',
        sargam: 'S R G M, G R S',
        sargamHindi: 'सा रे ग म, ग रे सा',
        keysHarmonium: 'e r t y, t r e',
        keysPiano: 'a s d f, d s a',
        notesWestern: 'C4 D4 E4 F4, E4 D4 C4'
      },
      {
        lyrics: 'Jo hai samaa, kal ho naa ho',
        sargam: "'P 'D 'N S R, S",
        sargamHindi: "'प 'ध 'नि सा रे, सा",
        keysHarmonium: '` q w e r, e',
        keysPiano: 'b n m a s, a',
        notesWestern: 'G3 A3 B3 C4 D4, C4'
      }
    ],
    notes: [
      // Har ghadi badal rahi hai roop zindagi
      { id: 'kh-1', midi: 67, time: 0.0, duration: 0.35, velocity: 0.85 }, // G4
      { id: 'kh-2', midi: 67, time: 0.4, duration: 0.35, velocity: 0.85 }, // G4
      { id: 'kh-3', midi: 67, time: 0.8, duration: 0.35, velocity: 0.85 }, // G4
      { id: 'kh-4', midi: 67, time: 1.2, duration: 0.35, velocity: 0.85 }, // G4
      { id: 'kh-5', midi: 69, time: 1.6, duration: 0.4, velocity: 0.9 },  // A4
      { id: 'kh-6', midi: 67, time: 2.05, duration: 0.35, velocity: 0.8 }, // G4
      { id: 'kh-7', midi: 65, time: 2.45, duration: 0.35, velocity: 0.8 }, // F4
      { id: 'kh-8', midi: 64, time: 2.85, duration: 0.35, velocity: 0.85 }, // E4
      { id: 'kh-9', midi: 62, time: 3.25, duration: 0.35, velocity: 0.8 }, // D4
      { id: 'kh-10', midi: 64, time: 3.65, duration: 0.35, velocity: 0.85 }, // E4
      { id: 'kh-11', midi: 65, time: 4.05, duration: 0.4, velocity: 0.85 }, // F4
      { id: 'kh-12', midi: 67, time: 4.50, duration: 0.9, velocity: 0.95 }, // G4
      // Chaanv hai kabhi kabhi hai dhoop zindagi
      { id: 'kh-13', midi: 67, time: 5.60, duration: 0.35, velocity: 0.85 }, // G4
      { id: 'kh-14', midi: 67, time: 6.00, duration: 0.35, velocity: 0.85 }, // G4
      { id: 'kh-15', midi: 67, time: 6.40, duration: 0.35, velocity: 0.85 }, // G4
      { id: 'kh-16', midi: 67, time: 6.80, duration: 0.35, velocity: 0.85 }, // G4
      { id: 'kh-17', midi: 69, time: 7.20, duration: 0.4, velocity: 0.9 },  // A4
      { id: 'kh-18', midi: 67, time: 7.65, duration: 0.35, velocity: 0.8 }, // G4
      { id: 'kh-19', midi: 65, time: 8.05, duration: 0.35, velocity: 0.8 }, // F4
      { id: 'kh-20', midi: 64, time: 8.45, duration: 0.35, velocity: 0.85 }, // E4
      { id: 'kh-21', midi: 62, time: 8.85, duration: 0.35, velocity: 0.8 }, // D4
      { id: 'kh-22', midi: 64, time: 9.25, duration: 0.35, velocity: 0.85 }, // E4
      { id: 'kh-23', midi: 65, time: 9.65, duration: 0.4, velocity: 0.85 }, // F4
      { id: 'kh-24', midi: 64, time: 10.10, duration: 1.1, velocity: 0.95 }, // E4
      // Har pal yahan jee bhar jiyo
      { id: 'kh-25', midi: 60, time: 11.40, duration: 0.4, velocity: 0.85 }, // C4
      { id: 'kh-26', midi: 62, time: 11.85, duration: 0.4, velocity: 0.85 }, // D4
      { id: 'kh-27', midi: 64, time: 12.30, duration: 0.45, velocity: 0.9 }, // E4
      { id: 'kh-28', midi: 65, time: 12.80, duration: 0.7, velocity: 0.9 },  // F4
      { id: 'kh-29', midi: 64, time: 13.60, duration: 0.35, velocity: 0.85 }, // E4
      { id: 'kh-30', midi: 62, time: 14.00, duration: 0.35, velocity: 0.8 }, // D4
      { id: 'kh-31', midi: 60, time: 14.40, duration: 0.9, velocity: 0.9 },  // C4
      // Jo hai samaa, kal ho naa ho
      { id: 'kh-32', midi: 55, time: 15.50, duration: 0.35, velocity: 0.8 }, // G3
      { id: 'kh-33', midi: 57, time: 15.90, duration: 0.35, velocity: 0.8 }, // A3
      { id: 'kh-34', midi: 59, time: 16.30, duration: 0.4, velocity: 0.85 }, // B3
      { id: 'kh-35', midi: 60, time: 16.75, duration: 0.4, velocity: 0.85 }, // C4
      { id: 'kh-36', midi: 62, time: 17.20, duration: 0.65, velocity: 0.9 }, // D4
      { id: 'kh-37', midi: 60, time: 17.90, duration: 1.8, velocity: 1.0 },  // C4
    ]
  },
  {
    id: 'lag-ja-gale',
    title: 'Lag Ja Gale',
    subtitle: 'Lata Mangeshkar • Woh Kaun Thi (Madan Mohan)',
    category: 'harmonium',
    mode: 'harmonium',
    scaleKey: 'D# (Kali 2)',
    transpose: 3,
    difficulty: 'Intermediate',
    tempo: 76,
    description: 'Timeless masterpiece of Madan Mohan and Lata ji. Lush emotional bends and exquisite melodic grace notes.',
    tags: ['Lata Mangeshkar', 'Madan Mohan', 'Ghazal', 'Evergreen', 'Classic'],
    lines: [
      {
        lyrics: 'Lag ja gale ke phir yeh haseen raat ho na ho',
        sargam: "P P d P M g M P d P M g",
        sargamHindi: "प प ध॒ प म ग॒ म प ध॒ प म ग॒",
        keysHarmonium: 'u u 8 u y 5 y u 8 u y 5',
        keysPiano: 'g g y g f e f g y g f e',
        notesWestern: 'G4 G4 G#4 G4 F4 D#4 F4 G4 G#4 G4 F4 D#4'
      },
      {
        lyrics: 'Shayad phir iss janam mein mulaqaat ho na ho',
        sargam: "g M P M g R S R g M g",
        sargamHindi: "ग॒ म प म ग॒ रे सा रे ग॒ म ग॒",
        keysHarmonium: '5 y u y 5 r e r 5 y 5',
        keysPiano: 'e f g f e s a s e f e',
        notesWestern: 'D#4 F4 G4 F4 D#4 D4 C4 D4 D#4 F4 D#4'
      },
      {
        lyrics: 'Lag ja gale... se...',
        sargam: "S R g R S 'n 'd 'P",
        sargamHindi: "सा रे ग॒ रे सा 'नि॒ 'ध॒ 'प",
        keysHarmonium: 'e r 5 r e 2 1 `',
        keysPiano: 'a s e s a u y b',
        notesWestern: 'C4 D4 D#4 D4 C4 A#3 G#3 G3'
      }
    ],
    notes: [
      { id: 'lg-1', midi: 67, time: 0.0, duration: 0.45, velocity: 0.85 }, // G4
      { id: 'lg-2', midi: 67, time: 0.50, duration: 0.35, velocity: 0.8 }, // G4
      { id: 'lg-3', midi: 68, time: 0.90, duration: 0.4, velocity: 0.85 }, // G#4
      { id: 'lg-4', midi: 67, time: 1.35, duration: 0.45, velocity: 0.85 }, // G4
      { id: 'lg-5', midi: 65, time: 1.85, duration: 0.45, velocity: 0.85 }, // F4
      { id: 'lg-6', midi: 63, time: 2.35, duration: 0.6, velocity: 0.9 },  // D#4
      { id: 'lg-7', midi: 65, time: 3.00, duration: 0.35, velocity: 0.8 }, // F4
      { id: 'lg-8', midi: 67, time: 3.40, duration: 0.4, velocity: 0.85 }, // G4
      { id: 'lg-9', midi: 68, time: 3.85, duration: 0.4, velocity: 0.9 },  // G#4
      { id: 'lg-10', midi: 67, time: 4.30, duration: 0.45, velocity: 0.85 }, // G4
      { id: 'lg-11', midi: 65, time: 4.80, duration: 0.45, velocity: 0.85 }, // F4
      { id: 'lg-12', midi: 63, time: 5.30, duration: 1.0, velocity: 0.95 }, // D#4
      // Shayad phir iss janam mein
      { id: 'lg-13', midi: 63, time: 6.50, duration: 0.35, velocity: 0.8 }, // D#4
      { id: 'lg-14', midi: 65, time: 6.90, duration: 0.35, velocity: 0.85 }, // F4
      { id: 'lg-15', midi: 67, time: 7.30, duration: 0.5, velocity: 0.9 },  // G4
      { id: 'lg-16', midi: 65, time: 7.85, duration: 0.4, velocity: 0.85 }, // F4
      { id: 'lg-17', midi: 63, time: 8.30, duration: 0.4, velocity: 0.85 }, // D#4
      { id: 'lg-18', midi: 62, time: 8.75, duration: 0.4, velocity: 0.8 }, // D4
      { id: 'lg-19', midi: 60, time: 9.20, duration: 0.5, velocity: 0.85 }, // C4
      { id: 'lg-20', midi: 62, time: 9.75, duration: 0.35, velocity: 0.8 }, // D4
      { id: 'lg-21', midi: 63, time: 10.15, duration: 0.4, velocity: 0.85 }, // D#4
      { id: 'lg-22', midi: 65, time: 10.60, duration: 0.5, velocity: 0.9 }, // F4
      { id: 'lg-23', midi: 63, time: 11.15, duration: 1.5, velocity: 1.0 }, // D#4
    ]
  },
  {
    id: 'om-jai-jagdish',
    title: 'Om Jai Jagdish Hare (Aarti)',
    subtitle: 'Traditional Devotional Aarti • Pt. Shradha Ram Phillauri',
    category: 'devotional',
    mode: 'harmonium',
    scaleKey: 'C (Safed 1)',
    transpose: 0,
    difficulty: 'Beginner',
    tempo: 78,
    description: 'The universal Hindu prayer played in every temple and household on the harmonium.',
    tags: ['Aarti', 'Bhajan', 'Devotional', 'Harmonium Mandir', 'Traditional'],
    lines: [
      {
        lyrics: 'Om Jai Jagdish Hare, Swami Jai Jagdish Hare',
        sargam: 'P P G M P D P, M G R G M P',
        sargamHindi: 'प प ग म प ध प, म ग रे ग म प',
        keysHarmonium: 'u u t y u i u, y t r t y u',
        keysPiano: 'g g d f g h g, f d s d f g',
        notesWestern: 'G4 G4 E4 F4 G4 A4 G4, F4 E4 D4 E4 F4 G4'
      },
      {
        lyrics: 'Bhakta jano ke sankat, daas jano ke sankat',
        sargam: "P S' N D P P, M G R G M P",
        sargamHindi: "प सां नि ध प प, म ग रे ग म प",
        keysHarmonium: 'u p o i u u, y t r t y u',
        keysPiano: 'g k j h g g, f d s d f g',
        notesWestern: 'G4 C5 B4 A4 G4 G4, F4 E4 D4 E4 F4 G4'
      },
      {
        lyrics: 'Kshan mein door kare, Om Jai Jagdish Hare',
        sargam: 'D P M G R S, G P M G R S',
        sargamHindi: 'ध प म ग रे सा, ग प म ग रे सा',
        keysHarmonium: 'i u y t r e, t u y t r e',
        keysPiano: 'h g f d s a, d g f d s a',
        notesWestern: 'A4 G4 F4 E4 D4 C4, E4 G4 F4 E4 D4 C4'
      }
    ],
    notes: [
      // Om Jai Jagdish Hare
      { id: 'oj-1', midi: 67, time: 0.0, duration: 0.45, velocity: 0.9 }, // G4
      { id: 'oj-2', midi: 67, time: 0.50, duration: 0.4, velocity: 0.85 }, // G4
      { id: 'oj-3', midi: 64, time: 0.95, duration: 0.4, velocity: 0.85 }, // E4
      { id: 'oj-4', midi: 65, time: 1.40, duration: 0.4, velocity: 0.85 }, // F4
      { id: 'oj-5', midi: 67, time: 1.85, duration: 0.5, velocity: 0.9 },  // G4
      { id: 'oj-6', midi: 69, time: 2.40, duration: 0.5, velocity: 0.9 },  // A4
      { id: 'oj-7', midi: 67, time: 2.95, duration: 0.9, velocity: 0.95 }, // G4
      // Swami Jai Jagdish Hare
      { id: 'oj-8', midi: 65, time: 4.00, duration: 0.4, velocity: 0.85 }, // F4
      { id: 'oj-9', midi: 64, time: 4.45, duration: 0.4, velocity: 0.85 }, // E4
      { id: 'oj-10', midi: 62, time: 4.90, duration: 0.4, velocity: 0.8 }, // D4
      { id: 'oj-11', midi: 64, time: 5.35, duration: 0.4, velocity: 0.85 }, // E4
      { id: 'oj-12', midi: 65, time: 5.80, duration: 0.45, velocity: 0.85 }, // F4
      { id: 'oj-13', midi: 67, time: 6.30, duration: 1.1, velocity: 0.95 }, // G4
      // Bhakta jano ke sankat
      { id: 'oj-14', midi: 67, time: 7.60, duration: 0.4, velocity: 0.85 }, // G4
      { id: 'oj-15', midi: 72, time: 8.05, duration: 0.6, velocity: 0.95 }, // C5
      { id: 'oj-16', midi: 71, time: 8.70, duration: 0.4, velocity: 0.9 },  // B4
      { id: 'oj-17', midi: 69, time: 9.15, duration: 0.4, velocity: 0.85 }, // A4
      { id: 'oj-18', midi: 67, time: 9.60, duration: 0.4, velocity: 0.85 }, // G4
      { id: 'oj-19', midi: 67, time: 10.05, duration: 0.8, velocity: 0.9 }, // G4
      // Kshan mein door kare
      { id: 'oj-20', midi: 69, time: 11.00, duration: 0.4, velocity: 0.85 }, // A4
      { id: 'oj-21', midi: 67, time: 11.45, duration: 0.4, velocity: 0.85 }, // G4
      { id: 'oj-22', midi: 65, time: 11.90, duration: 0.4, velocity: 0.85 }, // F4
      { id: 'oj-23', midi: 64, time: 12.35, duration: 0.4, velocity: 0.85 }, // E4
      { id: 'oj-24', midi: 62, time: 12.80, duration: 0.4, velocity: 0.8 }, // D4
      { id: 'oj-25', midi: 60, time: 13.25, duration: 1.5, velocity: 1.0 }, // C4
    ]
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra (Sacred Chants)',
    subtitle: 'Vedic Chanting • Rigveda 3.62.10',
    category: 'devotional',
    mode: 'harmonium',
    scaleKey: 'C (Safed 1)',
    transpose: 0,
    difficulty: 'Beginner',
    tempo: 64,
    description: 'Ancient mantra for illumination of the intellect. Calming meditative harmonium resonance.',
    tags: ['Vedic', 'Mantra', 'Spiritual', 'Meditation', 'Peace'],
    lines: [
      {
        lyrics: 'Om Bhur Bhuva Swaha',
        sargam: 'P P D P G P',
        sargamHindi: 'प प ध प ग प',
        keysHarmonium: 'u u i u t u',
        keysPiano: 'g g h g d g',
        notesWestern: 'G4 G4 A4 G4 E4 G4'
      },
      {
        lyrics: 'Tat Savitur Varenyam',
        sargam: "P P D S' N D P",
        sargamHindi: "प प ध सां नि ध प",
        keysHarmonium: 'u u i p o i u',
        keysPiano: 'g g h k j h g',
        notesWestern: 'G4 G4 A4 C5 B4 A4 G4'
      },
      {
        lyrics: 'Bhargo Devasya Dheemahi',
        sargam: 'G M P P M G R',
        sargamHindi: 'ग म प प म ग रे',
        keysHarmonium: 't y u u y t r',
        keysPiano: 'd f g g f d s',
        notesWestern: 'E4 F4 G4 G4 F4 E4 D4'
      },
      {
        lyrics: 'Dhiyo Yo Nah Prachodayat',
        sargam: 'S R G M G R S',
        sargamHindi: 'सा रे ग म ग रे सा',
        keysHarmonium: 'e r t y t r e',
        keysPiano: 'a s d f d s a',
        notesWestern: 'C4 D4 E4 F4 E4 D4 C4'
      }
    ],
    notes: [
      // Om Bhur Bhuva Swaha
      { id: 'gm-1', midi: 67, time: 0.0, duration: 0.8, velocity: 0.9 }, // G4
      { id: 'gm-2', midi: 67, time: 0.9, duration: 0.5, velocity: 0.85 }, // G4
      { id: 'gm-3', midi: 69, time: 1.45, duration: 0.5, velocity: 0.9 }, // A4
      { id: 'gm-4', midi: 67, time: 2.00, duration: 0.6, velocity: 0.85 }, // G4
      { id: 'gm-5', midi: 64, time: 2.65, duration: 0.5, velocity: 0.85 }, // E4
      { id: 'gm-6', midi: 67, time: 3.20, duration: 1.2, velocity: 0.95 }, // G4
      // Tat Savitur Varenyam
      { id: 'gm-7', midi: 67, time: 4.6, duration: 0.5, velocity: 0.85 }, // G4
      { id: 'gm-8', midi: 67, time: 5.15, duration: 0.5, velocity: 0.85 }, // G4
      { id: 'gm-9', midi: 69, time: 5.70, duration: 0.5, velocity: 0.9 },  // A4
      { id: 'gm-10', midi: 72, time: 6.25, duration: 0.7, velocity: 0.95 }, // C5
      { id: 'gm-11', midi: 71, time: 7.00, duration: 0.5, velocity: 0.9 },  // B4
      { id: 'gm-12', midi: 69, time: 7.55, duration: 0.5, velocity: 0.85 }, // A4
      { id: 'gm-13', midi: 67, time: 8.10, duration: 1.4, velocity: 0.95 }, // G4
      // Bhargo Devasya Dheemahi
      { id: 'gm-14', midi: 64, time: 9.7, duration: 0.5, velocity: 0.85 }, // E4
      { id: 'gm-15', midi: 65, time: 10.25, duration: 0.5, velocity: 0.85 }, // F4
      { id: 'gm-16', midi: 67, time: 10.80, duration: 0.5, velocity: 0.9 },  // G4
      { id: 'gm-17', midi: 67, time: 11.35, duration: 0.7, velocity: 0.9 },  // G4
      { id: 'gm-18', midi: 65, time: 12.10, duration: 0.5, velocity: 0.85 }, // F4
      { id: 'gm-19', midi: 64, time: 12.65, duration: 0.5, velocity: 0.85 }, // E4
      { id: 'gm-20', midi: 62, time: 13.20, duration: 1.4, velocity: 0.9 },  // D4
      // Dhiyo Yo Nah Prachodayat
      { id: 'gm-21', midi: 60, time: 14.8, duration: 0.5, velocity: 0.85 }, // C4
      { id: 'gm-22', midi: 62, time: 15.35, duration: 0.5, velocity: 0.85 }, // D4
      { id: 'gm-23', midi: 64, time: 15.90, duration: 0.5, velocity: 0.9 },  // E4
      { id: 'gm-24', midi: 65, time: 16.45, duration: 0.6, velocity: 0.9 },  // F4
      { id: 'gm-25', midi: 64, time: 17.10, duration: 0.5, velocity: 0.85 }, // E4
      { id: 'gm-26', midi: 62, time: 17.65, duration: 0.5, velocity: 0.85 }, // D4
      { id: 'gm-27', midi: 60, time: 18.20, duration: 2.0, velocity: 1.0 },  // C4
    ]
  },
  {
    id: 'fuer-elise',
    title: 'Für Elise',
    subtitle: 'Ludwig van Beethoven • Bagatelle No. 25 in A Minor',
    category: 'western',
    mode: 'piano',
    scaleKey: 'A minor',
    transpose: 0,
    difficulty: 'Intermediate',
    tempo: 128,
    description: 'The immortal classical piano bagatelle recognized worldwide.',
    tags: ['Beethoven', 'Classical', 'Piano Solo', 'Masterpiece', 'Romantic'],
    lines: [
      {
        lyrics: 'Opening Motif (E - D# - E - D# - E - B - D - C - A)',
        sargam: "G' r' G' r' G' N R' S' D",
        sargamHindi: "गं' रे॒' गं' रे॒' गं' नि रे' सां ध",
        keysHarmonium: '] = ] = ] o [ p i',
        keysPiano: '; p ; p ; j l k h',
        notesWestern: 'E5 D#5 E5 D#5 E5 B4 D5 C5 A4'
      },
      {
        lyrics: 'Left hand arpeggio (Am: A2 - E3 - A3) with C4 - E4 - A4 - B4 melody',
        sargam: 'S G D N (with Bass A)',
        sargamHindi: 'सा ग ध नि (बास ए के साथ)',
        keysHarmonium: 'e t i o',
        keysPiano: 'a d h j',
        notesWestern: 'C4 E4 A4 B4'
      }
    ],
    notes: [
      { id: 'fe-1', midi: 76, time: 0.0, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-2', midi: 75, time: 0.28, duration: 0.25, velocity: 0.8 }, // D#5
      { id: 'fe-3', midi: 76, time: 0.56, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-4', midi: 75, time: 0.84, duration: 0.25, velocity: 0.8 }, // D#5
      { id: 'fe-5', midi: 76, time: 1.12, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-6', midi: 71, time: 1.40, duration: 0.25, velocity: 0.75 }, // B4
      { id: 'fe-7', midi: 74, time: 1.68, duration: 0.25, velocity: 0.75 }, // D5
      { id: 'fe-8', midi: 72, time: 1.96, duration: 0.25, velocity: 0.8 }, // C5
      { id: 'fe-9', midi: 69, time: 2.24, duration: 0.60, velocity: 0.85 }, // A4
      // Left hand A minor
      { id: 'fe-lh-1', midi: 45, time: 2.24, duration: 0.8, velocity: 0.6 }, // A2
      { id: 'fe-lh-2', midi: 52, time: 2.50, duration: 0.8, velocity: 0.55 }, // E3
      { id: 'fe-lh-3', midi: 57, time: 2.76, duration: 0.8, velocity: 0.55 }, // A3
      // Melody
      { id: 'fe-10', midi: 60, time: 3.00, duration: 0.28, velocity: 0.7 }, // C4
      { id: 'fe-11', midi: 64, time: 3.30, duration: 0.28, velocity: 0.7 }, // E4
      { id: 'fe-12', midi: 69, time: 3.60, duration: 0.28, velocity: 0.75 }, // A4
      { id: 'fe-13', midi: 71, time: 3.90, duration: 0.60, velocity: 0.8 }, // B4
      // Left hand E major
      { id: 'fe-lh-4', midi: 40, time: 3.90, duration: 0.8, velocity: 0.6 }, // E2
      { id: 'fe-lh-5', midi: 52, time: 4.15, duration: 0.8, velocity: 0.55 }, // E3
      { id: 'fe-lh-6', midi: 56, time: 4.40, duration: 0.8, velocity: 0.55 }, // G#3
      // Melody
      { id: 'fe-14', midi: 64, time: 4.65, duration: 0.28, velocity: 0.7 }, // E4
      { id: 'fe-15', midi: 68, time: 4.95, duration: 0.28, velocity: 0.7 }, // G#4
      { id: 'fe-16', midi: 71, time: 5.25, duration: 0.28, velocity: 0.75 }, // B4
      { id: 'fe-17', midi: 72, time: 5.55, duration: 0.60, velocity: 0.85 }, // C5
      // Left hand A minor
      { id: 'fe-lh-7', midi: 45, time: 5.55, duration: 0.8, velocity: 0.6 }, // A2
      { id: 'fe-lh-8', midi: 52, time: 5.80, duration: 0.8, velocity: 0.55 }, // E3
      { id: 'fe-lh-9', midi: 57, time: 6.05, duration: 0.8, velocity: 0.55 }, // A3
      // Repeat main motif
      { id: 'fe-18', midi: 64, time: 6.30, duration: 0.28, velocity: 0.7 }, // E4
      { id: 'fe-19', midi: 76, time: 6.60, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-20', midi: 75, time: 6.88, duration: 0.25, velocity: 0.8 }, // D#5
      { id: 'fe-21', midi: 76, time: 7.16, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-22', midi: 75, time: 7.44, duration: 0.25, velocity: 0.8 }, // D#5
      { id: 'fe-23', midi: 76, time: 7.72, duration: 0.25, velocity: 0.8 }, // E5
      { id: 'fe-24', midi: 71, time: 8.00, duration: 0.25, velocity: 0.75 }, // B4
      { id: 'fe-25', midi: 74, time: 8.28, duration: 0.25, velocity: 0.75 }, // D5
      { id: 'fe-26', midi: 72, time: 8.56, duration: 0.25, velocity: 0.8 }, // C5
      { id: 'fe-27', midi: 69, time: 8.84, duration: 1.20, velocity: 0.95 }, // A4
    ]
  },
  {
    id: 'interstellar',
    title: 'Interstellar Theme',
    subtitle: 'Hans Zimmer • "First Step" (No Time For Caution)',
    category: 'western',
    mode: 'piano',
    scaleKey: 'A minor',
    transpose: 0,
    difficulty: 'Intermediate',
    tempo: 96,
    description: 'Hypnotic arpeggios that build into a thunderous cosmic emotional climax.',
    tags: ['Hans Zimmer', 'Soundtrack', 'Epic', 'Piano Arpeggio', 'Cinematic'],
    lines: [
      {
        lyrics: 'Cycle 1: A minor (A2 Bass + E4 - A4 - B4 - C5)',
        sargam: "G P D N S' (Bass 'D)",
        sargamHindi: "ग प ध नि सां (बास 'ध)",
        keysHarmonium: 't u i o p (with mandra q)',
        keysPiano: 'd g h j k (with z)',
        notesWestern: 'E4 A4 B4 C5 (Bass A2)'
      },
      {
        lyrics: 'Cycle 2: F major (F2 Bass + E4 - A4 - C5 - D5)',
        sargam: "G P S' R' (Bass 'M)",
        sargamHindi: "ग प सां रें (बास 'म)",
        keysHarmonium: 't u p [ (with mandra 1)',
        keysPiano: 'd g k l (with c)',
        notesWestern: 'E4 A4 C5 D5 (Bass F2)'
      }
    ],
    notes: [
      // Cycle 1: A minor
      { id: 'is-b1', midi: 45, time: 0.0, duration: 3.8, velocity: 0.6 }, // A2
      { id: 'is-1', midi: 64, time: 0.0, duration: 0.45, velocity: 0.7 }, // E4
      { id: 'is-2', midi: 69, time: 0.5, duration: 0.45, velocity: 0.75 }, // A4
      { id: 'is-3', midi: 71, time: 1.0, duration: 0.45, velocity: 0.8 }, // B4
      { id: 'is-4', midi: 64, time: 1.5, duration: 0.45, velocity: 0.7 }, // E4
      { id: 'is-5', midi: 69, time: 2.0, duration: 0.45, velocity: 0.75 }, // A4
      { id: 'is-6', midi: 71, time: 2.5, duration: 0.45, velocity: 0.8 }, // B4
      { id: 'is-7', midi: 72, time: 3.0, duration: 0.8, velocity: 0.85 }, // C5
      // Cycle 2: F major
      { id: 'is-b2', midi: 41, time: 4.0, duration: 3.8, velocity: 0.65 }, // F2
      { id: 'is-8', midi: 64, time: 4.0, duration: 0.45, velocity: 0.7 }, // E4
      { id: 'is-9', midi: 69, time: 4.5, duration: 0.45, velocity: 0.75 }, // A4
      { id: 'is-10', midi: 72, time: 5.0, duration: 0.45, velocity: 0.85 }, // C5
      { id: 'is-11', midi: 64, time: 5.5, duration: 0.45, velocity: 0.7 }, // E4
      { id: 'is-12', midi: 69, time: 6.0, duration: 0.45, velocity: 0.75 }, // A4
      { id: 'is-13', midi: 72, time: 6.5, duration: 0.45, velocity: 0.85 }, // C5
      { id: 'is-14', midi: 74, time: 7.0, duration: 0.8, velocity: 0.9 }, // D5
      // Cycle 3: G major
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
    id: 'canon-in-d',
    title: 'Canon in D',
    subtitle: 'Johann Pachelbel • Baroque Classic',
    category: 'western',
    mode: 'piano',
    scaleKey: 'D Major',
    transpose: 2,
    difficulty: 'Intermediate',
    tempo: 75,
    description: 'The most popular classical progression of all time. Elegant, uplifting and structured.',
    tags: ['Baroque', 'Wedding Classic', 'Canon', 'Chords', 'Pachelbel'],
    lines: [
      {
        lyrics: 'Theme: F#5 - E5 - D5 - C#5 - B4 - A4 - B4 - C#5',
        sargam: "M' G R S 'N 'D 'N S (Scale D)",
        sargamHindi: "म॑ ग रे सा 'नि 'ध 'नि सा",
        keysHarmonium: '7 t r e w q w e',
        keysPiano: 't d s a m n m a',
        notesWestern: 'F#5 E5 D5 C#5 B4 A4 B4 C#5'
      }
    ],
    notes: [
      { id: 'cn-1', midi: 78, time: 0.0, duration: 0.9, velocity: 0.85 }, // F#5
      { id: 'cn-2', midi: 76, time: 1.0, duration: 0.9, velocity: 0.85 }, // E5
      { id: 'cn-3', midi: 74, time: 2.0, duration: 0.9, velocity: 0.85 }, // D5
      { id: 'cn-4', midi: 73, time: 3.0, duration: 0.9, velocity: 0.85 }, // C#5
      { id: 'cn-5', midi: 71, time: 4.0, duration: 0.9, velocity: 0.85 }, // B4
      { id: 'cn-6', midi: 69, time: 5.0, duration: 0.9, velocity: 0.85 }, // A4
      { id: 'cn-7', midi: 71, time: 6.0, duration: 0.9, velocity: 0.85 }, // B4
      { id: 'cn-8', midi: 73, time: 7.0, duration: 1.2, velocity: 0.9 },  // C#5
    ]
  }
];

/**
 * Intelligent Sargam & Note Sequence Parser:
 * Allows user to paste any sargam or letters from the web and turns it into auto-playable Note[] sequence!
 */
export function parseSargamOrTextToNotes(text: string, _baseMidi = 60, defaultDuration = 0.45): Note[] {
  const result: Note[] = [];
  let currentTime = 0;
  let noteCounter = 0;

  // Clean and tokenize text
  const tokens = text
    .replace(/[,;|\n\r]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const SARGAM_MAP: { [key: string]: number } = {
    // Mandra (Lower octave)
    "'s": 48, "'r": 49, "'re": 49, "'g": 51, "'ga": 51, "'m": 53, "'ma": 53,
    "'m'": 54, "'p": 55, "'pa": 55, "'d": 56, "'dha": 56, "'n": 58, "'ni": 58,
    // Shuddha Mandra
    "'r+": 50, "'g+": 52, "'d+": 57, "'n+": 59,

    // Madhya Saptak
    "s": 60, "sa": 60, "सा": 60,
    "r": 61, "re_": 61, "re": 62, "रे": 62, "रे॒": 61,
    "g": 63, "ga_": 63, "ga": 64, "ग": 64, "ग॒": 63,
    "m": 65, "ma": 65, "म": 65,
    "m'": 66, "ma'": 66, "म॑": 66,
    "p": 67, "pa": 67, "प": 67,
    "d": 68, "dha_": 68, "dha": 69, "ध": 69, "ध॒": 68,
    "n": 70, "ni_": 70, "ni": 71, "नि": 71, "नि॒": 70,

    // Taar Saptak (Higher octave)
    "s'": 72, "sa'": 72, "सां": 72,
    "r'": 74, "re'": 74, "रें": 74,
    "g'": 76, "ga'": 76, "गं": 76,
    "m'h": 77, "ma'h": 77, "में": 77,
    "p'": 79, "pa'": 79, "पें": 79,
  };

  // Computer Key to MIDI map
  const KEY_MAP: { [key: string]: number } = {
    'e': 60, '4': 61, 'r': 62, '5': 63, 't': 64, 'y': 65, '7': 66, 'u': 67,
    '8': 68, 'i': 69, '9': 70, 'o': 71, 'p': 72, '-': 73, '[': 74, '=': 75,
    ']': 76, '\\': 77, 'a': 60, 's': 62, 'd': 64, 'f': 65, 'g': 67, 'h': 69,
    'j': 71, 'k': 72, 'l': 74, ';': 76
  };

  for (const token of tokens) {
    const lower = token.toLowerCase();
    let midi: number | undefined = undefined;

    // Check Sargam
    if (SARGAM_MAP[lower] !== undefined) {
      midi = SARGAM_MAP[lower];
    } else if (SARGAM_MAP[token] !== undefined) {
      midi = SARGAM_MAP[token];
    } else if (lower.length === 1 && KEY_MAP[lower] !== undefined) {
      midi = KEY_MAP[lower];
    } else {
      // Try Western note name: e.g. C4, D#4, F5
      const match = lower.match(/^([a-g])(#|b)?(\d)?$/);
      if (match) {
        const noteLetter = match[1];
        const accidental = match[2] || '';
        const oct = match[3] ? parseInt(match[3]) : 4;
        const letterOffsets: { [k: string]: number } = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
        let pitch = (oct + 1) * 12 + letterOffsets[noteLetter];
        if (accidental === '#' || accidental === 's') pitch += 1;
        if (accidental === 'b') pitch -= 1;
        midi = pitch;
      }
    }

    if (midi !== undefined && midi >= 21 && midi <= 108) {
      result.push({
        id: `parsed-${noteCounter++}`,
        midi,
        time: parseFloat(currentTime.toFixed(2)),
        duration: defaultDuration,
        velocity: 0.88,
      });
      currentTime += defaultDuration + 0.08;
    }
  }

  return result;
}
