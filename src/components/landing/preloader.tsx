'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FitLipMark } from '@/components/brand/fitlip-mark';

export function Preloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduce ? 0 : 1100);
    return () => clearTimeout(t);
  }, [reduce]);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[100] grid place-items-center bg-plum-900"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div initial={{ opacity: 0.15 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <FitLipMark size={64} color="#fff" accent="#B887C7" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
