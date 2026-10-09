"use client";

import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Scroll, ScrollControls } from '@react-three/drei';
import { Experience } from '@/components/scene/experience';
import { DownloadProvider, useDownload } from '@/components/download/download-provider';

export default function Home() {
  return (
    <DownloadProvider>
      <Page />
    </DownloadProvider>
  );
}

function Page() {
  const { open, download } = useDownload();
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#050505] text-white selection:bg-white selection:text-black">
      <Canvas gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -5, 2]} intensity={0.5} color="#4040ff" />
        <Suspense fallback={null}>
          <ScrollControls pages={9} damping={0.12}>
            <Experience />
            <Scroll html style={{ width: '100%' }}>
              <SectionHero />
              <SectionTracking />
              <SectionNutrition />
              <SectionCoach />
              <SectionGallery />
              <SectionMove />
              <SectionFormCam />
              <SectionStats />
              <SectionDownload onDownload={download} onGuide={() => open('install')} onQr={() => open('qr')} onVerify={() => open('verify')} />
            </Scroll>
          </ScrollControls>
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <ProgressBar />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#050505] to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#050505] to-transparent" />
    </main>
  );
}

function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = (e: Event) => {
      if (ref.current) ref.current.style.transform = `scaleX(${(e as CustomEvent<number>).detail})`;
    };
    window.addEventListener('fitlip:progress', on);
    return () => window.removeEventListener('fitlip:progress', on);
  }, []);
  return <div ref={ref} className="fixed left-0 top-0 z-40 h-[2px] w-full origin-left scale-x-0 bg-white/70" />;
}

function ShotCard({ src, label, note, className = '' }: { src: string; label: string; note: string; className?: string }) {
  return (
    <figure className={`shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${className}`}>
      <img src={src} alt={label} loading="lazy" className="aspect-[9/16] w-full object-cover" />
      <figcaption className="flex items-center justify-between px-3 py-2.5">
        <span className="font-cinematic text-[10px] text-white/80">{label}</span>
        <span className="font-mono text-[9px] text-white/40">{note}</span>
      </figcaption>
    </figure>
  );
}

function SectionHero() {
  return (
    <section className="pointer-events-none relative flex h-dvh w-full flex-col items-center justify-center">
      <h1 className="font-cinematic text-[20vw] leading-none text-white/90 md:text-[15vw]">FITLIP</h1>
      <p className="font-calligraphy mt-4 text-3xl text-white/60 md:text-5xl">Your body, <span className="text-white">orchestrated.</span></p>
      <div className="absolute bottom-10 animate-pulse text-xs uppercase tracking-[0.3em] text-white/30">Scroll to experience</div>
    </section>
  );
}

function SectionTracking() {
  return (
    <section className="pointer-events-none relative flex h-dvh w-full flex-col justify-center pl-10 md:pl-24">
      <h2 className="font-cinematic text-6xl leading-none text-white/90 md:text-9xl">Precision</h2>
      <p className="font-body mt-6 max-w-md text-xl font-light text-white/50 md:text-2xl">
        Capture every rep, every step, every heartbeat.
        <br /><span className="font-calligraphy text-2xl text-white/80 md:text-3xl">Flawless tracking.</span>
      </p>
    </section>
  );
}

function SectionNutrition() {
  return (
    <section className="pointer-events-none relative flex h-dvh w-full flex-col items-end justify-end pb-24 pr-10 md:pr-24">
      <h2 className="font-calligraphy text-7xl leading-none text-white/90 md:text-[11rem]">Nourishment</h2>
      <p className="font-body mt-6 max-w-md text-right text-xl font-light text-white/50 md:text-2xl">Fuel your ambition with intelligent macros.</p>
    </section>
  );
}

function SectionCoach() {
  return (
    <section className="pointer-events-none relative flex h-dvh w-full flex-col items-center justify-center">
      <h2 className="font-cinematic text-5xl leading-none text-white/90 md:text-8xl">Your AI Coach</h2>
      <p className="font-body mt-6 max-w-md text-center text-xl font-light text-white/50 md:text-2xl">Intelligent. Adaptive. Relentless.</p>
    </section>
  );
}

