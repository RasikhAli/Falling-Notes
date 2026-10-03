import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Play,
  Copy,
  Check,
  Music,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Globe,
  BookOpen,
  Send,
  Zap,
  Minimize2,
  Maximize2,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useMIDIStore } from '../store/MIDIStore';
import { SONG_LIBRARY, type LibrarySong, parseSargamOrTextToNotes } from '../utils/SongLibrary';
import { autoFetchSongFromWeb } from '../utils/SongFetcher';

export const SongSearchPanel: React.FC = () => {
  const showSongSearch = useMIDIStore((state) => state.showSongSearch);
  const setShowSongSearch = useMIDIStore((state) => state.setShowSongSearch);
  const loadCustomSong = useMIDIStore((state) => state.loadCustomSong);
  const setInputMode = useMIDIStore((state) => state.setInputMode);
  const setTranspose = useMIDIStore((state) => state.setTranspose);
  const currentTranspose = useMIDIStore((state) => state.transpose);
  const setSpeed = useMIDIStore((state) => state.setSpeed);
  const inputMode = useMIDIStore((state) => state.inputMode);

  const [activeTab, setActiveTab] = useState<'library' | 'web'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSongId, setExpandedSongId] = useState<string | null>('bajrangbali-hanuman-chalisa');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-fetched songs state
  const [fetchedSongs, setFetchedSongs] = useState<LibrarySong[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatusMessage, setFetchStatusMessage] = useState<string | null>(null);

  // Target instrument toggle for song playback (Piano vs Harmonium)
  const [targetInstrument, setTargetInstrument] = useState<'piano' | 'harmonium'>(inputMode);

  // Sync targetInstrument with global store when user changes mode elsewhere
  useEffect(() => {
    setTargetInstrument(inputMode);
  }, [inputMode]);

  // Pre-load Bajrangbali / Hanuman Chalisa automatically into fetched songs so it's always ready
  useEffect(() => {
    autoFetchSongFromWeb('bajrangbali').then((song) => {
      setFetchedSongs([song]);
    });
  }, []);

  // Web / Custom input state
  const [customTitle, setCustomTitle] = useState('My Custom Melody');
  const [customText, setCustomText] = useState("S R G M P D N S'");

  if (!showSongSearch) return null;

  // Combine static library + fetched songs (with deduplication)
  const allAvailableSongs: LibrarySong[] = [...fetchedSongs, ...SONG_LIBRARY].filter(
    (song, idx, arr) => arr.findIndex((s) => s.id === song.id) === idx
  );

  // Filter songs based on category and query
  const filteredSongs = allAvailableSongs.filter((song) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      song.category === selectedCategory ||
      (selectedCategory === 'harmonium' && song.mode === 'harmonium');
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(q) ||
      song.subtitle.toLowerCase().includes(q) ||
      song.description.toLowerCase().includes(q) ||
      song.scaleKey.toLowerCase().includes(q) ||
      song.tags.some((t) => t.toLowerCase().includes(q)) ||
      song.lines.some((l) => l.lyrics.toLowerCase().includes(q))
    );
  });

  // Automatic Web Search & Fetcher handler
  const handleAutoFetchSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsFetching(true);
    setFetchStatusMessage(`Auto-fetching complete notes & lyrics for "${searchQuery}"...`);

    try {
      const fetched = await autoFetchSongFromWeb(searchQuery);
      setFetchedSongs((prev) => [fetched, ...prev.filter((s) => s.id !== fetched.id)]);
      setExpandedSongId(fetched.id);
      setFetchStatusMessage(`Successfully fetched "${fetched.title}"! Ready to Auto-Play.`);
      setTimeout(() => setFetchStatusMessage(null), 3500);
    } catch {
      setFetchStatusMessage(`Could not auto-fetch song. Please try another query.`);
      setTimeout(() => setFetchStatusMessage(null), 3000);
    } finally {
      setIsFetching(false);
    }
  };

  const handlePlaySong = (song: LibrarySong, instrument: 'piano' | 'harmonium', practiceMode = false) => {
    setInputMode(instrument);
    setTargetInstrument(instrument);
    setTranspose(song.transpose);
    if (practiceMode) {
      setSpeed(0.8);
    } else {
      setSpeed(1.0);
    }
    loadCustomSong(song.title, song.notes, instrument, true);
  };

  const handleCopySequence = (song: LibrarySong) => {
    const linesText = song.lines
      .map(
        (l) =>
          `[${l.lyrics}]\nSargam: ${l.sargam} (${l.sargamHindi})\nHarmonium Keys: ${l.keysHarmonium}\nPiano Keys: ${l.keysPiano}\nWestern: ${l.notesWestern}\n`
      )
      .join('\n');
    const fullText = `--- ${song.title} (${song.subtitle}) ---\nScale: ${song.scaleKey} (Transpose: ${song.transpose})\n\n${linesText}`;

    navigator.clipboard.writeText(fullText);
    setCopiedId(song.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleParseAndPlay = (instrument: 'piano' | 'harmonium') => {
    if (!customText.trim()) return;
    const parsedNotes = parseSargamOrTextToNotes(customText);
    if (parsedNotes.length > 0) {
      setInputMode(instrument);
      setTargetInstrument(instrument);
      loadCustomSong(customTitle || 'Custom Web Song', parsedNotes, instrument, true);
    }
  };

  // Minimized floating pill bar when collapsed
  if (isMinimized) {
    return (
      <div className="fixed top-20 left-4 z-[65] animate-in fade-in duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-4 py-2.5 bg-zinc-900/95 hover:bg-zinc-850 text-amber-300 border border-amber-400/50 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all cursor-pointer backdrop-blur-xl hover:scale-105"
        >
          <BookOpen size={16} className="text-amber-400" />
          <span>Open Song Finder &amp; Keys</span>
          <Maximize2 size={13} className="text-zinc-400" />
        </button>
      </div>
    );
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 w-full sm:w-[440px] bg-zinc-950/95 backdrop-blur-3xl border-r border-white/10 z-[65] flex flex-col shadow-[25px_0_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-left duration-300"
      aria-label="Song Finder and Mapped Keys Panel"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.35)]">
            <BookOpen className="text-black" size={20} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
              Song Finder <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold border border-amber-500/30">Auto-Fetch</span>
            </h2>
            <p className="text-[11px] text-zinc-400">Search songs, Sargam notes &amp; mapped keyboard keys</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Minimize to side button"
          >
            <Minimize2 size={16} />
          </button>

          {/* Close Button */}
          <button
            onClick={() => setShowSongSearch(false)}
            className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close Song Finder"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Target Instrument Selector (Play on Piano vs Harmonium) */}
      <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
          <span>Active Instrument:</span>
        </span>
        <div className="flex bg-black/60 p-1 rounded-xl border border-zinc-800 text-xs font-bold">
          <button
            onClick={() => {
              setTargetInstrument('piano');
              setInputMode('piano');
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              targetInstrument === 'piano'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🎹 Grand Piano</span>
          </button>
          <button
            onClick={() => {
              setTargetInstrument('harmonium');
              setInputMode('harmonium');
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              targetInstrument === 'harmonium'
                ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🪗 Harmonium</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/50 p-1.5 gap-1.5">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'library'
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Music size={14} />
          <span>Curated &amp; Fetched Songs</span>
        </button>
        <button
          onClick={() => setActiveTab('web')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'web'
              ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe size={14} />
          <span>Paste Any Notes</span>
        </button>
      </div>

      {/* Tab 1: Curated & Auto-Fetched Library */}
      {activeTab === 'library' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search Bar with Instant Auto-Fetch */}
          <div className="p-3 border-b border-zinc-800/80 bg-black/30 space-y-2.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search ANY song (e.g. Bajrangbali, Kesariya, Pehla Nasha)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAutoFetchSearch();
                  }}
                  className="w-full bg-zinc-900/90 border border-zinc-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Instant Auto-Fetch Online Button */}
              <button
                onClick={handleAutoFetchSearch}
                disabled={isFetching || !searchQuery.trim()}
                className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-50 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                title="Auto-fetch complete song data online"
              >
                {isFetching ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                <span>Fetch</span>
              </button>
            </div>

            {/* Fetch Status Notification */}
            {fetchStatusMessage && (
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] font-medium animate-in fade-in flex items-center gap-2">
                <Sparkles size={13} className="text-amber-400 shrink-0" />
                <span className="truncate">{fetchStatusMessage}</span>
              </div>
            )}

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px] font-bold">
              {[
                { id: 'all', label: 'All Songs' },
                { id: 'devotional', label: '✨ Bajrangbali & Aarti' },
                { id: 'bollywood', label: '🎬 Bollywood Hits' },
                { id: 'classical', label: '🪕 Ragas' },
                { id: 'western', label: '🎹 Western Piano' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-200 text-black font-black'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Songs List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {filteredSongs.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <p className="text-zinc-400 text-xs">
                  No local songs matching &quot;{searchQuery}&quot;. Click below to auto-fetch online:
                </p>
                <button
                  onClick={handleAutoFetchSearch}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs rounded-xl inline-flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Auto-Fetch &quot;{searchQuery}&quot; from Music Web Base</span>
                </button>
              </div>
            ) : (
              filteredSongs.map((song) => {
                const isExpanded = expandedSongId === song.id;

                return (
                  <div
                    key={song.id}
                    className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all shadow-md"
                  >
                    {/* Song Card Header */}
                    <div className="p-3.5 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-black text-sm text-white truncate">{song.title}</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Full Song ({song.lines.length} lines)
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-400 block truncate">{song.subtitle}</span>
                        </div>

                        {/* Expand/Collapse Accordion */}
                        <button
                          onClick={() => setExpandedSongId(isExpanded ? null : song.id)}
                          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                          title={isExpanded ? 'Hide mapped keys' : 'Show mapped keys & Sargam'}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {/* Scale / Transpose Badge */}
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 flex-wrap">
                        <span className="bg-black/60 px-2 py-0.5 rounded border border-white/5 text-amber-300">
                          Scale: {song.scaleKey}
                        </span>
                        <span className="bg-black/60 px-2 py-0.5 rounded border border-white/5 text-zinc-300">
                          Transpose: {song.transpose > 0 ? `+${song.transpose}` : song.transpose}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span>{song.notes.length} notes</span>
                      </div>

                      {/* Dual Instrument Auto-Play Buttons (Piano AND Harmonium) */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60">
                        {/* Play on Piano Button */}
                        <button
                          onClick={() => handlePlaySong(song, 'piano', false)}
                          className={`py-2 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                            targetInstrument === 'piano'
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                          }`}
                          title="Auto-play full song on Grand Piano"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Auto-Play Piano 🎹</span>
                        </button>

                        {/* Play on Harmonium Button */}
                        <button
                          onClick={() => handlePlaySong(song, 'harmonium', false)}
                          className={`py-2 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                            targetInstrument === 'harmonium'
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                          }`}
                          title="Auto-play full song on Harmonium"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Auto-Play Harmonium 🪗</span>
                        </button>
                      </div>

                      {/* Secondary Actions: Practice, Set Transpose, Copy */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handlePlaySong(song, targetInstrument, true)}
                          className="flex-1 py-1.5 px-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 border border-zinc-700 transition-all cursor-pointer"
                          title="Practice mode at 0.8x tempo to play along on your keyboard"
                        >
                          <Sparkles size={12} className="text-cyan-400" />
                          <span>Practice (0.8x)</span>
                        </button>

                        <button
                          onClick={() => setTranspose(song.transpose)}
                          className={`py-1.5 px-2.5 text-xs font-bold rounded-xl flex items-center gap-1 border transition-all cursor-pointer ${
                            currentTranspose === song.transpose
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                              : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 border-zinc-700'
                          }`}
                          title="Set Scale / Transpose to this song's key"
                        >
                          <Sliders size={12} />
                          <span>Key ({song.transpose > 0 ? `+${song.transpose}` : song.transpose})</span>
                        </button>

                        <button
                          onClick={() => handleCopySequence(song)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                          title="Copy full key sequence and Sargam notes to clipboard"
                        >
                          {copiedId === song.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Section: Complete Full Song Lyrics & Mapped Keys Breakdown */}
                    {isExpanded && (
                      <div className="bg-black/50 p-3.5 border-t border-zinc-800 space-y-3 text-xs animate-in fade-in duration-200">
                        <p className="text-[11px] text-zinc-400 italic">{song.description}</p>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">
                            Full Song Mapped Keys &amp; Sargam:
                          </span>

                          {song.lines.map((line, idx) => (
                            <div key={idx} className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2.5 space-y-1.5">
                              {/* Lyrics */}
                              <div className="font-bold text-white text-xs flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-mono shrink-0">
                                  {idx + 1}
                                </span>
                                <span>&quot;{line.lyrics}&quot;</span>
                              </div>

                              {/* Indian Sargam */}
                              <div className="flex items-baseline gap-2 text-[11px]">
                                <span className="text-zinc-500 w-14 shrink-0 font-medium">Sargam:</span>
                                <span className="font-semibold text-amber-300 font-mono">
                                  {line.sargamHindi} <span className="text-zinc-400">({line.sargam})</span>
                                </span>
                              </div>

                              {/* Mapped Keys: Display BOTH Harmonium & Piano clearly */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                                {/* Harmonium Keys */}
                                <div className="bg-black/80 p-1.5 rounded-lg border border-amber-500/20 flex flex-col gap-0.5">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                                    🪗 Harmonium Keys:
                                  </span>
                                  <span className="font-mono font-black text-amber-300 text-[11px] tracking-widest truncate">
                                    {line.keysHarmonium}
                                  </span>
                                </div>

                                {/* Piano Keys */}
                                <div className="bg-black/80 p-1.5 rounded-lg border border-cyan-500/20 flex flex-col gap-0.5">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                                    🎹 Piano Keys:
                                  </span>
                                  <span className="font-mono font-black text-cyan-300 text-[11px] tracking-widest truncate">
                                    {line.keysPiano}
                                  </span>
                                </div>
                              </div>

                              {/* Western Notes */}
                              <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                <span className="w-14 shrink-0">Western:</span>
                                <span className="truncate">{line.notesWestern}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Paste Any Notes Converter */}
      {activeTab === 'web' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="bg-zinc-900/80 border border-cyan-500/30 rounded-2xl p-4 space-y-3 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="text-cyan-400" size={18} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Paste &amp; Auto-Play Any Notes</h3>
              </div>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">
                Smart Parser
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Paste ANY notes (Sargam like <code className="text-amber-300">S R G M P</code> or Hindi <code className="text-amber-300">सा रे ग म</code>, Western <code className="text-cyan-300">C4 D4 E4</code>, or keyboard letters <code className="text-zinc-200">E R T Y U</code>). We convert it to 3D falling bars and auto-play immediately!
            </p>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Melody Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Paste Sargam / Keys Sequence
              </label>
              <textarea
                rows={4}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. S R G M P D N S' or C4 D4 E4 G4 or E R T Y U"
                className="w-full bg-black/60 border border-zinc-700 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 custom-scrollbar"
              />
            </div>

            {/* Quick Templates */}
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Quick Templates:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => {
                    setCustomTitle('Shri Hanuman Chalisa Chaupai');
                    setCustomText('S S R G G G M G R S R R G M P M G R S P P D S\' N D P P D P M G R G M G R S');
                  }}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 rounded-lg cursor-pointer"
                >
                  Hanuman Chalisa
                </button>
                <button
                  onClick={() => {
                    setCustomTitle('Raag Yaman Aaroh/Avaroh');
                    setCustomText('\'N R G M\' D N S\' S\' N D P M\' G R S');
                  }}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 rounded-lg cursor-pointer"
                >
                  Raag Yaman
                </button>
                <button
                  onClick={() => {
                    setCustomTitle('Bilawal Shuddha Swaras');
                    setCustomText('S R G M P D N S\' S\' N D P M G R S');
                  }}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 rounded-lg cursor-pointer"
                >
                  Bilawal Scale
                </button>
              </div>
            </div>

            {/* Launch Auto-Play for Piano or Harmonium */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleParseAndPlay('piano')}
                className="py-2.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95 cursor-pointer"
              >
                <Send size={13} />
                <span>Play on Piano 🎹</span>
              </button>
              <button
                onClick={() => handleParseAndPlay('harmonium')}
                className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all active:scale-95 cursor-pointer"
              >
                <Send size={13} />
                <span>Play Harmonium 🪗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800 bg-black/70 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Sound Sync Active</span>
        </span>
        <span className="font-mono text-amber-400">Transpose: {currentTranspose > 0 ? `+${currentTranspose}` : currentTranspose}</span>
      </div>
    </aside>
  );
};
