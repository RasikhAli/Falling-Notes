import { useEffect } from 'react';
import { Visualizer } from './components/Visualizer';
import { Controls } from './components/Controls';
import { SongNotesManual } from './components/SongNotesManual';
import { SongSearchPanel } from './components/SongSearchPanel';
import { useMIDIStore } from './store/MIDIStore';
import { useInput } from './hooks/useInput';
import { audioEngine } from './utils/AudioEngine';
import { Music, Piano as PianoIcon, X, Sparkles, FileAudio, Sliders, Headphones, Mic, EyeOff, FileText, BookOpen, Waves } from 'lucide-react';

function App() {
  const isPlaying = useMIDIStore((state) => state.isPlaying);
  const showSettings = useMIDIStore((state) => state.showSettings);
  const showGuide = useMIDIStore((state) => state.showGuide);
  const isPerformanceMode = useMIDIStore((state) => state.isPerformanceMode);
  const inputMode = useMIDIStore((state) => state.inputMode);
  const audioPlayMode = useMIDIStore((state) => state.audioPlayMode);
  const setAudioPlayMode = useMIDIStore((state) => state.setAudioPlayMode);
  const showLabels = useMIDIStore((state) => state.showLabels);
  const setShowLabels = useMIDIStore((state) => state.setShowLabels);
  const transpose = useMIDIStore((state) => state.transpose);
  const setTranspose = useMIDIStore((state) => state.setTranspose);
  const octaveShift = useMIDIStore((state) => state.octaveShift);
  const setOctaveShift = useMIDIStore((state) => state.setOctaveShift);
  const isTranscribing = useMIDIStore((state) => state.isTranscribing);
  const transcriptionProgress = useMIDIStore((state) => state.transcriptionProgress);
  const isAudioInitialized = useMIDIStore((state) => state.isAudioInitialized);

  const togglePlay = useMIDIStore((state) => state.togglePlay);
  const reset = useMIDIStore((state) => state.reset);
  const clearMidi = useMIDIStore((state) => state.clearMidi);
  const speed = useMIDIStore((state) => state.playbackSpeed);
  const setSpeed = useMIDIStore((state) => state.setSpeed);
  const updateTime = useMIDIStore((state) => state.updateTime);
  const toggleSettings = useMIDIStore((state) => state.toggleSettings);
  const toggleGuide = useMIDIStore((state) => state.toggleGuide);
  const togglePerformance = useMIDIStore((state) => state.togglePerformanceMode);
  const setInputMode = useMIDIStore((state) => state.setInputMode);
  const audioFileName = useMIDIStore((state) => state.audioFileName);
  const notes = useMIDIStore((state) => state.notes);
  const loadDemo = useMIDIStore((state) => state.loadDemo);
  const showNotesManual = useMIDIStore((state) => state.showNotesManual);
  const toggleNotesManual = useMIDIStore((state) => state.toggleNotesManual);
  const showSongSearch = useMIDIStore((state) => state.showSongSearch);
  const toggleSongSearch = useMIDIStore((state) => state.toggleSongSearch);
  const reverbWet = useMIDIStore((state) => state.reverbWet);
  const setReverbWet = useMIDIStore((state) => state.setReverbWet);
  const harmoniumBassReed = useMIDIStore((state) => state.harmoniumBassReed);
  const harmoniumCoupler = useMIDIStore((state) => state.harmoniumCoupler);
  const setHarmoniumConfig = useMIDIStore((state) => state.setHarmoniumConfig);

  // Initialize input listeners
  useInput();

  // Global keyboard shortcuts (ESC to exit cinematic mode or close drawers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPerformanceMode) togglePerformance();
        if (showSongSearch) toggleSongSearch();
        if (showNotesManual) toggleNotesManual();
        if (showGuide) toggleGuide();
        if (showSettings) toggleSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPerformanceMode, showSongSearch, showNotesManual, showGuide, showSettings, togglePerformance, toggleSongSearch, toggleNotesManual, toggleGuide, toggleSettings]);

  // Internal playback animation loop
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

  const handleStartExperience = async () => {
    await audioEngine.init();
  };

  return (
    <div className="relative w-screen h-screen bg-[#030306] text-white overflow-hidden select-none font-sans">
      {/* 3D Visualizer Scene */}
      <div
        className={`w-full h-full transition-[padding] duration-300 ease-in-out ${
          showSongSearch && !isPerformanceMode ? 'sm:pl-[440px]' : 'pl-0'
        }`}
      >
        <Visualizer />
      </div>

      {/* Audio / Video Transcription Loading Overlay */}
      {isTranscribing && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-[70] flex items-center justify-center p-6">
          <div className="bg-zinc-900/95 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_60px_rgba(245,158,11,0.25)]">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse">
              <FileAudio className="text-amber-400" size={32} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Extracting Instrumental Notes</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Analyzing audio frequencies & isolating notes into pure instrument performance...
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-3 border border-zinc-700">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.round(transcriptionProgress * 100)}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              {Math.round(transcriptionProgress * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Initial Audio Engine Splash Screen */}
      {!isAudioInitialized && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center pointer-events-auto">
          <div className="text-center max-w-md px-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)] animate-bounce">
              <PianoIcon size={38} className="text-black" />
            </div>

            <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-2 italic">
              Falling <span className="text-amber-400">Notes</span>
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 mb-8 font-semibold">
              3D Real-Time Piano & Harmonium Visualizer
            </p>

            <button
              onClick={handleStartExperience}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              Enter Experience
            </button>
            <p className="text-[11px] text-zinc-500 mt-4">
              Click to activate Web Audio synthesis & 3D sound engine
            </p>
          </div>
        </div>
      )}

      {/* Interactive Keyboard Guide Modal */}
      {showGuide && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-xl z-[60] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-zinc-900/95 border border-zinc-700 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <PianoIcon className="text-amber-400" size={24} />
                <h3 className="text-2xl font-black uppercase text-white tracking-wide">Keyboard Playing Guide</h3>
              </div>
              <button
                onClick={toggleGuide}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Piano Mode Card */}
              <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  <h4 className="text-cyan-400 font-bold uppercase text-xs tracking-widest">Piano Mode</h4>
                </div>
                <div className="space-y-3 text-xs text-zinc-300">
                  <div>
                    <span className="font-bold text-white block mb-0.5">White Keys (Naturals):</span>
                    <p className="font-mono bg-zinc-800/80 px-2 py-1 rounded text-cyan-300">A S D F G H J K L ; '</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Plays C4 through F5 (Middle Octaves)</p>
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">Black Keys (Sharps & Flats):</span>
                    <p className="font-mono bg-zinc-800/80 px-2 py-1 rounded text-fuchsia-300">W E &nbsp; T Y U &nbsp; O P</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Accidentals positioned naturally above key gaps</p>
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">Bass Register (Octave 3):</span>
                    <p className="font-mono bg-zinc-800/80 px-2 py-1 rounded text-zinc-300">Z X C V B N M</p>
                  </div>
                </div>
              </div>

              {/* Harmonium Mode Card */}
              <div className="bg-black/40 border border-amber-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                  <h4 className="text-amber-400 font-bold uppercase text-xs tracking-widest">Harmonium Mode (Sargam)</h4>
                </div>
                <div className="space-y-3 text-xs text-zinc-300">
                  <div>
                    <span className="font-bold text-white block mb-0.5">Shuddha Swaras (White Keys):</span>
                    <p className="font-mono bg-zinc-800/80 px-2 py-1 rounded text-amber-300">E R T Y U I O P</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Sa (सा), Re (रे), Ga (ग), Ma (म), Pa (प), Dha (धा), Ni (नि), Sa' (सां)</p>
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">Komal & Tivra Swaras (Black Keys):</span>
                    <p className="font-mono bg-zinc-800/80 px-2 py-1 rounded text-yellow-300">4 5 &nbsp; 7 8 9 &nbsp; - =</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">re (रे॒), ga (ग॒), tivra Ma' (म॑), dha (ध॒), ni (नि॒)</p>
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5">Mandra Saptak (Pre-Octave):</span>
                    <p className="font-mono bg-zinc-800/80 px-2 py-1 rounded text-zinc-300">` 1 Q 2 W</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware & Upload Info */}
            <div className="mt-6 bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700/60 text-xs text-zinc-400 space-y-1.5">
              <p>
                <strong className="text-white">🎹 Hardware MIDI:</strong> Connect any USB or Bluetooth MIDI keyboard controller. Plug & play with zero latency!
              </p>
              <p>
                <strong className="text-white">🎧 Solo Instrumental Cover (.mp3 / .mp4):</strong> When you upload a song, FallingNotes transcribes the notes and plays pure piano/harmonium instrumental sound without vocals!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-700 w-96 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-amber-400" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Audio & Visuals</h2>
              </div>
              <button onClick={toggleSettings} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Instrument Mode */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Instrument Engine</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/60 border border-zinc-800 rounded-xl">
                  <button
                    onClick={() => setInputMode('piano')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${inputMode === 'piano' ? 'bg-cyan-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                  >
                    🎹 Grand Piano
                  </button>
                  <button
                    onClick={() => setInputMode('harmonium')}
                    className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${inputMode === 'harmonium' ? 'bg-amber-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                  >
                    🪗 Harmonium
                  </button>
                </div>
              </div>

              {/* Uploaded Audio Playback Mode (Solo Instrument vs Original Vocals) */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Audio Track Playback</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/60 border border-zinc-800 rounded-xl">
                  <button
                    onClick={() => setAudioPlayMode('instrument_only')}
                    className={`py-2 px-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      audioPlayMode === 'instrument_only' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Headphones size={13} />
                    <span>Solo Instrument</span>
                  </button>
                  <button
                    onClick={() => setAudioPlayMode('original_audio')}
                    className={`py-2 px-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      audioPlayMode === 'original_audio' ? 'bg-purple-500 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Mic size={13} />
                    <span>With Vocals</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">
                  {audioPlayMode === 'instrument_only'
                    ? 'Only the piano/harmonium instrument plays (vocals/lyrics muted).'
                    : 'The original audio file with vocals plays in the background.'}
                </p>
              </div>

              {/* Note Labels Selector */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Key & Note Labels</label>
                  <span className="text-xs text-amber-400 font-bold uppercase">{showLabels}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 p-1 bg-black/60 border border-zinc-800 rounded-xl text-xs font-bold">
                  {(['both', 'notes', 'keys', 'none'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setShowLabels(mode)}
                      className={`py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                        showLabels === mode ? 'bg-amber-400 text-black shadow' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transpose Slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                    {inputMode === 'harmonium' ? 'Scale Changer (Transpose)' : 'Transpose Pitch'}
                  </label>
                  <span className="text-xs text-amber-400 font-mono font-bold">
                    {transpose > 0 ? `+${transpose}` : transpose} semitones
                  </span>
                </div>
                <input
                  type="range"
                  min="-11"
                  max="11"
                  step="1"
                  value={transpose}
                  onChange={(e) => setTranspose(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Master Reverb Control */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <Waves size={13} className="text-amber-400" />
                    <span>Concert Reverb (Wet Space)</span>
                  </label>
                  <span className="text-xs text-amber-400 font-mono font-bold">{Math.round(reverbWet * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={reverbWet}
                  onChange={(e) => setReverbWet(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Dry (0%)</span>
                  <span>Mehfil (28%)</span>
                  <span>Darbar (55%)</span>
                </div>
              </div>

              {/* Harmonium Specific Reed Stops */}
              {inputMode === 'harmonium' && (
                <div className="space-y-2 p-3 bg-black/40 border border-amber-500/20 rounded-xl">
                  <label className="text-[10px] text-amber-400 uppercase font-black tracking-wider block">
                    Harmonium Reed Bank &amp; Bellows
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      onClick={() => setHarmoniumConfig({ bass: !harmoniumBassReed })}
                      className={`p-2 rounded-lg border transition-all cursor-pointer ${
                        harmoniumBassReed
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                    >
                      Bass Reed (-12)
                    </button>
                    <button
                      onClick={() => setHarmoniumConfig({ coupler: !harmoniumCoupler })}
                      className={`p-2 rounded-lg border transition-all cursor-pointer ${
                        harmoniumCoupler
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                    >
                      Octave Coupler (+12)
                    </button>
                  </div>
                </div>
              )}

              {/* Octave Slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Octave Register</label>
                  <span className="text-xs text-amber-400 font-mono font-bold">Octave {octaveShift}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={octaveShift}
                  onChange={(e) => setOctaveShift(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header UI */}
      <header
        className={`absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-20 transition-opacity duration-700 ${
          isPerformanceMode ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3.5 pointer-events-auto">
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.45)]">
              <PianoIcon size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase italic text-white drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                Falling <span className="text-amber-400">Notes</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  {inputMode === 'harmonium' ? '🪗 Harmonium' : '🎹 Grand Piano'}
                </span>
                <span className="text-[9px] text-zinc-500">•</span>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Headphones size={10} />
                  {audioPlayMode === 'instrument_only' ? 'Solo Cover' : 'Vocals'}
                </span>
              </div>
            </div>
          </div>

          {/* Now Playing Banner */}
          {audioFileName && (
            <div className="mt-1 p-3 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border-l-4 border-l-amber-400 border border-white/10 pointer-events-auto max-w-[300px] shadow-xl animate-in fade-in slide-in-from-left duration-300 flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="text-[9px] font-black text-amber-400 uppercase block mb-0.5 tracking-widest flex items-center gap-1.5">
                  <Music size={11} /> Now Playing
                </span>
                <span className="text-xs font-bold truncate block text-white/95" title={audioFileName}>
                  {audioFileName}
                </span>
              </div>
              <button
                onClick={toggleNotesManual}
                className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/30 text-amber-400 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                title="Open Song Notes Manual"
              >
                <FileText size={12} />
                <span>Sheet</span>
              </button>
            </div>
          )}
        </div>

        {/* Top Right Quick Access: Song Finder & Keys Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleSongSearch}
            className="px-3.5 py-2 bg-zinc-900/90 hover:bg-zinc-850 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer backdrop-blur-md"
            title="Search songs, Sargam notes & mapped keyboard keys"
          >
            <BookOpen size={15} className="text-amber-400" />
            <span className="hidden sm:inline">Song Finder &amp; Keys</span>
          </button>
        </div>
      </header>

      {/* Cinematic / Performance Mode Floating Exit Button */}
      {isPerformanceMode && (
        <div className="fixed top-5 right-5 z-[80] animate-in fade-in duration-300">
          <button
            onClick={togglePerformance}
            className="px-4 py-2 bg-zinc-950/90 hover:bg-zinc-900 text-white hover:text-amber-400 border border-amber-400/50 hover:border-amber-400 rounded-full text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer backdrop-blur-md"
          >
            <EyeOff size={14} className="text-amber-400" />
            <span>Exit Cinematic (ESC)</span>
          </button>
        </div>
      )}

      {/* Center Welcome Dialog if no track loaded */}
      {!isPlaying && notes.length === 0 && !isPerformanceMode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-48">
          <div className="text-center max-w-md animate-in fade-in zoom-in-95 duration-500 pointer-events-auto bg-black/75 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
            <Music size={48} className="mx-auto mb-3 text-amber-400/50" />
            <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic mb-1.5">
              Ready to Perform
            </h2>
            <p className="text-zinc-400 text-xs tracking-wider mb-5">
              Upload any .mp3, .wav, or .mp4 video for an instrumental cover, or try a demo:
            </p>
            <div className="flex justify-center gap-2.5">
              <button
                onClick={() => loadDemo(0)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold border border-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
              >
                <Sparkles size={13} className="text-cyan-400" />
                <span>Für Elise (Piano)</span>
              </button>
              <button
                onClick={() => loadDemo(1)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold border border-amber-500/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span>Raag Yaman (Harmonium)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Floating Control Dock */}
      <Controls
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={reset}
        onClearMidi={clearMidi}
        onToggleSettings={toggleSettings}
        onToggleGuide={toggleGuide}
        onTogglePerformance={togglePerformance}
        speed={speed}
        onSpeedChange={setSpeed}
        hasTrack={notes.length > 0}
        isPerformanceMode={isPerformanceMode}
      />

      {/* Interactive Song Notes Manual Drawer */}
      <SongNotesManual />

      {/* Interactive Song Finder, Web Search & Sargam Parser Side Panel */}
      <SongSearchPanel />
    </div>
  );
}

export default App;
