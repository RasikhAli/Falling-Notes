import React, { Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Piano } from './Piano';
import { NoteBars } from './NoteBars';
import { useMIDIStore } from '../store/MIDIStore';

const ResponsiveScene: React.FC = () => {
  const isPerformanceMode = useMIDIStore((state) => state.isPerformanceMode);
  const inputMode = useMIDIStore((state) => state.inputMode);
  const { size } = useThree();

  // Dynamic aspect ratio calculation
  const aspect = Math.max(0.2, size.width / Math.max(1, size.height));

  // Determine optimal camera frustum so the keyboard is always fully framed across all screen sizes
  const targetKeyboardWidth = inputMode === 'harmonium' ? 76 : 138;

  // On narrower windows, scale width so the 88 keys fit without clipping on edges
  const halfWidth = aspect >= 1.7
    ? targetKeyboardWidth / 2
    : (targetKeyboardWidth / 2) * Math.max(1, 1.7 / aspect);

  const halfHeight = halfWidth / aspect;
  const centerY = -1.5;

  return (
    <>
      <color attach="background" args={['#04050a']} />

      {/* 3D Lighting */}
      <ambientLight intensity={1.3} />
      <directionalLight position={[0, 25, 20]} intensity={2.2} />
      <pointLight position={[0, -10, 12]} intensity={1.5} distance={60} />

      {/* Responsive Orthographic Camera */}
      <OrthographicCamera
        makeDefault
        position={[0, -1.0, 32]}
        rotation={[0.16, 0, 0]}
        left={-halfWidth}
        right={halfWidth}
        top={halfHeight + centerY}
        bottom={-halfHeight + centerY}
        near={0.1}
        far={1000}
      />

      <Suspense fallback={null}>
        {!isPerformanceMode && (
          <Stars radius={150} depth={20} count={350} factor={0.6} saturation={0.2} fade speed={0.4} />
        )}

        <NoteBars />
        <Piano />

        {/* Balanced Bloom: Clean neon glow without white blown-out blobs */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.75}
            intensity={0.55}
            radius={0.35}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </>
  );
};

export const Visualizer: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#030306]">
      <Canvas
        gl={{
          antialias: true,
          stencil: false,
          alpha: false,
          depth: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <ResponsiveScene />
      </Canvas>
    </div>
  );
};
