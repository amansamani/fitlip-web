'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, BrainCircuit, Camera, Check, ChevronDown, Dumbbell, Fingerprint, Flame, Menu, ShieldCheck, Sparkles, Users, X, Zap } from 'lucide-react';
import { DownloadProvider, DownloadButton, QRButton, useDownload } from './download/download-provider';
import { SceneLoader } from './scene/scene-loader';
import { useScrollScene } from '@/hooks/use-scroll-scene';
import { release, screens } from '@/lib/release';

function Wordmark(){return <a href="#" className="wordmark" aria-label="FitLip home"><span className="brand-symbol">f<span>l</span></span>fitlip</a>;}
const capabilities = [
  {icon:BrainCircuit,name:'AI coaching',text:'A clearer view of your own records.'},
  {icon:Camera,name:'Meal capture',text:'Photo. Review. Log. Keep moving.'},
  {icon:Dumbbell,name:'Personal training',text:'A plan that fits your setup.'},
  {icon:Activity,name:'Daily tracking',text:'Bring your movement into focus.'},
];
const faqs = [
  ['What devices does FitLip support?', `This release supports Android ${release.minAndroid} and later. The APK includes ARM and x86 architectures. FitLip is not available for iPhone through this download.`],
  ['Why am I downloading an APK?', 'This is a direct Android release from FitLip. Your browser saves the installer, and Android asks you to allow installation from that browser. Our installation guide walks through each step.'],
  ['How can I check the file?', 'Use Verify your download below to calculate the SHA-256 hash on your device. A matching hash confirms that your copy matches this published release. We do not currently claim an independent malware scan.'],
  ['Does activity tracking sync automatically?', 'Sync availability depends on your device, permissions, and supported health integrations. FitLip also provides manual entry when automatic sync is unavailable.'],
  ['What happens after I install?', 'Open FitLip, follow the app’s account and goal setup, and explore your nutrition, workout, activity, and coaching screens. You can then revoke your browser’s permission to install unknown apps.'],
];

