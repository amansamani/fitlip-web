'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { release, signingCertSha256, siteUrl } from '@/lib/release';

type Check = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok' | 'bad'; msg: string };

const STEPS = [
  { t: 'Download', d: 'Get the APK or scan the QR code.' },
  { t: 'Verify', d: 'Match the SHA-256 fingerprint.' },
  { t: 'Allow', d: 'Enable installs from your browser.' },
  { t: 'Install', d: 'Open the file and start.' },
];

export function DownloadSection() {
  const [copied, setCopied] = useState(false);
  const [check, setCheck] = useState<Check>({ kind: 'idle' });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(release.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const verify = async (file?: File | null) => {
    if (!file) return;
    if (file.size !== release.bytes) {
      setCheck({ kind: 'bad', msg: 'Size mismatch.' });
      return;
    }
    if (!globalThis.crypto?.subtle) {
      setCheck({ kind: 'bad', msg: 'Crypto not available.' });
      return;
    }
    setCheck({ kind: 'busy' });
    try {
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
      setCheck(
        hex === release.sha256
          ? { kind: 'ok', msg: 'Verified. Safe to install.' }
          : { kind: 'bad', msg: 'Hash mismatch. Download again.' }
      );
    } catch {
      setCheck({ kind: 'bad', msg: 'Could not read file.' });
    }
  };

  return (
    <section id="download" className="relative py-32 px-5 overflow-hidden">
      <div className="orb orb-3" style={{ bottom: '10%', left: '-10%' }} />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-white/40">Get Started</span>
            <div className="h-px w-12 bg-white/20" />
          </div>

          <h2 className="display text-[clamp(44px,9vw,140px)] text-white">
  Begin your<br />
  journey<span className="text-accent">.</span>
</h2>

          <p className="mt-8 text-white/50 text-lg">
            Version {release.version} · {release.size} · Android {release.minAndroid}+
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10"
          >
            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-2">Download</h3>
            <p className="text-2xl font-display italic text-white mb-8">Get the app</p>

            <a
              href="/api/download"
              className="group flex h-16 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-brand to-accent text-base font-semibold text-white shadow-2xl shadow-brand/20 transition-all hover:shadow-brand/40 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download APK
            </a>

            <div className="mt-8 pt-8 border-t border-white/10 hidden lg:flex items-center gap-6">
              <div className="shrink-0 rounded-xl bg-white p-2.5">
                <QRCodeSVG
                  value={`${siteUrl}/api/download`}
                  size={88}
                  level="M"
                  fgColor="#18181B"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Scan with your phone camera to download instantly.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10"
          >
            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-2">Security</h3>
            <p className="text-2xl font-display italic text-white mb-8">Verify it's real</p>

            <div className="rounded-xl bg-black/40 p-4 font-mono text-[11px] text-brand-200 break-all select-all leading-relaxed">
              {release.sha256}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={copy}
                className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-brand-300/20 text-brand-300'
                    : 'border border-white/15 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy Hash'}
              </button>

              <label className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm font-semibold">
                Verify File
                <input
                  type="file"
                  accept=".apk,application/vnd.android.package-archive"
                  className="hidden"
                  onChange={(e) => verify(e.target.files?.[0])}
                />
              </label>
            </div>

            {check.kind !== 'idle' && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-xl text-sm ${
                  check.kind === 'ok' ? 'bg-green-500/10 text-green-400' :
                  check.kind === 'bad' ? 'bg-red-500/10 text-red-400' :
                  'bg-white/5 text-white/60'
                }`}
              >
                {check.kind === 'busy' ? 'Verifying...' : check.kind === 'ok' || check.kind === 'bad' ? check.msg : ''}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Install steps - minimal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden"
        >
          {STEPS.map((step, i) => (
            <div key={step.t} className="bg-plum-950 p-6">
              <span className="font-display text-3xl italic text-white/20">{pad(i + 1)}</span>
              <h4 className="mt-2 font-semibold text-white">{step.t}</h4>
              <p className="mt-1.5 text-sm text-white/50 leading-relaxed">{step.d}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-between gap-4 text-xs text-white/30">
          <span>FitLip {release.version}</span>
          <span>{siteUrl.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>
    </section>
  );
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}