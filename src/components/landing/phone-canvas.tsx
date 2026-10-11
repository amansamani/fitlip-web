'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { STEPS, pose } from '@/lib/tour';

const SRC = STEPS.map((s) => s.src);
const STACKED_BELOW = 864;

function roundedMask() {
  const w = 194, h = 420, r = 32;
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
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
  }, [textures]);

  useEffect(() => {
    const on = (e: PointerEvent) => {
      mouse.current.x = e.clientX / innerWidth - 0.5;
      mouse.current.y = e.clientY / innerHeight - 0.5;
    };
    addEventListener('pointermove', on);
    return () => removeEventListener('pointermove', on);
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const cam = state.camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const stacked = width < STACKED_BELOW;

    // Slightly further camera = more headroom, phone never touches the edges
    cam.position.z = stacked ? 8.4 : 5.6;
    const worldW = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * (width / height);

    const q = pose(progress.get(), reduce);
    const k = reduce ? 0 : 1;
    const idle = reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.025;

    const tx = stacked ? 0 : q.xn * 0.24 * worldW;
    const ty = (stacked ? 0.6 : 0) + q.y * (stacked ? 0.35 : 1) + idle;

    // Low lambda = long, silky glide instead of tight tracking
    g.position.x = THREE.MathUtils.damp(g.position.x, tx, 5.5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 5.5, dt);

    const ry = (stacked ? 0 : -q.xn * 0.32) + q.yaw * 0.6 + mouse.current.x * 0.25 * k;
    const rx = q.pitch + mouse.current.y * 0.15 * k;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ry, 6, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rx, 6, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, q.roll, 6, dt);

    mats.current.forEach((m, j) => {
      if (m) m.opacity = THREE.MathUtils.damp(m.opacity, j === q.img ? 1 : 0, 7, dt);
    });
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.08, 2.24, 0.1]} radius={0.14} smoothness={12}>
        <meshStandardMaterial color="#1a0d28" metalness={0.95} roughness={0.15} envMapIntensity={1.8} />
      </RoundedBox>

      {/* Hardware buttons */}
      <mesh position={[0.555, 0.4, 0]}>
        <boxGeometry args={[0.015, 0.18, 0.06]} />
        <meshStandardMaterial color="#0a0512" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.555, 0.5, 0]}>
        <boxGeometry args={[0.015, 0.12, 0.06]} />
        <meshStandardMaterial color="#0a0512" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-0.555, 0.3, 0]}>
        <boxGeometry args={[0.015, 0.12, 0.06]} />
        <meshStandardMaterial color="#0a0512" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Bezel */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[1.02, 2.16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Screens */}
      {textures.map((t, i) => (
        <mesh key={SRC[i]} position={[0, 0, 0.052 + i * 0.0003]} renderOrder={i + 1}>
          <planeGeometry args={[0.98, 2.12]} />
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

      {/* Glass reflection */}
      <mesh position={[0, 0, 0.055]} renderOrder={100}>
        <planeGeometry args={[0.98, 2.12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={['#08040f']} />
      <Lightformer form="rect" intensity={5} color="#ffffff" position={[-4, 4, 3]} scale={[4, 3, 1]} />
      <Lightformer form="rect" intensity={3.5} color="#ffffff" position={[3, 4, 2]} scale={[5, 2, 1]} />
      <Lightformer form="rect" intensity={2.5} color="#c4b5fd" position={[0, -3, -2]} scale={[12, 1.5, 1]} />
      <Lightformer form="rect" intensity={2} color="#f472b6" position={[5, 0, 3]} scale={[2, 5, 1]} />
    </Environment>
  );
}

export default function PhoneCanvas({ progress, reduce, active }: Props & { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 5.6], fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Studio />
        <directionalLight position={[3, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-2, -3, 3]} intensity={0.4} color="#c4b5fd" />
        <Phone progress={progress} reduce={reduce} />
      </Suspense>
    </Canvas>
  );
}