// @ts-nocheck — Three.js type versions conflict across the workspace.
import { Grid, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const CYAN = '#3ee0c5';
const MAGENTA = '#ff2bd6';
const VIOLET = '#8b5cff';

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
    float meridians = abs(sin(vUv.x * 18.0));
    float parallels = abs(sin(vUv.y * 11.0));
    float grid = smoothstep(0.94, 1.0, meridians) + smoothstep(0.95, 1.0, parallels);
    float scan = pow(abs(sin(vUv.y * 6.0 - uTime * 0.28)), 20.0);
    float fresnel = pow(1.0 - abs(vNormal.z), 2.4);
    vec3 color = mix(uColorA, uColorB, fresnel * 0.5 + scan * 0.2);
    float alpha = 0.16 + grid * 0.5 + fresnel * 0.32 + scan * 0.12;
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
      globe.current.rotation.y += delta * 0.09;
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.05;
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.96, 32, 24]} />
        <meshBasicMaterial color="#081018" transparent opacity={0.72} />
      </mesh>
      <mesh ref={globe}>
        <sphereGeometry args={[2.02, 48, 36]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={HOLO_VERT}
          fragmentShader={HOLO_FRAG}
        />
      </mesh>
      <mesh ref={shell} scale={1.04}>
        <icosahedronGeometry args={[2.02, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  color,
  tilt,
  speed,
  opacity = 0.5,
}: {
  radius: number;
  color: string;
  tilt: number;
  speed: number;
  opacity?: number;
}) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0.1, 0]}>
      <torusGeometry args={[radius, 0.01, 8, 140]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function PulseRing() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) {
      return;
    }
    const t = (state.clock.elapsedTime * 0.12) % 1;
    const scale = 1.2 + t * 3.4;
    ref.current.scale.set(scale, scale, 1);
    ref.current.material.opacity = (1 - t) * 0.28;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.08, 0, 0]} position={[0, -0.2, 0]}>
      <ringGeometry args={[1.9, 1.96, 64]} />
      <meshBasicMaterial
        color={CYAN}
        transparent
        opacity={0.22}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function Satellites() {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 6;
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        phase: (index / count) * Math.PI * 2,
        radius: 3.2,
        lift: (index % 2) * 0.18 - 0.09,
      })),
    [],
  );

  useFrame((state) => {
    if (!mesh.current) {
      return;
    }
    const t = state.clock.elapsedTime * 0.2;
    seeds.forEach((seed, index) => {
      const angle = t + seed.phase;
      dummy.position.set(Math.cos(angle) * seed.radius, seed.lift, Math.sin(angle) * seed.radius);
      dummy.rotation.set(0, angle, 0.4);
      dummy.scale.setScalar(0.1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={CYAN} transparent opacity={0.8} />
    </instancedMesh>
  );
}

function Dust() {
  const ref = useRef();
  const positions = useMemo(() => {
    const count = 160;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 4.2 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      data[i * 3] = Math.cos(theta) * radius;
      data[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      data[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={VIOLET} size={0.03} transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}

function CameraRig() {
  const pointer = usePointer();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const targetX = Math.sin(t * 0.06) * 0.7 + pointer.current.x * 0.45;
    const targetY = 0.85 + Math.sin(t * 0.08) * 0.16 + pointer.current.y * 0.22;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.035;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.035;
    state.camera.position.z = 7.8;
    state.camera.lookAt(0, -0.05, 0);
  });
  return null;
}

export function NeonScene() {
  return (
    <Canvas
      dpr={[1, 1.4]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.9, 7.8], fov: 48 }}
    >
      <color attach="background" args={['#04060c']} />
      <fog attach="fog" args={['#04060c', 11, 22]} />
      <ambientLight intensity={0.24} />
      <pointLight position={[3.2, 2.4, 4]} color={CYAN} intensity={14} distance={15} />
      <pointLight position={[-3.8, 1.4, -2]} color={MAGENTA} intensity={9} distance={13} />
      <Stars radius={44} depth={24} count={700} factor={2.6} saturation={0} fade speed={0.35} />
      <HologramGlobe />
      <OrbitRing radius={2.9} color={CYAN} tilt={1.2} speed={0.09} opacity={0.55} />
      <OrbitRing radius={3.28} color={MAGENTA} tilt={0.58} speed={-0.06} opacity={0.42} />
      <OrbitRing radius={3.7} color={VIOLET} tilt={1.05} speed={0.035} opacity={0.28} />
      <PulseRing />
      <Satellites />
      <Dust />
      <Grid
        position={[0, -2.35, 0]}
        args={[20, 20]}
        cellSize={0.62}
        cellThickness={0.45}
        cellColor="#24535c"
        sectionSize={2.5}
        sectionThickness={0.9}
        sectionColor="#3ee0c5"
        fadeDistance={15}
        fadeStrength={1.5}
        infiniteGrid
      />
      <CameraRig />
    </Canvas>
  );
}

export default NeonScene;
