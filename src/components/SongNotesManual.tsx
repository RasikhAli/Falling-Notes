import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Copy, Check, FileText, Play, ArrowDownToLine } from 'lucide-react';
import { useMIDIStore } from '../store/MIDIStore';
import { keys } from '../utils/Constants';

export const SongNotesManual: React.FC = () => {
  const showNotesManual = useMIDIStore((state) => state.showNotesManual);
  const setShowNotesManual = useMIDIStore((state) => state.setShowNotesManual);
  const notes = useMIDIStore((state) => state.notes);
  const currentTime = useMIDIStore((state) => state.currentTime);
  const audioFileName = useMIDIStore((state) => state.audioFileName);
  const inputMode = useMIDIStore((state) => state.inputMode);
  const seekTo = useMIDIStore((state) => state.seekTo);

  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const activeItemRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current active note
  useEffect(() => {
    if (autoScroll && activeItemRef.current && listContainerRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentTime, autoScroll]);

  if (!showNotesManual) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${parseFloat(secs) < 10 ? '0' : ''}${secs}`;
  };

  // Filter notes by search query
  const filteredNotes = notes.map((note, index) => {
    const keyInfo = keys.find((k) => k.midi === note.midi);
    const shortcut = inputMode === 'harmonium' ? keyInfo?.shortcutHarmonium : keyInfo?.shortcutPiano;
    const noteName = keyInfo?.noteName || '';
    const label = keyInfo?.label || '';
    const swara = keyInfo?.swara || '';
    const swaraHindi = keyInfo?.swaraHindi || '';

    return {
      note,
      index,
      keyInfo,
      shortcut,
      noteName,
      label,
      swara,
      swaraHindi,
    };
  }).filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.noteName.toLowerCase().includes(q) ||
      (item.shortcut && item.shortcut.toLowerCase().includes(q)) ||
      item.swara.toLowerCase().includes(q) ||
      item.swaraHindi.includes(q)
    );
  });

  // Copy full notes manual to clipboard
  const handleCopy = () => {
    const text = filteredNotes
      .map((item) => {
        const time = formatTime(item.note.time);
        const name = inputMode === 'harmonium'
          ? `${item.swara} (${item.swaraHindi}) [${item.shortcut || '-'}]`
          : `${item.label} [${item.shortcut || '-'}]`;
        return `${time}  ->  ${name}  (${item.note.duration.toFixed(2)}s)`;
      })
      .join('\n');

    navigator.clipboard.writeText(
      `--- ${audioFileName || 'Song'} Notes Manual ---\n\n${text}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-zinc-950/95 backdrop-blur-2xl border-l border-white/10 z-[65] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <FileText className="text-amber-400" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-wider">Song Notes Manual</h3>
            <span className="text-[10px] text-zinc-400 font-mono block truncate max-w-[200px]" title={audioFileName || 'No song loaded'}>
              {audioFileName || 'Real-time Notation Sheet'} ({notes.length} notes)
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowNotesManual(false)}
          className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Close Manual"
        >
          <X size={18} />
        </button>
      </div>

      {/* Toolbar & Search */}
      <div className="p-3 border-b border-zinc-800/80 bg-black/40 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={inputMode === 'harmonium' ? "Search Swara (Sa, Re, Ma)..." : "Search note (C4, F#, [A])..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
          title="Copy full notation sheet to clipboard"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        {/* Auto Scroll Toggle */}
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
            autoScroll ? 'bg-amber-500/20 border-amber-400/50 text-amber-400' : 'bg-white/5 border-white/10 text-zinc-400'
          }`}
          title={autoScroll ? "Auto-scroll: ON" : "Auto-scroll: OFF"}
        >
          <ArrowDownToLine size={14} />
        </button>
      </div>

      {/* Notation Sheet Notes List */}
      <div ref={listContainerRef} className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            {notes.length === 0
              ? 'No song loaded yet. Upload a MIDI/audio file or select a Demo!'
              : 'No matching notes found for your search.'}
          </div>
        ) : (
          filteredNotes.map((item) => {
            const isActive = currentTime >= item.note.time && currentTime < item.note.time + item.note.duration;

            return (
              <div
                key={item.note.id}
                ref={isActive ? activeItemRef : null}
                onClick={() => seekTo(item.note.time)}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.01]'
                    : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800/80 text-zinc-300'
                }`}
              >
                {/* Time & Index */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 w-6">#{item.index + 1}</span>
                  <span className="text-[11px] font-mono text-amber-400/90 font-bold">{formatTime(item.note.time)}</span>
                </div>

                {/* Pitch / Swara */}
                <div className="flex items-center gap-2">
                  {inputMode === 'harmonium' ? (
                    <div className="text-right">
                      <span className="font-bold text-xs text-white block">{item.swaraHindi} ({item.swara})</span>
                      <span className="text-[10px] text-zinc-400">{item.label}</span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="font-bold text-xs text-white block">{item.label}</span>
                      <span className="text-[10px] text-zinc-400">{item.noteName}</span>
                    </div>
                  )}

                  {/* Computer Key Shortcut Badge */}
                  {item.shortcut && (
                    <span className="px-2 py-1 bg-black/60 border border-white/10 rounded-lg text-xs font-mono font-bold text-amber-300">
                      [{item.shortcut}]
                    </span>
                  )}
                </div>

                {/* Duration & Play action */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                  <span>{item.note.duration.toFixed(2)}s</span>
                  {isActive && <Play size={10} className="text-amber-400 fill-amber-400 animate-pulse ml-1" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-zinc-800 bg-black/60 text-[10px] text-zinc-500 text-center">
        Click any note card to jump to its timestamp • Spacebar to Play/Pause
      </div>
    </div>
  );
};
