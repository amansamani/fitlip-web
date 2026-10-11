'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { STORY, SHOTS, storyPosition } from '@/lib/story';

type Props = { progress: MotionValue<number>; active: boolean; onReady: () => void; onFailure: () => void };

function screenMask() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 555;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 256, 555);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(0, 0, 256, 555, 23); ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

function Phone({ progress, onReady, active }: Pick<Props, 'progress' | 'onReady' | 'active'>) {
  const group = useRef<THREE.Group>(null);
  const surfaces = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const worlds = useRef<(THREE.Group | null)[]>([]);
  const textures = useTexture(STORY.map(s => s.src));
  const mask = useMemo(screenMask, []);
  const ready = useRef(false);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    if (!active) return;
    invalidate();
    return progress.on('change', () => invalidate());
  }, [active, progress, invalidate]);
  useEffect(() => {
    textures.forEach(texture => { texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; });
    return () => mask.dispose();
  }, [textures, mask]);

  useFrame((state) => {
    if (!group.current) return;
    const position = progress.get();
    const { from, to, mix } = storyPosition(position);
    const a = SHOTS[from], b = SHOTS[to];
    const lerp = THREE.MathUtils.lerp;
    const mobile = state.size.width <= 800;
    const worldWidth = state.viewport.width;
    const arc = Math.sin(mix * Math.PI);
    const g = group.current;
    const fit = mobile ? Math.min(state.viewport.height * (state.size.height < 600 ? .112 : .132), worldWidth * .28) : Math.min(state.viewport.height * .23, 1.65);
    g.position.set(mobile ? 0 : lerp(a.x, b.x, mix) * worldWidth * .235, mobile ? state.viewport.height * .17 : lerp(a.y,b.y,mix) - arc * .22, lerp(a.z,b.z,mix) - arc * .55);
    g.rotation.set(lerp(a.pitch,b.pitch,mix) + arc * .12, lerp(a.yaw,b.yaw,mix) + arc * .4, lerp(a.roll,b.roll,mix) - arc * .13);
    g.scale.setScalar(fit * lerp(a.scale,b.scale,mix));
    surfaces.current.forEach((material, index) => {
      if (material) material.opacity = index === from ? 1 - mix : index === to ? mix : 0;
    });
    worlds.current.forEach((world, index) => {
      if (!world) return;
      const weight = index === from ? 1-mix : index === to ? mix : 0;
      world.visible = weight > .005;
      world.scale.setScalar(Math.max(.001, weight));
      world.rotation.y = position * .18;
    });
    if (!ready.current) { ready.current = true; onReady(); }
  });

  return <group ref={group}>
    <RoundedBox args={[1.36, 2.85, .15]} radius={.17} smoothness={5}><meshStandardMaterial color="#9a8caa" metalness={.9} roughness={.24} /></RoundedBox>
    <RoundedBox args={[1.305, 2.79, .12]} radius={.155} smoothness={5} position={[0,0,.072]}><meshStandardMaterial color="#221c27" metalness={.2} roughness={.3} /></RoundedBox>
    {textures.map((texture, index) => <mesh key={index} position={[0,0,.138 + index * .0001]} renderOrder={index+1}><planeGeometry args={[1.225,2.65]} /><meshBasicMaterial ref={el => { surfaces.current[index] = el; }} map={texture} alphaMap={mask} transparent depthWrite={false} toneMapped={false} opacity={index === 0 ? 1 : 0} /></mesh>)}
    <RoundedBox args={[.22,.022,.012]} radius={.01} smoothness={2} position={[0,1.369,.14]}><meshBasicMaterial color="#100c15" /></RoundedBox>
    <RoundedBox args={[.025,.27,.075]} radius={.01} smoothness={2} position={[.689,.43,.015]}><meshStandardMaterial color="#b5a7c3" metalness={.9} roughness={.2} /></RoundedBox>
    <RoundedBox args={[.025,.39,.075]} radius={.01} smoothness={2} position={[-.689,.59,.015]}><meshStandardMaterial color="#b5a7c3" metalness={.9} roughness={.2} /></RoundedBox>
    {STORY.map((_,index) => <group key={index} ref={el => { worlds.current[index] = el; }}><World chapter={index} /></group>)}
  </group>;
}

function Ring({ radius=1.5, color='#b59cc8', tube=.018 }: {radius?:number;color?:string;tube?:number}) {
  return <mesh><torusGeometry args={[radius,tube,12,100]} /><meshStandardMaterial color={color} metalness={.5} roughness={.28} /></mesh>;
}

