import React, { useEffect } from 'react';
import { Visualizer } from './components/Visualizer';
import { Controls } from './components/Controls';
import { useMIDIStore } from './store/MIDIStore';
import { useInput } from './hooks/useInput';
import { audioEngine } from './utils/AudioEngine';
import { Music, Piano as PianoIcon, Info, Code } from 'lucide-react';

function App() {
  const isPlaying = useMIDIStore(state => state.isPlaying);
  const togglePlay = useMIDIStore(state => state.togglePlay);
  const reset = useMIDIStore(state => state.reset);
  const loadMIDI = useMIDIStore(state => state.loadMIDI);
  const clearMidi = useMIDIStore(state => state.clearMidi);
  const speed = useMIDIStore(state => state.playbackSpeed);
  const setSpeed = useMIDIStore(state => state.setSpeed);
  const updateTime = useMIDIStore(state => state.updateTime);
  const midiData = useMIDIStore(state => state.midiData);

  // Initialize input hooks
  useInput();

  const isSamplesLoaded = useMIDIStore(state => state.isSamplesLoaded);

  // Internal playback loop
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      updateTime(delta);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [updateTime]);

  const handleTogglePlay = async () => {
    await audioEngine.init();
    togglePlay();
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden select-none">
      {/* Visualizer Scene */}
      <Visualizer />

      {/* Initial Entry / Loading Overlay */}
      {(!isSamplesLoaded || !audioEngine.isInitialized) && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center pointer-events-auto">
              <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(255,200,0,0.3)] animate-pulse">
                      <PianoIcon size={40} className="text-black" />
                  </div>
                  
                  <h2 className="text-4xl font-black uppercase tracking-[0.4em] text-yellow-500 mb-4 italic">Falling Notes</h2>
                  
                  {!isSamplesLoaded ? (
                      <div>
                          <p className="text-white/40 text-sm mb-8 uppercase tracking-[0.3em]">Preparing Concert Environment...</p>
                          <div className="w-48 h-1 bg-white/10 mx-auto rounded-full overflow-hidden">
                              <div className="w-1/2 h-full bg-yellow-500 animate-[shimmer_2s_infinite]"></div>
                          </div>
                          
                          {/* Force Start for browsers blocking automatic loading */}
                          <button 
                            onClick={() => audioEngine.init()}
                            className="mt-10 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                          >
                            Enter Experience
                          </button>
                      </div>
                  ) : (
                      <p className="text-yellow-500 text-sm font-bold animate-bounce mt-10 tracking-widest uppercase cursor-pointer" onClick={() => audioEngine.init()}>Click to Begin</p>
                  )}
              </div>
          </div>
      )}

      {/* Header UI */}
      <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 pointer-events-auto group">
            <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(255,220,0,0.5)] transition-transform group-hover:rotate-12">
              <PianoIcon size={28} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-yellow-500 drop-shadow-[0_0_10px_rgba(255,200,0,0.8)]">Falling Notes</h1>
              <p className="text-[10px] font-bold text-yellow-200/40 tracking-[0.4em] uppercase">Professional Performance Visualizer</p>
            </div>
          </div>
          
          {midiData && (
              <div className="mt-6 p-5 bg-black/40 backdrop-blur-md rounded-2xl border-l-4 border-l-yellow-500 pointer-events-auto max-w-[280px] animate-in fade-in slide-in-from-left duration-700">
                  <span className="text-[10px] font-black text-yellow-500 uppercase block mb-1 tracking-widest">Now Playing</span>
                  <span className="text-sm font-bold truncate block text-white/90" title={midiData.header.name || "Unnamed MIDI"}>
                    {midiData.header.name || "MIDI Session"}
                  </span>
              </div>
          )}
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-yellow-500/10 border border-white/10 rounded-full transition-all text-xs font-black uppercase tracking-widest">
            <Info size={16} className="text-yellow-500" />
            <span>Guide</span>
          </button>
        </div>
      </header>

      {/* Instructions Overlay if no MIDI & not playing */}
      {!isPlaying && !midiData?.tracks.length && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-48">
            <div className="text-center max-w-lg animate-in fade-in zoom-in duration-1000">
                <Music size={80} className="mx-auto mb-6 text-yellow-500/20" />
                <h2 className="text-2xl font-black text-yellow-500/50 uppercase tracking-[0.3em] italic">Load MIDI or Play Real-time</h2>
                <p className="text-white/20 mt-4 font-bold tracking-widest">A-K for Middle Octave | Z-M for Lower</p>
            </div>
         </div>
      )}

      {/* Custom Controls UI Overlay */}
      <Controls 
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={reset}
        onFileUpload={loadMIDI}
        onClearMidi={clearMidi}
        speed={speed}
        onSpeedChange={setSpeed}
        hasMidi={!!midiData}
      />

      {/* Footer Branding */}
      <footer className="absolute bottom-6 right-8 text-right pointer-events-none opacity-30 select-none">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">PRO Performance | 60 FPS</div>
          <div className="text-[8px] font-bold uppercase tracking-widest">Powered by Antigravity x Tone.js</div>
      </footer>
    </div>
  );
}

export default App;
