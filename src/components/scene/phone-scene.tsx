'use client';
import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, useTexture, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { screens } from '@/lib/release';

type Props = { screen: number; progress: React.RefObject<{value: number}>; active: boolean; onFailure: () => void; onReady: () => void; gyro: React.RefObject<{x:number;y:number}> };

function Device({ screen, progress, gyro, onReady }: Pick<Props,'screen'|'progress'|'gyro'|'onReady'>) {
  const group = useRef<THREE.Group>(null);
  const front = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const back = useRef<THREE.Mesh>(null);
  const textures = useTexture(screens.map(s => s.src));
  useEffect(() => {onReady();},[onReady]);
  textures.forEach(t => { t.colorSpace = THREE.SRGBColorSpace; });
  useFrame(({pointer,clock}, delta) => {
    const p = progress.current.value;
    const d = Math.min(delta, 0.05);
    if(group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.25 + pointer.x * .16 + gyro.current.x - p * .7, 4, d);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, .035 - pointer.y * .07 + gyro.current.y, 4, d);
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -.07 + p * .13, 4, d);
      group.current.position.y = Math.sin(clock.elapsedTime * .65) * .055;
    }
    if(front.current) { front.current.position.z = .15 + p * 1.35; front.current.position.x = -p*.55; }
    if(core.current) { core.current.position.z = -p*.12; core.current.rotation.z = p*.16; }
    if(back.current) { back.current.position.z = -.12 - p*.8; back.current.position.x = p*.45; }
  });
  return <group ref={group} rotation={[.035,-.25,-.07]} scale={.88}>
    <RoundedBox ref={back} args={[2.25,4.78,.17]} radius={.21} smoothness={4} position={[0,0,-.12]}><meshStandardMaterial color="#11151b" metalness={.94} roughness={.24}/></RoundedBox>
    <group ref={core}>
      <RoundedBox args={[2.08,4.56,.08]} radius={.15} smoothness={3}><meshStandardMaterial color="#0b1710" metalness={.7} roughness={.4}/></RoundedBox>
      <RoundedBox args={[.95,1.05,.12]} radius={.07} smoothness={2} position={[0,.42,.06]}><meshStandardMaterial color="#a0ff75" emissive="#59ff54" emissiveIntensity={2.1} toneMapped={false}/></RoundedBox>
      {[0,1,2,3,4,5].map(i => <mesh key={i} position={[0,-1.2+i*.16,.09]}><boxGeometry args={[1.6,.025,.01]}/><meshStandardMaterial color="#8db574" emissive="#345d25"/></mesh>)}
    </group>
    <group ref={front} position={[0,0,.15]}>
      <RoundedBox args={[2.25,4.78,.14]} radius={.21} smoothness={5}><meshStandardMaterial color="#839085" metalness={1} roughness={.22}/></RoundedBox>
      <RoundedBox args={[2.17,4.7,.11]} radius={.2} smoothness={4} position={[0,0,.08]}><meshStandardMaterial color="#050605" metalness={.3} roughness={.3}/></RoundedBox>
      <mesh position={[0,0,.144]}><planeGeometry args={[2.035,4.41]}/><meshBasicMaterial map={textures[screen]} toneMapped={false}/></mesh>
      <RoundedBox args={[.5,.075,.018]} radius={.035} smoothness={3} position={[0,2.275,.15]}><meshBasicMaterial color="#020302"/></RoundedBox>
      <mesh position={[.44,2.275,.15]}><circleGeometry args={[.025,16]}/><meshStandardMaterial color="#213337" metalness={.8} roughness={.1}/></mesh>
    </group>
    <RoundedBox args={[.045,.5,.09]} radius={.02} smoothness={2} position={[1.13,.6,0]}><meshStandardMaterial color="#929b93" metalness={1} roughness={.2}/></RoundedBox>
    <RoundedBox args={[.045,.7,.09]} radius={.02} smoothness={2} position={[-1.13,.9,0]}><meshStandardMaterial color="#929b93" metalness={1} roughness={.2}/></RoundedBox>
  </group>;
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const previous = useRef(new THREE.Vector2());
  const speed = useRef(0);
  const positions = useMemo(() => { const a = new Float32Array(150*3); for(let i=0;i<a.length;i++) a[i] = Math.sin(i*127.1+31.7)*8; return a; },[]);
  useFrame(({pointer}, delta) => {
    speed.current = THREE.MathUtils.damp(speed.current, pointer.distanceTo(previous.current),3,Math.min(delta,.05)); previous.current.copy(pointer);
    if(points.current) {points.current.rotation.y += Math.min(delta,.05)*(.015+speed.current*.5);points.current.rotation.x = pointer.y*.025;}
  });
  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial size={.025} color="#caff9b" transparent opacity={.5} sizeAttenuation depthWrite={false}/></points>;
}
function ContextWatcher({onFailure}: {onFailure: () => void}) {
  const {gl} = useThree();
  useEffect(() => { const canvas = gl.domElement; const lost = (event: Event) => {event.preventDefault(); onFailure();}; canvas.addEventListener('webglcontextlost',lost); return () => canvas.removeEventListener('webglcontextlost',lost); },[gl,onFailure]);
  return null;
}
export default function PhoneScene({screen,progress,active,onFailure,onReady,gyro}: Props) {
  const [quality,setQuality] = useState(true);
  const [dpr,setDpr] = useState(Math.min(window.devicePixelRatio, 1.75));
  return <Canvas camera={{position:[0,0,9.2],fov:36}} dpr={dpr} frameloop={active ? 'always' : 'never'} gl={{alpha:true,antialias:true,powerPreference:'high-performance'}} onCreated={({gl}) => {gl.setClearColor('#07080a',0);}}>
    <ContextWatcher onFailure={onFailure}/>
    <PerformanceMonitor onDecline={() => {setDpr(1);setQuality(false);}}/>
    <ambientLight intensity={1.2}/><directionalLight position={[3,5,6]} intensity={4.5} color="#eaffde"/><directionalLight position={[-4,1,3]} intensity={3} color="#c6c7f0"/><pointLight position={[0,-3,3]} intensity={18} color="#aaff00"/>
    <Suspense fallback={null}><Device screen={screen} progress={progress} gyro={gyro} onReady={onReady}/></Suspense>
    <Particles/>
    {quality && <EffectComposer multisampling={0}><Bloom intensity={.38} luminanceThreshold={1.4} mipmapBlur/></EffectComposer>}
  </Canvas>;
}
