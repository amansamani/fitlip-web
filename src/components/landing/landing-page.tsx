'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FitLipMark } from '@/components/brand/fitlip-mark';
import { release, siteUrl } from '@/lib/release';
import { FitLipWordmark } from '@/components/brand/fitlip-wordmark';
import { ScrollStory } from './scroll-story';

type IconName = 'arrow' | 'download' | 'spark' | 'camera' | 'move' | 'leaf' | 'check' | 'qr' | 'plus';
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" /></>,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /></>,
    camera: <><path d="m8 5 1-2h6l1 2h4v15H4V5h4Z" /><circle cx="12" cy="12" r="4" /></>,
    move: <><path d="m3 15 4-7 5 10 5-14 4 8" /></>,
    leaf: <><path d="M20 4C8 2 2 10 6 16s16 2 14-12ZM5 20 16 9" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    qr: <><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6z" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Brand() {
  return <a className="fl-brand brand-authentic" href="#top" aria-label="FitLip home"><FitLipWordmark /></a>;
}

function ReleaseDetails() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const verify = async (file?: File) => {
    if (!file) return;
    if (file.size !== release.bytes) { setMessage('This file’s size does not match the published release. Please download it again.'); return; }
    if (!globalThis.crypto?.subtle) { setMessage('File verification needs HTTPS or localhost.'); return; }
    setBusy(true); setMessage('Checking the file on your device…');
    try {
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
      setMessage(hash === release.sha256 ? 'Match confirmed. Your file is identical to this published release.' : 'The fingerprint does not match. Please download a fresh copy.');
    } catch { setMessage('The file could not be read. Please try again.'); }
    finally { setBusy(false); }
  };
  return <details className="release-details"><summary>Release details & file verification<Icon name="plus" size={18} /></summary><div className="release-details-body"><p>Version {release.version} · {release.size} · Android {release.minAndroid} and later.</p><p>Compare the SHA-256 fingerprint to check that your file matches this release. This is a file integrity check, not a malware scan.</p><code>{release.sha256}</code><div className="verify-actions"><button onClick={async () => { try { await navigator.clipboard.writeText(release.sha256); setMessage('Fingerprint copied.'); } catch { setMessage('Copy unavailable. Select and copy the fingerprint above.'); } }}>Copy fingerprint</button><label className="file-verify">Choose APK to verify<input disabled={busy} type="file" accept=".apk,application/vnd.android.package-archive" onChange={e => void verify(e.target.files?.[0])} /></label></div><p role="status">{message}</p></div></details>;
}

const faqs = [
  ['Is FitLip available for my phone?', `This release is for Android ${release.minAndroid} and later. Download the APK directly from this page. An iPhone version is not included in this release.`],
  ['How do I install the app?', 'Download the APK, open the file, and follow Android’s installation prompts. If asked, allow your browser to install apps. After installation, you can turn that browser permission off again.'],
  ['What can I do with FitLip Coach?', 'Ask about your logged meals and activity, including a calorie chart for the past seven days. The coach brings your FitLip records into the conversation.'],
  ['Are these the actual app screens?', 'Yes. Every phone preview on this page uses a real FitLip screenshot. The activity and nutrition values shown are sample records, not promised results.'],
];

