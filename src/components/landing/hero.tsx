import type { CSSProperties } from 'react';

const delay = (s: string) => ({ ['--d' as string]: s }) as CSSProperties;

export function Hero() {
  return (
    <header
      id="top"
      className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-plum-900 to-[#3a1c48] px-5 pb-24 pt-[calc(110px+env(safe-area-inset-top))] text-center"
    >
      <svg className="pointer-events-none absolute inset-x-0 -bottom-px h-[36%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
        <polygon fill="#33193f" points="0,400 0,260 180,150 330,250 520,110 700,240 900,90 1100,230 1280,140 1440,230 1440,400" />
        <polygon fill="#1b0f24" points="0,400 0,320 220,230 420,320 640,210 860,320 1060,240 1260,320 1440,260 1440,400" />
      </svg>
      <h1 className="relative font-display text-[clamp(46px,8.6vw,132px)] font-normal italic leading-[0.98] tracking-[-0.01em]">
        <span className="rise block" style={delay('1.1s')}>Meals, workouts and runs.</span>
        <span className="rise block" style={delay('1.22s')}>One app, one coach.</span>
      </h1>
      <p className="rise relative mt-6 max-w-[44ch] text-[clamp(16px,1.5vw,19px)] text-white/80" style={delay('1.4s')}>
        FitLip logs your food from a photo, plans your training, tracks every run, and answers questions from your own records.
      </p>
      <div className="rise relative mt-8 flex flex-wrap justify-center gap-3" style={delay('1.55s')}>
        <a href="#download" className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-[15px] font-semibold text-plum-900 transition-opacity hover:opacity-90">
          Download for Android
        </a>
        <a href="#tour" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-[15px] font-semibold transition-opacity hover:opacity-90">
          See the app
        </a>
      </div>
    </header>
  );
}
