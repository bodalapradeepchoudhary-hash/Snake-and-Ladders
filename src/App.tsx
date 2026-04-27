import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 font-sans flex flex-col items-center justify-center p-4 sm:p-8 border-[length:var(--border-width,0px)] sm:border-4 border-[#12121a]">
      <div className="max-w-6xl w-full grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-16 items-center justify-items-center lg:justify-items-start">
        
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-sm lg:max-w-none">
          <div className="flex items-center gap-3 relative z-10 justify-center lg:justify-start">
            <div className="w-3 h-3 rounded-full bg-[#00f3ff] animate-pulse shadow-[0_0_8px_#00f3ff]"></div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-[#00f3ff] uppercase">
              Cyber Snake<span className="text-xs font-normal opacity-50 ml-2 hidden sm:inline">V.1.0.4</span>
            </h1>
          </div>

          <div className="bg-[#0d0d14] border border-[#00f3ff]/20 p-6 rounded-sm text-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold z-10 relative">System Score</div>
            <div className="text-5xl sm:text-6xl font-mono font-bold text-[#39ff14] drop-shadow-[0_0_8px_#39ff14] z-10 relative">
              {score.toString().padStart(4, '0')}
            </div>
          </div>

          <div className="w-full relative z-10">
            <MusicPlayer />
          </div>
        </div>

        {/* Right Content - Game */}
        <div className="w-full flex justify-center lg:justify-end relative">
          <SnakeGame onScoreUpdate={setScore} />
        </div>

      </div>
    </div>
  );
}
