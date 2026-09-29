// @ts-nocheck — Three.js type versions conflict across the workspace.
import { Float, Grid, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

const CYAN = '#3ee0c5';
const MAGENTA = '#ff2bd6';
const VIOLET = '#8b5cff';
const GOLD = '#f2c14b';

interface SceneNode {
  rotation: { x: number; y: number; z: number };
  position: { set: (x: number, y: number, z: number) => void };
}

function SpinningGlobe() {
  const inner = useRef<SceneNode>(null);
  const outer = useRef<SceneNode>(null);

  useFrame((_, delta) => {
    if (inner.current) {
      inner.current.rotation.y += delta * 0.14;
      inner.current.rotation.x += delta * 0.02;
    }
    if (outer.current) {
      outer.current.rotation.y -= delta * 0.09;
      outer.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group>
      <mesh ref={inner as never}>
        <sphereGeometry args={[2.15, 36, 28]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={outer as never} scale={1.08}>
        <icosahedronGeometry args={[2.15, 1]} />
        <meshBasicMaterial color={MAGENTA} wireframe transparent opacity={0.28} />
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
  const ref = useRef<SceneNode>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
  });

  return (
    <mesh ref={ref as never} rotation={[tilt, 0.2, 0]}>
      <torusGeometry args={[radius, 0.012, 12, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

function OrbitingKnot() {
  const ref = useRef<SceneNode>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t * 0.35) * 4.2,
        Math.sin(t * 0.55) * 1.1,
        Math.sin(t * 0.35) * 4.2,
      );
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.016;
    }
  });

  return (
    <group ref={ref as never}>
      <mesh>
        <torusKnotGeometry args={[0.42, 0.12, 96, 16]} />
        <meshStandardMaterial
          color={MAGENTA}
          emissive={MAGENTA}
          emissiveIntensity={2.4}
          metalness={0.35}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}

function CrystalField() {
  const crystals = useMemo(
    () =>
      [
        { pos: [-4.6, 1.4, -2.2] as const, color: CYAN, scale: 0.38, speed: 0.4 },
        { pos: [4.2, -0.8, -1.6] as const, color: VIOLET, scale: 0.46, speed: 0.28 },
        { pos: [-2.8, -1.6, 3.1] as const, color: MAGENTA, scale: 0.32, speed: 0.52 },
        { pos: [3.4, 1.8, 2.4] as const, color: GOLD, scale: 0.28, speed: 0.36 },
        { pos: [0.6, 2.4, -3.4] as const, color: CYAN, scale: 0.24, speed: 0.44 },
        { pos: [-5.1, -0.4, 1.2] as const, color: VIOLET, scale: 0.34, speed: 0.3 },
        { pos: [5.4, 0.6, 0.4] as const, color: MAGENTA, scale: 0.3, speed: 0.41 },
        { pos: [-1.2, 2.1, 4.2] as const, color: GOLD, scale: 0.22, speed: 0.5 },
      ] as const,
    [],
  );

  return (
    <>
      {crystals.map((crystal) => (
        <Float
          key={crystal.pos.join(',')}
          speed={crystal.speed + 1.2}
          rotationIntensity={1.4}
          floatIntensity={1.1}
        >
          <mesh position={crystal.pos} scale={crystal.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={crystal.color}
              emissive={crystal.color}
              emissiveIntensity={2.6}
              metalness={0.7}
              roughness={0.15}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function NeonDebris() {
  const ref = useRef<SceneNode>(null);
  const { positions, colors } = useMemo(() => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      [0.24, 0.88, 0.77],
      [1, 0.17, 0.84],
      [0.55, 0.36, 1],
      [0.95, 0.76, 0.29],
    ];
    for (let i = 0; i < count; i += 1) {
      const radius = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const tint = palette[i % palette.length] ?? palette[0];
      colors[i * 3] = tint[0];
      colors[i * 3 + 1] = tint[1];
      colors[i * 3 + 2] = tint[2];
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={ref as never}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.08) * 1.4;
    state.camera.position.y = 1.15 + Math.sin(t * 0.12) * 0.35;
    state.camera.position.z = 8.4;
    state.camera.lookAt(0, 0.15, 0);
  });
  return null;
}

function ArenaLights() {
  return (
    <>
      <color attach="background" args={['#04060c']} />
      <fog attach="fog" args={['#04060c', 8, 22]} />
      <ambientLight intensity={0.28} />
      <pointLight position={[4, 3, 4]} color={CYAN} intensity={22} distance={16} />
      <pointLight position={[-5, 2, -3]} color={MAGENTA} intensity={20} distance={16} />
      <pointLight position={[0, -2, 5]} color={VIOLET} intensity={14} distance={14} />
    </>
  );
}

export function NeonScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.2, 8.4], fov: 52 }}
    >
      <ArenaLights />
      <Stars radius={48} depth={30} count={1400} factor={3.2} saturation={0} fade speed={0.6} />
      <SpinningGlobe />
      <OrbitRing radius={3.05} color={CYAN} tilt={1.2} speed={0.18} />
      <OrbitRing radius={3.45} color={MAGENTA} tilt={0.55} speed={-0.12} />
      <OrbitRing radius={3.85} color={VIOLET} tilt={1.7} speed={0.08} />
      <OrbitingKnot />
      <CrystalField />
      <NeonDebris />
      <Grid
        position={[0, -2.6, 0]}
        args={[24, 24]}
        cellSize={0.55}
        cellThickness={0.6}
        cellColor={MAGENTA}
        sectionSize={2.2}
        sectionThickness={1.1}
        sectionColor={CYAN}
        fadeDistance={18}
        fadeStrength={1.4}
        infiniteGrid
      />
      <CameraRig />
    </Canvas>
  );
}

export default NeonScene;
