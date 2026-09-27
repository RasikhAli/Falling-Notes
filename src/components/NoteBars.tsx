import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  keys,
  type Note,
  type KeyInfo,
  WHITE_KEY_WIDTH,
  BLACK_KEY_WIDTH,
  PIANO_HIT_Y,
} from '../utils/Constants';
import { useMIDIStore } from '../store/MIDIStore';

const VISIBLE_WINDOW_AHEAD = 12; // Seconds of falling notes visible in the sky
const VISIBLE_WINDOW_BEHIND = 2; // Seconds after passing hit line
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Helper component for floating note labels
const NoteLabel: React.FC<{
  note: Note;
  keyInfo: KeyInfo;
  speed: number;
  avgX: number;
  currentTime: number;
  inputMode: 'piano' | 'harmonium';
  showLabels: 'both' | 'notes' | 'keys' | 'none';
}> = ({ note, keyInfo, speed, avgX, currentTime, inputMode, showLabels }) => {
  if (showLabels === 'none') return null;

  const dist = (note.time - currentTime) * speed;
  const posY = PIANO_HIT_Y + dist + 0.6; // Position near leading edge of the falling bar

  // Only render if close enough to be readable
  if (posY < PIANO_HIT_Y - 2 || posY > 24) return null;

  const shortcut = inputMode === 'harmonium' ? keyInfo.shortcutHarmonium : keyInfo.shortcutPiano;
  const noteName = inputMode === 'harmonium' ? keyInfo.swara : keyInfo.noteName;

  let text = '';
  if (showLabels === 'both') {
    text = shortcut ? `${noteName} [${shortcut}]` : noteName;
  } else if (showLabels === 'notes') {
    text = noteName;
  } else if (showLabels === 'keys') {
    text = shortcut ? `[${shortcut}]` : noteName;
  }

  return (
    <group position={[keyInfo.x - avgX, posY, keyInfo.isBlack ? 0.9 : 0.6]}>
      <Text
        fontSize={keyInfo.isBlack ? 0.65 : 0.75}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        fontWeight="bold"
        outlineWidth={0.06}
        outlineColor="#000000"
      >
        {text}
      </Text>
    </group>
  );
};

export const NoteBars: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const notes = useMIDIStore((state) => state.notes);
  const currentTime = useMIDIStore((state) => state.currentTime);
  const liveHistory = useMIDIStore((state) => state.liveHistory);
  const activeLiveNotes = useMIDIStore((state) => state.activeLiveNotes);
  const hasMidiOrAudio = useMIDIStore((state) => !!state.midiData || !!state.audioBuffer || state.notes.length > 0);
  const liveTime = useMIDIStore((state) => state.liveTime);
  const playbackSpeed = useMIDIStore((state) => state.playbackSpeed);
  const inputMode = useMIDIStore((state) => state.inputMode);
  const showLabels = useMIDIStore((state) => state.showLabels);

  // Harmonium view filter (MIDI 53 to 85)
  const visibleKeysList = inputMode === 'harmonium'
    ? keys.filter((k) => k.midi >= 53 && k.midi <= 85)
    : keys;

  const avgX = visibleKeysList.length > 0
    ? (visibleKeysList[0].x + visibleKeysList[visibleKeysList.length - 1].x) / 2
    : 0;

  // Filter notes visible in the current time window
  const visibleNotes = useMemo(() => {
    const inRange = (m: number) => (inputMode === 'harmonium' ? m >= 53 && m <= 85 : true);

    const fileNotes = notes.filter((note) => {
      if (!inRange(note.midi)) return false;
      const start = note.time;
      const end = start + note.duration;
      return end >= currentTime - VISIBLE_WINDOW_BEHIND && start <= currentTime + VISIBLE_WINDOW_AHEAD;
    });

    const liveNotes: Note[] = [];
    activeLiveNotes.forEach((note) => {
      if (inRange(note.midi)) liveNotes.push(note);
    });

    const activeIds = new Set(liveNotes.map((n) => n.id));
    const history = liveHistory.filter((note) => {
      if (activeIds.has(note.id)) return false;
      if (!inRange(note.midi)) return false;
      const elapsed = liveTime - note.time;
      return elapsed < 12; // 12-second fly-away window
    });

    return [...fileNotes, ...liveNotes, ...history];
  }, [notes, liveHistory, activeLiveNotes, currentTime, liveTime, inputMode]);

  // Notes near the keyboard that should show floating labels
  const labeledNotes = useMemo(() => {
    if (showLabels === 'none' || !hasMidiOrAudio) return [];
    return visibleNotes
      .filter((n) => !n.isLive && n.time <= currentTime + 5 && n.time + n.duration >= currentTime - 0.5)
      .slice(0, 30); // Cap at 30 labels for high performance
  }, [visibleNotes, currentTime, showLabels, hasMidiOrAudio]);

  useFrame(() => {
    if (!meshRef.current) return;

    const speed = playbackSpeed * 15; // Vertical fall/fly speed

    visibleNotes.forEach((note, i) => {
      const keyInfo = keys.find((k) => k.midi === note.midi);
      if (!keyInfo) return;

      const durationY = Math.max(0.3, note.duration * speed);
      const isBlack = keyInfo.isBlack;
      const width = isBlack ? BLACK_KEY_WIDTH * 0.95 : WHITE_KEY_WIDTH * 0.92;
      let posY = 0;

      if (hasMidiOrAudio && !note.isLive) {
        // --- Falling MIDI / Transcribed Notes ---
        const dist = (note.time - currentTime) * speed;
        posY = PIANO_HIT_Y + dist + durationY / 2;

        if (posY + durationY / 2 < PIANO_HIT_Y - 3) {
          // Off screen below piano
          tempObject.scale.set(0, 0, 0);
        } else {
          tempObject.position.set(keyInfo.x - avgX, posY, isBlack ? 0.35 : 0.05);
          tempObject.scale.set(width, durationY, 0.5);
        }
      } else {
        // --- Rising Live Performance Notes (Fly-Away) ---
        const elapsed = liveTime - note.time;
        // Bar ascends smoothly; bottom edge detaches from key once released
        const distFromKey = Math.max(0, elapsed - note.duration) * speed;
        posY = PIANO_HIT_Y + distFromKey + durationY / 2;

        tempObject.position.set(keyInfo.x - avgX, posY, isBlack ? 0.35 : 0.05);
        tempObject.scale.set(width, durationY, 0.5);
      }

      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      // Color coding for notes
      if (inputMode === 'harmonium') {
        // Golden warm theme
        tempColor.set(isBlack ? '#f59e0b' : '#fbbf24');
      } else {
        // Cyan for white keys, Neon Pink/Magenta for black keys
        tempColor.set(isBlack ? '#e879f9' : '#00f0ff');
      }
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    meshRef.current.count = visibleNotes.length;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, 3000]}>
        <boxGeometry />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.0}
          roughness={0.25}
          transparent
          opacity={0.92}
        />
      </instancedMesh>

      {/* Floating Note & Computer Key Labels on Falling Bars */}
      {labeledNotes.map((note) => {
        const keyInfo = keys.find((k) => k.midi === note.midi);
        if (!keyInfo) return null;
        return (
          <NoteLabel
            key={note.id}
            note={note}
            keyInfo={keyInfo}
            speed={playbackSpeed * 15}
            avgX={avgX}
            currentTime={currentTime}
            inputMode={inputMode}
            showLabels={showLabels}
          />
        );
      })}
    </group>
  );
};
