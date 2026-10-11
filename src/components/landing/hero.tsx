'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

const HeroCanvas = dynamic(() => import('./hero-canvas'), { ssr: false });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.97]);

  return (
    <header
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-[calc(80px+env(safe-area-inset-top))] pb-[calc(48px+env(safe-area-inset-bottom))] text-center"
    >
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-plum-950/30 to-plum-950" />

      <motion.div style={{ y, opacity, scale }} className="relative z-10 flex w-full max-w-5xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-300" />
          </span>
          <span className="text-[13px] tracking-wide text-white/70">Now available for Android</span>
        </motion.div>

        {/* Giant flat grotesque — no serif, no italic, no gradient */}
        <h1 className="display w-full text-[clamp(52px,10.5vw,158px)] text-white">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.23, 1, 0.320, 1] }}
          >
            Your fitness.
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.9, ease: [0.23, 1, 0.320, 1] }}
          >
            Truly understood<span className="text-accent">.</span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-9 max-w-md text-[clamp(15px,1.5vw,19px)] leading-relaxed text-white/60"
        >
          FitLip sees your meals, plans your training, tracks your runs, and learns from every day — so your coach is always one step ahead.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#download"
            className="magnetic-btn group relative inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-[15px] font-semibold text-plum-950 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Download for Android
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          <a
            href="#tour"
            className="magnetic-btn inline-flex h-14 items-center rounded-full border border-white/15 bg-white/[0.03] px-8 text-[15px] font-medium text-white/90 backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/[0.08]"
          >
            See how it works
          </a>
        </motion.div>
      </motion.div>
    </header>
  );
}