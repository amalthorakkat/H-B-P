import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CursorGlow: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Soft, smooth spring interpolation for a dreamy delayed trailing effect
  const springX = useSpring(mouseX, { damping: 28, stiffness: 140 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 140 });

  useEffect(() => {
    // Only enable on fine pointer (desktop / mouse) and when reduced motion is not preferred
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isTouch && !prefersReducedMotion) {
      setIsEnabled(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!isEnabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 w-[360px] h-[360px] -ml-[180px] -mt-[180px] pointer-events-none z-1 rounded-full opacity-60 mix-blend-multiply"
      style={{
        x: springX,
        y: springY,
        background:
          'radial-gradient(circle, rgba(254, 205, 211, 0.42) 0%, rgba(253, 230, 238, 0.2) 40%, rgba(255, 241, 242, 0.05) 65%, transparent 75%)',
        filter: 'blur(32px)',
      }}
    />
  );
};
