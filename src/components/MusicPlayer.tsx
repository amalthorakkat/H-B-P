import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl?: string;
  autoPlay?: boolean;
  visible?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  musicUrl,
  autoPlay = true,
  visible = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!musicUrl) return;

    const audio = new Audio();
    audio.src = musicUrl;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.75;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    audioRef.current = audio;

    const attemptPlay = () => {
      if (userPausedRef.current) return;

      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Browser autoplay policy blocked until first user interaction.
          });
      }
    };

    if (autoPlay) {
      attemptPlay();

      const unlockAudio = (e: Event) => {
        // Prevent unlocking if the target was the mute button itself
        const target = e.target as HTMLElement | null;
        if (target && target.closest('[data-music-toggle="true"]')) {
          return;
        }

        if (!userPausedRef.current && audio.paused) {
          attemptPlay();
        }
      };

      window.addEventListener('click', unlockAudio, { capture: true });
      window.addEventListener('touchstart', unlockAudio, { capture: true });
      window.addEventListener('keydown', unlockAudio, { capture: true });

      return () => {
        window.removeEventListener('click', unlockAudio, { capture: true });
        window.removeEventListener('touchstart', unlockAudio, { capture: true });
        window.removeEventListener('keydown', unlockAudio, { capture: true });
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.pause();
        audio.muted = true;
        audio.src = '';
      };
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.muted = true;
      audio.src = '';
    };
  }, [musicUrl, autoPlay]);

  const toggleMusic = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const currentlyPlaying = isPlaying || (audioRef.current && !audioRef.current.paused);

    if (currentlyPlaying) {
      // MUTE / PAUSE completely
      userPausedRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.muted = true;
      }
      setIsPlaying(false);
    } else {
      // UNMUTE / RESUME
      userPausedRef.current = false;
      if (audioRef.current) {
        audioRef.current.muted = false;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {});
        }
      }
    }
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
            onClick={toggleMusic}
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
