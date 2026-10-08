'use client';
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { screens } from '@/lib/release';
const Scene = dynamic(() => import('./phone-scene'), {ssr:false});
class SceneBoundary extends Component<{children: ReactNode; onFailure:()=>void},{failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() {return {failed:true};}
  componentDidCatch() {this.props.onFailure();}
  render(){return this.state.failed ? null : this.props.children;}
}
export function SceneLoader({screen,progress}: {screen:number;progress:React.RefObject<{value:number}>}) {
  const holder = useRef<HTMLDivElement>(null);
  const gyro = useRef({x:0,y:0});
  const [enabled,setEnabled] = useState(false);
  const [ready,setReady] = useState(false);
  const [active,setActive] = useState(true);
  const [motion,setMotion] = useState(false);
  const [motionMessage,setMotionMessage] = useState('');
  const fail = useCallback(() => {setEnabled(false);setReady(false);},[]);
  const sceneReady = useCallback(() => setReady(true),[]);
  useEffect(() => {
    const nav = navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      setEnabled(!!gl && !mq.matches && !nav.connection?.saveData && (nav.deviceMemory ?? 8) >= 4 && navigator.hardwareConcurrency >= 4);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    };
    update();mq.addEventListener('change',update);
    let visible = true;
    const sync = () => setActive(visible && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {visible=entry.isIntersecting;sync();},{rootMargin:'80px'});
    if(holder.current) io.observe(holder.current);
    document.addEventListener('visibilitychange',sync);
    return () => {io.disconnect(); mq.removeEventListener('change',update);document.removeEventListener('visibilitychange',sync);};
  },[]);
  useEffect(() => {
    if(!motion) return;
    const orient = (e:DeviceOrientationEvent) => {gyro.current={x:Math.max(-.2,Math.min(.2,(e.gamma ?? 0)*.006)),y:Math.max(-.1,Math.min(.1,((e.beta ?? 30)-30)*.004))};};
    window.addEventListener('deviceorientation',orient);
    return () => window.removeEventListener('deviceorientation',orient);
  },[motion]);
  async function enableMotion() {
    try {
      const api = DeviceOrientationEvent as unknown as {requestPermission?:()=>Promise<string>};
      if(api.requestPermission && await api.requestPermission() !== 'granted') {setMotionMessage('Motion permission was not granted. Touch controls are still available.');return;}
      setMotion(true);setMotionMessage('Motion enabled');
    } catch {setMotionMessage('Motion is unavailable on this device.');}
  }
  return <div ref={holder} className="scene-holder">
    <div className={`css-device ${enabled && ready ? 'behind-canvas' : ''}`} aria-hidden="true"><div className="css-phone"><img src={screens[screen].src} alt=""/><i/></div></div>
    {enabled && <div className="canvas-layer"><SceneBoundary onFailure={fail}><Scene screen={screen} progress={progress} active={active} onFailure={fail} onReady={sceneReady} gyro={gyro}/></SceneBoundary></div>}
    {enabled && <button className="motion-toggle" onClick={() => motion ? setMotion(false) : void enableMotion()}>{motion ? 'Disable motion tilt' : 'Enable motion tilt'}</button>}
    <span className="sr-only" role="status">{motionMessage}</span>
  </div>;
}
