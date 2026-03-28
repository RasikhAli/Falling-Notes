import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { useMIDIStore } from '../store/MIDIStore';
import { keys, NOTE_FALL_SPEED, WHITE_KEY_WIDTH, BLACK_KEY_WIDTH } from '../utils/Constants';

const VISIBLE_WINDOW = 8; // Seconds

export const NoteBars: React.FC = () => {
    const notes = useMIDIStore(state => state.notes);
    const liveHistory = useMIDIStore(state => state.liveHistory);
    const activeLiveNotes = useMIDIStore(state => state.activeLiveNotes);
    const currentTime = useMIDIStore(state => state.currentTime);
    const hasMidi = useMIDIStore(state => !!state.midiData);

    const keyMap = useMemo(() => {
        const map = new Map();
        keys.forEach(k => map.set(k.midi, k));
        return map;
    }, []);

    // Notes visible in the current time window
    const visibleNotes = useMemo(() => {
        const fileNotes = notes.filter(note => {
            const start = note.time;
            const end = start + note.duration;
            return end > currentTime && start < currentTime + VISIBLE_WINDOW;
        });

        // Current active live notes (growing)
        const liveNotes: any[] = [];
        activeLiveNotes.forEach(note => liveNotes.push(note));
        
        // Recently released live notes (rising/falling)
        const activeIds = new Set(liveNotes.map(n => n.id));
        const history = liveHistory.filter(note => {
            if (activeIds.has(note.id)) return false; // Don't duplicate
            
            const end = note.time + note.duration;
            if (hasMidi) { // falling
                return end > currentTime;
            } else { // rising
                return note.time + note.duration + VISIBLE_WINDOW > currentTime;
            }
        });

        return [...fileNotes, ...liveNotes, ...history];
    }, [notes, liveHistory, activeLiveNotes, currentTime, hasMidi]);

    // Direction: -1 for falling (with file), 1 for rising (live)
    const direction = hasMidi ? -1 : 1;

    return (
        <Instances range={visibleNotes.length}>
            <boxGeometry args={[1, 1, 0.5]} />
            <meshStandardMaterial 
                emissive="#ffcc00" 
                emissiveIntensity={2} 
                color="#ffaa00" 
                transparent 
                opacity={0.9} 
            />
            
            {visibleNotes.map((note) => {
                const keyInfo = keyMap.get(note.midi);
                if (!keyInfo) return null;

                const width = keyInfo.isBlack ? BLACK_KEY_WIDTH * 0.8 : WHITE_KEY_WIDTH * 0.7;
                const height = Math.max(0.1, note.duration * NOTE_FALL_SPEED);
                
                // Position logic
                let y;
                if (direction === -1) { // FALLING (File Mode)
                    // Bottom hits keyboard at note.time
                    const yBottom = (note.time - currentTime) * NOTE_FALL_SPEED;
                    y = yBottom + height / 2;
                } else { // RISING (Live Mode)
                    // Top (start edge) leaves keyboard at note.time
                    // After the note started, its bottom is at (currentTime - time) * SPEED
                    const yBottom = (currentTime - note.time) * NOTE_FALL_SPEED - height;
                    y = yBottom + height / 2;
                }

                // If note is live and currently pressed, its duration is updated by store
                // We just need to ensure scale and position are correct
                return (
                    <Instance
                        key={note.id}
                        position={[keyInfo.x, y, 0]}
                        scale={[width, height, 1]}
                    />
                );
            })}
        </Instances>
    );
};
