'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Smooth springs for the trailing effect
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const ghostX = useSpring(0, springConfig);
  const ghostY = useSpring(0, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      ghostX.set(e.clientX);
      ghostY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cyber-button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [ghostX, ghostY]);

  return (
    <>
      {/* Core Target Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-red-600 rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_10px_#ef4444]"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 2000, damping: 25, mass: 0.1 }}
      />
      
      {/* Physics Ghost / Targeting Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-red-600/40 rounded-full pointer-events-none z-[9998] flex items-center justify-center"
        style={{
          x: ghostX,
          y: ghostY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="w-full h-full relative">
           {/* Crosshair lines */}
           <div className="absolute top-1/2 left-0 w-2 h-[1px] bg-red-600/60" />
           <div className="absolute top-1/2 right-0 w-2 h-[1px] bg-red-600/60" />
           <div className="absolute top-0 left-1/2 w-[1px] h-2 bg-red-600/60" />
           <div className="absolute bottom-0 left-1/2 w-[1px] h-2 bg-red-600/60" />
        </div>
      </motion.div>

      {/* Outer Distortion Ring */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 border-[0.5px] border-red-950/20 rounded-full pointer-events-none z-[9997]"
        animate={{
          x: mousePosition.x - 32,
          y: mousePosition.y - 32,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 1 : 0.2,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />
    </>
  );
}
