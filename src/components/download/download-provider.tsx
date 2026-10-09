"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, FileCheck2, QrCode, ShieldCheck, Smartphone, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { release } from '@/lib/release';

type Mode = 'install' | 'qr' | 'verify' | null;
type Ctx = { open: (mode: Exclude<Mode, null>) => void; download: () => void };
const DownloadContext = createContext<Ctx>({ open: () => {}, download: () => {} });
export const useDownload = () => useContext(DownloadContext);

export function DownloadProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(null);
  const [copied, setCopied] = useState(false);
  const [verifyState, setVerifyState] = useState<'idle' | 'busy' | 'ok' | 'bad'>('idle');
  const [verifyMsg, setVerifyMsg] = useState('');

  const open = useCallback((m: Exclude<Mode, null>) => { setVerifyState('idle'); setVerifyMsg(''); setMode(m); }, []);
  const close = useCallback(() => setMode(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const download = useCallback(() => {
    const a = document.createElement('a');
    a.href = '/api/download';
    a.download = `fitlip-${release.version}.apk`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const copyHash = useCallback(async () => {
    try { await navigator.clipboard.writeText(release.sha256); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  }, []);

  const verify = useCallback(async (file?: File | null) => {
    if (!file) return;
    setVerifyMsg('');
    if (file.size !== release.bytes) { setVerifyState('bad'); setVerifyMsg('File size does not match this release. Do not install it.'); return; }
    if (!crypto.subtle) { setVerifyState('bad'); setVerifyMsg('Verification requires HTTPS or localhost.'); return; }
    setVerifyState('busy');
    try {
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      const hash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
      if (hash === release.sha256) { setVerifyState('ok'); setVerifyMsg('Signature matches the official release. Safe to install.'); }
      else { setVerifyState('bad'); setVerifyMsg('Hash mismatch. Delete the file and download again.'); }
    } catch { setVerifyState('bad'); setVerifyMsg('Could not read the file. Try again.'); }
  }, []);

  const value = useMemo(() => ({ open, download }), [open, download]);

  return (
    <DownloadContext.Provider value={value}>
      {children}
      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="modal-backdrop absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={close} />
          <div className="modal-card relative w-[min(92vw,440px)] rounded-3xl border border-white/10 bg-[#0b0b0d]/95 p-8 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
            <button onClick={close} aria-label="Close" className="absolute right-5 top-5 text-white/40 transition-colors hover:text-white"><X size={20} /></button>

            {mode === 'qr' && (
              <div className="flex flex-col items-center text-center">
                <Title icon={<QrCode size={20} />} t="Scan to install" s="Open FitLip on your Android device." />
                <div className="mt-6 rounded-2xl bg-white p-4"><QRCodeSVG value={typeof window !== 'undefined' ? window.location.origin : ''} size={176} bgColor="#ffffff" fgColor="#0b0b0d" level="M" /></div>
                <p className="font-body mt-4 text-sm font-light text-white/50">Point your camera here — the site opens on your phone and the download starts in one tap.</p>
                <HashRow copied={copied} onCopy={copyHash} />
              </div>
            )}

            {mode === 'install' && (
              <div>
                <Title icon={<Smartphone size={20} />} t="Install FitLip" s="Three steps, under a minute." />
                <ol className="mt-6 space-y-4">
                  {[
                    ['Download the APK', '162.7 MB, straight from the release server.'],
                    ['Allow unknown sources', 'Settings → Apps → your browser → allow installs.'],
                    ['Open & install', 'Tap the finished download and confirm.'],
                  ].map(([t, s], i) => (
                    <li key={t} className="flex gap-4">
                      <span className="font-cinematic text-lg text-white/30">0{i + 1}</span>
                      <span><span className="font-cinematic block text-[12px] tracking-[0.2em] text-white/90">{t}</span><span className="font-body text-sm font-light text-white/50">{s}</span></span>
                    </li>
                  ))}
                </ol>
                <button onClick={download} className="font-cinematic mt-7 flex w-full items-center justify-center gap-2 bg-white py-4 text-sm text-black transition-transform hover:scale-[1.02]"><Download size={16} /> Download APK</button>
                <button onClick={() => open('verify')} className="font-body mt-3 w-full text-center text-xs text-white/40 transition-colors hover:text-white/80">Already downloaded? Verify its signature</button>
              </div>
            )}

            {mode === 'verify' && (
              <div>
                <Title icon={<ShieldCheck size={20} />} t="Verify your download" s="SHA-256 integrity check, in your browser." />
                <label className="mt-6 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-8 text-center transition-colors hover:border-white/40">
                  <FileCheck2 size={22} className="text-white/60" />
                  <span className="font-body text-sm font-light text-white/60">Choose the downloaded <span className="font-mono">.apk</span> to verify</span>
                  <input type="file" accept=".apk,application/vnd.android.package-archive" className="hidden" onChange={(e) => verify(e.target.files?.[0])} />
                </label>
                {verifyState === 'busy' && <p className="font-body mt-4 text-sm text-white/50">Hashing…</p>}
                {verifyState === 'ok' && <p className="font-body mt-4 flex items-center gap-2 text-sm text-[#c4ff47]"><Check size={16} /> {verifyMsg}</p>}
                {verifyState === 'bad' && <p className="font-body mt-4 text-sm text-red-400">{verifyMsg}</p>}
                <HashRow copied={copied} onCopy={copyHash} />
              </div>
            )}
          </div>
        </div>
      )}
    </DownloadContext.Provider>
  );
}

function Title({ icon, t, s }: { icon: React.ReactNode; t: string; s: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="mb-3 text-white/60">{icon}</span>
      <h3 className="font-cinematic text-lg tracking-[0.15em] text-white">{t}</h3>
      <p className="font-calligraphy mt-1 text-xl text-white/50">{s}</p>
    </div>
  );
}

function HashRow({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button onClick={onCopy} className="mt-6 flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/25">
      <span className="font-mono text-[10px] text-white/40">{release.sha256.slice(0, 18)}…{release.sha256.slice(-6)}</span>
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/50">{copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'SHA-256'}</span>
    </button>
  );
}