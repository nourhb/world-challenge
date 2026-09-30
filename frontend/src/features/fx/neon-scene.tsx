// @ts-nocheck — Three.js type versions conflict across the workspace.
import { Grid, MeshWobbleMaterial, Sparkles, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const CYAN = '#3ee0c5';
const MAGENTA = '#ff2bd6';
const VIOLET = '#8b5cff';
const GOLD = '#f2c14b';
const TEMPO = 1.18;

const HOLO_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  uniform float uTime;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec3 p = position;
    p += normal * sin(uTime * 1.6 + position.y * 7.0) * 0.028;
    vPos = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const HOLO_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  void main() {
    float meridians = abs(sin(vUv.x * 32.0 + uTime * 0.45));
    float parallels = abs(sin(vUv.y * 20.0 - uTime * 0.6));
    float grid = smoothstep(0.93, 1.0, meridians) + smoothstep(0.95, 1.0, parallels);
    float land = smoothstep(0.46, 0.62, noise(vUv * vec2(9.0, 14.0) + uTime * 0.04));
    float scan = pow(abs(sin(vUv.y * 18.0 - uTime * 1.4)), 12.0);
    float fresnel = pow(1.0 - abs(vNormal.z), 2.4);
    vec3 color = mix(uColorA, uColorB, fresnel * 0.7 + land * 0.35 + scan * 0.25);
    float alpha = 0.12 + grid * 0.55 + land * 0.22 + fresnel * 0.4 + scan * 0.18;
    gl_FragColor = vec4(color, alpha);
  }
`;

const AURORA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AURORA_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  void main() {
    float wave = sin(vUv.x * 18.0 + uTime * 1.3) * 0.5 + 0.5;
    float ribbon = smoothstep(0.15, 0.5, vUv.y) * smoothstep(0.85, 0.5, vUv.y);
    float flow = abs(sin(vUv.x * 6.0 - uTime * 0.8 + wave));
    vec3 color = mix(uColorA, uColorB, flow);
    float alpha = ribbon * (0.18 + flow * 0.45) * (0.65 + wave * 0.35);
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
    const beat = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * TEMPO);
    if (globe.current) {
      globe.current.rotation.y += delta * 0.13;
      globe.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.08;
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.08;
      shell.current.rotation.z += delta * 0.025;
      const s = 1.07 + beat * 0.035;
      shell.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh ref={globe}>
        <sphereGeometry args={[2.12, 64, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={HOLO_VERT}
          fragmentShader={HOLO_FRAG}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.18, 1]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  color,
  tilt,
  speed,
  thickness = 0.012,
}: {
  radius: number;
  color: string;
  tilt: number;
  speed: number;
  thickness?: number;
}) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }
    ref.current.rotation.z += delta * speed;
    ref.current.rotation.x = tilt + Math.sin(state.clock.elapsedTime * 0.2) * 0.06;
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0.18, 0]}>
      <torusGeometry args={[radius, thickness, 10, 160]} />
      <meshBasicMaterial color={color} transparent opacity={0.78} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function PulseRings() {
  const rings = [useRef(), useRef(), useRef(), useRef()];
  useFrame((state) => {
    rings.forEach((ring, index) => {
      if (!ring.current) {
        return;
      }
      const t = (state.clock.elapsedTime * 0.18 + index * 0.25) % 1;
      const scale = 1.1 + t * 7.2;
      ring.current.scale.set(scale, scale, 1);
      ring.current.material.opacity = (1 - t) * 0.42;
    });
  });

  return (
    <group rotation={[-Math.PI / 2.15, 0, 0]} position={[0, -0.15, 0]}>
      {rings.map((ring, index) => (
        <mesh key={index} ref={ring}>
          <ringGeometry args={[1.72, 1.8, 80]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? CYAN : MAGENTA}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SwarmProbes() {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 16;
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        radius: 3.15 + (index % 6) * 0.28,
        speed: 0.18 + (index % 8) * 0.045,
        phase: index * 0.73,
        lift: ((index % 7) - 3) * 0.22,
        spin: 0.8 + (index % 5) * 0.35,
      })),
    [],
  );

  useFrame((state) => {
    if (!mesh.current) {
      return;
    }
    const t = state.clock.elapsedTime;
    seeds.forEach((seed, index) => {
      const angle = t * seed.speed + seed.phase;
      dummy.position.set(
        Math.cos(angle) * seed.radius,
        seed.lift + Math.sin(angle * 2.1) * 0.28,
        Math.sin(angle) * seed.radius,
      );
      dummy.rotation.set(angle * seed.spin, angle, angle * 0.4);
      const pulse = 0.085 + Math.sin(t * 3.2 + index) * 0.018;
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={GOLD}
        emissive={GOLD}
        emissiveIntensity={3.1}
        metalness={0.55}
        roughness={0.18}
      />
    </instancedMesh>
  );
}

function CrystalField() {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 12;
  const palette = useMemo(
    () => [new THREE.Color(CYAN), new THREE.Color(VIOLET), new THREE.Color(MAGENTA), new THREE.Color(GOLD)],
    [],
  );
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const theta = (index / count) * Math.PI * 2;
        return {
          radius: 4.4 + (index % 4) * 0.55,
          phase: theta,
          speed: 0.12 + (index % 5) * 0.03,
          height: ((index % 5) - 2) * 0.85,
          scale: 0.22 + (index % 4) * 0.06,
        };
      }),
    [],
  );

  useFrame((state) => {
    if (!mesh.current) {
      return;
    }
    const t = state.clock.elapsedTime;
    seeds.forEach((seed, index) => {
      const angle = seed.phase + t * seed.speed;
      dummy.position.set(
        Math.cos(angle) * seed.radius,
        seed.height + Math.sin(t * 0.9 + index) * 0.45,
        Math.sin(angle) * seed.radius,
      );
      dummy.rotation.set(t * 0.4 + index, t * 0.55, t * 0.2);
      dummy.scale.setScalar(seed.scale * (1 + Math.sin(t * TEMPO + index) * 0.12));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={palette[0]}
        emissive={palette[1]}
        emissiveIntensity={2.2}
        metalness={0.72}
        roughness={0.14}
        wireframe
      />
    </instancedMesh>
  );
}

function DataHelix() {
  const a = useRef();
  const b = useRef();
  const { positionsA, positionsB } = useMemo(() => {
    const count = 160;
    const positionsA = new Float32Array(count * 3);
    const positionsB = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const turn = (i / count) * Math.PI * 10;
      const y = (i / count - 0.5) * 4.6;
      positionsA[i * 3] = Math.cos(turn) * 2.58;
      positionsA[i * 3 + 1] = y;
      positionsA[i * 3 + 2] = Math.sin(turn) * 2.58;
      positionsB[i * 3] = Math.cos(turn + Math.PI) * 2.58;
      positionsB[i * 3 + 1] = y;
      positionsB[i * 3 + 2] = Math.sin(turn + Math.PI) * 2.58;
    }
    return { positionsA, positionsB };
  }, []);

  useFrame((_, delta) => {
    if (a.current) {
      a.current.rotation.y += delta * 0.42;
    }
    if (b.current) {
      b.current.rotation.y += delta * 0.42;
    }
  });

  return (
    <>
      <points ref={a}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positionsA.length / 3} array={positionsA} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={CYAN} size={0.045} transparent opacity={0.9} depthWrite={false} />
      </points>
      <points ref={b}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positionsB.length / 3} array={positionsB} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={MAGENTA} size={0.045} transparent opacity={0.82} depthWrite={false} />
      </points>
    </>
  );
}

function EnergyArcs() {
  const group = useRef();
  const geometries = useMemo(() => {
    const make = (x: number, z: number) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2.35, 0),
        new THREE.Vector3(x * 0.7, 1.1, z * 0.7),
        new THREE.Vector3(x, 0, z),
        new THREE.Vector3(x * 0.7, -1.1, z * 0.7),
        new THREE.Vector3(0, -2.35, 0),
      ]);
      return new THREE.TubeGeometry(curve, 56, 0.016, 8, false);
    };
    return [make(2.15, 0.4), make(-1.7, 1.8), make(-0.4, -2.2)];
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.16;
      group.current.children.forEach((child, index) => {
        const material = child.material;
        if (!material || Array.isArray(material)) {
          return;
        }
        const pulse = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.4 + index));
        material.opacity = pulse;
      });
    }
  });

  return (
    <group ref={group}>
      {geometries.map((geometry, index) => (
        <mesh key={index} geometry={geometry}>
          <meshBasicMaterial
            color={index === 1 ? GOLD : index === 2 ? VIOLET : CYAN}
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function AuroraBand() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(CYAN) },
      uColorB: { value: new THREE.Color(VIOLET) },
    }),
    [],
  );
  const ref = useRef();
  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.07;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
    }
  });

  return (
    <mesh ref={ref} rotation={[0.7, 0.2, 0.4]}>
      <torusGeometry args={[3.7, 0.55, 24, 140]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={AURORA_VERT}
        fragmentShader={AURORA_FRAG}
      />
    </mesh>
  );
}

function OrbitingKnots() {
  const primary = useRef();
  const secondary = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (primary.current) {
      primary.current.position.set(Math.cos(t * 0.38) * 4.25, Math.sin(t * 0.62) * 1.15, Math.sin(t * 0.38) * 4.25);
      primary.current.rotation.x += 0.012;
      primary.current.rotation.y += 0.02;
    }
    if (secondary.current) {
      secondary.current.position.set(
        Math.cos(t * -0.27 + 1.7) * 5.1,
        Math.cos(t * 0.48) * 1.35,
        Math.sin(t * -0.27 + 1.7) * 5.1,
      );
      secondary.current.rotation.z += 0.018;
    }
  });

  return (
    <>
      <group ref={primary}>
        <mesh>
          <torusKnotGeometry args={[0.38, 0.11, 96, 16]} />
          <MeshWobbleMaterial
            color={MAGENTA}
            emissive={MAGENTA}
            emissiveIntensity={2.6}
            factor={0.55}
            speed={1.6}
            metalness={0.4}
            roughness={0.16}
          />
        </mesh>
      </group>
      <group ref={secondary}>
        <mesh>
          <tetrahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={2.8}
            metalness={0.6}
            roughness={0.12}
          />
        </mesh>
      </group>
    </>
  );
}

function PolarBeacons() {
  const north = useRef();
  const south = useRef();
  useFrame((state, delta) => {
    const beat = 0.7 + Math.sin(state.clock.elapsedTime * TEMPO * 1.6) * 0.3;
    [north, south].forEach((pole, index) => {
      if (!pole.current) {
        return;
      }
      pole.current.rotation.y += delta * (index === 0 ? 1.8 : -1.4);
      pole.current.scale.y = 1.2 + beat * 0.55;
      const material = pole.current.material;
      if (material && !Array.isArray(material)) {
        material.opacity = 0.18 + beat * 0.22;
      }
    });
  });

  return (
    <>
      <mesh ref={north} position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.035, 0.12, 1.6, 12]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={south} position={[0, -2.05, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.12, 1.6, 12]} />
        <meshBasicMaterial color={MAGENTA} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}

function NeonDebris() {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const count = 520;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      [0.24, 0.88, 0.77],
      [1, 0.17, 0.84],
      [0.55, 0.36, 1],
      [0.95, 0.76, 0.29],
    ];
    for (let i = 0; i < count; i += 1) {
      const radius = 6.2 + Math.random() * 11;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const tint = palette[i % palette.length];
      colors[i * 3] = tint[0];
      colors[i * 3 + 1] = tint[1];
      colors[i * 3 + 2] = tint[2];
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }
    ref.current.rotation.y += delta * 0.028;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.07) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.038} vertexColors transparent opacity={0.88} depthWrite={false} />
    </points>
  );
}

function CameraRig() {
  const pointer = usePointer();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const targetX = Math.sin(t * 0.08) * 1.25 + pointer.current.x * 1.05;
    const targetY = 1.12 + Math.sin(t * 0.11) * 0.32 + pointer.current.y * 0.45;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.045;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.045;
    state.camera.position.z = 8.35;
    state.camera.lookAt(0, 0.12, 0);
  });
  return null;
}

function ArenaLights() {
  const cyan = useRef();
  const magenta = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cyan.current) {
      cyan.current.position.set(Math.cos(t * 0.42) * 5.2, 2.4 + Math.sin(t * 0.33), Math.sin(t * 0.42) * 5.2);
    }
    if (magenta.current) {
      magenta.current.position.set(Math.cos(t * -0.31) * 4.6, 1.2, Math.sin(t * -0.31) * 4.6);
    }
  });

  return (
    <>
      <color attach="background" args={['#04060c']} />
      <fog attach="fog" args={['#04060c', 7.5, 21]} />
      <ambientLight intensity={0.22} />
      <pointLight ref={cyan} position={[4, 3, 4]} color={CYAN} intensity={26} distance={18} />
      <pointLight ref={magenta} position={[-5, 2, -3]} color={MAGENTA} intensity={24} distance={17} />
      <pointLight position={[0, -2.4, 5]} color={VIOLET} intensity={16} distance={14} />
    </>
  );
}

export function NeonScene() {
  return (
    <Canvas
      dpr={[1, 1.4]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.2, 8.4], fov: 50 }}
    >
      <ArenaLights />
      <Stars radius={52} depth={34} count={1200} factor={3.4} saturation={0} fade speed={0.85} />
      <Sparkles count={70} scale={[14, 7, 14]} size={2.6} speed={0.55} opacity={0.55} color={CYAN} />
      <HologramGlobe />
      <PolarBeacons />
      <OrbitRing radius={3.02} color={CYAN} tilt={1.18} speed={0.2} />
      <OrbitRing radius={3.38} color={MAGENTA} tilt={0.52} speed={-0.14} />
      <OrbitRing radius={3.78} color={VIOLET} tilt={1.66} speed={0.09} thickness={0.016} />
      <OrbitRing radius={4.22} color={GOLD} tilt={0.92} speed={-0.06} thickness={0.008} />
      <AuroraBand />
      <PulseRings />
      <EnergyArcs />
      <DataHelix />
      <SwarmProbes />
      <CrystalField />
      <OrbitingKnots />
      <NeonDebris />
      <Grid
        position={[0, -2.65, 0]}
        args={[28, 28]}
        cellSize={0.5}
        cellThickness={0.55}
        cellColor={MAGENTA}
        sectionSize={2}
        sectionThickness={1.15}
        sectionColor={CYAN}
        fadeDistance={17}
        fadeStrength={1.5}
        infiniteGrid
      />
      <CameraRig />
    </Canvas>
  );
}

export default NeonScene;
