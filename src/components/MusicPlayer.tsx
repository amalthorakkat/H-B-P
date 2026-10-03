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
  const [useSynthesizer, setUseSynthesizer] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!musicUrl) return;

    const audio = new Audio();
    audio.src = musicUrl;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.75;

    audio.addEventListener('error', () => {
      // If MP3 file doesn't exist or errors, smoothly switch to the romantic music-box synth
      setUseSynthesizer(true);
    });

    audioRef.current = audio;

    const attemptPlay = () => {
      if (userPausedRef.current) return;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Browser autoplay policy blocked until first user gesture.
            // Listeners below will activate on the first tap/click.
          });
      }
    };

    if (autoPlay) {
      attemptPlay();

      // Listen for the very first interaction anywhere on the document to start music
      const unlockAudio = () => {
        if (!userPausedRef.current) {
          attemptPlay();
        }
      };

      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });

      return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        audio.pause();
        audio.src = '';
        stopRomanticMelody();
      };
    }

    return () => {
      audio.pause();
      audio.src = '';
      stopRomanticMelody();
    };
  }, [musicUrl, autoPlay]);

  const toggleMusic = () => {
    if (isPlaying) {
      userPausedRef.current = true;
      if (useSynthesizer) {
        stopRomanticMelody();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      userPausedRef.current = false;
      if (useSynthesizer) {
        startRomanticMelody();
        setIsPlaying(true);
      } else if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // If browser blocked or file not found, fallback to synthesized gentle chimes
              setUseSynthesizer(true);
              startRomanticMelody();
              setIsPlaying(true);
            });
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
