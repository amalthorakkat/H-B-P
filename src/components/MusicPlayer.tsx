import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl?: string;
  isPlaying: boolean;
  onToggle: () => void;
  visible?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  musicUrl,
  isPlaying,
  onToggle,
  visible = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and update audio
  useEffect(() => {
    if (!musicUrl) return;

    const audio = new Audio();
    audio.src = musicUrl;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.75;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [musicUrl]);

  // Sync play / pause state based on isPlaying prop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play prevented:', err);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.92 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 right-4 z-40"
        >
          <button
            data-music-toggle="true"
            onClick={handleToggle}
            type="button"
            aria-label={isPlaying ? 'Mute music' : 'Play music'}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-rose-100/90 shadow-xs hover:shadow-md transition-all duration-300 text-stone-600 hover:text-rose-700 cursor-pointer"
          >
            {/* Pulsing indicator ring when playing */}
            {isPlaying && (
              <span className="absolute -inset-0.5 rounded-full bg-rose-300/30 animate-ping opacity-75 pointer-events-none" />
            )}

            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors">
              {isPlaying ? (
                <Volume2 className="w-4 h-4 animate-pulse text-rose-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400 group-hover:text-rose-400" />
              )}
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