function World({ chapter }: {chapter:number}) {
  const route = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.3,-1.1,.3),new THREE.Vector3(-1.25,-.2,-.5),new THREE.Vector3(-.3,.3,-.6),new THREE.Vector3(.8,.7,-.5),new THREE.Vector3(1.4,1.2,.1),new THREE.Vector3(.65,1.65,.2),
  ]), []);
  if (chapter === 0 || chapter === 1) return null;
  if (chapter === 2) return <group position={[.95,-.7,-.2]} rotation={[.8,-.3,.2]}><mesh><cylinderGeometry args={[.68,.61,.09,64]}/><meshStandardMaterial color="#fcf7ea" roughness={.36}/></mesh><group rotation={[Math.PI/2,0,0]}><Ring radius={.57} color="#d2b795" tube={.026}/></group>{[[.14,.1,.15],[-.22,.13,-.12],[.22,.12,-.15],[-.14,.1,.25]].map((p,i)=><mesh key={i} position={p as [number,number,number]} scale={[1,.65,1]}><sphereGeometry args={[.17,20,16]}/><meshStandardMaterial color={['#759564','#a5b879','#c88562','#658754'][i]} roughness={.5}/></mesh>)}</group>;
  if (chapter === 3) return <group position={[-.97,-.6,.12]} rotation={[.12,.3,-.14]}>{[.78,.62,.46].map((radius,i)=><group key={radius} position={[0,0,-i*.11]}><mesh><torusGeometry args={[radius,.065,12,70,Math.PI*(1.5-i*.3)]}/><meshStandardMaterial color={['#b5bf8c','#8870a3','#d9b474'][i]} roughness={.32} metalness={.25}/></mesh></group>)}</group>;
  if (chapter === 4) return <group position={[.87,-.9,.1]} rotation={[.22,.2,-.52]}><mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.065,.065,1.05,24]}/><meshStandardMaterial color="#c5b7cc" metalness={.8} roughness={.23}/></mesh>{[-.53,-.35,.35,.53].map((x,i)=><mesh key={x} position={[x,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[i===0||i===3?.28:.35,i===0||i===3?.28:.35,.15,32]}/><meshStandardMaterial color="#81559a" metalness={.35} roughness={.32}/></mesh>)}</group>;
  if (chapter === 5) return <group position={[0,0,-.3]}><mesh><tubeGeometry args={[route,70,.033,10,false]}/><meshStandardMaterial color="#7cae97" metalness={.2} roughness={.35}/></mesh>{[0,.25,.5,.75,1].map((n,i)=><mesh key={n} position={route.getPoint(n)}><sphereGeometry args={[i===0||i===4?.085:.042,20,16]}/><meshStandardMaterial color={i===4?'#d9bd83':'#558572'} roughness={.3}/></mesh>)}</group>;
  if (chapter === 6) return <group position={[.9,.65,-.35]} rotation={[.25,-.15,.14]}>{[.62,.47,.32].map((radius,i)=><mesh key={radius} position={[0,0,i*.06]}><torusGeometry args={[radius,.055,12,70,Math.PI*(1.7-i*.25)]}/><meshStandardMaterial color={['#caa46c','#9d7db5','#8ca477'][i]} roughness={.35} metalness={.3}/></mesh>)}</group>;
  return <group position={[-1,-.6,-.1]} rotation={[.05,-.18,-.1]}><RoundedBox args={[.95,.7,.045]} radius={.07} smoothness={3}><meshStandardMaterial color="#f5ebfa" roughness={.24} metalness={.1}/></RoundedBox>{[.13,.25,.18,.36,.45].map((height,i)=><RoundedBox key={i} args={[.085,height,.035]} radius={.018} smoothness={2} position={[-.3+i*.145,height/2-.23,.048]}><meshStandardMaterial color={i===4?'#704087':'#b18ec4'} roughness={.35}/></RoundedBox>)}</group>;
}

function ContextGuard({ onFailure }: {onFailure:()=>void}) {
  const { gl } = useThree();
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}

export default function StoryCanvas({ progress, active, onReady, onFailure }: Props) {
  return <Canvas camera={{position:[0,0,8],fov:36,near:.1,far:30}} dpr={[1,1.5]} frameloop={active?'demand':'never'} gl={{alpha:true,antialias:true,powerPreference:'default'}}>
    <ContextGuard onFailure={onFailure}/>
    <ambientLight intensity={1.5}/><directionalLight position={[2,4,6]} intensity={3} color="#fff5e5"/><directionalLight position={[-4,0,4]} intensity={1.3} color="#ddc1eb"/>
    <Suspense fallback={null}><Environment resolution={128} frames={1}><Lightformer form="rect" intensity={3} position={[-4,4,3]} scale={[4,5,1]}/><Lightformer form="rect" intensity={2} position={[4,2,2]} scale={[3,6,1]}/></Environment><Phone progress={progress} active={active} onReady={onReady}/></Suspense>
  </Canvas>;
}




