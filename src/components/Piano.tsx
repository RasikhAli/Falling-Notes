import React, { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  keys,
  type KeyInfo,
  WHITE_KEY_WIDTH,
  WHITE_KEY_LENGTH,
  WHITE_KEY_DEPTH,
  BLACK_KEY_WIDTH,
  BLACK_KEY_LENGTH,
  BLACK_KEY_DEPTH,
  PIANO_HIT_Y,
} from '../utils/Constants';
import { useMIDIStore } from '../store/MIDIStore';

interface KeyProps {
  keyInfo: KeyInfo;
  xOffset: number;
}

const Key: React.FC<KeyProps> = ({ keyInfo, xOffset }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const activeNotes = useMIDIStore((state) => state.activeNotes);
  const inputMode = useMIDIStore((state) => state.inputMode);
  const showLabels = useMIDIStore((state) => state.showLabels);
  const triggerNoteOn = useMIDIStore((state) => state.triggerNoteOn);
  const triggerNoteOff = useMIDIStore((state) => state.triggerNoteOff);

  const isActive = activeNotes.has(keyInfo.midi);
  const isBlack = keyInfo.isBlack;

  // Real acoustic piano key proportions
  const width = isBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH * 0.94;
  const length = isBlack ? BLACK_KEY_LENGTH : WHITE_KEY_LENGTH;
  const depth = isBlack ? BLACK_KEY_DEPTH : WHITE_KEY_DEPTH;

  // Key center Y
  const centerY = PIANO_HIT_Y - length / 2;
  const centerZ = isBlack ? 0.35 : 0;

  // Colors
  const activeColor = inputMode === 'harmonium'
    ? (isBlack ? '#f59e0b' : '#fbbf24')
    : (isBlack ? '#d946ef' : '#00e5ff');

  const defaultColor = isBlack ? '#111215' : '#f8fafc';

  // Key depression physics
  useFrame(() => {
    if (meshRef.current) {
      const targetDip = isActive ? -0.35 : 0;
      const targetRotX = isActive ? 0.035 : 0;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, centerZ + targetDip, 0.4);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.4);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    triggerNoteOn(keyInfo.midi, 110, true);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    triggerNoteOff(keyInfo.midi, true);
  };

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isActive) {
      triggerNoteOff(keyInfo.midi, true);
    }
  };

  // Label text determination
  const shortcut = inputMode === 'harmonium' ? keyInfo.shortcutHarmonium : keyInfo.shortcutPiano;
  const displayShortcut = (showLabels === 'both' || showLabels === 'keys') && shortcut;
  const displayNoteName = (showLabels === 'both' || showLabels === 'notes');

  return (
    <group position={[keyInfo.x - xOffset, centerY, centerZ]}>
      {/* 3D Key Body */}
      <Box
        ref={meshRef}
        args={[width, length, depth]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={isActive ? activeColor : defaultColor}
          emissive={isActive ? activeColor : '#000000'}
          emissiveIntensity={isActive ? 1.3 : 0}
          roughness={isBlack ? 0.4 : 0.25}
          metalness={isBlack ? 0.15 : 0.05}
        />
      </Box>

      {/* --- Key Labels (Note Names & Computer Keyboard Shortcuts) --- */}
      {showLabels !== 'none' && (
        <group position={[0, -length / 2 + (isBlack ? 1.0 : 1.3), depth / 2 + 0.06]}>
          {inputMode === 'harmonium' ? (
            // Harmonium Swara + Key
            <>
              {displayNoteName && (
                <Text
                  position={[0, displayShortcut ? 0.4 : 0, 0]}
                  fontSize={isBlack ? 0.65 : 0.75}
                  color={isBlack ? (isActive ? '#ffffff' : '#fbbf24') : (isActive ? '#000000' : '#854d0e')}
                  anchorX="center"
                  anchorY="middle"
                  fontWeight="bold"
                >
                  {keyInfo.swaraHindi}
                </Text>
              )}
              {displayShortcut && (
                <Text
                  position={[0, displayNoteName ? -0.4 : 0, 0]}
                  fontSize={isBlack ? 0.55 : 0.65}
                  color={isBlack ? (isActive ? '#ffffff' : '#fde047') : (isActive ? '#000000' : '#451a03')}
                  anchorX="center"
                  anchorY="middle"
                  fontStyle="italic"
                >
                  [{shortcut}]
                </Text>
              )}
            </>
          ) : (
            // Piano Note + Key
            <>
              {displayNoteName && (
                <Text
                  position={[0, displayShortcut ? 0.45 : 0, 0]}
                  fontSize={isBlack ? 0.65 : 0.75}
                  color={isBlack ? (isActive ? '#ffffff' : '#94a3b8') : (isActive ? '#000000' : '#64748b')}
                  anchorX="center"
                  anchorY="middle"
                  fontWeight="bold"
                >
                  {isBlack ? keyInfo.noteName : keyInfo.label}
                </Text>
              )}
              {displayShortcut && (
                <Text
                  position={[0, displayNoteName ? -0.45 : 0, 0]}
                  fontSize={isBlack ? 0.6 : 0.7}
                  color={isBlack ? (isActive ? '#ffffff' : '#f472b6') : (isActive ? '#000000' : '#0284c7')}
                  anchorX="center"
                  anchorY="middle"
                >
                  [{shortcut}]
                </Text>
              )}
            </>
          )}
        </group>
      )}

      {/* Key Impact Glow Burst */}
      {isActive && (
        <mesh position={[0, length / 2, depth / 2 + 0.05]}>
          <planeGeometry args={[width * 1.3, 0.7]} />
          <meshBasicMaterial
            color={activeColor}
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};

export const Piano: React.FC = () => {
  const inputMode = useMIDIStore((state) => state.inputMode);

  // Harmonium view shows a focused 3-octave range (MIDI 53 to 85)
  const visibleKeys = inputMode === 'harmonium'
    ? keys.filter((k) => k.midi >= 53 && k.midi <= 85)
    : keys;

  const avgX = visibleKeys.length > 0
    ? (visibleKeys[0].x + visibleKeys[visibleKeys.length - 1].x) / 2
    : 0;

  const keyboardWidth = visibleKeys.length > 0
    ? Math.abs(visibleKeys[visibleKeys.length - 1].x - visibleKeys[0].x) + WHITE_KEY_WIDTH * 1.5
    : 120;

  return (
    <group>
      {/* --- Piano Furniture & Body Frame --- */}
      {inputMode === 'harmonium' ? (
        // Authentic Indian Teak Wood Harmonium Cabinet
        <group position={[0, PIANO_HIT_Y - 4.5, -0.6]}>
          {/* Main Wooden Body Base */}
          <Box args={[keyboardWidth + 6, WHITE_KEY_LENGTH + 7, 3.2]}>
            <meshStandardMaterial color="#451a03" roughness={0.65} metalness={0.1} />
          </Box>

          {/* Wooden Top Fallboard & Register Stops Bar */}
          <Box position={[0, WHITE_KEY_LENGTH / 2 + 2.0, 1.0]} args={[keyboardWidth + 5.5, 2.5, 2.2]}>
            <meshStandardMaterial color="#2d1202" roughness={0.5} />
          </Box>

          {/* Brass Decorative Corners and Trim */}
          <Box position={[0, WHITE_KEY_LENGTH / 2 + 0.8, 1.6]} args={[keyboardWidth + 5.2, 0.25, 0.2]}>
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
          </Box>

          {/* Red Velvet Bellows Cushion Felt */}
          <Box position={[0, WHITE_KEY_LENGTH / 2 + 0.45, 0.8]} args={[keyboardWidth + 0.5, 0.5, 0.4]}>
            <meshStandardMaterial color="#991b1b" roughness={0.9} />
          </Box>

          {/* Brass Register Knobs (Stops) */}
          {[-12, -6, 0, 6, 12].map((xPos, idx) => (
            <mesh key={idx} position={[xPos, WHITE_KEY_LENGTH / 2 + 2.0, 2.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.6, 0.8, 16]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.95} roughness={0.15} />
            </mesh>
          ))}

          {/* Golden Badge */}
          <Text
            position={[0, WHITE_KEY_LENGTH / 2 + 2.0, 2.3]}
            fontSize={0.8}
            color="#fef08a"
            anchorX="center"
            anchorY="middle"
          >
            SURA-MANDIR HARMONIUM
          </Text>
        </group>
      ) : (
        // Modern Concert Grand Piano Casing
        <group position={[0, PIANO_HIT_Y - 4.5, -0.6]}>
          {/* Piano Keybed Underneath Keys */}
          <Box args={[keyboardWidth + 4, WHITE_KEY_LENGTH + 5, 2.6]}>
            <meshStandardMaterial color="#09090b" roughness={0.4} metalness={0.3} />
          </Box>

          {/* Polished Ebony Fallboard / Nameboard */}
          <Box position={[0, WHITE_KEY_LENGTH / 2 + 1.8, 1.2]} args={[keyboardWidth + 3.8, 2.2, 2.5]}>
            <meshStandardMaterial color="#030305" roughness={0.2} metalness={0.8} />
          </Box>

          {/* Red Velvet Key Felt Cushion Strip */}
          <Box position={[0, WHITE_KEY_LENGTH / 2 + 0.35, 0.85]} args={[keyboardWidth + 0.6, 0.45, 0.4]}>
            <meshStandardMaterial color="#b91c1c" roughness={0.95} />
          </Box>

          {/* Gold Inlaid Brand Name */}
          <Text
            position={[0, WHITE_KEY_LENGTH / 2 + 1.8, 2.5]}
            fontSize={1.05}
            color="#fef08a"
            anchorX="center"
            anchorY="middle"
          >
            MAGNIFIC CONCERT GRAND
          </Text>

          {/* Left & Right Cheek Blocks */}
          <Box position={[-keyboardWidth / 2 - 1.2, 0, 1.0]} args={[2.0, WHITE_KEY_LENGTH + 3, 2.2]}>
            <meshStandardMaterial color="#09090b" roughness={0.3} metalness={0.5} />
          </Box>
          <Box position={[keyboardWidth / 2 + 1.2, 0, 1.0]} args={[2.0, WHITE_KEY_LENGTH + 3, 2.2]}>
            <meshStandardMaterial color="#09090b" roughness={0.3} metalness={0.5} />
          </Box>
        </group>
      )}

      {/* --- Piano Keys --- */}
      {visibleKeys.map((key) => (
        <Key key={key.midi} keyInfo={key} xOffset={avgX} />
      ))}
    </group>
  );
};
