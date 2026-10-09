'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { STEPS, pose } from '@/lib/tour';

const SRC = STEPS.map((s) => s.src);
const STACKED_BELOW = 864; // matches --breakpoint-tour (54rem)

/** Rounded-corner alpha mask so the flat screenshot follows the phone's corners. */
function roundedMask() {
  const w = 194, h = 420, r = 26;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d')!;
  x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#fff';
  x.beginPath();
  x.moveTo(r, 0); x.lineTo(w - r, 0); x.quadraticCurveTo(w, 0, w, r);
  x.lineTo(w, h - r); x.quadraticCurveTo(w, h, w - r, h);
  x.lineTo(r, h); x.quadraticCurveTo(0, h, 0, h - r);
  x.lineTo(0, r); x.quadraticCurveTo(0, 0, r, 0);
  x.fill();
  return new THREE.CanvasTexture(c);
}

type Props = { progress: MotionValue<number>; reduce: boolean };

function Phone({ progress, reduce }: Props) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const textures = useTexture(SRC);
  const mask = useMemo(roundedMask, []);

  useEffect(() => {
    textures.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.needsUpdate = true; });
  }, [textures]);

  useEffect(() => {
    const on = (e: PointerEvent) => { mouse.current.x = e.clientX / innerWidth - 0.5; mouse.current.y = e.clientY / innerHeight - 0.5; };
    addEventListener('pointermove', on);
    return () => removeEventListener('pointermove', on);
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const cam = state.camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const stacked = width < STACKED_BELOW;
    cam.position.z = stacked ? 8.2 : 5.4;
    const worldW = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * (width / height);

    const q = pose(progress.get(), reduce);
    const k = reduce ? 0 : 1;
    const tx = stacked ? 0 : q.xn * 0.24 * worldW;
    const ty = (stacked ? 0.85 : 0) + q.y * (stacked ? 0.4 : 1);
    g.position.x = THREE.MathUtils.damp(g.position.x, tx, 14, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 14, dt);
    g.rotation.y = (stacked ? 0 : -q.xn * 0.32) + q.yaw * 0.6 + mouse.current.x * 0.3 * k;
    g.rotation.x = q.pitch + mouse.current.y * 0.2 * k;
    g.rotation.z = q.roll;
    mats.current.forEach((m, j) => { if (m) m.opacity = THREE.MathUtils.damp(m.opacity, j === q.img ? 1 : 0, 10, dt); });
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.04, 2.2, 0.09]} radius={0.13} smoothness={8}>
        <meshStandardMaterial color="#2a1638" metalness={1} roughness={0.22} envMapIntensity={1.4} />
      </RoundedBox>
      {textures.map((t, i) => (
        <mesh key={SRC[i]} position={[0, 0, 0.0462 + i * 0.0003]} renderOrder={i + 1}>
          <planeGeometry args={[0.97, 2.1]} />
          <meshBasicMaterial
            ref={(el) => { mats.current[i] = el; }}
            map={t}
            alphaMap={mask}
            transparent
            opacity={i === 0 ? 1 : 0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Procedural studio lighting: no HDR file is downloaded. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#1b0f24']} />
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[-4, 3, 3]} scale={[4, 2, 1]} />
      <Lightformer form="rect" intensity={3} color="#ffffff" position={[3, 4, 2]} scale={[5, 1.5, 1]} />
      <Lightformer form="rect" intensity={3} color="#ffb98a" position={[0, -3, -2]} scale={[10, 1.2, 1]} />
      <Lightformer form="rect" intensity={2.5} color="#b887c7" position={[4, 0, 3]} scale={[2, 4, 1]} />
    </Environment>
  );
}

export default function PhoneCanvas({ progress, reduce, active }: Props & { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 5.4], fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Studio />
        <directionalLight position={[3, 4, 5]} intensity={1.1} />
        <Phone progress={progress} reduce={reduce} />
      </Suspense>
    </Canvas>
  );
}
