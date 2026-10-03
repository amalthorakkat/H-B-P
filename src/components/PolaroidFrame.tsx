import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface PolaroidFrameProps {
  photos?: string[];
  herName?: string;
  myName?: string;
}

export const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  photos = ['/images/her1.jpg', '/images/us1.jpg'],
  herName = 'Puppy',
  myName = 'Chocho',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRealPhoto, setIsRealPhoto] = useState<{ [key: number]: boolean }>({});

  const validPhotos = photos && photos.length > 0 ? photos : ['/images/her1.jpg'];
  const currentPhoto = validPhotos[activeIndex % validPhotos.length];

  // Inspect image to see if it's a real photo or 1x1 dummy placeholder
  useEffect(() => {
    const img = new Image();
    img.src = currentPhoto;
    img.onload = () => {
      setIsRealPhoto((prev) => ({
        ...prev,
        [activeIndex]: img.naturalWidth > 30 && img.naturalHeight > 30,
      }));
    };
    img.onerror = () => {
      setIsRealPhoto((prev) => ({ ...prev, [activeIndex]: false }));
    };
  }, [currentPhoto, activeIndex]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (validPhotos.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % validPhotos.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (validPhotos.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + validPhotos.length) % validPhotos.length);
  };

  // Romantic handwritten captions for polaroid
  const captions = [
    {
      title: `${herName} ✨`,
      note: 'The one who brings warmth and light to every day',
    },
    {
      title: `Me and Ente Forever! ❤️`,
      note: 'With you, always and forever',
    },
    {
      title: 'Our favorite smiles 🌸',
      note: 'Moments I want to hold onto forever',
    },
    {
      title: `Happy Birthday, Puppyeee 💫`,
      note: `Forever loved by your ${myName}`,
    },
  ];

  const currentCaption = captions[activeIndex % captions.length];

  return (
    <div className="relative flex flex-col items-center my-6 md:my-8 select-none">
      {/* Ambient warm glow behind the polaroid */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/30 via-pink-100/20 to-amber-100/20 blur-2xl -z-10 rounded-full scale-110 pointer-events-none" />

      {/* Main Polaroid Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 25, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        whileHover={{ scale: 1.02, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onClick={handleNext}
        className="relative group cursor-pointer"
      >
        {/* Soft Washi Tape on Top Center */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-7 bg-amber-100/85 border border-amber-200/60 backdrop-blur-xs rounded-xs rotate-[-1deg] shadow-xs z-30 pointer-events-none flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-widest text-amber-800/60 font-serif">
            Forever
          </span>
        </div>

        {/* Polaroid Physical Body */}
        <div className="bg-white p-3.5 sm:p-4 pb-6 sm:pb-7 rounded-sm sm:rounded-md shadow-[0_12px_36px_rgba(0,0,0,0.08),0_3px_12px_rgba(244,114,182,0.12)] border border-rose-100/70 w-[275px] sm:w-[315px] transition-all duration-300 group-hover:shadow-[0_18px_45px_rgba(244,114,182,0.22)]">
          {/* Photo Slot */}
          <div className="relative aspect-[4/4.8] rounded-xs overflow-hidden bg-gradient-to-tr from-rose-50 via-pink-50 to-stone-50 flex items-center justify-center border border-stone-200/60 shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full"
              >
                {isRealPhoto[activeIndex] ? (
                  <img
                    src={currentPhoto}
                    alt={currentCaption.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  // Romantic illustrated card before user adds real photo
                  <div className="relative w-full h-full p-5 flex flex-col items-center justify-center text-center bg-gradient-to-b from-rose-50/90 via-pink-50/60 to-stone-50">
                    <div className="w-14 h-14 rounded-full bg-white/95 shadow-xs border border-rose-100 flex items-center justify-center mb-2.5 text-rose-400">
                      <Heart className="w-7 h-7 fill-rose-300 stroke-rose-400 animate-pulse" />
                    </div>
                    <p className="font-serif-romantic text-xl text-stone-900 font-medium">
                      {herName}
                    </p>
                    <p className="text-[11px] text-stone-500 font-serif-romantic italic mt-1 max-w-[190px] leading-relaxed">
                      "{currentCaption.note}"
                    </p>
                    <div className="mt-3.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-rose-100 text-[10px] text-rose-500 font-medium shadow-2xs">
                      <Camera className="w-3 h-3" />
                      <span>Tap to flip photo</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Subtle romantic corner sparkle */}
            <div className="absolute top-2.5 right-2.5 text-rose-300 pointer-events-none drop-shadow-xs">
              <Sparkles className="w-4 h-4 fill-rose-200/60" />
            </div>
          </div>

          {/* Polaroid Handwritten Caption Section */}
          <div className="mt-4 text-center px-1">
            <p className="font-handwriting text-2xl sm:text-3xl text-stone-800 tracking-wide leading-tight">
              {currentCaption.title}
            </p>
            <p className="text-[11px] text-rose-900/50 font-serif-romantic italic mt-1">
              {currentCaption.note}
            </p>
          </div>
        </div>

        {/* Second Photo Peeking from Behind (Physical stack effect) */}
        {validPhotos.length > 1 && (
          <div
            aria-hidden="true"
            className="absolute -bottom-2.5 -right-3 w-full h-full bg-white/80 border border-rose-100/70 rounded-sm sm:rounded-md -z-10 rotate-3 shadow-xs pointer-events-none"
          />
        )}
      </motion.div>

      {/* Switcher & Photo Counter (if multiple photos) */}
      {validPhotos.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4 text-stone-600">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 shadow-2xs border border-rose-100 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            {validPhotos.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(i);
                }}
                aria-label={`View photo ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === i
                    ? 'w-5 h-1.5 bg-rose-400'
                    : 'w-1.5 h-1.5 bg-rose-200 hover:bg-rose-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 shadow-2xs border border-rose-100 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {validPhotos.length > 1 && (
        <span className="text-[10px] text-stone-600 font-medium mt-1">
          Tap photo to flip • {activeIndex + 1} of {validPhotos.length}
        </span>
      )}
    </div>
  );
};
