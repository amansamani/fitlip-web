'use client';

import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { STORY, storyPosition, chapterVisibility } from '@/lib/story';

import { SplashElements } from './splash-elements';

const StoryCanvas = dynamic(() => import('./story-canvas'), { ssr: false });
class SceneBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function StoryCopy({ index, progress, active, onStart }: {index:number;progress:MotionValue<number>;active:number;onStart:()=>void}) {
  const chapter = STORY[index];
  const opacity = useTransform(progress, p => chapterVisibility(index,p));
  const y = useTransform(opacity, value => (1-value)*24);
  const Heading = index === 0 ? 'h1' : 'h2';
  return <motion.article className={`story-copy copy-${chapter.side} ${index===0?'story-opening':''}`} style={{opacity,y}} aria-hidden={active !== index} inert={active !== index}>
    <span className="story-eyebrow"><i/>{chapter.time}</span>
    <Heading>{chapter.title}<br/><em>{chapter.emphasis}</em></Heading>
    <p>{chapter.body}</p>
    {index === 0 ? <div className="story-start-actions"><button className="button button-purple" onClick={onStart}>Step inside FitLip</button><a href="#download">Get the Android app</a></div> : index === STORY.length-1 ? <a className="button button-purple story-last-cta" href="#download">Start your own story</a> : <span className="story-detail">{chapter.detail}</span>}
    {index===0 && <span className="story-intro-note">A scroll through your everyday. No perfect routines required.</span>}
  </motion.article>;
}

export function ScrollStory() {
  const target = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [simple, setSimple] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState(0);
  const [canRender, setCanRender] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const { scrollYProgress } = useScroll({target,offset:['start start','end end']});
  // One shared spring keeps copy, screens, and geometry on the same timeline.
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: .45, restDelta: .00005, restSpeed: .00005 });
  const background = useTransform(progress, STORY.map((_,i)=>i/(STORY.length-1)), STORY.map(s=>s.background));
  const fallbackRotate = useTransform(progress,[0,.3,.6,1],[-8,6,-6,3]);
  const showSimple = simple || !!reduced || compact;
  useEffect(() => {
    const media = window.matchMedia('(max-height: 620px)');
    const update = () => setCompact(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useMotionValueEvent(progress,'change',value => setActive(storyPosition(value).active));
  const failed = useCallback(() => {setCanRender(false);setReady(false);},[]);
  const sceneReady = useCallback(() => setReady(true),[]);
  useEffect(() => {
    if (showSimple) {setCanRender(false);return;}
    const nav = navigator as Navigator & {connection?:{saveData?:boolean};deviceMemory?:number};
    if (nav.connection?.saveData || (nav.deviceMemory ?? 8)<4) return;
    try {
      const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');
      setCanRender(!!gl);gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {setCanRender(false);}
  },[showSimple]);
  useEffect(() => {
    let inView=true;
    const sync=()=>setVisible(inView&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{rootMargin:'100px'});
    if(target.current)observer.observe(target.current);
    document.addEventListener('visibilitychange',sync);
    return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);};
  },[]);
  function go(index:number) {
    if (!target.current) return;
    const section=target.current;
    const top=section.getBoundingClientRect().top+window.scrollY;
    window.scrollTo({top:top+(index/(STORY.length-1))*(section.offsetHeight-window.innerHeight),behavior:'instant'});
  }
  const chapter = STORY[active];
  return <section id="experience" className={`scroll-story ${showSimple?'story-static':''}`} ref={target} aria-label="A day with FitLip: interactive app tour">
    {showSimple ? <div className="static-story wrap"><div className="static-story-heading"><span className="eyebrow">YOUR DAY WITH FITLIP</span><p>The complete app tour, at your own pace.</p>{!reduced&&!compact&&<button onClick={()=>{setSimple(false);window.scrollTo({top:0,behavior:'instant'});}}>Return to the 3D story</button>}</div>{STORY.map((step,i)=><article key={step.id} className="static-story-chapter" id={`story-${step.id}`}><div><span className="story-eyebrow">{step.time}</span>{i===0?<h1>{step.title}<br/><em>{step.emphasis}</em></h1>:<h2>{step.title}<br/><em>{step.emphasis}</em></h2>}<p>{step.body}</p><span className="story-detail">{step.detail}</span></div><img src={step.src} alt={step.alt} width={810} height={1755} loading={i===0?'eager':'lazy'}/></article>)}</div> : <motion.div className="story-stage" style={{backgroundColor:background}} data-chapter={active}>
      <div className="story-topbar"><span><i/> A DAY WITH FITLIP</span><div><button onClick={()=>{setSimple(true);window.scrollTo({top:0,behavior:'instant'});}}>Read the tour</button><a href="#everyday">Skip tour</a></div></div>
      <div className={`story-fallback fallback-${chapter.side} ${ready&&canRender?'canvas-ready':''}`} aria-hidden="true"><motion.div style={{rotate:fallbackRotate}}><img src={chapter.src} alt="" width={810} height={1755} loading="eager"/></motion.div></div>
      <div className="story-canvas" aria-hidden="true">{canRender&&<SceneBoundary onFailure={failed}><StoryCanvas progress={progress} active={visible} onReady={sceneReady} onFailure={failed}/></SceneBoundary>}</div>
      <SplashElements progress={progress}/>
      <div className="story-copy-layer">{STORY.map((step,index)=><StoryCopy key={step.id} index={index} progress={progress} active={active} onStart={()=>go(1)}/>)}</div>
      <div className={`story-scene-label label-${chapter.side}`} aria-hidden="true"><div><small>ACTUAL FITLIP SCREEN · SAMPLE ACTIVITY</small></div></div>
      <div className="story-dock"><div className="story-scroll-hint">Scroll to explore</div><nav aria-label="App tour chapters">{STORY.map((step,index)=><button key={step.id} onClick={()=>go(index)} aria-label={`Chapter ${index+1}: ${step.label}`} aria-current={active===index?'step':undefined}><span>{String(index+1).padStart(2,'0')}</span><strong>{step.label}</strong><i/></button>)}</nav><span className="story-page-count">{String(active+1).padStart(2,'0')} <span>/ 08</span></span></div>
      <motion.div className="story-progress" style={{scaleX:progress}}/>
    </motion.div>}
  </section>;
}

