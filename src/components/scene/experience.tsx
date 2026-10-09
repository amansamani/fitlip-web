"use client";

import { Sparkles, useScroll, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PhoneModel } from './phone-model';

const SCREENS = [
  '/screens/home.webp',
  '/screens/tracking.webp',
  '/screens/nutrition.webp',
  '/screens/coach.webp',
  '/screens/workouts.webp',
  '/screens/run.webp',
  '/screens/camera.webp',
];

type Key = { p: [number, number, number]; r: [number, number, number]; cam: number; s: number; tex: number };

/* One keyframe per scroll chapter — position, rotation, camera distance, scale, screen texture */
const KEYS: Key[] = [
  { p: [0, 0, 0],        r: [0, 0, 0],         cam: 5.0, s: 1.0,  tex: 0 }, // Hero
  { p: [1.7, 0, 0],      r: [0, -0.55, 0],     cam: 4.6, s: 1.0,  tex: 1 }, // Precision
  { p: [-1.7, 0, 0],     r: [0.18, 0.5, 0],    cam: 4.6, s: 1.0,  tex: 2 }, // Nourishment
  { p: [0, 0, 0.7],      r: [0, 0, 0],         cam: 3.1, s: 1.05, tex: 3 }, // AI Coach (close-up)
  { p: [0, 1.7, -1.6],   r: [0.12, 0, 0],      cam: 6.8, s: 0.75, tex: 0 }, // Gallery (phone recedes up)
  { p: [1.8, 0, 0],      r: [0, -0.75, 0.06],  cam: 4.8, s: 1.0,  tex: 4 }, // Move
  { p: [-1.8, 0, 0],     r: [0, 0.75, -0.06],  cam: 4.8, s: 1.0,  tex: 6 }, // Form Cam
  { p: [0, 0, -2.2],     r: [0.3, 0, 0],       cam: 7.5, s: 0.7,  tex: 5 }, // Stats (phone drifts back)
  { p: [0, -0.2, 0.4],   r: [-0.06, 0, 0],     cam: 4.4, s: 1.0,  tex: 0 }, // Ready?
];

export function Experience() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const lastOffset = useRef(-1);
  const textures = useTexture(SCREENS);

  useEffect(() => {
    textures.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; });
  }, [textures]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;

    const pages = KEYS.length - 1;
    const f = scroll.offset * pages;
    const i = Math.min(Math.floor(f), pages - 1);
    const t = THREE.MathUtils.smoothstep(f - i, 0, 1);
    const a = KEYS[i], b = KEYS[i + 1];
    const L = THREE.MathUtils.lerp;

    g.position.set(L(a.p[0], b.p[0], t), L(a.p[1], b.p[1], t), L(a.p[2], b.p[2], t));
    g.rotation.set(L(a.r[0], b.r[0], t), L(a.r[1], b.r[1], t), L(a.r[2], b.r[2], t));
    g.scale.setScalar(L(a.s, b.s, t));

    state.camera.position.z = L(a.cam, b.cam, t);
    state.camera.lookAt(g.position.x * 0.8, g.position.y * 0.8, 0);

    g.position.y += Math.sin(state.clock.elapsedTime * 0.6) * 0.03; // idle breathing

    // Swap the real app screenshot on the 3D screen at the chapter midpoint
    const idx = t < 0.5 ? a.tex : b.tex;
    const mat = screenMat.current;
    if (mat && mat.userData.tex !== idx) {
      mat.userData.tex = idx;
      mat.map = textures[idx];
      mat.emissive.set('#ffffff');
      mat.emissiveMap = textures[idx];
      mat.emissiveIntensity = 0.35;
      mat.needsUpdate = true;
    }

    // Broadcast scroll progress to DOM overlays (progress bar)
    if (Math.abs(scroll.offset - lastOffset.current) > 0.0015) {
      lastOffset.current = scroll.offset;
      window.dispatchEvent(new CustomEvent('fitlip:progress', { detail: scroll.offset }));
    }
  });

  return (
    <group ref={group}>
      <PhoneModel screenMatRef={screenMat} />
      <Sparkles count={50} scale={6} size={1.5} speed={0.2} color="#ffffff" opacity={0.3} />
    </group>
  );
}