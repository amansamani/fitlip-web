'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FitLipMark } from '@/components/brand/fitlip-mark';

const LINKS = [
  { href: '#tour', label: 'Experience' },
  { href: '#download', label: 'Install' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          scrolled ? 'border-white/10 bg-plum-950/70 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
      >
        {/* Single aligned flex row — nothing can escape or clip */}
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-7 px-5 sm:px-8">
          <a href="#top" className="mr-auto flex items-center gap-2.5">
            <FitLipMark size={26} accent="#C4B5FD" />
<span className="font-display text-[17px] font-extrabold tracking-[-0.03em]">FITLIP</span>          </a>

          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hidden text-sm text-white/60 transition-colors hover:text-white md:block">
              {l.label}
            </a>
          ))}

          <a
            href="#download"
            className="hidden h-9 items-center rounded-full bg-white px-5 text-sm font-semibold text-plum-950 transition-colors hover:bg-white/90 md:inline-flex"
          >
            Get the app
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex flex-col items-center justify-center gap-[5px] p-2 md:hidden"
          >
            <motion.span animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block h-px w-6 bg-white" />
            <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block h-px w-6 bg-white" />
            <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block h-px w-6 bg-white" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-plum-950/95 backdrop-blur-2xl md:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="font-display text-4xl italic text-white/90"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#download"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-2 inline-flex h-12 items-center rounded-full bg-white px-8 text-sm font-semibold text-plum-950"
            >
              Get the app
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}