function SectionGallery() {
  const shots = [
    { src: '/screens/home.webp', label: 'Home', note: 'daily rings' },
    { src: '/screens/tracking.webp', label: 'Tracking', note: 'live metrics' },
    { src: '/screens/run.webp', label: 'Run', note: 'pace & route' },
    { src: '/screens/coach.webp', label: 'Coach', note: 'adaptive plan' },
    { src: '/screens/workouts.webp', label: 'Workouts', note: '40+ programs' },
    { src: '/screens/nutrition.webp', label: 'Nutrition', note: 'macro engine' },
    { src: '/screens/camera.webp', label: 'Form Cam', note: 'rep counting' },
  ];
  return (
    <section className="pointer-events-none relative flex h-dvh w-full flex-col justify-center overflow-hidden">
      <div className="mb-10 px-10 md:px-24">
        <h2 className="font-cinematic text-4xl text-white/90 md:text-7xl">The Interface</h2>
        <p className="font-calligraphy mt-3 text-2xl text-white/60 md:text-3xl">every screen, considered.</p>
      </div>
      <div className="marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-5 pr-5">
            {shots.map((s) => <ShotCard key={s.label} {...s} className="w-52 md:w-64" />)}
          </div>
        ))}
      </div>
      <div className="marquee marquee-reverse mt-6 opacity-50">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-5 pr-5">
            {[...shots].reverse().map((s) => <ShotCard key={s.label} {...s} className="w-40 md:w-48" />)}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionMove() {
  return (
    <section className="pointer-events-none relative flex h-dvh w-full flex-col justify-center pl-10 md:pl-24">
      <h2 className="font-cinematic text-5xl text-white/90 md:text-8xl">Move</h2>
      <p className="font-body mt-4 max-w-md text-lg font-light text-white/50 md:text-xl">
        Structured programs, live pace, rep-accurate sessions —
        <span className="font-calligraphy text-white/80"> built for real training.</span>
      </p>
      <div className="mt-10 flex gap-6">
        <ShotCard src="/screens/workouts.webp" label="Workouts" note="40+ programs" className="w-44 md:w-56" />
        <ShotCard src="/screens/run.webp" label="Run" note="pace & route" className="w-44 md:w-56" />
      </div>
    </section>
  );
}

function SectionFormCam() {
  return (
    <section className="pointer-events-none relative flex h-dvh w-full flex-col items-end justify-center pr-10 md:pr-24">
      <div className="flex max-w-md flex-col items-end text-right">
        <h2 className="font-cinematic text-5xl text-white/90 md:text-8xl">Form Cam</h2>
        <p className="font-body mt-4 text-lg font-light text-white/50 md:text-xl">
          Your camera counts reps and checks form —
          <span className="font-calligraphy text-white/80"> no wearables needed.</span>
        </p>
        <div className="mt-8"><ShotCard src="/screens/camera.webp" label="Live session" note="on-device vision" className="w-48 md:w-60" /></div>
      </div>
    </section>
  );
}

function SectionStats() {
  const stats = [
    { n: '7', l: 'core modules', c: 'tracking to nutrition' },
    { n: '40+', l: 'guided programs', c: 'progressive overload built in' },
    { n: '0', l: 'ads or subscriptions', c: 'one file, forever yours' },
    { n: '2.0', l: 'release series', c: 'rebuilt from the ground up' },
  ];
  return (
    <section className="pointer-events-none relative flex h-dvh w-full flex-col justify-center px-10 md:px-24">
      <h2 className="font-calligraphy mb-12 text-3xl text-white/60 md:text-5xl">by the numbers</h2>
      <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="font-cinematic text-6xl text-white/90 md:text-8xl">{s.n}</div>
            <div className="font-cinematic mt-2 text-[11px] tracking-[0.25em] text-white/70">{s.l}</div>
            <div className="font-body mt-1 text-sm font-light text-white/40">{s.c}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionDownload({ onDownload, onGuide, onQr, onVerify }: { onDownload: () => void; onGuide: () => void; onQr: () => void; onVerify: () => void }) {
  return (
    <section className="pointer-events-auto relative flex h-dvh w-full flex-col items-center justify-center">
      <h2 className="font-calligraphy mb-10 text-6xl leading-none text-white/90 md:text-9xl">Ready?</h2>
      <button onClick={onDownload} className="font-cinematic bg-white px-10 py-5 text-lg text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]">
        Download APK
      </button>
      <div className="mt-8 flex items-center gap-6 text-xs uppercase tracking-[0.25em] text-white/40">
        <button onClick={onGuide} className="transition-colors hover:text-white">Install guide</button>
        <span className="h-3 w-px bg-white/20" />
        <button onClick={onQr} className="transition-colors hover:text-white">Scan QR</button>
        <span className="h-3 w-px bg-white/20" />
        <button onClick={onVerify} className="transition-colors hover:text-white">Verify</button>
      </div>
      <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-white/25">v2.0.0 · 162.7 MB · Android 8+</p>
      <footer className="absolute bottom-8 flex w-full items-center justify-between px-10 text-[10px] uppercase tracking-[0.25em] text-white/25 md:px-24">
        <span>FitLip © 2026</span><span>crafted for movement</span>
      </footer>
    </section>
  );
}