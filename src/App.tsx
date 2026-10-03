/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { loveStory as initialStory } from './data/loveStory.js';
import { OpeningScreen } from './components/OpeningScreen';
import { FloatingAtmosphere } from './components/FloatingAtmosphere';
import { PolaroidFrame } from './components/PolaroidFrame';
import { EnvelopeLetter } from './components/EnvelopeLetter';
import { MusicPlayer } from './components/MusicPlayer';
import { CursorGlow } from './components/CursorGlow';
import { Heart } from 'lucide-react';

export default function App() {
  // Three clean stages:
  // 1. 'opening'
  // 2. 'birthday'
  // 3. 'letter-opened'
  const [stage, setStage] = useState<'opening' | 'birthday' | 'letter-opened'>('opening');

  // Load love story data
  const story = initialStory;

  const handleOpenHeart = () => {
    setStage('birthday');
  };

  const handleLetterOpened = () => {
    setStage('letter-opened');
  };

  const lines = story.lines || [
    'You are my moon,',
    'the softest light in my darkest nights.',
    'And on your birthday,',
    'I only wish to keep you shining',
    'beside me, forever. ❤️',
  ];

  // Separate title and trailing heart for dedicated pulsing animation
  const rawTitle = story.birthdayTitle || 'Happy Birthday, Puppyeee ❤️';
  const hasHeart = rawTitle.includes('❤️');
  const titleText = rawTitle.replace('❤️', '').trim();

  return (
    <div className="relative min-h-screen bg-[#FFFDFD] text-stone-800 flex flex-col justify-between overflow-x-hidden selection:bg-rose-100 selection:text-rose-900">
      {/* Desktop subtle cursor-following ambient glow */}
      <CursorGlow />

      {/* Floating Ambient Atmosphere (Hearts, Balloons, Subtle Warm Glows) */}
      <FloatingAtmosphere stage={stage} />

      {/* Music Player (Plays automatically from the start, button visible only after opening) */}
      <MusicPlayer musicUrl={story.music} autoPlay={true} visible={stage !== 'opening'} />

      {/* Stage 1: Opening Screen */}
      <AnimatePresence mode="wait">
        {stage === 'opening' && (
          <OpeningScreen key="opening-screen" onOpen={handleOpenHeart} />
        )}
      </AnimatePresence>

      {/* Stages 2 & 3: Birthday Wish & Letter Experience */}
      {stage !== 'opening' && (
        <motion.main
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col items-center"
        >
          {/* STAGE 2: BIRTHDAY WISH */}
          <section className="w-full text-center flex flex-col items-center">
            {/* Soft Little Heart Accent */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-500 border border-rose-100 shadow-xs"
            >
              <Heart className="w-5 h-5 fill-rose-200 stroke-rose-500" />
            </motion.div>

            {/* Section 3: Birthday Heading Animation */}
            {/* Heading: "Happy Birthday, My Love ❤️" */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-romantic text-4xl sm:text-5xl md:text-6xl text-stone-900 font-normal tracking-tight max-w-2xl px-2 leading-tight drop-shadow-[0_2px_12px_rgba(244,63,94,0.12)] inline-flex flex-wrap items-center justify-center gap-x-3"
            >
              <span>{titleText}</span>
              {hasHeart && (
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="inline-block text-rose-500"
                >
                  ❤️
                </motion.span>
              )}
            </motion.h1>

            {/* Subheading: "To the most beautiful person in my world..." (0.5 sec delay after heading) */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-romantic italic text-xl sm:text-2xl text-rose-800/80 mt-3.5 font-normal max-w-lg"
            >
              {story.birthdayMessage}
            </motion.p>

            {/* Girlfriend Polaroid Photo (0.5 sec delay after message) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="w-full flex justify-center"
            >
              <PolaroidFrame
                photos={story.photos}
                herName={story.herName}
                myName={story.myName}
              />
            </motion.div>

            {/* Romantic Birthday Poem Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 sm:mt-8 max-w-lg w-full mx-auto px-7 py-6 sm:px-9 sm:py-8 rounded-2xl bg-white/80 backdrop-blur-xs border border-rose-100/80 shadow-[0_8px_30px_-6px_rgba(244,63,94,0.07)] text-center relative overflow-hidden"
            >
              {story.poemTitle && (
                <div className="mb-3">
                  <motion.h2
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.85, duration: 0.7 }}
                    className="font-serif-romantic text-2xl sm:text-3xl text-rose-950 font-normal tracking-wide"
                  >
                    {story.poemTitle}
                  </motion.h2>
                  <div className="w-10 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mt-1.5" />
                </div>
              )}

              <div className="space-y-0.5 sm:space-y-1">
                {lines.map((line, index) =>
                  line.trim() === '' ? (
                    <div key={`stanza-break-${index}`} className="h-2 sm:h-2.5" />
                  ) : (
                    <motion.p
                      key={`wish-line-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.95 + index * 0.15, duration: 0.8 }}
                      className="text-stone-700/90 text-[17px] sm:text-[19px] font-serif-romantic italic leading-snug tracking-wide"
                    >
                      {line}
                    </motion.p>
                  )
                )}
              </div>
            </motion.div>
          </section>

          {/* Gentle Hairline Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="w-28 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent my-10 sm:my-14"
          />

          {/* STAGE 3: MY LETTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.9 }}
            className="w-full flex justify-center"
          >
            <EnvelopeLetter
              letterText={story.letter}
              herName={story.herName}
              myName={story.myName}
              onOpened={handleLetterOpened}
            />
          </motion.div>

          {/* Quiet Footer Sign-off */}
          <footer className="mt-12 mb-6 text-center text-xs text-stone-400 font-light tracking-wider flex items-center gap-1.5">
            <span>Made with love for</span>
            <span className="font-serif-romantic italic text-rose-800/70 font-medium">
              {story.herName}
            </span>
            <span>by</span>
            <span className="font-serif-romantic italic text-rose-800/70 font-medium">
              {story.myName}
            </span>
            <span>❤️</span>
          </footer>
        </motion.main>
      )}
    </div>
  );
}
