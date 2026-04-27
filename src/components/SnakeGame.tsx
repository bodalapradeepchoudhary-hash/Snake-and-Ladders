import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 15 },
  { x: 10, y: 16 },
  { x: 10, y: 17 }
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_TICK_RATE = 150;

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 10, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionQueue = useRef<typeof INITIAL_DIRECTION[]>([]);

  // Sound effects could go here, but omitted to prevent audio clutter with the music player

  const generateFood = useCallback((currentSnake: typeof INITIAL_SNAKE) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionQueue.current = [];
    setScore(0);
    onScoreUpdate(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isStarted && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!isStarted || isGameOver || isPaused) return;

      const lastDir = directionQueue.current.length > 0 
        ? directionQueue.current[directionQueue.current.length - 1] 
        : direction;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (lastDir.y === 0) directionQueue.current.push({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (lastDir.y === 0) directionQueue.current.push({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (lastDir.x === 0) directionQueue.current.push({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (lastDir.x === 0) directionQueue.current.push({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isStarted, isGameOver, isPaused]);

  useInterval(
    () => {
      setSnake((prevSnake) => {
        const nextDir = directionQueue.current.length > 0 ? directionQueue.current.shift()! : direction;
        // Keep standard direction state reasonably synced, though strictly relying on queue internally
        setDirection(nextDir);

        const head = prevSnake[0];
        const newHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    },
    isStarted && !isGameOver && !isPaused ? Math.max(BASE_TICK_RATE - score * 0.2, 70) : null
  );

  return (
    <div className="w-full aspect-square max-w-[500px] border-2 border-[#00f3ff]/30 rounded-sm bg-[#020205] relative shadow-[0_0_40px_rgba(0,243,255,0.05)] overflow-hidden flex flex-col group">
      
      {/* Grid rendering (Absolute positioned items on a percentage basis) */}
      <div className="flex-1 relative w-full h-full p-2">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-2 border border-white/[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
          }}
        ></div>

        {/* Snake rendering */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute transition-all duration-75 bg-[#39ff14] shadow-[0_0_10px_#39ff14] ${
                isHead ? 'z-10' : 'z-10 opacity-90'
              }`}
              style={{
                left: `calc(0.5rem + ${(segment.x / GRID_SIZE) * 100}%)`,
                top: `calc(0.5rem + ${(segment.y / GRID_SIZE) * 100}%)`,
                width: `calc(${100 / GRID_SIZE}% - 2px)`,
                height: `calc(${100 / GRID_SIZE}% - 2px)`,
                borderRadius: '0px',
              }}
            >
              {isHead && <div className="w-full h-full flex items-center justify-center text-[10px] text-black font-bold focus:outline-none select-none">•</div>}
            </div>
          );
        })}

        {/* Food rendering */}
        <div
          className="absolute bg-[#ff00ff] rounded-full shadow-[0_0_15px_#ff00ff] animate-pulse"
          style={{
            left: `calc(0.5rem + ${(food.x / GRID_SIZE) * 100}%)`,
            top: `calc(0.5rem + ${(food.y / GRID_SIZE) * 100}%)`,
            width: `calc(${100 / GRID_SIZE}% - 2px)`,
            height: `calc(${100 / GRID_SIZE}% - 2px)`,
            transform: 'scale(0.8)', // make food slightly smaller than grid cell
          }}
        />
      </div>

      {/* Main overlays (Start, Game Over, Pause) */}
      {(!isStarted || isGameOver || isPaused) && (
        <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-20">
          
          {isGameOver && (
            <div className="mb-6 flex flex-col items-center">
              <Trophy className="w-16 h-16 text-[#ff00ff] mb-2 drop-shadow-[0_0_15px_#ff00ff]" />
              <h2 className="text-3xl font-bold text-[#ff00ff] drop-shadow-[0_0_10px_#ff00ff] mb-1">SYSTEM FAILURE</h2>
              <p className="text-slate-300 text-lg uppercase tracking-wider">Final Score: <span className="text-[#39ff14] font-bold">{score}</span></p>
            </div>
          )}

          {!isStarted && !isGameOver && (
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#00f3ff] drop-shadow-[0_0_10px_#00f3ff] mb-2 uppercase tracking-wide">Ready?</h2>
                <div className="flex gap-2 items-center justify-center text-sm text-slate-400 bg-[#0d0d14]/80 px-4 py-2 rounded-sm border border-[#00f3ff]/20">
                  <span className="font-bold border border-[#00f3ff]/40 px-1 rounded-sm">W</span>
                  <span className="font-bold border border-[#00f3ff]/40 px-1 rounded-sm">A</span>
                  <span className="font-bold border border-[#00f3ff]/40 px-1 rounded-sm">S</span>
                  <span className="font-bold border border-[#00f3ff]/40 px-1 rounded-sm">D</span>
                   <span>or</span>
                   <span>Arrows to Move</span>
                </div>
             </div>
          )}

          {isPaused && !isGameOver && (
            <h2 className="text-3xl font-bold text-[#00f3ff] drop-shadow-[0_0_10px_#00f3ff] mb-6 uppercase tracking-[0.2em] animate-pulse">PAUSED</h2>
          )}

          <button
            onClick={resetGame}
            className="group relative px-8 py-3 bg-[#0d0d14] border border-[#00f3ff]/40 rounded-sm text-[#00f3ff] text-xs font-bold uppercase tracking-widest hover:bg-[#00f3ff]/10 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#00f3ff]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative flex items-center justify-center gap-2">
              {isGameOver ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isGameOver ? 'REBOOT' : isPaused ? 'RESUME' : 'INITIALIZE'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
