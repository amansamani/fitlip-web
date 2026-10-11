'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FitLipMark } from '@/components/brand/fitlip-mark';

export function Preloader() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
      }
      setProgress(Math.min(p, 100));
    }, 150);
    return () => clearInterval(interval);
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-plum-950"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.320, 1] }}
            className="relative"
          >
            <FitLipMark size={80} color="#fff" accent="#B887C7" />
            <motion.div
              className="absolute -inset-4 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(184, 135, 199, 0.5), transparent)',
                filter: 'blur(10px)'
              }}
            />
          </motion.div>

          <div className="mt-12 w-48">
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #6e3482, #ff6b9d, #a855f7)'
                }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <p className="mt-4 text-center text-sm text-white/50">
              Loading experience... {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}