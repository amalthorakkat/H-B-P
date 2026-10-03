import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Star } from 'lucide-react';

interface OpeningScreenProps {
  onOpen: () => void;
}

interface BurstElement {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  color: string;
  type: 'heart' | 'star' | 'sparkle' | 'orb';
  duration: number;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [burstElements, setBurstElements] = useState<BurstElement[]>([]);

  // Subtle floating background particles on opening screen
  const backgroundParticles = [
    { id: 1, left: '12%', delay: 0, duration: 10, size: 8, opacity: 0.25 },
    { id: 2, left: '25%', delay: 2, duration: 12, size: 10, opacity: 0.2 },
    { id: 3, left: '75%', delay: 1, duration: 11, size: 7, opacity: 0.3 },
    { id: 4, left: '88%', delay: 3, duration: 13, size: 9, opacity: 0.22 },
    { id: 5, left: '48%', delay: 4, duration: 9, size: 6, opacity: 0.18 },
    { id: 6, left: '62%', delay: 2.5, duration: 11.5, size: 8, opacity: 0.25 },
  ];

  // Subtle background hearts for the opening screen
  const backgroundHearts = [
    { id: 1, left: '8%', top: '22%', size: 16, delay: 0 },
    { id: 2, left: '86%', top: '18%', size: 18, delay: 1.5 },
    { id: 3, left: '16%', top: '78%', size: 14, delay: 0.8 },
    { id: 4, left: '90%', top: '72%', size: 16, delay: 2.2 },
    { id: 5, left: '6%', top: '55%', size: 12, delay: 3 },
  ];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOpening) return;
    setIsOpening(true);

    // Trigger delicate pastel confetti burst
    try {
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.62 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#fed7aa', '#fef3c7'],
        ticks: 200,
        gravity: 0.7,
        scalar: 1.1,
      });
    } catch {
      // smooth fallback if canvas is disabled
    }

    // Generate vibrant radial explosion of hearts, stars, and golden glowing orbs
    const count = 28;
    const newElements: BurstElement[] = [];
    const colors = [
      '#f43f5e',
      '#fb7185',
      '#fda4af',
      '#fbbf24',
      '#f59e0b',
      '#ec4899',
      '#f472b6',
    ];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.3 - 0.15);
      const distance = 90 + Math.random() * 110;
      const typeChoice = Math.random();
      newElements.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 25, // gentle float upward
        scale: 0.7 + Math.random() * 0.7,
        rotate: (Math.random() - 0.5) * 120,
        color: colors[i % colors.length],
        type:
          typeChoice < 0.45
            ? 'heart'
            : typeChoice < 0.75
            ? 'star'
            : typeChoice < 0.9
            ? 'sparkle'
            : 'orb',
        duration: 0.9 + Math.random() * 0.4,
      });
    }
    setBurstElements(newElements);

    // Transition smoothly after bloom finishes
    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <motion.div
      key="opening-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: 'blur(10px)',
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center min-h-screen px-6 bg-[#FFFDFD] overflow-hidden"
    >
      {/* Soft romantic background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Living center blush aura */}
        <motion.div
          animate={{
            scale: isOpening ? [1, 1.8] : isHovered ? [1.1, 1.25, 1.1] : [1, 1.12, 1],
            opacity: isOpening ? [0.6, 1, 0] : isHovered ? [0.65, 0.85, 0.65] : [0.45, 0.65, 0.45],
          }}
          transition={{
            duration: isOpening ? 1.1 : isHovered ? 2.5 : 6,
            repeat: isOpening ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-gradient-to-tr from-rose-200/50 via-pink-100/40 to-amber-100/35 blur-3xl"
        />

        {/* Subtle romantic corner glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-rose-100/35 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-pink-100/35 blur-3xl" />

        {/* Tiny glowing particles drifting upward */}
        {backgroundParticles.map((p) => (
          <motion.div
            key={`sparkle-${p.id}`}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, p.opacity, p.opacity * 0.7, 0],
              x: [0, p.id % 2 === 0 ? 14 : -14, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: p.left,
              width: p.size,
              height: p.size,
            }}
            className="rounded-full bg-gradient-to-tr from-rose-300 to-amber-200 blur-[0.5px] pointer-events-none"
          />
        ))}

        {/* Subtle floating heart icons in background */}
        {backgroundHearts.map((h) => (
          <motion.div
            key={`bg-heart-${h.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: [0.15, 0.35, 0.15],
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 5.5 + h.id,
              delay: h.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: h.left,
              top: h.top,
              width: h.size,
              height: h.size,
            }}
            className="text-rose-300/40 pointer-events-none"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto text-center flex flex-col items-center">
        {/* Soft floating decorative heart badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [-4, 4, -4],
          }}
          transition={{
            scale: { duration: 1, delay: 0.15 },
            opacity: { duration: 1, delay: 0.15 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="mb-6"
        >
          <div className="relative w-16 h-16 rounded-full bg-white/95 backdrop-blur-xs shadow-md border border-rose-100/80 flex items-center justify-center mx-auto">
            {/* Soft inner glow ring */}
            <div className="absolute inset-0 rounded-full bg-rose-50/70 animate-pulse pointer-events-none" />
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Heart className="w-7 h-7 text-rose-500 fill-rose-300/80" />
            </motion.div>
          </div>
        </motion.div>

        {/* Center prompt text */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-romantic text-3xl sm:text-4xl md:text-5xl text-stone-800 tracking-tight font-normal mb-8 drop-shadow-[0_2px_8px_rgba(244,63,94,0.06)]"
        >
          I made something for you...
        </motion.h1>

        {/* "Open My Heart ❤️" Button with Heartbeat, Shimmer & Ripple */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="relative flex items-center justify-center"
        >
          {/* Outer Living Heartbeat Halo Rings */}
          <motion.div
            animate={{
              scale: isOpening ? [1, 2.2] : isHovered ? [1.05, 1.3, 1.05] : [1, 1.18, 1, 1.25, 1],
              opacity: isOpening ? [0.8, 0] : isHovered ? [0.4, 0.7, 0.4] : [0.25, 0.55, 0.25, 0.6, 0.25],
            }}
            transition={{
              duration: isOpening ? 0.9 : isHovered ? 1.8 : 2.8,
              repeat: isOpening ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-rose-300/40 via-pink-300/30 to-amber-200/40 blur-xl pointer-events-none"
          />

          <motion.div
            animate={{
              scale: isOpening ? [1, 1.7] : [1, 1.12, 1, 1.16, 1],
              opacity: isOpening ? [0.9, 0] : [0.4, 0.7, 0.4, 0.75, 0.4],
            }}
            transition={{
              duration: isOpening ? 0.75 : 2.8,
              repeat: isOpening ? 0 : Infinity,
              ease: 'easeInOut',
              delay: 0.1,
            }}
            className="absolute -inset-2 rounded-full border border-rose-300/40 pointer-events-none"
          />

          {/* Main Button */}
          <motion.button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isOpening}
            animate={
              isOpening
                ? {
                    scale: [1, 0.94, 1.12, 1.2],
                    opacity: [1, 1, 0.9, 0],
                    boxShadow: '0 0 50px 20px rgba(244, 63, 94, 0.5)',
                  }
                : {
                    scale: [1, 1.025, 1, 1.035, 1],
                  }
            }
            transition={
              isOpening
                ? { duration: 1, ease: [0.16, 1, 0.3, 1] }
                : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            }
            whileHover={
              !isOpening
                ? {
                    scale: 1.06,
                    boxShadow: '0 12px 36px -4px rgba(244, 63, 94, 0.3), 0 4px 12px 0 rgba(0, 0, 0, 0.04)',
                  }
                : {}
            }
            whileTap={!isOpening ? { scale: 0.95 } : {}}
            type="button"
            className="relative overflow-hidden flex items-center justify-center gap-3 px-9 sm:px-10 py-4 sm:py-4.5 rounded-full bg-white text-stone-800 border border-rose-200/90 shadow-[0_6px_28px_-4px_rgba(244,63,94,0.18),0_2px_8px_0_rgba(0,0,0,0.04)] font-medium text-base sm:text-lg cursor-pointer group select-none transition-all duration-300"
          >
            {/* Shimmer Light Sweep on Hover */}
            <motion.div
              animate={{
                x: ['-140%', '200%'],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-rose-100/40 to-transparent skew-x-12 pointer-events-none"
            />

            {/* Expanding Ripple on Click */}
            {isOpening && (
              <motion.span
                initial={{ scale: 0.2, opacity: 0.95 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400/40 to-pink-400/30 pointer-events-none"
              />
            )}

            {/* Small sparkle accent */}
            <motion.span
              animate={{
                rotate: [0, 180, 360],
                scale: isHovered ? [1, 1.25, 1] : [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="text-amber-400 flex items-center"
            >
              <Sparkles className="w-4 h-4 fill-amber-300/80 stroke-amber-400" />
            </motion.span>

            {/* Label */}
            <span className="tracking-wide text-stone-800 font-medium group-hover:text-rose-950 transition-colors">
              Open My Heart
            </span>

            {/* Heart with rhythmic heartbeat and glow */}
            <motion.div
              animate={
                isOpening
                  ? {
                      scale: [1, 1.8, 2.5],
                      rotate: [0, -10, 10, 0],
                    }
                  : {
                      scale: [1, 1.2, 1, 1.3, 1],
                      rotate: [0, 3, -3, 0],
                    }
              }
              transition={
                isOpening
                  ? { duration: 0.8, ease: 'easeOut' }
                  : {
                      duration: 2.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
              className="relative text-rose-500 flex items-center justify-center text-xl"
            >
              <Heart className="w-5 h-5 fill-rose-400 stroke-rose-500 drop-shadow-[0_2px_8px_rgba(244,63,94,0.35)]" />
            </motion.div>
          </motion.button>

          {/* Radial Explosion Particles upon Opening */}
          <AnimatePresence>
            {isOpening &&
              burstElements.map((el) => (
                <motion.div
                  key={`burst-el-${el.id}`}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: el.x,
                    y: el.y,
                    scale: el.scale,
                    opacity: [1, 0.95, 0],
                    rotate: el.rotate,
                  }}
                  transition={{
                    duration: el.duration,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute pointer-events-none z-30"
                  style={{
                    color: el.color,
                    width: 22,
                    height: 22,
                    marginLeft: -11,
                    marginTop: -11,
                  }}
                >
                  {el.type === 'heart' ? (
                    <Heart className="w-full h-full fill-current drop-shadow-sm" />
                  ) : el.type === 'star' ? (
                    <Star className="w-full h-full fill-current stroke-none drop-shadow-sm" />
                  ) : el.type === 'sparkle' ? (
                    <Sparkles className="w-full h-full fill-current drop-shadow-sm" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-current shadow-[0_0_12px_currentColor]" />
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>

        {/* Quiet footnote hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-xs text-stone-400 tracking-wider uppercase mt-8 font-light flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-rose-300" />
          <span>A special surprise just for you</span>
          <Sparkles className="w-3 h-3 text-rose-300" />
        </motion.p>
      </div>
    </motion.div>
  );
};

