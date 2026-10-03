import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Upload,
  Settings,
  Zap,
  Trash2,
  Info,
  Sparkles,
  Music,
  Headphones,
  Mic,
  Tag,
  FileText,
  BookOpen,
  Waves,
  Plus,
  Minus,
  SlidersHorizontal,
} from 'lucide-react';
import { useMIDIStore } from '../store/MIDIStore';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onClearMidi: () => void;
  onToggleSettings: () => void;
  onToggleGuide: () => void;
  onTogglePerformance: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  hasTrack: boolean;
  isPerformanceMode: boolean;
}

const INDIAN_SCALES = [
  { st: 0, key: 'C', in: 'Safed 1' },
  { st: 1, key: 'C#', in: 'Kali 1' },
  { st: 2, key: 'D', in: 'Safed 2' },
  { st: 3, key: 'D#', in: 'Kali 2' },
  { st: 4, key: 'E', in: 'Safed 3' },
  { st: 5, key: 'F', in: 'Safed 4' },
  { st: 6, key: 'F#', in: 'Kali 3' },
  { st: 7, key: 'G', in: 'Safed 5' },
  { st: 8, key: 'G#', in: 'Kali 4' },
  { st: 9, key: 'A', in: 'Safed 6' },
  { st: 10, key: 'A#', in: 'Kali 5' },
  { st: 11, key: 'B', in: 'Safed 7' },
];

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  onClearMidi,
  onToggleSettings,
  onToggleGuide,
  onTogglePerformance,
  speed,
  onSpeedChange,
  hasTrack,
  isPerformanceMode,
}) => {
  const loadMIDI = useMIDIStore((state) => state.loadMIDI);
  const loadAudioOrVideo = useMIDIStore((state) => state.loadAudioOrVideo);
  const loadDemo = useMIDIStore((state) => state.loadDemo);
  const inputMode = useMIDIStore((state) => state.inputMode);
  const setInputMode = useMIDIStore((state) => state.setInputMode);
  const audioPlayMode = useMIDIStore((state) => state.audioPlayMode);
  const setAudioPlayMode = useMIDIStore((state) => state.setAudioPlayMode);
  const showLabels = useMIDIStore((state) => state.showLabels);
  const setShowLabels = useMIDIStore((state) => state.setShowLabels);
  const showNotesManual = useMIDIStore((state) => state.showNotesManual);
  const toggleNotesManual = useMIDIStore((state) => state.toggleNotesManual);
  const showSongSearch = useMIDIStore((state) => state.showSongSearch);
  const toggleSongSearch = useMIDIStore((state) => state.toggleSongSearch);
  const transpose = useMIDIStore((state) => state.transpose);
  const setTranspose = useMIDIStore((state) => state.setTranspose);
  const reverbWet = useMIDIStore((state) => state.reverbWet);
  const setReverbWet = useMIDIStore((state) => state.setReverbWet);
  const harmoniumBassReed = useMIDIStore((state) => state.harmoniumBassReed);
  const harmoniumCoupler = useMIDIStore((state) => state.harmoniumCoupler);
  const harmoniumBellows = useMIDIStore((state) => state.harmoniumBellows);
  const setHarmoniumConfig = useMIDIStore((state) => state.setHarmoniumConfig);
  const currentTime = useMIDIStore((state) => state.currentTime);
  const totalDuration = useMIDIStore((state) => state.totalDuration);
  const seekTo = useMIDIStore((state) => state.seekTo);

  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'mid' || ext === 'midi') {
      loadMIDI(file);
    } else {
      loadAudioOrVideo(file);
    }
    e.target.value = '';
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Cycle label modes: both -> notes -> keys -> none -> both
  const cycleLabels = () => {
    if (showLabels === 'both') setShowLabels('notes');
    else if (showLabels === 'notes') setShowLabels('keys');
    else if (showLabels === 'keys') setShowLabels('none');
    else setShowLabels('both');
  };

  return (
    <div
      className={`fixed bottom-3 transition-all duration-300 z-30 flex flex-col gap-2 -translate-x-1/2 ${
        showSongSearch && !isPerformanceMode
          ? 'sm:left-[calc(50%+220px)] left-1/2 w-[95%] sm:max-w-4xl'
          : 'left-1/2 w-[95%] max-w-5xl'
      } ${
        isPerformanceMode ? 'opacity-0 pointer-events-none translate-y-8' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Track Progress Scrubber (When a song is loaded) */}
      {hasTrack && totalDuration > 0 && (
        <div className="flex items-center gap-3 px-6 py-2 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
          <span className="text-[11px] font-mono text-zinc-400 min-w-[36px]">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.1"
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-[11px] font-mono text-zinc-400 min-w-[36px]">{formatTime(totalDuration)}</span>
        </div>
      )}

      {/* Harmonium Acoustic Real-Time Tone, Transpose & Reverb Strip */}
      {inputMode === 'harmonium' && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 py-2.5 bg-zinc-950/90 backdrop-blur-2xl border border-amber-500/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] text-xs">
          {/* Left: Indian Scale Changer (Transpose) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
              <SlidersHorizontal size={13} />
              Scale Changer:
            </span>

            <div className="flex items-center gap-1 bg-black/60 border border-white/10 px-1 py-0.5 rounded-xl">
              <button
                onClick={() => setTranspose(transpose - 1)}
                className="p-1 hover:bg-white/10 rounded-lg text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Transpose down 1 semitone"
              >
                <Minus size={13} />
              </button>

              <select
                value={((transpose % 12) + 12) % 12}
                onChange={(e) => setTranspose(Number(e.target.value))}
                className="bg-transparent text-amber-300 font-mono font-bold text-xs px-1 cursor-pointer focus:outline-none"
                title="Select Root Scale (Sur)"
              >
                {INDIAN_SCALES.map((scale) => (
                  <option key={scale.st} value={scale.st} className="bg-zinc-900 text-white">
                    {scale.key} ({scale.in}) {scale.st > 0 ? `+${scale.st}` : '0'}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setTranspose(transpose + 1)}
                className="p-1 hover:bg-white/10 rounded-lg text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Transpose up 1 semitone"
              >
                <Plus size={13} />
              </button>
            </div>

            {transpose !== 0 && (
              <button
                onClick={() => setTranspose(0)}
                className="px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] text-zinc-400 hover:text-white cursor-pointer"
                title="Reset scale to C (Safed 1)"
              >
                Reset (C)
              </button>
            )}
          </div>

          {/* Center: Reverb Control */}
          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <div className="flex items-center gap-1.5 text-zinc-300 text-[11px] font-bold">
              <Waves size={14} className="text-amber-400" />
              <span>Reverb:</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={reverbWet}
                onChange={(e) => setReverbWet(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                title={`Harmonium Hall Reverb Wet: ${Math.round(reverbWet * 100)}%`}
              />
              <span className="font-mono text-amber-300 text-[11px] min-w-[28px]">
                {Math.round(reverbWet * 100)}%
              </span>
            </div>

            {/* Preset Reverb buttons */}
            <div className="hidden lg:flex items-center gap-1 text-[10px]">
              {[
                { label: 'Dry', wet: 0.1 },
                { label: 'Mehfil', wet: 0.28 },
                { label: 'Darbar', wet: 0.55 },
              ].map((rev) => (
                <button
                  key={rev.label}
                  onClick={() => setReverbWet(rev.wet)}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                    Math.abs(reverbWet - rev.wet) < 0.05
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {rev.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Harmonium Reed Stops (Bass & Coupler) */}
          <div className="hidden sm:flex items-center gap-1.5 border-l border-white/10 pl-3">
            <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">Reeds:</span>
            <button
              onClick={() => setHarmoniumConfig({ bass: !harmoniumBassReed })}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                harmoniumBassReed
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-white/5 text-zinc-500 border border-white/5'
              }`}
              title="Bass Reed: Deep woody sub-octave fundamental"
            >
              Bass (-12)
            </button>

            <button
              onClick={() => setHarmoniumConfig({ coupler: !harmoniumCoupler })}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                harmoniumCoupler
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-white/5 text-zinc-500 border border-white/5'
              }`}
              title="Octave Coupler: High shimmering reed (+12)"
            >
              Coupler (+12)
            </button>

            <button
              onClick={() => setHarmoniumConfig({ bellows: harmoniumBellows > 0.2 ? 0.0 : 0.45 })}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                harmoniumBellows > 0.2
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-white/5 text-zinc-500 border border-white/5'
              }`}
              title="Bellows Air Flutter / Tremolo"
            >
              Bellows
            </button>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Control Dock */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 px-5 py-3 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
        {/* Left Section: Play / Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white"
            title="Reset to beginning"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-11 h-11 flex items-center justify-center bg-gradient-to-tr from-amber-500 to-yellow-300 hover:from-amber-400 hover:to-yellow-200 text-black font-black rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>

          {/* Speed Control */}
          <div className="hidden sm:flex flex-col gap-1 w-24 border-l border-white/10 pl-3">
            <div className="flex justify-between text-[9px] uppercase font-black text-amber-400/80 tracking-wider">
              <span>Speed</span>
              <span className="text-white font-mono">{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Center Section: Instrument & Audio Mode Switchers */}
        <div className="flex items-center gap-2">
          {/* Instrument Toggle */}
          <div className="flex bg-black/60 border border-white/10 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setInputMode('piano')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputMode === 'piano'
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🎹 Piano
            </button>
            <button
              onClick={() => setInputMode('harmonium')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputMode === 'harmonium'
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🪗 Harmonium
            </button>
          </div>

          {/* Audio Output Mode Toggle (Original Mix vs Vocal Cut Karaoke vs Synth Solo) */}
          <div className="hidden md:flex bg-black/60 border border-white/10 p-1 rounded-xl text-xs font-bold" title="Toggle audio playback mode for uploaded MP3/MP4 files">
            <button
              onClick={() => setAudioPlayMode('original_audio')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                audioPlayMode === 'original_audio'
                  ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Play uploaded high-fidelity original audio track"
            >
              <Music size={13} />
              <span>Original Song</span>
            </button>
            <button
              onClick={() => setAudioPlayMode('vocal_remover')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                audioPlayMode === 'vocal_remover'
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Suppresses vocals and lyrics using real-time stereo phase cancellation"
            >
              <Mic size={13} />
              <span>Vocal Cut (Karaoke)</span>
            </button>
            <button
              onClick={() => setAudioPlayMode('instrument_only')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                audioPlayMode === 'instrument_only'
                  ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Synthesizer solo (Piano/Harmonium) without audio track"
            >
              <Headphones size={13} />
              <span>Synth Solo</span>
            </button>
          </div>

          {/* Note & Key Labels Cycler Button */}
          <button
            onClick={cycleLabels}
            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title={`Note labels on keys & falling bars: ${showLabels.toUpperCase()} (Click to toggle)`}
          >
            <Tag size={13} className="text-amber-400" />
            <span className="capitalize">{showLabels}</span>
          </button>
        </div>

        {/* Right Section: Upload, Demos & Tools */}
        <div className="flex items-center gap-2 text-zinc-400">
          {/* Upload Button */}
          <label
            className="cursor-pointer p-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 hover:border-amber-400/60 rounded-xl transition-all text-amber-400 flex items-center gap-1.5 text-xs font-bold"
            title="Upload .mid (pure MIDI sheet) or .mp3, .wav, .mp4"
          >
            <Upload size={16} />
            <span className="hidden lg:inline">Upload Song</span>
            <input
              type="file"
              className="hidden"
              accept=".mid,.midi,.mp3,.wav,.ogg,.m4a,.mp4,.aac"
              onChange={handleFileUpload}
            />
          </label>

          {/* Instant Demos Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-amber-300 hover:text-amber-200 cursor-pointer"
              title="Load Demo Song"
            >
              <Sparkles size={16} />
            </button>
            {showDemoMenu && (
              <div className="absolute bottom-full mb-2 right-0 bg-zinc-900 border border-zinc-700 p-2 rounded-2xl shadow-2xl w-60 gap-1.5 text-xs z-40 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider px-2 py-0.5">Built-in Studio Demos</span>
                <button
                  onClick={() => {
                    loadDemo(0);
                    setShowDemoMenu(false);
                  }}
                  className="text-left px-3 py-2 rounded-xl hover:bg-zinc-800 text-white flex items-center gap-2 cursor-pointer"
                >
                  <Music size={14} className="text-cyan-400 shrink-0" />
                  <span className="truncate">Für Elise (Piano Solo)</span>
                </button>
                <button
                  onClick={() => {
                    loadDemo(1);
                    setShowDemoMenu(false);
                  }}
                  className="text-left px-3 py-2 rounded-xl hover:bg-zinc-800 text-white flex items-center gap-2 cursor-pointer"
                >
                  <Music size={14} className="text-blue-400 shrink-0" />
                  <span className="truncate">Interstellar (Hans Zimmer)</span>
                </button>
                <button
                  onClick={() => {
                    loadDemo(2);
                    setShowDemoMenu(false);
                  }}
                  className="text-left px-3 py-2 rounded-xl hover:bg-zinc-800 text-white flex items-center gap-2 cursor-pointer"
                >
                  <Music size={14} className="text-amber-400 shrink-0" />
                  <span className="truncate">Tum Hi Ho (Harmonium)</span>
                </button>
                <button
                  onClick={() => {
                    loadDemo(3);
                    setShowDemoMenu(false);
                  }}
                  className="text-left px-3 py-2 rounded-xl hover:bg-zinc-800 text-white flex items-center gap-2 cursor-pointer"
                >
                  <Music size={14} className="text-rose-400 shrink-0" />
                  <span className="truncate">Raag Yaman (Harmonium Classic)</span>
                </button>
              </div>
            )}
          </div>

          {/* Clear Track */}
          {hasTrack && (
            <button
              onClick={onClearMidi}
              className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-xl transition-all cursor-pointer"
              title="Clear song"
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* Song Finder & Web Search Side Panel Toggle */}
          <button
            onClick={toggleSongSearch}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              showSongSearch
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30'
            }`}
            title="Search songs, Indian Sargam notes, mapped keyboard keys & auto-play"
          >
            <BookOpen size={16} />
            <span className="hidden sm:inline">Song Finder</span>
          </button>

          {/* Song Notes Manual */}
          <button
            onClick={toggleNotesManual}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              showNotesManual
                ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'hover:bg-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Song Notes Manual / Notation Sheet"
          >
            <FileText size={16} />
          </button>

          {/* Settings */}
          <button
            onClick={onToggleSettings}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-zinc-400 hover:text-white cursor-pointer"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* Guide */}
          <button
            onClick={onToggleGuide}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-zinc-400 hover:text-white cursor-pointer"
            title="Keyboard Guide"
          >
            <Info size={16} />
          </button>

          {/* Performance Mode */}
          <button
            onClick={onTogglePerformance}
            className="p-2.5 hover:bg-amber-500/20 text-amber-400 rounded-xl transition-all cursor-pointer"
            title="Toggle Cinematic Mode"
          >
            <Zap size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
