import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { startRomanticMelody, stopRomanticMelody } from '../utils/romanticMelody';

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
    audio.addEventListener('error', () => {
      // If MP3 file fails, fallback to gentle synth
      if (!userPausedRef.current) {
        startRomanticMelody();
        setIsPlaying(true);
      }
    });

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
        stopRomanticMelody();
      };
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.muted = true;
      audio.src = '';
      stopRomanticMelody();
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
      stopRomanticMelody();
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
            .catch(() => {
              // Fallback to synthesizer if audio fails
              startRomanticMelody();
              setIsPlaying(true);
            });
        }
      } else {
        startRomanticMelody();
        setIsPlaying(true);
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
            aria-label={isPlaying ? 'Pause romantic music' : 'Play romantic music'}
            className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-rose-100/80 shadow-xs hover:shadow-md transition-all duration-300 text-stone-600 hover:text-rose-700"
          >
            {/* Pulsing indicator ring when playing */}
            {isPlaying && (
              <span className="absolute -inset-0.5 rounded-full bg-rose-300/30 animate-ping opacity-75" />
            )}

            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors">
              {isPlaying ? (
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-rose-600" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-400" />
              )}
            </div>

            <span className="text-xs font-medium tracking-wide text-stone-600 group-hover:text-stone-800 transition-colors hidden sm:inline-block">
              {isPlaying ? 'Our Song 🎵' : 'Play Music'}
            </span>
            <Music className="w-3 h-3 text-rose-400 hidden xs:inline-block sm:hidden" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