export function LandingPage() {
  const [menu, setMenu] = useState(false);
  const qr = useRef<HTMLDialogElement>(null);
  const qrTrigger = useRef<HTMLButtonElement | null>(null);
  const openQr = (event: React.MouseEvent<HTMLButtonElement>) => { qrTrigger.current = event.currentTarget; qr.current?.showModal(); };
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);
  return <div className="fitlip-site" id="top">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="fl-header"><div className="wrap nav-inner"><Brand /><nav id="main-navigation" className={menu ? 'fl-nav is-open' : 'fl-nav'} aria-label="Main navigation"><a href="#experience" onClick={() => setMenu(false)}>The story</a><a href="#everyday" onClick={() => setMenu(false)}>Made for your day</a><a href="#questions" onClick={() => setMenu(false)}>Good to know</a></nav><a className="nav-download" href="#download">Get FitLip</a><button className="menu-button" aria-controls="main-navigation" aria-expanded={menu} aria-label={menu ? 'Close navigation' : 'Open navigation'} onClick={() => setMenu(!menu)}><span /><span /></button></div></header>
    <main id="main">
      <ScrollStory />
      <section className="everyday-section wrap" id="everyday"><div className="everyday-heading"><div><span className="eyebrow">LESS FRICTION. MORE LIVING.</span><h2>A good fit for<br /><em>your kind of day.</em></h2></div><p>No perfect routines required.<br />Just useful tools for showing up<br className="desktop-break" /> a little more often.</p></div><div className="everyday-grid">
        <article className="daily-card capture-card"><div className="card-top"><span>01 / KEEP IT SIMPLE</span><Icon name="camera" /></div><h3>Your next meal.<br />Just a snap away.</h3><p>Capture your plate, review the details,<br />and add it to your day.</p><div className="capture-preview"><div className="capture-window"><img src="/screens/camera.webp" alt="FitLip meal photo capture interface" width={810} height={1755} loading="lazy" /></div><span className="capture-badge"><Icon name="camera" size={16} /> SNAP. REVIEW. LOG.</span></div></article>
        <article className="daily-card movement-card"><div className="card-top"><span>02 / MAKE ROOM TO MOVE</span><Icon name="move" /></div><h3>A change of pace.<br />A clearer head.</h3><p>Runs, walks, and rides.<br />There’s more than one way forward.</p><div className="route-art" aria-hidden="true"><svg viewBox="0 0 440 260"><g stroke="#d4d8ba" strokeWidth="1" fill="none"><path d="M-20 40 460 210M-20 85 440 250M-20 145 320 270M40-10 480 140M80-10-30 260M170-10 50 280M260-10 140 280M350-10 230 280M450-10 330 280" /></g><path d="M102 203C110 169 151 199 177 162S139 130 173 101s81 6 97-19 52-15 65 12" fill="none" stroke="#eef2d8" strokeWidth="17" /><path d="M102 203C110 169 151 199 177 162S139 130 173 101s81 6 97-19 52-15 65 12" fill="none" stroke="#586635" strokeWidth="5" strokeLinecap="round" /><circle cx="102" cy="203" r="8" fill="#586635" stroke="#fff" strokeWidth="4" /><circle cx="335" cy="94" r="9" fill="#586635" stroke="#fff" strokeWidth="4" /></svg><span className="route-pill"><span /> FIND YOUR OWN PACE</span></div></article>
        <article className="daily-card clarity-card"><div className="card-top"><span>03 / CONNECT THE DOTS</span></div><h3>Less wondering.<br />More understanding.</h3><p>Your daily habits, brought into view.<br />One conversation at a time.</p><div className="coach-illustration"><span className="coach-symbol"><FitLipMark size={48} color="#693e86" /></span><div className="chat-prompt">Show my calorie chart<br />for the last 7 days.</div><div className="chart-preview" aria-label="Illustrative activity chart">{[30, 54, 78, 48, 36, 60, 92].map((height, i) => <div key={i}><i style={{ '--bar': `${height}%` } as CSSProperties} /><span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span></div>)}</div><small>ILLUSTRATION · YOUR RECORDS TELL YOUR STORY</small></div></article>
      </div></section>
      <section className="download-block" id="download"><div className="wrap download-layout"><div className="download-copy"><span className="eyebrow">YOUR NEXT CHAPTER STARTS SMALL</span><h2>Here’s to your<br /><em>next little step.</em></h2><p>A little more intention. A little more movement.<br />A little more you.</p><div className="download-actions"><a className="button button-cream" href="/api/download"><Icon name="download" /> Download for Android</a><button className="qr-button" onClick={openQr}><Icon name="qr" /> Scan to download</button></div><div className="release-meta">Version {release.version}<span />{release.size}<span />Android {release.minAndroid}+</div></div><div className="download-art" aria-hidden="true"><div className="download-icon"><FitLipMark size={112} color="#f9f4e9" /></div><span className="download-art-label">YOUR EVERYDAY, TOGETHER.</span></div></div></section>
      <section className="questions-section wrap" id="questions"><div><span className="eyebrow">GOOD TO KNOW</span><h2>A little<br /><em>more clarity.</em></h2><p>Your first step, made simpler.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus" size={18} /></summary><p>{answer}</p></details>)}<ReleaseDetails /></div></section>
    </main>
    <footer className="fl-footer wrap"><div><Brand /><p>Your nutrition, training, and AI coach. Together.</p></div><span>© {new Date().getFullYear()} FitLip</span><a href="#top">Back to top</a></footer>
    <dialog ref={qr} className="qr-dialog" aria-labelledby="qr-title" onClick={event => { if (event.target === event.currentTarget) qr.current?.close(); }} onClose={() => qrTrigger.current?.focus()}><button className="dialog-close" aria-label="Close QR code" onClick={() => qr.current?.close()}>×</button><span className="eyebrow">TAKE THE NEXT STEP</span><h2 id="qr-title">Meet you on<br /><em>your phone.</em></h2><div className="qr-code"><QRCodeSVG value={`${siteUrl}/api/download`} size={184} fgColor="#382144" bgColor="#ffffff" level="M" /></div><p>Scan with your Android camera<br />to download FitLip {release.version}.</p><span className="qr-requirements">Android {release.minAndroid}+ · {release.size}</span></dialog>
  </div>;
}
