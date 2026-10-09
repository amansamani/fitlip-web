"use client";

import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function PhoneModel({ screenMatRef }: { screenMatRef?: React.RefObject<THREE.MeshPhysicalMaterial | null> }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
  });

  return (
    <group ref={meshRef} scale={1.5}>
      <RoundedBox args={[1.8, 3.8, 0.2]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#121212" metalness={0.95} roughness={0.15} envMapIntensity={1.5} />
      </RoundedBox>

      {/* Screen — real app UI is injected here by experience.tsx */}
      <RoundedBox args={[1.7, 3.7, 0.01]} radius={0.1} smoothness={4} position={[0, 0, 0.11]}>
        <meshPhysicalMaterial
          ref={screenMatRef}
          color="#000000"
          emissive="#000000"
          emissiveIntensity={1}
          metalness={0.1}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
          toneMapped={false}
        />
      </RoundedBox>

      <group position={[-0.5, 1.2, -0.15]}>
        <RoundedBox args={[0.7, 0.7, 0.12]} radius={0.15} smoothness={4}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
        </RoundedBox>
        {[[-0.15, 0.15], [0.15, -0.15]].map((pos, i) => (
          <mesh key={i} position={[pos[0], pos[1], -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 32]} />
            <meshPhysicalMaterial color="#050505" metalness={1} roughness={0} clearcoat={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}