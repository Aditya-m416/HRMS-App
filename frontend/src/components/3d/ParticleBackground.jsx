import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 1200 }) {
  const mesh = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      // mix violet and cyan
      const t = Math.random();
      col[i * 3]     = 0.48 * (1 - t) + 0.02 * t;
      col[i * 3 + 1] = 0.23 * (1 - t) + 0.71 * t;
      col[i * 3 + 2] = 0.93 * (1 - t) + 0.83 * t;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.elapsedTime * 0.04;
      mesh.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.06}
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingRing() {
  const ring = useRef();
  useFrame(({ clock }) => {
    if (ring.current) {
      ring.current.rotation.x = clock.elapsedTime * 0.3;
      ring.current.rotation.z = clock.elapsedTime * 0.15;
    }
  });
  return (
    <mesh ref={ring} position={[3, 1, -5]}>
      <torusGeometry args={[2, 0.03, 16, 100]} />
      <meshBasicMaterial color="#7C3AED" transparent opacity={0.25} />
    </mesh>
  );
}

function FloatingRing2() {
  const ring = useRef();
  useFrame(({ clock }) => {
    if (ring.current) {
      ring.current.rotation.y = clock.elapsedTime * 0.2;
      ring.current.rotation.x = Math.PI / 3 + clock.elapsedTime * 0.1;
    }
  });
  return (
    <mesh ref={ring} position={[-4, -1, -8]}>
      <torusGeometry args={[3, 0.02, 16, 100]} />
      <meshBasicMaterial color="#06B6D4" transparent opacity={0.2} />
    </mesh>
  );
}

export default function ParticleBackground({ style = {} }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      ...style
    }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Particles />
        <FloatingRing />
        <FloatingRing2 />
      </Canvas>
    </div>
  );
}
