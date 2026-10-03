import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface FloatingAtmosphereProps {
  stage: 'opening' | 'birthday' | 'letter-opened';
}

interface HeartParticle {
  id: number;
  x: number; // percentage from left
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

interface BalloonItem {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  stringColor: string;
  depth: 'back' | 'front';
}

// Gentle hearts floating subtly in the background margins
const hearts: HeartParticle[] = [
  { id: 1, x: 5, size: 14, duration: 18, delay: 0, color: '#f43f5e', opacity: 0.3 },
  { id: 2, x: 14, size: 18, duration: 22, delay: 3, color: '#fb7185', opacity: 0.35 },
  { id: 3, x: 88, size: 16, duration: 19, delay: 1, color: '#fda4af', opacity: 0.38 },
  { id: 4, x: 94, size: 20, duration: 24, delay: 4, color: '#f43f5e', opacity: 0.28 },
  { id: 5, x: 8, size: 16, duration: 17, delay: 7, color: '#fecdd3', opacity: 0.4 },
  { id: 6, x: 84, size: 13, duration: 16, delay: 6, color: '#f43f5e', opacity: 0.32 },
  { id: 7, x: 20, size: 12, duration: 21, delay: 9, color: '#fb7185', opacity: 0.25 },
  { id: 8, x: 92, size: 15, duration: 20, delay: 11, color: '#fda4af', opacity: 0.3 },
  { id: 9, x: 2, size: 18, duration: 25, delay: 5, color: '#fca5a5', opacity: 0.25 },
  { id: 10, x: 79, size: 17, duration: 23, delay: 8, color: '#fb7185', opacity: 0.26 },
];

// Beautifully balanced balloons that never obstruct the central reading container
const balloons: BalloonItem[] = [
  { id: 1, x: 4, size: 44, duration: 26, delay: 1, color: '#fecdd3', stringColor: '#fda4af', depth: 'back' },
  { id: 2, x: 91, size: 48, duration: 30, delay: 3, color: '#fed7aa', stringColor: '#fdba74', depth: 'front' },
  { id: 3, x: 11, size: 38, duration: 28, delay: 9, color: '#fbcfe8', stringColor: '#f472b6', depth: 'front' },
  { id: 4, x: 85, size: 42, duration: 24, delay: 6, color: '#ffe4e6', stringColor: '#fecdd3', depth: 'back' },
  { id: 5, x: 18, size: 34, duration: 32, delay: 14, color: '#fed7aa', stringColor: '#fdba74', depth: 'back' },
  { id: 6, x: 78, size: 36, duration: 27, delay: 12, color: '#fecdd3', stringColor: '#fda4af', depth: 'back' },
];

export const FloatingAtmosphere: React.FC<FloatingAtmosphereProps> = ({ stage }) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const showAtmosphere = stage !== 'opening';
  const isLetterOpened = stage === 'letter-opened';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Background Romantic Ambient Glows */}
      <motion.div
        animate={{
          scale: isLetterOpened ? 1.15 : 1,
          opacity: isLetterOpened ? 0.85 : 0.65,
        }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[520px] rounded-full blur-3xl bg-gradient-to-b from-rose-100/60 via-pink-50/40 to-transparent"
      />

      <motion.div
        animate={{
          opacity: isLetterOpened ? 0.65 : 0.35,
          scale: isLetterOpened ? 1.1 : 1,
        }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] rounded-full blur-3xl bg-rose-100/50"
      />

      <motion.div
        animate={{
          opacity: isLetterOpened ? 0.6 : 0.3,
          scale: isLetterOpened ? 1.15 : 1,
        }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full blur-3xl bg-amber-100/40"
      />

      {/* Subtle Shimmering Light Rays during letter reveal */}
      {isLetterOpened && !reducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent pointer-events-none"
        />
      )}

      {/* Floating Hearts with subtle sideways wander */}
      {showAtmosphere &&
        !reducedMotion &&
        hearts.map((heart) => (
          <motion.div
            key={`heart-${heart.id}`}
            initial={{ y: '105vh', opacity: 0, x: 0 }}
            animate={{
              y: '-15vh',
              opacity: [0, heart.opacity, heart.opacity * 0.9, 0],
              x: [0, (heart.id % 2 === 0 ? 1 : -1) * 22, 0, (heart.id % 2 === 0 ? -1 : 1) * 16],
            }}
            transition={{
              duration: isLetterOpened ? heart.duration * 0.85 : heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: `${heart.x}%`,
              width: heart.size,
              height: heart.size,
            }}
            className="filter drop-shadow-[0_2px_6px_rgba(244,63,94,0.15)]"
          >
            <svg viewBox="0 0 24 24" fill={heart.color} className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}

      {/* Floating Pastel Balloons */}
      {showAtmosphere &&
        !reducedMotion &&
        balloons.map((balloon) => (
          <motion.div
            key={`balloon-${balloon.id}`}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{
              y: '-25vh',
              opacity: [0, 0.78, 0.78, 0],
              x: [
                balloon.id % 2 === 0 ? -18 : 18,
                balloon.id % 2 === 0 ? 22 : -22,
                balloon.id % 2 === 0 ? -12 : 12,
              ],
              rotate: [-5, 6, -4],
            }}
            transition={{
              duration: balloon.duration,
              delay: balloon.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: `${balloon.x}%`,
              width: balloon.size,
              zIndex: balloon.depth === 'front' ? 2 : 0,
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Balloon Body with spherical gradient lighting */}
              <div
                className="w-full aspect-[4/5] rounded-[50%_50%_50%_50%/40%_40%_60%_60%] relative shadow-[0_8px_16px_-4px_rgba(244,63,94,0.12)]"
                style={{
                  background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${balloon.color} 58%, ${balloon.stringColor} 100%)`,
                }}
              >
                {/* Gloss highlight reflection */}
                <div className="absolute top-2 left-2 w-2 h-3.5 bg-white/70 rounded-full rotate-[-25deg] blur-[0.3px]" />
              </div>
              {/* Knot */}
              <div
                className="w-1.5 h-1.5 -mt-0.5 rounded-full"
                style={{ backgroundColor: balloon.stringColor }}
              />
              {/* String */}
              <svg width="12" height="45" viewBox="0 0 12 45" fill="none" className="opacity-35">
                <path
                  d="M6 0 C8 12, 4 22, 6 32 C7 38, 5 42, 6 45"
                  stroke={balloon.stringColor}
                  strokeWidth="1.2"
                />
              </svg>
            </div>
          </motion.div>
        ))}

      {/* Sparkling romantic ambient dust when letter is opened */}
      {isLetterOpened &&
        !reducedMotion && (
          <div className="absolute inset-0">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{
                  x: `${12 + ((i * 11) % 76)}%`,
                  y: `${18 + ((i * 17) % 68)}%`,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.75, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 3.5 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: 'easeInOut',
                }}
                className="absolute text-amber-300/80 pointer-events-none text-xs drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
              >
                ✦
              </motion.div>
            ))}
          </div>
        )}
    </div>
  );
};
