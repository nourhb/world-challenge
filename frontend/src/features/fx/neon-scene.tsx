// @ts-nocheck — Three.js type versions conflict across the workspace.
import { Grid, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const CYAN = '#3ee0c5';
const MAGENTA = '#ff2bd6';

const HOLO_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HOLO_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  void main() {
    float meridians = abs(sin(vUv.x * 16.0));
    float parallels = abs(sin(vUv.y * 10.0));
    float grid = smoothstep(0.96, 1.0, meridians) + smoothstep(0.97, 1.0, parallels);
    float scan = pow(abs(sin(vUv.y * 8.0 - uTime * 0.35)), 24.0);
    float fresnel = pow(1.0 - abs(vNormal.z), 2.8);
    vec3 color = mix(uColorA, uColorB, fresnel * 0.55);
    float alpha = 0.08 + grid * 0.42 + fresnel * 0.28 + scan * 0.08;
    gl_FragColor = vec4(color, alpha);
  }
`;

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return pointer;
}

function HologramGlobe() {
  const globe = useRef();
  const shell = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(CYAN) },
      uColorB: { value: new THREE.Color(MAGENTA) },
    }),
    [],
  );

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (globe.current) {
      globe.current.rotation.y += delta * 0.07;
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={globe}>
        <sphereGeometry args={[2.05, 48, 36]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={HOLO_VERT}
          fragmentShader={HOLO_FRAG}
        />
      </mesh>
      <mesh ref={shell} scale={1.045}>
        <icosahedronGeometry args={[2.05, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.11} />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  color,
  tilt,
  speed,
}: {
  radius: number;
  color: string;
  tilt: number;
  speed: number;
}) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0.12, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.38} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function Satellite() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.22;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * 3.35, Math.sin(t * 0.7) * 0.35, Math.sin(t) * 3.35);
      ref.current.rotation.y += 0.012;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.09, 0]} />
      <meshBasicMaterial color={CYAN} transparent opacity={0.85} />
    </mesh>
  );
}

function CameraRig() {
  const pointer = usePointer();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const targetX = Math.sin(t * 0.05) * 0.55 + pointer.current.x * 0.35;
    const targetY = 0.95 + Math.sin(t * 0.07) * 0.12 + pointer.current.y * 0.18;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.03;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.03;
    state.camera.position.z = 8.8;
    state.camera.lookAt(0, -0.15, 0);
  });
  return null;
}

export function NeonScene() {
  return (
    <Canvas
      dpr={[1, 1.4]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1, 8.8], fov: 46 }}
    >
      <color attach="background" args={['#04060c']} />
      <fog attach="fog" args={['#04060c', 9, 18]} />
      <ambientLight intensity={0.18} />
      <pointLight position={[3.5, 2.2, 4]} color={CYAN} intensity={10} distance={14} />
      <pointLight position={[-4, 1.2, -2]} color={MAGENTA} intensity={6} distance={12} />
      <Stars radius={40} depth={20} count={420} factor={2.2} saturation={0} fade speed={0.25} />
      <HologramGlobe />
      <OrbitRing radius={2.95} color={CYAN} tilt={1.22} speed={0.08} />
      <OrbitRing radius={3.35} color={MAGENTA} tilt={0.62} speed={-0.05} />
      <Satellite />
      <Grid
        position={[0, -2.45, 0]}
        args={[18, 18]}
        cellSize={0.7}
        cellThickness={0.35}
        cellColor="#1a3344"
        sectionSize={2.8}
        sectionThickness={0.7}
        sectionColor="#2a5a62"
        fadeDistance={14}
        fadeStrength={1.8}
        infiniteGrid
      />
      <CameraRig />
    </Canvas>
  );
}

export default NeonScene;
