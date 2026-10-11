'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { STEPS, pose, textOpacity, textShift, type Step as StepData } from '@/lib/tour';
import { lenisRef } from '@/lib/smooth';

const PhoneCanvas = dynamic(() => import('./phone-canvas'), { ssr: false });
const N = STEPS.length;
const pad = (n: number) => String(n).padStart(2, '0');

export function PhoneTour() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  const [gl, setGl] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);

  // Label fades out as soon as the tour starts scrolling
  const labelOpacity = useTransform(scrollYProgress, [0, 0.035], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(pose(p, reduce).img));

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setGl(!!(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setGl(false);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + ((i + 0.35) / N) * (el.offsetHeight - innerHeight);
    if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 1.4 });
    else window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section
      ref={ref}
      id="tour"
      aria-label="FitLip features"
      className="relative bg-plum-950"
      style={{ height: `calc(${N} * 100vh + 100vh)` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Progress hairline */}
        <motion.div
          className="absolute left-0 top-0 z-40 h-px w-full origin-left"
          style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #7c3aed, #f472b6, #c4b5fd)' }}
        />

        {/* Section label — single instance, fades away on scroll */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className="pointer-events-none absolute left-0 right-0 top-[calc(76px+env(safe-area-inset-top))] z-30 flex items-center justify-center gap-3 px-5"
        >
          <div className="h-px w-10 bg-white/15" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/35">The FitLip Experience</span>
          <div className="h-px w-10 bg-white/15" />
        </motion.div>

        {/* 3D phone / flat fallback */}
        <div className="pointer-events-none absolute inset-0">
          {gl === true && <PhoneCanvas progress={scrollYProgress} reduce={reduce} active={visible} />}
          {gl === false && (
            <div className="grid h-full place-items-center">
              <img
                src={STEPS[active].src}
                alt={`FitLip ${STEPS[active].label} screen`}
                className="h-[58svh] rounded-[32px] border border-white/10 shadow-2xl"
              />
            </div>
          )}
        </div>

        {/* Cinematic vignette */}
        <div className="tour-vignette pointer-events-none absolute inset-0 z-10" />

        {STEPS.map((s, i) => (
          <StepText key={s.id} index={i} step={s} progress={scrollYProgress} reduce={reduce} />
        ))}

        {/* Counter — single clean block */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-[max(28px,6vw)] z-30 flex items-baseline gap-3 max-tour:bottom-auto max-tour:left-5 max-tour:top-[calc(120px+env(safe-area-inset-top))]"
        >
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="display text-[clamp(40px,5vw,72px)] leading-none text-white"
          >
            {pad(active + 1)}
          </motion.div>
          <span className="text-xs uppercase tracking-widest text-white/30">/ {pad(N)}</span>
        </div>

        {/* Minimal line dock */}
        <div
          role="group"
          aria-label="Choose a screen"
          className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5"
        >
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${s.label}`}
              aria-current={i === active ? 'step' : undefined}
              className="group flex items-center p-1.5"
            >
              <div
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === active ? 'w-8 bg-gradient-to-r from-brand to-accent' : 'w-3 bg-white/20 group-hover:bg-white/45'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepText({
  index,
  step,
  progress,
  reduce,
}: {
  index: number;
  step: StepData;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const opacity = useTransform(progress, (p) => textOpacity(index, p));
  const y = useTransform(progress, (p) => (reduce ? 0 : textShift(index, p)));
  const side = index % 2 === 0 ? 'tour:justify-end' : 'tour:justify-start';

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 flex items-end justify-center px-6 pb-28 tour:items-center tour:px-[8vw] tour:pb-0 ${side}`}
    >
      <motion.article style={{ opacity, y }} className="w-full tour:w-[min(480px,38vw)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-brand-300/50" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-brand-300">{step.label}</span>
        </div>

        <h2 className="display-case text-[clamp(32px,7vw,50px)] text-white tour:text-[clamp(40px,4.2vw,64px)]">
          {step.title}
        </h2>

        <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-white/55 tour:mt-6 tour:text-[clamp(16px,1.25vw,18px)]">
          {step.body}
        </p>
      </motion.article>
    </div>
  );
}