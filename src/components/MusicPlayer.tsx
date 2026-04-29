import { useEffect, useState, useCallback, useRef, ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'SYNTH_WAVE_01', artist: 'AI.CORE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'NEON_NIGHTS_V2', artist: 'AI.CORE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'CYBER_DRIFTER', artist: 'AI.CORE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && isPlaying) {
        try {
          await audioRef.current.play();
        } catch (e) {
          console.error("Autoplay prevented or playback error:", e);
          setIsPlaying(false);
        }
      }
    };
    playAudio();
  }, [currentTrackIndex]); 

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const playPrev = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) setIsMuted(false);
  };

  return (
    <div className="w-full max-w-[320px] bg-[#0a0a0a] border border-pink-500/30 rounded-xl p-5 shadow-[0_0_20px_rgba(236,72,153,0.15)] backdrop-blur-md font-mono">
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        crossOrigin="anonymous"
      />

      {/* Visualizer / Art area */}
      <div className="w-full h-24 bg-gradient-to-br from-pink-950/40 to-cyan-950/40 border border-pink-500/20 rounded-lg mb-5 relative overflow-hidden flex items-center justify-center">
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-70">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] rounded-t-sm origin-bottom"
                style={{
                  height: `${20 + Math.random() * 80}%`,
                  animation: `bounce-visualizer 0.${5 + ((i * 3) % 5)}s infinite alternate ease-in-out`
                }}
              />
            ))}
          </div>
        )}
        <div className="z-10 bg-black/60 px-3 py-1 rounded text-[10px] text-pink-300 backdrop-blur-sm border border-pink-500/30 tracking-widest">
          {isPlaying ? '▶ STREAM_ACTIVE' : '⏸ STREAM_PAUSED'}
        </div>
      </div>

      <div className="mb-4 text-center">
        <h3 className="text-pink-400 font-bold tracking-widest text-base drop-shadow-[0_0_5px_rgba(236,72,153,0.6)] truncate">
          {track.title}
        </h3>
        <p className="text-cyan-500/70 text-[10px] mt-1 tracking-widest">{track.artist}</p>
      </div>

      <div className="w-full h-1 bg-neutral-900 rounded-full mb-5 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,1)] transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-2 px-2">
        <button onClick={playPrev} className="p-2 text-cyan-600 hover:text-cyan-400 transition-colors">
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500 flex items-center justify-center text-pink-400 hover:bg-pink-500 hover:text-black hover:shadow-[0_0_15px_rgba(236,72,153,0.8)] transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5 base-icon absolute" fill="currentColor" /> : <Play className="w-5 h-5 ml-1 absolute" fill="currentColor" />}
        </button>
        <button onClick={playNext} className="p-2 text-cyan-600 hover:text-cyan-400 transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-cyan-500/60 mt-4 px-2">
        <button onClick={() => setIsMuted(!isMuted)}>
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleSeek}
          className="w-full accent-cyan-500 h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
