import { useEffect } from 'react';
import { useMIDIStore } from '../store/MIDIStore';
import { audioEngine } from '../utils/AudioEngine';

const KEY_MAP: { [key: string]: number } = {
  // Octave 3 (Top Row)
  'q': 48, // C3
  '2': 49, // C#3
  'w': 50, // D3
  '3': 51, // D#3
  'e': 52, // E3
  'r': 53, // F3
  '5': 54, // F#3
  't': 55, // G3
  '6': 56, // G#3
  'y': 57, // A3
  '7': 58, // A#3
  'u': 59, // B3
  
  // Octave 4 (Home Row - existing)
  'a': 60, // C4
  'w_mapped': 61, // Shared with w? no, use keys like w, e, r for top row.
  's': 62, // D4
  'e_mapped': 63, 
  'd': 64, // E4
  'f': 65, // F4
  't_mapped': 66,
  'g': 67, // G4
  'y_mapped': 68,
  'h': 69, // A4
  'u_mapped': 70,
  'j': 71, // B4
  'k': 72, // C5
  'l': 74, // D5
  ';': 76, // E5
  "'": 77, // F5
  
  // Bottom Row (Octave 3/4 mix for more keys)
  'z': 48, 'x': 50, 'c': 52, 'v': 53, 'b': 55, 'n': 57, 'm': 59,
  ',': 60, '.': 62, '/': 64,
};

export const useInput = () => {
    const triggerNoteOn = useMIDIStore(state => state.triggerNoteOn);
    const triggerNoteOff = useMIDIStore(state => state.triggerNoteOff);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            const midi = KEY_MAP[e.key.toLowerCase()];
            if (midi) {
                triggerNoteOn(midi, 0.7);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const midi = KEY_MAP[e.key.toLowerCase()];
            if (midi) {
                triggerNoteOff(midi);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        // Handle MIDI Input
        // Note: must wait for user interaction to start AudioContext first
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(access => {
                for (const input of access.inputs.values()) {
                    input.onmidimessage = (message) => {
                        if (!message.data) return;
                        const [status, midi, velocity] = Array.from(message.data);
                        const command = status & 0xF0;
                        
                        if (command === 0x90 && velocity > 0) { // Note on
                            triggerNoteOn(midi, velocity / 127);
                        } else if (command === 0x80 || (command === 0x90 && velocity === 0)) { // Note off
                            triggerNoteOff(midi);
                        }
                    };
                }
            }).catch(err => {
                console.warn("Web MIDI access not available or denied. Please grant permission or try a compatible browser.", err);
            });
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [triggerNoteOn, triggerNoteOff]);
};
