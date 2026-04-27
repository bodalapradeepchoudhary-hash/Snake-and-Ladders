import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Synthesis - AI Demo 1",
    artist: "Neural Synths",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f3ff",
    themeClass: "bg-[#00f3ff]",
    borderClass: "border-[#00f3ff]",
    textClass: "text-[#00f3ff]",
    shadowClass: "shadow-[0_0_10px_#00f3ff]"
  },
  {
    id: 2,
    title: "Cybernetic Groove - AI Demo 2",
    artist: "AutoHertz",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
    themeClass: "bg-[#ff00ff]",
    borderClass: "border-[#ff00ff]",
    textClass: "text-[#ff00ff]",
    shadowClass: "shadow-[0_0_10px_#ff00ff]"
  },
  {
    id: 3,
    title: "Digital Horizon - AI Demo 3",
    artist: "DeepMind Waves",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39ff14",
    themeClass: "bg-[#39ff14]",
    borderClass: "border-[#39ff14]",
    textClass: "text-[#39ff14]",
    shadowClass: "shadow-[0_0_10px_#39ff14]"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-[#0d0d14] p-5 rounded-sm border border-[#00f3ff]/20 flex flex-col gap-4">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#00f3ff] mb-2 border-b border-[#00f3ff]/10 pb-2">Audio Stream</h2>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleNext}
      />

      {/* Header Info */}
      <div className="flex justify-between items-center bg-[#050508] p-3 border border-white/5 rounded-sm">
        <div className="flex gap-4 items-center">
          <div className={`relative w-12 h-12 bg-[#1a1a24] rounded-sm flex items-center justify-center border ${currentTrack.borderClass}/30 overflow-hidden`}>
            {isPlaying ? (
              <div className={`w-3 h-3 ${currentTrack.themeClass} rounded-full animate-pulse ${currentTrack.shadowClass}`}></div>
            ) : (
              <div className={`w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[${currentTrack.color}] border-b-[6px] border-b-transparent ml-1`}></div>
            )}
          </div>
          <div>
            <h3 className={`text-xs font-bold uppercase ${currentTrack.textClass} truncate max-w-[140px]`}>{currentTrack.title}</h3>
            <p className="text-[10px] text-slate-400 mt-1 opacity-60 uppercase">{currentTrack.artist}</p>
          </div>
        </div>
        
        {/* Equalizer Visualizer */}
        <div className="flex items-end gap-[2px] h-8 w-16 px-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 transition-all duration-300 ${currentTrack.themeClass} ${isPlaying ? 'animate-bounce-bar ' + currentTrack.shadowClass : 'h-[2px] opacity-30 shadow-none'}`}
            ></div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2 px-2">
        <button
          onClick={toggleMute}
          className="text-slate-500 hover:text-white transition-colors p-2"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-6">
          <button
            onClick={handlePrev}
            className="text-white opacity-40 hover:opacity-100 hover:text-[#00f3ff] transition-all"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button
            onClick={togglePlay}
            className={`w-10 h-10 flex items-center justify-center rounded-none border transition-all ${isPlaying ? currentTrack.borderClass + ' ' + currentTrack.shadowClass : 'border-white/20'}`}
          >
            {isPlaying ? (
              <Pause className={`w-4 h-4 fill-current ${currentTrack.textClass}`} />
            ) : (
              <Play className={`w-4 h-4 fill-current text-white ml-1 ${currentTrack.textClass}`} />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-white opacity-40 hover:opacity-100 hover:text-[#00f3ff] transition-all "
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        
        {/* Spacer for symmetry with mute button */}
        <div className="w-8"></div>
      </div>
    </div>
  );
}
