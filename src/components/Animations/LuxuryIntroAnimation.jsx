import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LuxuryIntroAnimation = ({ onComplete }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Prevent scroll during intro
    document.body.style.overflow = 'hidden';

    // 1.2 seconds show time, then trigger shutter split reveal
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        document.body.style.overflow = 'unset';
        if (onComplete) onComplete();
      }, 550); // curtain split duration
    }, 1300);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isClosing && (
        <div className="fixed inset-0 z-[999999] pointer-events-auto select-none overflow-hidden font-body flex items-center justify-center">
          
          {/* Top Shutter Door */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 right-0 h-[50vh] bg-[#030612] border-b border-amber-500/40 z-20 shadow-[0_15px_50px_rgba(245,158,11,0.25)] flex items-end justify-center"
          >
            {/* Top Golden Light Seam */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b]" />
          </motion.div>

          {/* Bottom Shutter Door */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 right-0 h-[50vh] bg-[#030612] border-t border-amber-500/40 z-20 shadow-[0_-15px_50px_rgba(245,158,11,0.25)] flex items-start justify-center"
          >
            {/* Bottom Golden Light Seam */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b]" />
          </motion.div>

          {/* Centerpiece Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
            transition={{ duration: 0.45 }}
            className="relative z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-full"
          >
            {/* Radial Background Light Aura */}
            <div className="absolute w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-gradient-to-r from-amber-500/25 via-fuchsia-600/20 to-cyan-500/20 blur-3xl pointer-events-none animate-pulse" />

            {/* Glowing Luxury Monogram Badge */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-4 sm:mb-6"
            >
              {/* Rotating Gold Energy Halo */}
              <div className="absolute -inset-3 sm:-inset-5 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 opacity-60 blur-xl animate-pulse" />

              <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-[#070b1e]/95 border-2 border-amber-400/60 p-3 sm:p-5 shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center backdrop-blur-2xl">
                <img
                  src="/logo.png"
                  alt="Viral Vyapar Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(245,158,11,0.9)]"
                />

                {/* Laser Light Sweep Line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[marquee_1.3s_infinite]" />
              </div>
            </motion.div>

            {/* Typography Reveal */}
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-1.5 sm:space-y-2 text-center"
            >
              <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-none">
                VIRAL{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 filter drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]">
                  VYAPAR
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.25em' }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-[10px] sm:text-xs md:text-sm font-extrabold text-slate-300 uppercase tracking-widest"
              >
                ✦ DIGITAL GROWTH ARCHITECTS ✦
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LuxuryIntroAnimation;
