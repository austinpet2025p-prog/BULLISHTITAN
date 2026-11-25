import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneEnvironment } from './SceneEnvironment';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CandleSpec {
  x: number;
  baseY: number;
  h: number;
  bull: boolean;
  highlight?: boolean;
}

const CANDLE_SPECS: CandleSpec[] = [
  { x: -0.92, baseY: 0.42, h: 0.34, bull: true },
  { x: -0.55, baseY: 0.52, h: 0.28, bull: false },
  { x: -0.18, baseY: 0.62, h: 0.48, bull: true },
  { x: 0.19, baseY: 0.78, h: 0.32, bull: false },
  { x: 0.56, baseY: 0.9, h: 0.58, bull: true },
  { x: 0.93, baseY: 1.12, h: 0.72, bull: true, highlight: true },
];

function createPlaybookPageTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EDE6D6';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle chart grid lines
    ctx.strokeStyle = 'rgba(140, 106, 31, 0.16)';
    ctx.lineWidth = 2;
    for (let i = 48; i < 480; i += 48) {
      ctx.beginPath();
      ctx.moveTo(28, i);
      ctx.lineTo(484, i);
      ctx.stroke();
    }

    // Printed bullish curve diagram & gold header rule
    ctx.strokeStyle = '#1F9D6B';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(54, 380);
    ctx.bezierCurveTo(160, 340, 260, 210, 446, 120);
    ctx.stroke();

    ctx.fillStyle = '#8C6A1F';
    ctx.fillRect(54, 52, 180, 10);
    ctx.fillStyle = 'rgba(140, 106, 31, 0.35)';
    ctx.fillRect(54, 76, 120, 6);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const PlaybookAssembly: React.FC<{
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}> = ({ pointerRef, reducedMotion }) => {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const barRefs = useRef<(THREE.Group | null)[]>([]);

  const pageTex = useMemo(() => createPlaybookPageTexture(), []);

  const trendCurveGeo = useMemo(() => {
    const pts = CANDLE_SPECS.map((c) => new THREE.Vector3(c.x, c.baseY + c.h * 0.42, 0.24));
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 48, 0.024, 10, false);
  }, []);

  useEffect(() => {
    return () => {
      pageTex.dispose();
      trendCurveGeo.dispose();
    };
  }, [pageTex, trendCurveGeo]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      if (!reducedMotion) {
        groupRef.current.rotation.y += dt * 0.3;
        groupRef.current.position.y = Math.sin(t * 1.15) * 0.065;
      }
      const targetX = reducedMotion ? 0.34 : 0.34 - pointerRef.current.y * 0.18;
      const targetZ = reducedMotion ? 0 : -pointerRef.current.x * 0.14;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 4.5, dt);
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetZ, 4.5, dt);
    }

    if (haloRef.current && !reducedMotion) {
      haloRef.current.rotation.z = t * 0.42;
    }

    if (!reducedMotion) {
      for (let i = 0; i < CANDLE_SPECS.length; i++) {
        const bar = barRefs.current[i];
        if (!bar) continue;
        const spec = CANDLE_SPECS[i];
        const wave = Math.sin(t * 2.0 - i * 0.72) * 0.08;
        bar.position.y = spec.baseY + wave;
        bar.scale.y = 1 + Math.sin(t * 2.0 - i * 0.72) * 0.14;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[0.34, -0.4, 0]}>
      {/* Warm Rose-Copper Orbiting Meridian Halo */}
      <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.36, 0]}>
        <torusGeometry args={[1.76, 0.018, 16, 72]} />
        <meshPhysicalMaterial color="#D98245" metalness={0.94} roughness={0.18} clearcoat={0.4} />
      </mesh>

      {/* Polished Gold Book Spine & Corner Clasps */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[0.18, 0.15, 2.08]} />
        <meshPhysicalMaterial color="#F0D58A" metalness={0.95} roughness={0.16} clearcoat={0.5} />
      </mesh>

      {/* Emerald Silk Ribbon Bookmark */}
      <mesh position={[0.14, -0.18, 1.08]} rotation={[0.4, 0, -0.08]}>
        <boxGeometry args={[0.09, 0.02, 0.46]} />
        <meshStandardMaterial color="#1F9D6B" emissive="#146B48" emissiveIntensity={0.3} roughness={0.6} />
      </mesh>

      {/* Left Espresso-Leather Cover + Ruled Institutional Manuscript Pages */}
      <group position={[-0.8, -0.1, 0]} rotation={[0, 0, -0.18]}>
        <mesh>
          <boxGeometry args={[1.48, 0.08, 2.04]} />
          <meshStandardMaterial color="#1F1812" metalness={0.35} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[1.36, 0.1, 1.9]} />
          <meshStandardMaterial map={pageTex} metalness={0.04} roughness={0.82} />
        </mesh>
        {/* Gold corner trim accents */}
        <mesh position={[-0.68, 0.03, 0.96]}>
          <boxGeometry args={[0.14, 0.1, 0.14]} />
          <meshStandardMaterial color="#F0D58A" metalness={0.95} roughness={0.18} />
        </mesh>
      </group>

      {/* Right Espresso-Leather Cover + Ivory Pages */}
      <group position={[0.8, -0.1, 0]} rotation={[0, 0, 0.18]}>
        <mesh>
          <boxGeometry args={[1.48, 0.08, 2.04]} />
          <meshStandardMaterial color="#1F1812" metalness={0.35} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[1.36, 0.1, 1.9]} />
          <meshStandardMaterial map={pageTex} color="#F3EBDD" metalness={0.04} roughness={0.82} />
        </mesh>
        <mesh position={[0.68, 0.03, 0.96]}>
          <boxGeometry args={[0.14, 0.1, 0.14]} />
          <meshStandardMaterial color="#F0D58A" metalness={0.95} roughness={0.18} />
        </mesh>
      </group>

      {/* Floating 24k Gold Moving Average Ribbon */}
      <mesh geometry={trendCurveGeo}>
        <meshStandardMaterial
          color="#F0D58A"
          emissive="#C9A24B"
          emissiveIntensity={0.48}
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* 6 Realistic Bullish Emerald & Bearish Crimson 3D Candlesticks with Wicks */}
      {CANDLE_SPECS.map((c, idx) => {
        const bodyColor = c.highlight ? '#F0D58A' : c.bull ? '#22C58B' : '#D9534F';
        const emissiveColor = c.highlight ? '#C9A24B' : c.bull ? '#147850' : '#8A2B28';
        return (
          <group
            key={c.x}
            ref={(el) => {
              barRefs.current[idx] = el;
            }}
            position={[c.x, c.baseY, 0]}
          >
            <mesh>
              <boxGeometry args={[0.17, c.h, 0.17]} />
              <meshPhysicalMaterial
                color={bodyColor}
                emissive={emissiveColor}
                emissiveIntensity={0.42}
                metalness={0.45}
                roughness={0.2}
                clearcoat={0.75}
              />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.018, 0.018, c.h + 0.34, 10]} />
              <meshStandardMaterial color="#EDE6D6" metalness={0.88} roughness={0.22} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const TrainingScene3D: React.FC = () => {
  const { canRender3D, isSoftwareGl } = useDeviceCapability();
  const reducedMotion = useReducedMotion();
  const [lost, setLost] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  if (!canRender3D || lost) {
    return (
      <div className="flex h-[300px] sm:h-[360px] w-full items-center justify-center rounded-3xl hairline-gold p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 h-20 w-32 rounded-2xl border border-[#C9A24B]/40 bg-[#141414] flex items-end justify-center gap-2 p-3">
            <span className="w-2.5 h-6 bg-[#22C58B] rounded-sm" />
            <span className="w-2.5 h-4 bg-[#D9534F] rounded-sm" />
            <span className="w-2.5 h-9 bg-[#22C58B] rounded-sm" />
            <span className="w-2.5 h-12 bg-[#F0D58A] rounded-sm" />
          </div>
          <p className="text-xs font-medium text-[#9A968C]">
            3-Track Execution Playbook
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
            'radial-gradient(circle, rgba(31,157,107,0.14) 0%, rgba(240,213,138,0.10) 45%, transparent 72%)',
        }}
      />
      <Canvas
        camera={{ position: [0, 1.18, 4.5], fov: 40 }}
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
        <hemisphereLight args={['#FFE8B8', '#091512', 0.72]} />
        <directionalLight position={[4, 5, 4]} intensity={2.1} color="#FFF0CE" />
        <directionalLight position={[-4, 2, -2]} intensity={1.8} color="#22C58B" />
        <directionalLight position={[4, -1, -3]} intensity={1.5} color="#E08A3C" />
        <PlaybookAssembly pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default TrainingScene3D;
