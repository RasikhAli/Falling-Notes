import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Piano } from './Piano';
import { NoteBars } from './NoteBars';

const Scene: React.FC = () => {
    return (
        <>
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 20, 10]} intensity={3.0} color="#ffaa00" />
            <pointLight position={[60, 10, -5]} intensity={2} color="#ffaa00" />
            <pointLight position={[-60, 10, -5]} intensity={2} color="#ffaa00" />
            
            {/* Top-down Synthesia camera */}
            <PerspectiveCamera 
                makeDefault 
                position={[0, 55, 55]} 
                fov={80}
                rotation={[-Math.PI / 2.6, 0, 0]}
            />
            
            <Suspense fallback={null}>
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                
                <NoteBars />
                <Piano />
                
                <EffectComposer>
                    <Bloom 
                        luminanceThreshold={0.4} 
                        mipmapBlur 
                        intensity={2.0} 
                        radius={0.3} 
                    />
                </EffectComposer>
            </Suspense>
        </>
    );
};

export const Visualizer: React.FC = () => {
    return (
        <div className="w-full h-full bg-black">
            <Canvas shadows gl={{ antialias: false, stencil: false, alpha: false, depth: true }} dpr={[1, 2]}>
                <Scene />
            </Canvas>
        </div>
    );
};
