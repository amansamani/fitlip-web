'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { STEPS, pose, textOpacity, textShift, type Step as StepData } from '@/lib/tour';

// three.js is loaded only in the browser, and only when this section mounts.
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
    const top = el.offsetTop + ((i + 0.3) / N) * (el.offsetHeight - innerHeight);
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section
      ref={ref}
      id="tour"
      aria-label="FitLip features"
      className="relative bg-plum-950"
      style={{ height: `calc(${N} * 95vh + 100vh)` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute left-0 top-0 z-30 h-0.5 w-full origin-left bg-brand-300" style={{ scaleX: scrollYProgress }} />

        <div className="pointer-events-none absolute inset-0">
          {gl === true && <PhoneCanvas progress={scrollYProgress} reduce={reduce} active={visible} />}
          {gl === false && (
            <div className="grid h-full place-items-center">
              {/* No WebGL: show the current screen as a flat image. */}
              <img src={STEPS[active].src} alt={`FitLip ${STEPS[active].label} screen`} className="h-[62svh] rounded-[28px] border-4 border-[#2a1638]" />
            </div>
          )}
        </div>

        {STEPS.map((s, i) => (
          <StepText key={s.id} index={i} step={s} progress={scrollYProgress} reduce={reduce} />
        ))}

        <div aria-hidden="true" className="absolute bottom-[calc(22px+env(safe-area-inset-bottom))] left-[max(24px,7vw)] z-20 flex items-baseline gap-2.5 max-tour:bottom-auto max-tour:left-5 max-tour:top-[calc(72px+env(safe-area-inset-top))]">
          <b className="font-display text-[44px] font-normal italic leading-none tour:text-[clamp(48px,6vw,88px)]">{pad(active + 1)}</b>
          <span className="text-sm text-white/55">of {pad(N)}</span>
        </div>

        <div role="group" aria-label="Choose a screen" className="absolute bottom-[calc(20px+env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 gap-0.5 rounded-[14px] border border-white/10 bg-white/10 p-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${s.label}`}
              aria-current={i === active ? 'step' : undefined}
              className={`flex h-9 cursor-pointer items-center justify-center rounded-[10px] px-2 text-[13px] font-medium transition-colors ${
                i === active ? 'bg-brand px-3.5 text-white' : 'text-white/65 hover:text-white tour:px-3.5'
              }`}
            >
              <span className={i === active ? '' : 'hidden tour:inline'}>{s.label}</span>
              {i !== active && <span className="block size-2 rounded-full bg-current tour:hidden" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepText({ index, step, progress, reduce }: { index: number; step: StepData; progress: MotionValue<number>; reduce: boolean }) {
  const opacity = useTransform(progress, (p) => textOpacity(index, p));
  const y = useTransform(progress, (p) => (reduce ? 0 : textShift(index, p)));
  // Phone on the left for even steps, so their text sits on the right; the reverse for odd steps.
  const side = index % 2 === 0 ? 'tour:justify-end' : 'tour:justify-start';
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 flex items-end justify-center px-5 pb-[calc(78px+env(safe-area-inset-bottom))] tour:items-center tour:px-[7vw] tour:pb-0 ${side}`}>
      <motion.article style={{ opacity, y }} className="w-full tour:w-[min(420px,34vw)]">
        <h2 className="font-display text-[clamp(34px,9vw,48px)] font-normal italic leading-none tracking-[-0.01em] tour:text-[clamp(38px,5vw,76px)]">{step.title}</h2>
        <p className="mt-2 max-w-[36ch] text-[15px] text-white/75 tour:mt-[18px] tour:text-[clamp(16px,1.3vw,18px)]">{step.body}</p>
      </motion.article>
    </div>
  );
}
