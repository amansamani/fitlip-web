'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { release, signingCertSha256, siteUrl } from '@/lib/release';

type Check = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok' | 'bad'; msg: string };

const STEPS = [
  { t: 'Download', d: 'Get the APK on your Android phone, or scan the QR code from your laptop.' },
  { t: 'Check it', d: 'Optional but recommended: match the SHA-256 above before you open the file.' },
  { t: 'Allow the install', d: 'If Android blocks it, go to Settings, Apps, your browser, Install unknown apps, and allow it.' },
  { t: 'Install and open', d: 'Tap the downloaded file, confirm Install, then open FitLip and set up your profile.' },
];

const panel = 'min-w-0 rounded-[18px] border border-white/15 bg-white/[0.03] p-[clamp(22px,3vw,34px)]';
const mono = 'font-mono text-[13px] leading-normal';

export function DownloadSection() {
  const [copied, setCopied] = useState(false);
  const [check, setCheck] = useState<Check>({ kind: 'idle' });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(release.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* Clipboard can be blocked; the hash is selectable with one click. */
    }
  };

  const verify = async (file?: File | null) => {
    if (!file) return;
    if (file.size !== release.bytes) {
      setCheck({ kind: 'bad', msg: 'The file size does not match this release. Do not install it.' });
      return;
    }
    if (!globalThis.crypto?.subtle) {
      setCheck({ kind: 'bad', msg: 'Your browser can only run this check on a secure page. Use the terminal command instead.' });
      return;
    }
    setCheck({ kind: 'busy' });
    try {
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
      setCheck(
        hex === release.sha256
          ? { kind: 'ok', msg: `Match. This is the official FitLip ${release.version} file. Safe to install.` }
          : { kind: 'bad', msg: 'No match. Delete this file and download it again.' },
      );
    } catch {
      setCheck({ kind: 'bad', msg: 'Could not read the file. Try again.' });
    }
  };

  return (
    <section id="download" className="border-t border-white/15 bg-plum-950 px-5 pb-[calc(40px+env(safe-area-inset-bottom))] pt-[clamp(80px,11vw,150px)]">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="max-w-[16ch] font-display text-[clamp(46px,7vw,104px)] font-normal italic leading-[0.98] tracking-[-0.01em]">
          Download FitLip for Android.
        </h2>
        <p className="mt-[18px] text-[clamp(16px,1.5vw,18px)] text-white/75">
          Version {release.version}, {release.size}, for Android {release.minAndroid} or later.
        </p>

        <div className="mt-12 grid gap-5 tour:grid-cols-[1fr_1.2fr]">
          <div className={panel}>
            <h3 className="text-lg font-semibold">Get the app</h3>
            <p className="mt-2.5 text-[15px] text-white/75">
              FitLip is installed from a direct APK file, not from Google Play. Download it, then check its fingerprint before you install.
            </p>
            <a href="/api/download" className="mt-[22px] inline-flex h-[54px] w-full items-center justify-center rounded-xl bg-white text-base font-semibold text-plum-900 transition-opacity hover:opacity-90">
              Download APK
            </a>
            {/* Only on laptops and desktops: a phone can just tap the button. */}
            <div className="mt-6 hidden items-center gap-[18px] border-t border-white/15 pt-6 [@media(min-width:54rem)_and_(hover:hover)_and_(pointer:fine)]:flex">
              <div className="shrink-0 rounded-[10px] bg-white p-2.5">
                <QRCodeSVG value={`${siteUrl}/api/download`} size={112} level="M" fgColor="#18181B" bgColor="#ffffff" title="QR code that downloads the FitLip APK" />
              </div>
              <p className="text-[15px] text-white/75">On a laptop? Scan this with your phone&apos;s camera to download the APK straight to your phone.</p>
            </div>
          </div>

          <div className={panel}>
            <h3 className="text-lg font-semibold">Check that it&apos;s the real file</h3>
            <p className="mt-2.5 text-[15px] text-white/75">Every release has a SHA-256 fingerprint. Your downloaded file must produce exactly this value.</p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <code className={`${mono} min-w-0 flex-1 select-all break-all rounded-[10px] bg-black/35 px-3.5 py-3 text-[#e9d5f2]`}>{release.sha256}</code>
              <button type="button" onClick={copy} className="h-11 shrink-0 cursor-pointer rounded-[10px] border border-white/25 px-4 text-sm font-semibold sm:h-auto">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <details className="mt-3.5 text-sm">
              <summary className="cursor-pointer font-semibold">Check it in a terminal</summary>
              <code className={`${mono} mt-2 block overflow-x-auto whitespace-nowrap rounded-[10px] bg-black/35 px-3 py-2.5`}>Windows: certutil -hashfile {release.filename} SHA256</code>
              <code className={`${mono} mt-2 block overflow-x-auto whitespace-nowrap rounded-[10px] bg-black/35 px-3 py-2.5`}>Mac / Linux: shasum -a 256 {release.filename}</code>
              <code className={`${mono} mt-2 block overflow-x-auto whitespace-nowrap rounded-[10px] bg-black/35 px-3 py-2.5`}>Signer: apksigner verify --print-certs {release.filename}</code>
            </details>

            <label className="relative mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-brand px-[18px] py-2.5 text-sm font-semibold focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-brand-300">
              Or choose the downloaded APK to check it here
              <input type="file" accept=".apk,application/vnd.android.package-archive" className="absolute size-px opacity-0" onChange={(e) => verify(e.target.files?.[0])} />
            </label>
            <p role="status" className={`mt-3 min-h-[22px] text-[15px] font-semibold ${check.kind === 'ok' ? 'text-lime-400' : check.kind === 'bad' ? 'text-red-300' : ''}`}>
              {check.kind === 'busy' ? 'Checking, this takes a few seconds…' : check.kind === 'ok' || check.kind === 'bad' ? check.msg : ''}
            </p>
            <p className="text-[13px] text-white/60">The check runs in your browser. The file never leaves your device.</p>

            <dl className="mt-[22px] grid grid-cols-2 gap-x-5 gap-y-3 border-t border-white/15 pt-5 text-[13px]">
              <Fact k="Package" v={release.packageName} />
              <Fact k="Version" v={`${release.version} (code ${release.versionCode})`} />
              <Fact k="File size" v={`${release.bytes.toLocaleString('en-US')} bytes`} />
              <Fact k="Needs" v={`Android ${release.minAndroid} or later`} />
              <div className="col-span-2">
                <dt className="text-white/60">Signing certificate (SHA-256)</dt>
                <dd className={`${mono} mt-0.5 break-all font-medium`}>{signingCertSha256}</dd>
              </div>
            </dl>
          </div>
        </div>

        <h3 className="mt-14 font-display text-[clamp(34px,4vw,52px)] font-normal italic leading-none">Install in four steps</h3>
        <ol className="mt-5 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-[18px] border border-white/15 p-[22px] text-[15px] text-white/75">
              <span className="mb-2.5 block font-display text-[44px] italic leading-none text-white">{i + 1}</span>
              <b className="mb-1 block text-base font-semibold text-white">{s.t}</b>
              {s.d}
            </li>
          ))}
        </ol>

        <p className="mt-6 max-w-[70ch] text-sm text-white/65">
          This build has not been through an independent malware scan. The fingerprint above shows your file is the one FitLip published, byte for byte. The signing certificate is the key it was signed with. If the fingerprint doesn&apos;t match, delete the file and download again.
        </p>

        <footer className="mt-16 flex flex-wrap justify-between gap-2.5 border-t border-white/15 pt-[22px] text-[13px] text-white/60">
          <span>FitLip {release.version}</span>
          <a href={siteUrl} className="hover:text-white">{siteUrl.replace(/^https?:\/\//, '')}</a>
        </footer>
      </div>
    </section>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-white/60">{k}</dt>
      <dd className="mt-0.5 break-all font-semibold">{v}</dd>
    </div>
  );
}
