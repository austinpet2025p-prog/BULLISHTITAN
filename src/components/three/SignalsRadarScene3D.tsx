import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneEnvironment } from './SceneEnvironment';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RadarTarget {
  pos: [number, number, number];
  bias: 'long' | 'short' | 'gold';
  phase: number;
}

const TARGET_BLIPS: RadarTarget[] = [
  { pos: [0.76, 0.28, 0.44], bias: 'long', phase: 0.2 },
  { pos: [-0.88, 0.38, -0.34], bias: 'gold', phase: 1.4 },
  { pos: [0.36, 0.26, -0.94], bias: 'short', phase: 2.3 },
  { pos: [-0.42, 0.24, 0.86], bias: 'long', phase: 3.1 },
  { pos: [0.18, 0.32, 0.36], bias: 'long', phase: 4.4 },
];

const BIAS_COLORS = {
  long: { main: '#22C58B', emissive: '#147850' },
  short: { main: '#D9534F', emissive: '#8A2B28' },
  gold: { main: '#F0D58A', emissive: '#C9A24B' },
};

function createRadarDialTexture(): THREE.CanvasTexture {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, cx);
    grad.addColorStop(0, '#0D1714');
    grad.addColorStop(0.55, '#090D0C');
    grad.addColorStop(1, '#050506');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Crosshairs
    ctx.strokeStyle = 'rgba(201, 162, 75, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, 24);
    ctx.lineTo(cx, size - 24);
    ctx.moveTo(24, cy);
    ctx.lineTo(size - 24, cy);
    ctx.stroke();

    // Concentric emerald & gold telemetry rings
    [76, 148, 220].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(34, 197, 139, 0.32)' : 'rgba(240, 213, 138, 0.28)';
      ctx.lineWidth = i === 2 ? 2.5 : 1.5;
      ctx.stroke();
    });

    // Degree azimuth tick marks around outer bezel
    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const major = deg % 30 === 0;
      const rIn = major ? 226 : 234;
      const rOut = 244;
      ctx.strokeStyle = major ? 'rgba(240, 213, 138, 0.65)' : 'rgba(201, 162, 75, 0.28)';
      ctx.lineWidth = major ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * rIn, cy + Math.sin(rad) * rIn);
      ctx.lineTo(cx + Math.cos(rad) * rOut, cy + Math.sin(rad) * rOut);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const RadarAssembly: React.FC<{
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}> = ({ pointerRef, reducedMotion }) => {
  const rootRef = useRef<THREE.Group>(null);
  const sweepRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const pulseMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const blipRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  const dialTex = useMemo(() => createRadarDialTexture(), []);

  const sweepShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.absarc(0, 0, 1.38, 0, Math.PI / 3.6, false);
    s.lineTo(0, 0);
    return s;
  }, []);

  useEffect(() => {
    return () => {
      dialTex.dispose();
    };
  }, [dialTex]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      const targetX = reducedMotion ? 0.44 : 0.44 - pointerRef.current.y * 0.16;
      const targetZ = reducedMotion ? 0 : -pointerRef.current.x * 0.15;
      rootRef.current.rotation.x = THREE.MathUtils.damp(rootRef.current.rotation.x, targetX, 4.5, dt);
      rootRef.current.rotation.z = THREE.MathUtils.damp(rootRef.current.rotation.z, targetZ, 4.5, dt);
    }

    if (sweepRef.current && !reducedMotion) {
      sweepRef.current.rotation.y -= dt * 1.15;
    }

    if (pulseRingRef.current && pulseMatRef.current && !reducedMotion) {
      const cycle = (t * 0.44) % 1;
      pulseRingRef.current.scale.setScalar(0.14 + cycle * 1.34);
      pulseMatRef.current.opacity = Math.max(0, (1 - cycle) * 0.55);
    }

    if (!reducedMotion) {
      for (let i = 0; i < TARGET_BLIPS.length; i++) {
        const m = blipRefs.current[i];
        const r = ringRefs.current[i];
        if (m) {
          const scale = 1 + Math.sin(t * 2.6 + TARGET_BLIPS[i].phase) * 0.18;
          m.scale.setScalar(scale);
          m.rotation.y += dt * 1.4;
        }
        if (r) {
          r.rotation.z = t * 1.5 + TARGET_BLIPS[i].phase;
        }
      }
    }
  });

  return (
    <group ref={rootRef} rotation={[0.44, 0, 0]} position={[0, -0.08, 0]}>
      {/* Machined Anodized Radar Platter + Engraved Compass Texture */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.48, 1.56, 0.1, 48]} />
        <meshPhysicalMaterial map={dialTex} metalness={0.55} roughness={0.35} clearcoat={0.5} />
      </mesh>

      {/* Outer Rose-Copper Bezel & Inner Emerald Calibration Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <torusGeometry args={[1.47, 0.032, 16, 72]} />
        <meshPhysicalMaterial color="#D98245" metalness={0.94} roughness={0.18} clearcoat={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
        <torusGeometry args={[0.92, 0.014, 12, 64]} />
        <meshStandardMaterial
          color="#22C58B"
          emissive="#147850"
          emissiveIntensity={0.45}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
        <torusGeometry args={[0.46, 0.012, 12, 56]} />
        <meshStandardMaterial color="#F0D58A" emissive="#C9A24B" emissiveIntensity={0.35} />
      </mesh>

      {/* Center Emerald Emitter Dome */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshPhysicalMaterial
          color="#22C58B"
          emissive="#22C58B"
          emissiveIntensity={0.8}
          clearcoat={1.0}
        />
      </mesh>

      {/* Expanding Emerald-Gold Telemetry Shockwave Ring */}
      <mesh ref={pulseRingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <torusGeometry args={[1.05, 0.014, 10, 64]} />
        <meshBasicMaterial
          ref={pulseMatRef}
          color="#22C58B"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Rotating Emerald-Gold Sweep Cone & Illuminated Lead Arm */}
      <group ref={sweepRef} position={[0, 0.025, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <shapeGeometry args={[sweepShape]} />
          <meshBasicMaterial
            color="#22C58B"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0.7, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 1.4, 8]} />
          <meshStandardMaterial color="#F0D58A" emissive="#F0D58A" emissiveIntensity={0.9} />
        </mesh>
      </group>

      {/* Elevated Long (Emerald), Short (Crimson), & Primary Gold Signal Beacons */}
      {TARGET_BLIPS.map((b, idx) => {
        const palette = BIAS_COLORS[b.bias];
        return (
          <group key={idx} position={[b.pos[0], 0, b.pos[2]]}>
            <mesh position={[0, b.pos[1] * 0.5, 0]}>
              <cylinderGeometry args={[0.012, 0.012, b.pos[1], 8]} />
              <meshBasicMaterial color={palette.main} transparent opacity={0.62} />
            </mesh>
            <mesh
              ref={(el) => {
                blipRefs.current[idx] = el;
              }}
              position={[0, b.pos[1], 0]}
            >
              <octahedronGeometry args={[0.082, 0]} />
              <meshPhysicalMaterial
                color={palette.main}
                emissive={palette.emissive}
                emissiveIntensity={0.78}
                metalness={0.55}
                roughness={0.16}
                clearcoat={0.8}
              />
            </mesh>
            <mesh
              ref={(el) => {
                ringRefs.current[idx] = el;
              }}
              position={[0, 0.02, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.09, 0.115, 24]} />
              <meshBasicMaterial color={palette.main} transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const SignalsRadarScene3D: React.FC = () => {
  const { canRender3D, isSoftwareGl } = useDeviceCapability();
  const reducedMotion = useReducedMotion();
  const [lost, setLost] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  if (!canRender3D || lost) {
    return (
      <div className="flex h-[240px] w-full items-center justify-center rounded-2xl hairline-gold p-6">
        <svg viewBox="0 0 180 180" className="h-40 w-40" aria-label="Signal radar scanner">
          <circle cx="90" cy="90" r="72" fill="#060B09" stroke="#D98245" strokeOpacity="0.65" strokeWidth="1.5" />
          <circle cx="90" cy="90" r="48" fill="none" stroke="#22C58B" strokeOpacity="0.6" strokeWidth="1.2" />
          <circle cx="90" cy="90" r="24" fill="none" stroke="#F0D58A" strokeOpacity="0.55" strokeWidth="1" />
          <path d="M90 90 L145 48" stroke="#22C58B" strokeWidth="2" />
          <circle cx="128" cy="62" r="4.5" fill="#22C58B" />
          <circle cx="56" cy="112" r="4.5" fill="#D9534F" />
          <circle cx="105" cy="128" r="4.5" fill="#F0D58A" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="h-[250px] sm:h-[280px] w-full relative"
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
      <Canvas
        camera={{ position: [0, 1.42, 3.35], fov: 40 }}
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
        <hemisphereLight args={['#FFE8B8', '#071410', 0.72]} />
        <directionalLight position={[3, 5, 3]} intensity={2.1} color="#FFF0CE" />
        <directionalLight position={[-3, 2, -2]} intensity={1.7} color="#22C58B" />
        <RadarAssembly pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default SignalsRadarScene3D;
