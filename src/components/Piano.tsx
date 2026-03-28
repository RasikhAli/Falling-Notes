import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import { 
  keys, 
  WHITE_KEY_WIDTH, 
  BLACK_KEY_WIDTH, 
  WHITE_KEY_HEIGHT, 
  WHITE_KEY_LENGTH, 
  BLACK_KEY_HEIGHT, 
  BLACK_KEY_LENGTH 
} from '../utils/Constants';
import { useMIDIStore } from '../store/MIDIStore';

interface KeyProps {
  midi: number;
  isBlack: boolean;
  x: number;
  label: string;
}

const Key: React.FC<KeyProps> = ({ midi, isBlack, x }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const activeNotes = useMIDIStore(state => state.activeNotes);
  const isActive = activeNotes.has(midi);

  const width = isBlack ? BLACK_KEY_WIDTH : WHITE_KEY_WIDTH * 0.95;
  const height = isBlack ? BLACK_KEY_HEIGHT : WHITE_KEY_HEIGHT;
  const length = isBlack ? BLACK_KEY_LENGTH : WHITE_KEY_LENGTH;
  const z = isBlack ? BLACK_KEY_LENGTH / 2 : WHITE_KEY_LENGTH / 2;
  const y = isBlack ? (BLACK_KEY_HEIGHT - WHITE_KEY_HEIGHT) / 2 : 0;

  const keyColor = isActive ? '#ffff00' : (isBlack ? '#111' : '#eee');

  useFrame(() => {
    if (meshRef.current) {
        const targetY = isActive ? -0.2 : y;
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.4);
    }
  });

  return (
    <group position={[x, y, z]}>
      <Box 
        ref={meshRef} 
        args={[width, height, length]}
      >
        <meshStandardMaterial 
          color={keyColor} 
          emissive={isActive ? '#ffff00' : 'black'} 
          emissiveIntensity={isActive ? 10 : 0}
          roughness={isActive ? 0 : 0.5}
        />
      </Box>
      
      {/* Key Impact Glow */}
      {isActive && (
        <mesh position={[0, height / 2 + 0.1, -length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[width * 1.5, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

export const Piano: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {keys.map((key) => (
        <Key key={key.midi} {...key} />
      ))}
    </group>
  );
};
