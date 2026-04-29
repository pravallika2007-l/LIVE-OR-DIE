import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIR = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [dir, setDir] = useState(INITIAL_DIR);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);

  const dirRef = useRef(dir);
  const speed = Math.max(60, 150 - (score * 1.5));

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
          e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        if (!isGameOver) setIsPaused(prev => !prev);
        return;
      }

      if (isPaused || isGameOver) return;

      const currentDir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDir({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDir({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDir({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDir({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver]);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = dirRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [isPaused, isGameOver, food, generateFood, speed]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIR);
    dirRef.current = INITIAL_DIR;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  return (
    <div className="flex flex-col items-center select-none font-mono">
      <div className="flex w-full justify-between items-center mb-6 px-4 py-3 bg-[#0a0a0a]/80 border border-cyan-500/40 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-sm">
        <div className="flex items-center gap-4">
           {isGameOver ? (
             <span className="text-pink-500 font-bold tracking-[0.2em] text-sm uppercase drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">SYS_FAIL</span>
           ) : (
             <span className="text-cyan-400 font-bold tracking-[0.2em] text-sm drop-shadow-[0_0_5px_rgba(6,182,212,0.6)]">
                {isPaused ? 'STANDBY' : 'RUNNING_'}
             </span>
           )}
        </div>
        <div className="text-lg font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)] tracking-widest">
          SCORE:{score.toString().padStart(4, '0')}
        </div>
      </div>

      <div
        className="relative bg-[#050505] border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`
        }}
      >
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-60 pointer-events-none" />

         {food && (
           <div
             className="absolute bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,1)] rounded-full transition-all duration-75"
             style={{
               width: '20px',
               height: '20px',
               left: `${food.x * 20}px`,
               top: `${food.y * 20}px`,
               transform: 'scale(0.8)'
             }}
           />
         )}

         {snake.map((segment, index) => (
           <div
             key={`${segment.x}-${segment.y}-${index}`}
             className={`absolute rounded-sm ${index === 0 ? 'bg-green-300' : 'bg-green-500'} shadow-[0_0_8px_rgba(74,222,128,0.5)]`}
             style={{
               width: '20px',
               height: '20px',
               left: `${segment.x * 20}px`,
               top: `${segment.y * 20}px`,
               transform: index === 0 ? 'scale(0.95)' : 'scale(0.85)'
             }}
           />
         ))}

         {(isGameOver || isPaused) && (
           <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded">
             {isGameOver && <h2 className="text-3xl font-bold text-pink-500 mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] tracking-widest">GAME OVER</h2>}
             {isPaused && !isGameOver && <h2 className="text-2xl font-bold text-cyan-400 mb-6 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] tracking-widest">PAUSED</h2>}

             <button
               onClick={resetGame}
               className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-green-500 text-green-400 font-bold hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(74,222,128,0.6)] transition-all rounded tracking-widest text-sm"
             >
               {isGameOver ? <RotateCcw size={18} /> : <Play size={18} fill="currentColor" />}
               {isGameOver ? 'REBOOT' : 'INITIATE'}
             </button>
           </div>
         )}
      </div>

      <div className="mt-8 text-cyan-500/40 text-[10px] tracking-widest uppercase flex gap-4 text-center">
         <span>[W A S D] / [ARROWS] MOVEMENT</span>
         <span>[SPACE] PAUSE SYSTEM</span>
      </div>
    </div>
  );
}
