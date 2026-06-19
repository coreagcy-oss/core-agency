import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function Blob() {
  const mesh = useRef(null);
  const group = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.18;
      mesh.current.rotation.z = t * 0.06;
    }
    if (group.current) {
      // плавный параллакс к курсору
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        state.pointer.y * 0.4,
        0.04
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        state.pointer.x * 0.5,
        0.04
      );
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
        <Icosahedron ref={mesh} args={[1.35, 12]}>
          <MeshDistortMaterial
            color="#ff6a1a"
            emissive="#ff3d00"
            emissiveIntensity={0.4}
            roughness={0.18}
            metalness={0.65}
            distort={0.42}
            speed={1.8}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

function Particles({ count = 240 }) {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#ff9d2e" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={2.4} color="#ff7a18" />
      <pointLight position={[-5, -3, 2]} intensity={2.2} color="#ffb24d" />
      <pointLight position={[0, 4, -4]} intensity={1.6} color="#ff3d00" />
      <Blob />
      <Particles />
    </Canvas>
  );
}
