import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Feather, Stars } from 'lucide-react';

interface EnvelopeLetterProps {
  letterText: string;
  herName: string;
  myName: string;
  onOpened: () => void;
}

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  type: 'heart' | 'star' | 'dot';
  color: string;
}

export const EnvelopeLetter: React.FC<EnvelopeLetterProps> = ({
  letterText,
  herName,
  myName,
  onOpened,
}) => {
  // Opening sequence states:
  // 'closed' -> 'button-clicked' -> 'envelope-focus' -> 'flap-opening' -> 'letter-unfolding' -> 'letter-revealed'
  const [sequenceStep, setSequenceStep] = useState<
    'closed' | 'button-clicked' | 'envelope-focus' | 'flap-opening' | 'letter-unfolding' | 'letter-revealed'
  >('closed');

  const [buttonRipple, setButtonRipple] = useState(false);
  const [explosionParticles, setExplosionParticles] = useState<BurstParticle[]>([]);
  const letterRef = useRef<HTMLDivElement>(null);

  // Trigger romantic pastel confetti burst
  const triggerCelebration = () => {
    try {
      // Elegant center burst
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef3c7', '#fed7aa', '#fecdd3'],
        ticks: 240,
        gravity: 0.75,
        scalar: 1.15,
        shapes: ['circle'],
      });

      // Side floral bursts
      setTimeout(() => {
        confetti({
          particleCount: 22,
          angle: 60,
          spread: 50,
          origin: { x: 0.25, y: 0.6 },
          colors: ['#fda4af', '#f43f5e', '#fed7aa', '#fff'],
          ticks: 200,
          gravity: 0.8,
          scalar: 0.95,
        });
        confetti({
          particleCount: 22,
          angle: 120,
          spread: 50,
          origin: { x: 0.75, y: 0.6 },
          colors: ['#fda4af', '#f43f5e', '#fed7aa', '#fff'],
          ticks: 200,
          gravity: 0.8,
          scalar: 0.95,
        });
      }, 250);
    } catch {
      // fallback smoothly if canvas confetti is unsupported
    }
  };

  // Generate floating heart & star particles for the romantic explosion
  const generateExplosionParticles = () => {
    const particles: BurstParticle[] = [];
    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#ec4899', '#fbbf24'];

    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI + (Math.random() * 0.3 - 0.15);
      const distance = 90 + Math.random() * 100;
      particles.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 30, // slight upward bias
        scale: 0.6 + Math.random() * 0.7,
        rotate: (Math.random() - 0.5) * 80,
        type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'star' : 'dot',
        color: colors[i % colors.length],
      });
    }
    setExplosionParticles(particles);
  };

  // Coordinated multi-step opening sequence
  const startOpeningSequence = () => {
    if (sequenceStep !== 'closed') return;

    // Step 1: Button click, ripple, hearts burst from button
    setSequenceStep('button-clicked');
    setButtonRipple(true);

    // Step 2: Envelope centers, scales up with soft glow
    setTimeout(() => {
      setSequenceStep('envelope-focus');
    }, 400);

    // Step 3: Envelope flap rotates open in 3D
    setTimeout(() => {
      setSequenceStep('flap-opening');
    }, 1100);

    // Step 4: Romantic explosion & letter unfolds
    setTimeout(() => {
      setSequenceStep('letter-unfolding');
      generateExplosionParticles();
      triggerCelebration();
      onOpened();
    }, 1850);

    // Step 5: Letter revealed fully, settle into reading
    setTimeout(() => {
      setSequenceStep('letter-revealed');
      // Smoothly bring letter into focus
      letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2800);
  };

  const isOpen =
    sequenceStep === 'letter-unfolding' || sequenceStep === 'letter-revealed';

  // Replace placeholder strings
  const formattedLetter = letterText
    .replace(/\[MY NAME\]/g, myName)
    .replace(/YOUR NAME/g, myName)
    .replace(/HER NAME/g, herName);

  const paragraphs = formattedLetter.split('\n\n').filter(Boolean);
  const mainParagraphs = paragraphs.slice(0, paragraphs.length - 2);
  const loveDeclaration = paragraphs[paragraphs.length - 2] || 'I love you more than words can say.';
  const signOff = paragraphs[paragraphs.length - 1] || `Forever yours,\n${myName} ❤️`;

  return (
    <div className="relative w-full max-w-2xl sm:max-w-3xl mx-auto my-8 sm:my-12 px-1.5 sm:px-3 flex flex-col items-center">
      {/* Intro prompt */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/90 border border-rose-100 text-rose-600 text-xs font-medium tracking-wide mb-3 shadow-xs">
            <Feather className="w-3.5 h-3.5 text-rose-400" />
            <span>From my heart to yours</span>
          </div>
          <h2 className="font-serif-romantic text-2xl sm:text-3xl text-stone-800 tracking-tight drop-shadow-[0_2px_8px_rgba(244,63,94,0.06)]">
            I wrote something for you...
          </h2>
        </motion.div>
      )}

      {/* ENVELOPE STAGE (Steps 1, 2, 3) */}
      {!isOpen ? (
        <div className="w-full flex flex-col items-center">
          {/* Envelope Graphic with 3D flap and rise animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale:
                sequenceStep === 'envelope-focus' || sequenceStep === 'flap-opening'
                  ? 1.05
                  : 1,
              y:
                sequenceStep === 'envelope-focus'
                  ? -12
                  : sequenceStep === 'flap-opening'
                  ? -16
                  : 0,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[340px] sm:max-w-[400px] h-[220px] sm:h-[240px] perspective-1000"
          >
            {/* Soft breathing golden/rose aura behind envelope */}
            <motion.div
              animate={{
                scale:
                  sequenceStep === 'envelope-focus' || sequenceStep === 'flap-opening'
                    ? [1.05, 1.25, 1.15]
                    : [1, 1.08, 1],
                opacity:
                  sequenceStep === 'envelope-focus' || sequenceStep === 'flap-opening'
                    ? [0.6, 0.9, 0.75]
                    : [0.35, 0.6, 0.35],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-100/60 via-rose-100/50 to-pink-100/40 blur-xl pointer-events-none"
            />

            {/* Envelope Body */}
            <div className="relative w-full h-full bg-[#FAF5F2] border border-[#E8DFD7] rounded-xl shadow-lg overflow-hidden flex flex-col items-center justify-center p-6">
              {/* Back interior pocket */}
              <div className="absolute inset-0 bg-[#F4EDE7]" />

              {/* Peeking Letter Card inside envelope */}
              <motion.div
                initial={{ y: 0 }}
                animate={{
                  y:
                    sequenceStep === 'flap-opening'
                      ? -65
                      : 0,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-4 left-6 right-6 h-40 bg-[#FFFDF9] rounded-t-lg border border-amber-100 shadow-sm flex flex-col items-center pt-3 px-4 z-5"
              >
                <div className="w-12 h-0.5 bg-rose-200/80 rounded-full mb-2" />
                <div className="w-24 h-0.5 bg-rose-100/80 rounded-full" />
                <span className="font-handwriting text-rose-800 text-lg mt-2">
                  My Dear {herName}...
                </span>
              </motion.div>

              {/* Envelope Bottom Folds */}
              <div
                aria-hidden="true"
                className="absolute inset-0 border-l-[170px] sm:border-l-[200px] border-l-transparent border-r-[170px] sm:border-r-[200px] border-r-transparent border-b-[110px] sm:border-b-[120px] border-b-[#EFE7E0] z-10 pointer-events-none"
              />

              {/* Envelope Flap with 3D Flip */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{
                  rotateX:
                    sequenceStep === 'flap-opening' ? 180 : 0,
                }}
                transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
                className="absolute top-0 left-0 right-0 z-20"
              >
                {/* Flap triangle */}
                <div
                  aria-hidden="true"
                  className="w-0 h-0 border-l-[170px] sm:border-l-[200px] border-l-transparent border-r-[170px] sm:border-r-[200px] border-r-transparent border-t-[120px] sm:border-t-[130px] border-t-[#F3ECE6] drop-shadow-sm"
                />

                {/* Wax Seal affixed to flap tip */}
                {sequenceStep !== 'flap-opening' && (
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="absolute top-20 sm:top-22 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full gold-wax-seal flex items-center justify-center cursor-pointer shadow-md"
                    onClick={startOpeningSequence}
                  >
                    <Heart className="w-6 h-6 text-amber-950/70 fill-amber-900/40" />
                  </motion.div>
                )}
              </motion.div>

              {/* Recipient tag text */}
              <p className="relative z-15 mt-16 font-serif-romantic italic text-xs sm:text-sm text-stone-500 tracking-wider">
                For {herName} 🌸
              </p>
            </div>

            {/* Romantic Burst Particles emanating outward when flap opens */}
            <AnimatePresence>
              {explosionParticles.length > 0 &&
                explosionParticles.map((p) => (
                  <motion.div
                    key={`burst-p-${p.id}`}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      scale: p.scale,
                      opacity: [1, 0.9, 0],
                      rotate: p.rotate,
                    }}
                    transition={{
                      duration: 1.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute top-1/2 left-1/2 pointer-events-none z-30"
                    style={{
                      width: 22,
                      height: 22,
                      marginLeft: -11,
                      marginTop: -11,
                      color: p.color,
                    }}
                  >
                    {p.type === 'heart' ? (
                      <Heart className="w-full h-full fill-current drop-shadow-xs" />
                    ) : p.type === 'star' ? (
                      <span className="text-xl font-bold">✦</span>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-current shadow-xs" />
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

          {/* "Open My Letter 💌" Button (Section 7) */}
          <div className="relative mt-8">
            {/* Soft breathing glow behind button */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.55, 0.85, 0.55],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 blur-md pointer-events-none"
            />

            <motion.button
              onClick={startOpeningSequence}
              disabled={sequenceStep !== 'closed'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              animate={
                sequenceStep === 'button-clicked'
                  ? { scale: [1, 0.95, 0.98], opacity: [1, 0.9, 0] }
                  : {}
              }
              transition={{ duration: 0.5 }}
              type="button"
              className="relative flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-white hover:bg-rose-50 text-stone-800 hover:text-rose-950 border border-rose-200/90 shadow-md hover:shadow-xl transition-all duration-300 font-medium text-base sm:text-lg cursor-pointer group select-none"
            >
              {/* Expanding circular ripple when clicked */}
              {buttonRipple && (
                <motion.span
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-rose-400 pointer-events-none"
                />
              )}

              <span>Open My Letter</span>

              {/* Heart icon subtle move on hover */}
              <motion.span
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-rose-500 inline-block text-xl"
              >
                💌
              </motion.span>
            </motion.button>
          </div>
        </div>
      ) : (
        /* STEP 5: UNFOLDED HANDWRITTEN-STYLE LETTER */
        <motion.div
          key="letter-opened"
          ref={letterRef}
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
        >
          {/* Ambient Warm Glow behind unfolded letter */}
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-b from-rose-100/50 via-amber-50/40 to-rose-50/30 blur-2xl pointer-events-none" />

          {/* Letter Paper Container */}
          <div className="relative w-full rounded-2xl bg-[#FFFDF9] border border-stone-200/80 p-4 sm:p-7 md:p-9 letter-shadow overflow-hidden">
            {/* Subtle Parchment Corner Ornaments */}
            <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-amber-200/60 pointer-events-none" />
            <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-amber-200/60 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-amber-200/60 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-amber-200/60 pointer-events-none" />

            {/* Soft Watermark Heart in Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-rose-100/35 pointer-events-none select-none">
              <Heart className="w-full h-full fill-current" />
            </div>

            {/* Letter Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative z-10 flex items-center justify-between border-b border-rose-100/80 pb-4 mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="font-serif-romantic text-xs sm:text-sm tracking-widest uppercase text-stone-400">
                  A letter to you
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600/80 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-serif-romantic italic">Happy Birthday</span>
              </div>
            </motion.div>

            {/* Letter Body - Gently revealed paragraph by paragraph */}
            <div className="relative z-10 space-y-3 sm:space-y-3.5">
              {mainParagraphs.map((paragraph, idx) => (
                <motion.p
                  key={`para-${idx}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.35 + idx * 0.3,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-handwriting text-2xl sm:text-3xl text-stone-800 leading-snug tracking-wide"
                >
                  {paragraph}
                </motion.p>
              ))}

              {/* Section 10: Final Letter Animation for "I love you ❤️" */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.35 + mainParagraphs.length * 0.3 + 0.3,
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="pt-1.5"
              >
                <p className="font-handwriting text-3xl sm:text-4xl text-rose-900 font-medium leading-snug tracking-wide inline-flex items-center gap-2 drop-shadow-[0_2px_12px_rgba(244,63,94,0.18)]">
                  <span>{loveDeclaration.replace(/❤️/g, '').trim()}</span>
                  <motion.span
                    animate={{
                      scale: [1, 1.25, 1, 1.25, 1],
                    }}
                    transition={{
                      delay: 0.35 + mainParagraphs.length * 0.3 + 1.2,
                      duration: 1.8,
                      ease: 'easeInOut',
                    }}
                    className="inline-block text-rose-500"
                  >
                    ❤️
                  </motion.span>
                </p>
              </motion.div>

              {/* Final Sign-off: "Forever yours, [MY NAME]" */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35 + mainParagraphs.length * 0.3 + 1.6,
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="pt-2.5"
              >
                <div className="font-handwriting text-2xl sm:text-3xl text-stone-700 leading-snug whitespace-pre-line">
                  {signOff}
                </div>
              </motion.div>
            </div>

            {/* Letter Footer Stamp & Re-read hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.35 + mainParagraphs.length * 0.3 + 2.2,
                duration: 0.8,
              }}
              className="relative z-10 mt-10 pt-6 border-t border-rose-100/70 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 text-rose-500/80 text-sm font-serif-romantic italic">
                <Heart className="w-4 h-4 fill-rose-300 stroke-rose-400" />
                <span>Written with all my love</span>
              </div>

              <button
                type="button"
                onClick={() => setSequenceStep('closed')}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-4 cursor-pointer"
              >
                Fold letter back
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
