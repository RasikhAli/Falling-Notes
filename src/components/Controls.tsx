import React from 'react';
import { Play, Pause, RotateCcw, Upload, Settings, Zap, Trash2 } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onFileUpload: (file: File) => void;
  onClearMidi: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  hasMidi: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  onFileUpload,
  onClearMidi,
  speed,
  onSpeedChange,
  hasMidi
}) => {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/60 backdrop-blur-xl border border-white/10 px-10 py-5 rounded-[2.5rem] z-10 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-5 border-r border-white/10 pr-6">
        <button 
          onClick={onReset}
          className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-white"
          title="Reset Playback"
        >
          <RotateCcw size={22} />
        </button>
        
        <button 
          onClick={onTogglePlay}
          className="w-14 h-14 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black rounded-full transition-all shadow-[0_0_30px_rgba(255,220,0,0.4)] active:scale-90"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      <div className="flex flex-col gap-2 w-40">
        <div className="flex justify-between text-[10px] uppercase font-black text-yellow-500/60 tracking-[0.2em]">
          <span>Playback Speed</span>
          <span className="text-white/80">{speed}x</span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1" 
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
      </div>

      <div className="flex items-center gap-3 border-l border-white/10 pl-8">
        <label className="cursor-pointer p-3 bg-white/5 hover:bg-yellow-500/20 border border-white/5 rounded-full transition-all text-yellow-500 group relative">
          <Upload size={22} />
          <input 
            type="file" 
            className="hidden" 
            accept=".mid,.midi" 
            onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
          />
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Load MIDI File</span>
        </label>
        
        {hasMidi && (
            <button 
                onClick={onClearMidi}
                className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-full transition-all"
                title="Discard MIDI"
            >
                <Trash2 size={22} />
            </button>
        )}

        <button className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-white">
          <Settings size={22} />
        </button>
        
        <button className="p-3 hover:bg-yellow-500/10 rounded-full transition-colors text-yellow-500 group relative">
          <Zap size={22} fill="currentColor" />
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Performance Mode</span>
        </button>
      </div>
    </div>
  );
};
