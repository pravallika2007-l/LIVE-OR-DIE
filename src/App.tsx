import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-mono selection:bg-pink-500/30 selection:text-pink-200">
      <header className="p-6 border-b border-cyan-900/40 bg-[#0a0a0a]/80 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-green-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]">
              NEON_SNAKE // PROTOCOL
            </h1>
            <p className="text-cyan-600 text-xs mt-2 tracking-[0.3em]">SYS.VER 1.2.0 ACTIVE | AURAL_INTERFACE ENABLED</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center lg:items-start justify-center relative z-10 overflow-x-hidden">
        {/* Left side: Music Player */}
        <div className="w-full lg:w-auto lg:shrink-0 flex justify-center order-2 lg:order-1 lg:pt-16">
           <MusicPlayer />
        </div>

        {/* Right side: Game */}
        <div className="flex-1 flex justify-center order-1 lg:order-2">
           <SnakeGame />
        </div>
      </main>

      {/* Cyberpunk background grid effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050505]/80 to-[#050505] z-0" />
    </div>
  );
}
