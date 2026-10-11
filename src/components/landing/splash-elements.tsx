'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { Dumbbell, Footprints, Utensils } from 'lucide-react';
import { chapterVisibility } from '@/lib/story';

// Original F outline and entrance timing from the native FitLipLaunch screen.
const MARK = 'M0 24V18C0 7 7 2 18 2H34V10C29 14 24 14 18 14C10 14 5 18 0 24ZM0 44V33C0 24 7 20 17 20H31C30 27 27 30 20 30H14C11 30 10 32 10 35V44Z';
const FEATURES = [
  { label: 'EXERCISE', Icon: Dumbbell, className: 'splash-exercise', x: 70, y: 75 },
  { label: 'DIET', Icon: Utensils, className: 'splash-diet', x: -70, y: -10 },
  { label: 'TRACK', Icon: Footprints, className: 'splash-track', x: 60, y: -75 },
];

export function SplashElements({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, value => chapterVisibility(0, value));
  const y = useTransform(opacity, value => (1 - value) * -20);
  return <motion.div className="splash-elements" style={{ opacity, y }} aria-hidden="true">
    <div className="splash-composition">
      <motion.div className="splash-mark" initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: [0, 1, 1, 1, 1], y: [-70, 0, -17, 0, 0], scaleX: [.7, .92, 1.17, .95, 1.04, 1], scaleY: [.8, 1.1, .83, 1.06, .97, 1] }}
        transition={{ duration: .96, ease: 'linear', y: { times: [0, .43, .66, .83, 1], duration: .96 }, scaleX: { times: [0, .35, .45, .65, .83, 1], duration: .96 }, scaleY: { times: [0, .35, .45, .65, .83, 1], duration: .96 } }}>
        <motion.div className="splash-bloom" initial={{ scale: .55, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .4, duration: .6, ease: [.22, 1, .36, 1] }} />
        <svg viewBox="0 0 34 44" width="30" height="39"><path d={MARK} fill="#6e3482" /></svg>
        <motion.svg className="splash-white-mark" viewBox="0 0 34 44" width="30" height="39" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4, duration: .6 }}><path d={MARK} fill="#fff" /></motion.svg>
      </motion.div>
      {FEATURES.map(({ label, Icon, className, x, y }, index) => <motion.div key={label} className={'splash-feature ' + className}
        initial={{ opacity: 0, x, y, scale: .35 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ delay: 1.03 + index * .14, type: 'spring', damping: 15, stiffness: 125, mass: .85 }}>
        <div className="splash-feature-icon"><Icon size={25} strokeWidth={1.65} /></div><span>{label}</span>
      </motion.div>)}
    </div>
  </motion.div>;
}
