import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneEnvironment } from './SceneEnvironment';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const TRADER_DESKS: Array<{
  pos: [number, number, number];
  accent: string;
  phase: number;
}> = [
  { pos: [1.5, 0.52, 0.35], accent: '#22C58B', phase: 0.0 },
  { pos: [-1.5, 0.65, -0.25], accent: '#F0D58A', phase: 0.55 },
  { pos: [0.9, -0.92, 0.9], accent: '#E08A3C', phase: 1.1 },
  { pos: [-0.95, -0.85, 0.8], accent: '#22C58B', phase: 1.65 },
  { pos: [0.22, 1.32, -0.78], accent: '#EDE6D6', phase: 2.2 },
  { pos: [-0.32, -0.35, -1.38], accent: '#D98245', phase: 2.75 },
];

const _pulsePos = new THREE.Vector3();

function createMiniTerminalTexture(accent: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 96;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#07090B';
    ctx.fillRect(0, 0, 128, 96);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let y = 20; y < 90; y += 20) {
      ctx.beginPath();
      ctx.moveTo(8, y);
      ctx.lineTo(120, y);
      ctx.stroke();
    }
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(14, 72);
    ctx.lineTo(38, 56);
    ctx.lineTo(62, 62);
    ctx.lineTo(86, 36);
    ctx.lineTo(114, 22);
    ctx.stroke();

    ctx.fillStyle = '#22C58B';
    ctx.fillRect(36, 48, 6, 16);
    ctx.fillRect(84, 30, 6, 18);
    ctx.fillStyle = '#D9534F';
    ctx.fillRect(60, 56, 6, 12);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const NetworkLattice: React.FC<{
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}> = ({ pointerRef, reducedMotion }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseOutRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pulseInRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const screenTextures = useMemo(
    () => TRADER_DESKS.map((d) => createMiniTerminalTexture(d.accent)),
    []
  );

  const conduits = useMemo(() => {
    const origin = new THREE.Vector3(0, 0, 0);
    return TRADER_DESKS.map((desk) => {
      const target = new THREE.Vector3(...desk.pos);
      const midCtrl = origin
        .clone()
        .add(target)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0.24, 0));
      const curve = new THREE.QuadraticBezierCurve3(origin, midCtrl, target);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.015, 8, false);
      const lookQuat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        origin.clone().sub(target).normalize()
      );
      return { curve, tubeGeo, target, lookQuat, ...desk };
    });
  }, []);

  useEffect(() => {
    return () => {
      screenTextures.forEach((t) => t.dispose());
      conduits.forEach((c) => c.tubeGeo.dispose());
    };
  }, [screenTextures, conduits]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      if (!reducedMotion) {
        groupRef.current.rotation.y += dt * 0.28;
      }
      const targetX = reducedMotion
        ? 0.08
        : 0.08 + Math.sin(t * 0.5) * 0.07 - pointerRef.current.y * 0.22;
      const targetZ = reducedMotion ? 0 : -pointerRef.current.x * 0.16;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 4.5, dt);
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetZ, 4.5, dt);
    }

    if (ringARef.current && !reducedMotion) {
      ringARef.current.rotation.z += dt * 0.55;
    }
    if (ringBRef.current && !reducedMotion) {
      ringBRef.current.rotation.y -= dt * 0.45;
    }
    if (coreRef.current && !reducedMotion) {
      coreRef.current.rotation.y -= dt * 0.65;
    }

    // Two-way telemetry packets along curved Bezier conduits (emerald insights out, warm gold reviews in)
    if (!reducedMotion) {
      for (let i = 0; i < conduits.length; i++) {
        const outMesh = pulseOutRefs.current[i];
        const inMesh = pulseInRefs.current[i];
        const uOut = (t * 0.48 + conduits[i].phase * 0.35) % 1;
        const uIn = 1 - ((t * 0.42 + conduits[i].phase * 0.45 + 0.5) % 1);

        if (outMesh) {
          conduits[i].curve.getPointAt(uOut, _pulsePos);
          outMesh.position.copy(_pulsePos);
          outMesh.scale.setScalar(0.65 + Math.sin(uOut * Math.PI) * 0.65);
        }
        if (inMesh) {
          conduits[i].curve.getPointAt(uIn, _pulsePos);
          inMesh.position.copy(_pulsePos);
          inMesh.scale.setScalar(0.6 + Math.sin(uIn * Math.PI) * 0.55);
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Mentor Sovereign Hub (Emerald Core + Dual Rose-Copper / 24k Gold Gimbals) */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshPhysicalMaterial
          color="#22C58B"
          emissive="#147850"
          emissiveIntensity={0.62}
          metalness={0.35}
          roughness={0.14}
          clearcoat={1.0}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.52, 0]} />
        <meshBasicMaterial color="#F0D58A" wireframe transparent opacity={0.32} />
      </mesh>
      <mesh ref={ringARef} rotation={[Math.PI / 3, 0.3, 0]}>
        <torusGeometry args={[0.74, 0.025, 16, 64]} />
        <meshPhysicalMaterial color="#F0D58A" metalness={0.94} roughness={0.16} clearcoat={0.4} />
      </mesh>
      <mesh ref={ringBRef} rotation={[-Math.PI / 4, -0.4, 0]}>
        <torusGeometry args={[1.08, 0.02, 16, 64]} />
        <meshPhysicalMaterial color="#D98245" metalness={0.92} roughness={0.22} clearcoat={0.35} />
      </mesh>

      {/* Curved Network Conduits, Dual-Direction Signal Pulses & 6 Mini Trader Terminal Pods */}
      {conduits.map((c, idx) => (
        <group key={idx}>
          <mesh geometry={c.tubeGeo}>
            <meshStandardMaterial
              color="#D98245"
              emissive={c.accent}
              emissiveIntensity={0.22}
              metalness={0.82}
              roughness={0.28}
            />
          </mesh>

          {/* Outbound Emerald Coaching Signal */}
          <mesh
            ref={(el) => {
              pulseOutRefs.current[idx] = el;
            }}
          >
            <sphereGeometry args={[0.048, 12, 12]} />
            <meshStandardMaterial color="#22C58B" emissive="#22C58B" emissiveIntensity={1.0} />
          </mesh>

          {/* Inbound Warm Gold Chart Review */}
          <mesh
            ref={(el) => {
              pulseInRefs.current[idx] = el;
            }}
          >
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#F0D58A" emissive="#F0D58A" emissiveIntensity={0.95} />
          </mesh>

          {/* Sleek Trader Desk Terminal Node Facing Hub */}
          <group position={c.target} quaternion={c.lookQuat}>
            <mesh>
              <boxGeometry args={[0.36, 0.25, 0.04]} />
              <meshPhysicalMaterial color="#18181B" metalness={0.8} roughness={0.26} clearcoat={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.024]}>
              <planeGeometry args={[0.31, 0.2]} />
              <meshStandardMaterial
                map={screenTextures[idx]}
                emissiveMap={screenTextures[idx]}
                emissive="#FFFFFF"
                emissiveIntensity={0.68}
                roughness={0.2}
              />
            </mesh>
            {/* Glowing colored corner node collar */}
            <mesh position={[0, -0.15, 0]}>
              <cylinderGeometry args={[0.035, 0.06, 0.06, 16]} />
              <meshStandardMaterial
                color={c.accent}
                emissive={c.accent}
                emissiveIntensity={0.4}
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

export const MentorshipScene3D: React.FC = () => {
  const { canRender3D, isSoftwareGl } = useDeviceCapability();
  const reducedMotion = useReducedMotion();
  const [lost, setLost] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  if (!canRender3D || lost) {
    return (
      <div className="flex h-[300px] sm:h-[360px] w-full items-center justify-center rounded-3xl hairline-gold p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 h-20 w-20 rounded-full border-2 border-[#22C58B]/55 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-[#22C58B]/20 border border-[#F0D58A]" />
          </div>
          <p className="text-xs font-medium text-[#9A968C]">
            Mentor-to-Desk Network Alignment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-[320px] sm:h-[380px] w-full relative"
      onPointerMove={(e) => {
        if (reducedMotion || e.pointerType === 'touch') return;
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current.x = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2));
        pointerRef.current.y = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2));
      }}
      onPointerLeave={() => {
        pointerRef.current.x = 0;
        pointerRef.current.y = 0;
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-8 rounded-full opacity-55"
        style={{
          background:
            'radial-gradient(circle, rgba(34,197,139,0.14) 0%, rgba(217,130,69,0.08) 46%, transparent 72%)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0.35, 4.45], fov: 42 }}
        dpr={isSoftwareGl ? 1 : [1, 2]}
        gl={{ antialias: !isSoftwareGl, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setLost(true);
          });
        }}
      >
        <SceneEnvironment />
        <hemisphereLight args={['#FFE8B8', '#081812', 0.72]} />
        <directionalLight position={[4, 4, 4]} intensity={2.1} color="#FFF0CE" />
        <directionalLight position={[-4, 2, -2]} intensity={1.9} color="#22C58B" />
        <directionalLight position={[3, -3, -2]} intensity={1.5} color="#E08A3C" />
        <NetworkLattice pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default MentorshipScene3D;
