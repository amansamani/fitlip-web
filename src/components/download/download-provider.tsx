'use client';
import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Download, X, Copy, Check, ShieldCheck, Smartphone, FileCheck2, QrCode, ChevronRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { release } from '@/lib/release';

type Mode = 'install' | 'qr' | 'verify' | null;
const DownloadContext = createContext<{open: (mode: Exclude<Mode,null>) => void; download: () => void}>({open: () => {}, download: () => {}});
export const useDownload = () => useContext(DownloadContext);

export function DownloadProvider({children}: {children: React.ReactNode}) {
  const [mode, setMode] = useState<Mode>(null);
  const [step, setStep] = useState(0);
  const [allowed, setAllowed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [url, setUrl] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = useCallback((next: Exclude<Mode,null>) => {
    opener.current = document.activeElement as HTMLElement;
    setMode(next); setMessage(''); setUrl(`${window.location.origin}/?install=1#download`);
  }, []);
  const close = () => { dialog.current?.close(); setMode(null); opener.current?.focus(); };
  const download = useCallback(() => {
    const a = document.createElement('a');
    a.href = '/api/download'; a.download = release.filename; document.body.appendChild(a); a.click(); a.remove();
    open('install'); setStep(0);
  }, [open]);
  useEffect(() => {
    if (mode) { dialog.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => {document.body.style.overflow = previous;}; }
  }, [mode]);
  useEffect(() => { if (new URLSearchParams(window.location.search).has('install')) open('install'); }, [open]);
  async function copy() {
    try { await navigator.clipboard.writeText(release.sha256); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    catch { setMessage('Copy is unavailable in this browser. Select and copy the checksum below.'); }
  }
  async function verify(file?: File) {
    if (!file) return;
    setMessage('');
    if (file.size !== release.bytes) {setMessage('File size does not match this release. Do not install this file.'); return;}
    if (!crypto.subtle) {setMessage('Verification requires HTTPS or localhost.'); return;}
    setVerifying(true);
    try {
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      const hash = Array.from(new Uint8Array(digest)).map(n => n.toString(16).padStart(2,'0')).join('');
      setMessage(hash === release.sha256 ? 'Match confirmed. Your file is identical to the published Fitlip v2.0.0 APK.' : 'Checksum mismatch. Do not install this file. Download the published release again.');
    } catch { setMessage('Could not verify this file. Try a desktop browser or compare the checksum manually.'); }
    finally { setVerifying(false); }
  }
  return <DownloadContext.Provider value={{open, download}}>{children}
    <dialog ref={dialog} className="download-dialog" aria-labelledby="dialog-title" onCancel={close} onClick={e => {if(e.target === e.currentTarget) close();}}>
      <div className="dialog-inner">
        <div className="dialog-top"><span className="eyebrow"><ShieldCheck size={15}/> FITLIP / ANDROID</span><button className="icon-button" aria-label="Close installation dialog" onClick={close}><X/></button></div>
        <div className="dialog-tabs">{(['install','qr','verify'] as const).map(t => <button key={t} aria-pressed={mode === t} onClick={() => {setMode(t); setMessage('');}}>{t === 'install' ? 'Install guide' : t === 'qr' ? 'Scan to install' : 'Verify file'}</button>)}</div>
        {mode === 'qr' ? <><h2 id="dialog-title">Meet you on mobile.</h2><p>Scan with your Android camera to open this page on your phone.</p><div className="qr-panel">{url && <QRCodeSVG value={url} size={208} level="M" marginSize={4} title="Open the FitLip installation page"/>}</div><p className="small">Android {release.minAndroid}+ · {release.size} · v{release.version}</p><button className="button primary full" onClick={download}><Download size={18}/> Download on this device</button></> : mode === 'verify' ? <><h2 id="dialog-title">Confidence, byte by byte.</h2><p>Compare your downloaded APK with the published release. Your file stays on your device.</p><label className="file-input"><FileCheck2 size={30}/><span>{verifying ? 'Calculating SHA-256…' : 'Choose your downloaded APK'}</span><input type="file" accept=".apk,application/vnd.android.package-archive" disabled={verifying} onChange={e => void verify(e.target.files?.[0])}/></label><p className="small">A matching checksum confirms file integrity. It is not a malware scan.</p></> : <><h2 id="dialog-title">Your next chapter starts here.</h2><p>Three steps. One app. Your daily momentum.</p><div className="steps">{['Download','Allow source','Launch'].map((s,i) => <button key={s} onClick={() => setStep(i)} aria-current={step === i ? 'step' : undefined}><span>{i < step ? <Check size={16}/> : `0${i+1}`}</span>{s}</button>)}</div>
          <div className="step-content">{step === 0 ? <><Download className="step-icon"/><h3>Save the Fitlip APK.</h3><p>Open your browser’s downloads and select <strong>{release.filename}</strong>. If the download hasn’t started, use the button below.</p><button className="button primary" onClick={download}><Download size={18}/> Download APK · {release.size}</button><p className="small">Android only. On iPhone? Open this page on an Android device.</p></> : step === 1 ? <><Smartphone className="step-icon"/><h3>Allow this installation source.</h3><p>When Android prompts you, open Settings and enable “Allow from this source” for the browser you used.</p><div className="android-setting"><span>Allow from this source<small>Example setting · your browser</small></span><button role="switch" aria-checked={allowed} aria-label="Preview Allow from this source setting" className={`toggle ${allowed ? 'on' : ''}`} onClick={() => setAllowed(v => !v)}><span/></button></div><p className="small">This preview does not change your phone settings. Keep Play Protect enabled. If it flags the app, stop and review the warning.</p></> : <><Check className="step-icon"/><h3>Install. Open. Find your rhythm.</h3><p>Return to the downloaded APK, tap Install, then Open. Follow Fitlip’s onboarding to set up your account and goals.</p><p className="small">After installation, turn off “Allow from this source” for your browser again. Settings labels vary by device.</p></>}</div>
          <button className="button outline full" onClick={() => step < 2 ? setStep(step+1) : close()}>{step < 2 ? 'Next step' : 'Got it'}{step < 2 && <ChevronRight size={17}/>}</button></>}
        <div className="checksum"><div><span className="eyebrow">SHA-256 / RELEASE FINGERPRINT</span><button onClick={copy} aria-label="Copy SHA-256 checksum">{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy'}</button></div><code>{release.sha256}</code></div>
        <p role="status" aria-live="polite" className="status-message">{message}</p>
      </div>
    </dialog>
  </DownloadContext.Provider>;
}

export function DownloadButton({className = '', compact = false}: {className?: string; compact?: boolean}) {
  const {download} = useDownload();
  return <button className={`button primary ${className}`} onClick={download}><Download size={18}/>{compact ? 'Get FitLip' : 'Download FitLip APK'}{!compact && <span className="version">v{release.version}</span>}</button>;
}
export function QRButton() { const {open} = useDownload(); return <button className="button quiet" onClick={() => open('qr')}><QrCode size={18}/> Scan to install</button>; }