function Experience() {
  const [screen,setScreen] = useState(0);
  const [sticky,setSticky] = useState(false);
  const [menu,setMenu] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const {section,progress} = useScrollScene();
  const {open} = useDownload();
  const reduced = useReducedMotion();
  useEffect(() => { const io=new IntersectionObserver(([e])=>setSticky(!e.isIntersecting),{threshold:0});if(hero.current)io.observe(hero.current);return()=>io.disconnect(); },[]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="nav-shell"><Wordmark/><nav aria-label="Main navigation" className={menu ? 'nav-links mobile-open' : 'nav-links'}><a href="#experience" onClick={()=>setMenu(false)}>The experience</a><a href="#inside" onClick={()=>setMenu(false)}>Built around you</a><a href="#download" onClick={()=>setMenu(false)}>Get the app</a></nav><div className="nav-actions"><span className="android-tag">MADE FOR ANDROID</span><DownloadButton compact/><button className="menu-toggle icon-button" aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></div></header>
    <main id="main">
      <div className="hero-scroll" ref={section}>
        <div className="hero-sticky">
          <section ref={hero} className="hero section-width" aria-labelledby="hero-title">
            <div className="hero-copy">
              <motion.div initial={reduced ? false : {opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
                <div className="release-tag"><span/> YOUR NEXT LEVEL. NOW AVAILABLE.<span className="tag-version">V{release.version}</span></div>
                <h1 id="hero-title">Build your<br/><span>better.</span></h1>
                <p className="hero-description">Your meals. Your movement. Your momentum.<br/>One intelligent app that brings it all together.</p>
                <div className="hero-buttons"><DownloadButton/><QRButton/></div>
                <p className="download-meta"><ShieldCheck size={14}/> Direct Android download <span>·</span> {release.size} <span>·</span> Android {release.minAndroid}+</p>
                <div className="hero-proof"><span className="proof-icon"><Fingerprint size={22}/></span><div><strong>Your progress is personal.</strong><span>Your fitness app should be, too.</span></div></div>
              </motion.div>
            </div>
            <div className="hero-visual">
              <div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="orbit-label">MEALS · MOVEMENT · MOMENTUM</span>
              <div className="visual-coordinate">FL / 02.00<br/>PERSONAL PERFORMANCE</div>
              <SceneLoader screen={screen} progress={progress}/>
              <div className="float-metric metric-one"><span className="metric-icon"><Flame size={18}/></span><div><span>DAILY MOMENTUM</span><strong>Every move counts.</strong></div><span className="metric-spark">✦</span></div>
              <div className="float-metric metric-two"><span className="metric-icon"><Sparkles size={18}/></span><div><span>MEET FITLIP COACH</span><strong>Your records. In focus.</strong></div></div>
              <div className="screen-control"><span className="eyebrow">EXPLORE THE APP</span><div role="group" aria-label="Choose app screen">{screens.map((s,i)=><button key={s.id} className={screen===i?'selected':''} aria-pressed={screen===i} onClick={()=>setScreen(i)}>{s.label}</button>)}</div><span className="screen-caption">Actual app screens · drag your cursor to explore</span></div>
            </div>
            <div className="hero-bottom"><a href="#experience"><span className="scroll-line"/> SCROLL TO DISCOVER</a><span>LESS FRICTION. MORE FORWARD.</span><span>01 — 05</span></div>
          </section>
          <div className="exploded-overlay" aria-hidden="true"><span className="module-badge module-one"><BrainCircuit size={20}/><span>01 / INTELLIGENCE<strong>Your AI coach</strong></span></span><span className="module-badge module-two"><Activity size={20}/><span>02 / AWARENESS<strong>Your daily signals</strong></span></span><span className="module-badge module-three"><Flame size={20}/><span>03 / CONSISTENCY<strong>Your nutrition, tracked</strong></span></span></div>
        </div>
      </div>
      <section className="capability-strip" aria-label="FitLip features"><div className="section-width">{capabilities.map(({icon:Icon,name,text})=><div key={name}><Icon size={22}/><span><strong>{name}</strong><small>{text}</small></span></div>)}</div></section>
      <section className="experience-section section-width" id="experience">
        <div className="section-heading"><div><span className="eyebrow lime">01 / ONE CONNECTED ROUTINE</span><h2>Everything you do.<br/><span>Finally, together.</span></h2></div><p>From the first meal to the last rep, see the habits that make you, you. Less switching apps. More showing up.</p></div>
        <div className="feature-grid">
          <article className="feature-card nutrition-card"><div className="feature-content"><span className="feature-number">01 — FUEL</span><h3>Eat with<br/>intention.</h3><p>Find your calorie budget. Understand your macros. Keep your meals in view.</p><button className="text-button" onClick={()=>{setScreen(2);document.getElementById('inside')?.scrollIntoView({behavior:reduced?'instant':'smooth'});}}>Explore nutrition</button></div><div className="nutrition-visual"><div className="macro-ring"><span>1,628<small>KCAL LOGGED</small></span></div><div className="macro-values"><span><i/>Protein<strong>183g</strong></span><span><i/>Carbs<strong>112g</strong></span><span><i/>Fat<strong>41g</strong></span></div><span className="data-caption">Sample activity from the app</span></div></article>
          <article className="feature-card train-card"><div className="feature-content"><span className="feature-number">02 — MOVE</span><h3>Make your<br/>next move.</h3><p>Training plans for your setup. Activity tracking for everything in between.</p></div><div className="workout-preview"><div><Dumbbell/><span>THIS WEEK’S PLAN</span><span>6 DAYS</span></div>{['Full Body Fat Burn','Core & Cardio','Lower Body'].map((s,i)=><div className="workout-row" key={s}><span>0{i+1}</span><strong>{s}</strong><span>6 exercises</span></div>)}</div></article>
          <article className="feature-card coach-card"><div className="feature-content"><span className="feature-number">03 — UNDERSTAND</span><h3>A little clarity.<br/>A lot of momentum.</h3><p>Ask FitLip Coach about your logged meals, movement, and progress.</p></div><div className="chat-preview"><span className="chat-avatar"><Sparkles size={18}/></span><div className="chat-question">Show my calorie chart for the last 7 days.</div><div className="chat-answer"><span><Sparkles size={14}/> FROM YOUR FITLIP RECORDS</span><div className="mini-chart">{[3,45,74,45,3,3,98].map((v,i)=><i key={i} style={{height:`${v}%`}}/>)}</div><small>A clearer picture of your week.</small></div></div></article>
        </div>
      </section>
      <section className="inside-section" id="inside"><div className="section-width inside-grid"><div className="inside-copy"><span className="eyebrow lime">02 / THIS IS YOUR FITLIP</span><h2>Real life.<br/>Real progress.<br/><span>Your rhythm.</span></h2><p>A home for every part of your routine. Take a look inside the app you’ll actually use.</p><div className="screen-list" role="group" aria-label="Browse FitLip app screenshots">{screens.map((s,i)=><button key={s.id} aria-pressed={screen===i} className={screen===i?'active':''} onClick={()=>setScreen(i)}><span>0{i+1}</span>{s.label}<span>{screen===i?'●':'+'}</span></button>)}</div></div><div className="app-gallery"><div className="gallery-glow"/><div className="gallery-phone"><img src={screens[screen].src} alt={screens[screen].alt} width="540" height="1170" loading="lazy"/></div><div className="gallery-label"><span className="live-dot"/> ACTUAL FITLIP APP / {screens[screen].label.toUpperCase()}</div></div><div className="side-note"><span>PERSONAL BY DESIGN.</span><span>POWERED BY YOUR CONSISTENCY.</span></div></div></section>
      <section className="community section-width"><div className="community-icon"><Users size={36}/></div><div><span className="eyebrow lime">BETTER WITH COMPANY</span><h2>Your people.<br/>Your extra push.</h2><p>Invite friends. Set a challenge. Build your Dumbbell rank through real fitness actions.</p></div><div className="community-steps"><span><i>01</i> Invite your circle</span><span><i>02</i> Accept the challenge</span><span><i>03</i> Show up together</span></div></section>
      <section id="download" className="download-section"><div className="section-width"><div className="download-heading"><span className="eyebrow lime">03 / YOUR NEXT CHAPTER</span><h2>Ready when<br/><span>you are.</span></h2><p>Your goals don’t need another Monday.<br/>They need a first step.</p><div className="final-buttons"><DownloadButton/><QRButton/></div><span className="download-meta">v{release.version} · {release.size} · Android {release.minAndroid}+</span></div><div className="trust-panel"><div className="trust-top"><ShieldCheck size={27}/><span>Know what you’re installing.</span></div><div className="trust-item"><Check/><div><strong>Release integrity verified</strong><p>Published SHA-256 fingerprint calculated directly from this APK.</p></div></div><div className="trust-item"><Fingerprint/><div><strong>Check your own copy</strong><p>Verify your downloaded file locally. Nothing is uploaded.</p></div></div><div className="trust-item"><ShieldCheck/><div><strong>A transparent installation</strong><p>Android signature verified. Independent malware scan status: not verified.</p></div></div><div className="trust-actions"><button onClick={()=>open('verify')}>Verify your download</button><button onClick={()=>open('install')}>Installation guide</button></div><code>{release.sha256.slice(0,24)}…{release.sha256.slice(-8)}</code></div></div></section>
      <section className="faq-section section-width"><div><span className="eyebrow lime">A LITTLE MORE CLARITY</span><h2>Good questions.<br/>Straight answers.</h2></div><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={18}/></summary><p>{a}</p></details>)}</div></section>
    </main>
    <footer className="site-footer section-width"><Wordmark/><span>MEALS. MOVEMENT. MOMENTUM.</span><span>© {new Date().getFullYear()} FitLip</span><button onClick={()=>open('install')}>Installation help</button></footer>
    <div className={`sticky-download ${sticky?'is-visible':''}`} inert={!sticky}><div className="island-brand"><Zap size={18}/><strong>Make your next move.</strong><span>v{release.version}</span></div><DownloadButton compact/></div>
  </>;
}
export function FitlipExperience(){return <DownloadProvider><Experience/></DownloadProvider>;}
