import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneEnvironment } from './SceneEnvironment';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ScrollKineticSculpture3DProps {
  scrollProgressRef: React.MutableRefObject<number>;
  activeStage: number;
  className?: string;
}

const CANDLE_COUNT = 16;
const TICK_COUNT = 24;
const DUST_COUNT = 54;

// Pre-allocated scratch math helpers (zero GC inside animation loop)
const _mat4 = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _euler = new THREE.Euler();

// Authentic trading candle palette: Bullish Emerald, Sovereign Gold, Bearish Pullback Crimson
const CANDLE_BIASES: Array<'bull' | 'gold' | 'bear'> = [
  'bull', 'bull', 'bear', 'bull',
  'gold', 'bull', 'bear', 'bull',
  'bull', 'gold', 'bear', 'bull',
  'bull', 'bear', 'gold', 'bull',
];

const SESSION_SATELLITES = [
  { label: 'London', color: '#22C58B', radius: 1.56, speed: 0.42, tilt: 0.25, phase: 0.2 },
  { label: 'New York', color: '#F0D58A', radius: 1.38, speed: -0.52, tilt: -0.35, phase: 1.9 },
  { label: 'Tokyo', color: '#E08A3C', radius: 1.72, speed: 0.34, tilt: 0.55, phase: 3.4 },
  { label: 'Synthetics', color: '#EDE6D6', radius: 1.18, speed: 0.64, tilt: -0.22, phase: 4.8 },
];

interface KineticAstrolabeProps {
  scrollProgressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  pulseRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}

const KineticAstrolabeMesh: React.FC<KineticAstrolabeProps> = ({
  scrollProgressRef,
  pointerRef,
  pulseRef,
  reducedMotion,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const copperRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);
  const barsRef = useRef<THREE.InstancedMesh>(null);
  const wicksRef = useRef<THREE.InstancedMesh>(null);
  const ticksRef = useRef<THREE.InstancedMesh>(null);
  const satRefs = useRef<(THREE.Mesh | null)[]>([]);
  const dustRef = useRef<THREE.Points>(null);

  const smoothScrollRef = useRef(0);

  const geometries = useMemo(() => {
    const outerTorus = new THREE.TorusGeometry(1.66, 0.028, 20, 96);
    const copperTorus = new THREE.TorusGeometry(1.32, 0.024, 18, 84);
    const innerTorus = new THREE.TorusGeometry(0.92, 0.018, 16, 72);
    const coreCrystal = new THREE.OctahedronGeometry(0.38, 0);
    const coreRingCollar = new THREE.TorusGeometry(0.49, 0.016, 12, 48);
    const coreGlassCage = new THREE.IcosahedronGeometry(0.62, 1);
    const barGeo = new THREE.BoxGeometry(0.092, 1, 0.092);
    const wickGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 8);
    const tickGeo = new THREE.BoxGeometry(0.02, 0.095, 0.02);
    const satGeo = new THREE.OctahedronGeometry(0.068, 0);

    // Helical dual-tone liquidity spline
    const curvePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      curvePts.push(
        new THREE.Vector3(
          Math.cos(a) * 1.48,
          Math.sin(a * 2) * 0.36,
          Math.sin(a) * 1.48
        )
      );
    }
    const flowCurve = new THREE.CatmullRomCurve3(curvePts, true);
    const ribbonGeo = new THREE.TubeGeometry(flowCurve, 96, 0.013, 8, true);

    // Orbital warm golden + emerald dust particle field
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustColors = new Float32Array(DUST_COUNT * 3);
    const cGold = new THREE.Color('#F0D58A');
    const cEmerald = new THREE.Color('#22C58B');
    const cCopper = new THREE.Color('#E08A3C');

    for (let i = 0; i < DUST_COUNT; i++) {
      const theta = ((i * 137.5) % 360) * (Math.PI / 180);
      const r = 1.05 + ((i * 19) % 13) * 0.095;
      const y = (((i * 29) % 21) - 10) * 0.14;
      dustPositions[i * 3] = Math.cos(theta) * r;
      dustPositions[i * 3 + 1] = y;
      dustPositions[i * 3 + 2] = Math.sin(theta) * r;

      const pick = i % 5 === 0 ? cEmerald : i % 4 === 0 ? cCopper : cGold;
      dustColors[i * 3] = pick.r;
      dustColors[i * 3 + 1] = pick.g;
      dustColors[i * 3 + 2] = pick.b;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    return {
      outerTorus,
      copperTorus,
      innerTorus,
      coreCrystal,
      coreRingCollar,
      coreGlassCage,
      barGeo,
      wickGeo,
      tickGeo,
      satGeo,
      ribbonGeo,
      dustGeo,
    };
  }, []);

  const materials = useMemo(() => {
    const brightGold = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F0D58A'),
      metalness: 0.94,
      roughness: 0.14,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.55,
    });

    const roseCopper = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D98245'),
      metalness: 0.92,
      roughness: 0.2,
      clearcoat: 0.35,
      envMapIntensity: 1.45,
    });

    const antiqueBronze = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8C6A1F'),
      metalness: 0.88,
      roughness: 0.32,
      envMapIntensity: 1.2,
    });

    const emeraldHeart = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1F9D6B'),
      emissive: new THREE.Color('#147850'),
      emissiveIntensity: 0.55,
      metalness: 0.35,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.6,
    });

    const sapphireGlassCage = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#9FE6C8'),
      metalness: 0.1,
      roughness: 0.12,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      clearcoat: 1.0,
      envMapIntensity: 1.6,
    });

    // Instanced candle body material (uses instanceColor cleanly with white base)
    const candleInstanceMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      metalness: 0.48,
      roughness: 0.22,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.35,
    });

    const wickMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EDE6D6'),
      metalness: 0.86,
      roughness: 0.22,
    });

    const satMaterials = SESSION_SATELLITES.map(
      (s) =>
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(s.color),
          emissive: new THREE.Color(s.color),
          emissiveIntensity: 0.5,
          metalness: 0.72,
          roughness: 0.2,
        })
    );

    const dustMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      brightGold,
      roseCopper,
      antiqueBronze,
      emeraldHeart,
      sapphireGlassCage,
      candleInstanceMat,
      wickMat,
      satMaterials,
      dustMat,
    };
  }, []);

  // Initialize meridian ticks and color-coded bullish/bearish/gold candle instances
  useEffect(() => {
    if (ticksRef.current) {
      for (let i = 0; i < TICK_COUNT; i++) {
        const a = (i / TICK_COUNT) * Math.PI * 2;
        _pos.set(Math.cos(a) * 1.66, Math.sin(a) * 1.66, 0);
        _euler.set(0, 0, a + Math.PI / 2);
        _quat.setFromEuler(_euler);
        const lenScale = i % 6 === 0 ? 1.5 : 0.8;
        _scale.set(1, lenScale, 1);
        _mat4.compose(_pos, _quat, _scale);
        ticksRef.current.setMatrixAt(i, _mat4);
      }
      ticksRef.current.instanceMatrix.needsUpdate = true;
      ticksRef.current.computeBoundingSphere();
    }

    if (barsRef.current) {
      const cBull = new THREE.Color('#22C58B');
      const cGold = new THREE.Color('#F0D58A');
      const cBear = new THREE.Color('#D9534F');
      for (let i = 0; i < CANDLE_COUNT; i++) {
        const bias = CANDLE_BIASES[i];
        barsRef.current.setColorAt(
          i,
          bias === 'bull' ? cBull : bias === 'bear' ? cBear : cGold
        );
      }
      if (barsRef.current.instanceColor) {
        barsRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
      materials.brightGold.dispose();
      materials.roseCopper.dispose();
      materials.antiqueBronze.dispose();
      materials.emeraldHeart.dispose();
      materials.sapphireGlassCage.dispose();
      materials.candleInstanceMat.dispose();
      materials.wickMat.dispose();
      materials.dustMat.dispose();
      materials.satMaterials.forEach((m) => m.dispose());
    };
  }, [geometries, materials]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const targetProgress = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);
    smoothScrollRef.current = THREE.MathUtils.damp(smoothScrollRef.current, targetProgress, 5.5, dt);
    const p = smoothScrollRef.current;

    pulseRef.current = THREE.MathUtils.damp(pulseRef.current, 0, 3.0, dt);
    const pulse = pulseRef.current;

    // Brighten emerald heart on click shockwave
    materials.emeraldHeart.emissiveIntensity = 0.52 + pulse * 0.9;

    if (rootRef.current) {
      const targetRotX = (reducedMotion ? 0.16 : 0.16 - pointerRef.current.y * 0.24) + p * 0.25;
      const targetRotY = (reducedMotion ? 0 : pointerRef.current.x * 0.36) + p * Math.PI * 0.85;
      rootRef.current.rotation.x = THREE.MathUtils.damp(rootRef.current.rotation.x, targetRotX, 4.5, dt);
      rootRef.current.rotation.y = THREE.MathUtils.damp(rootRef.current.rotation.y, targetRotY, 4.5, dt);
      rootRef.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.95) * 0.05;
    }

    if (outerRingRef.current && !reducedMotion) {
      outerRingRef.current.rotation.z = t * 0.14 + p * 1.4;
      outerRingRef.current.rotation.x = Math.sin(t * 0.35 + p * 2.5) * 0.22;
    }
    if (copperRingRef.current && !reducedMotion) {
      copperRingRef.current.rotation.y = -t * 0.28 - p * 2.1;
      copperRingRef.current.rotation.x = Math.PI / 3 + p * 0.65;
    }
    if (innerRingRef.current && !reducedMotion) {
      innerRingRef.current.rotation.z = t * 0.44 + p * 3.0;
      innerRingRef.current.rotation.y = Math.PI / 4 + Math.cos(t * 0.4) * 0.25;
    }
    if (dustRef.current && !reducedMotion) {
      dustRef.current.rotation.y = t * 0.08;
    }

    if (coreRef.current) {
      if (!reducedMotion) {
        coreRef.current.rotation.y += dt * (0.55 + pulse * 2.1);
        coreRef.current.rotation.x = Math.sin(t * 0.7) * 0.2;
      }
      const coreScale = 1 + pulse * 0.2 + Math.sin(p * Math.PI) * 0.08;
      coreRef.current.scale.setScalar(coreScale);
    }

    // Orbit 4 colored session satellites
    if (!reducedMotion) {
      for (let i = 0; i < SESSION_SATELLITES.length; i++) {
        const sat = satRefs.current[i];
        if (!sat) continue;
        const cfg = SESSION_SATELLITES[i];
        const a = t * cfg.speed + cfg.phase + p * 1.6;
        sat.position.set(
          Math.cos(a) * cfg.radius,
          Math.sin(a * 1.2) * cfg.tilt,
          Math.sin(a) * cfg.radius
        );
        sat.rotation.y = t * 1.4;
      }
    }

    // Morph 16 colored candlesticks + metallic wicks smoothly across the 4 scroll poses
    if (barsRef.current && wicksRef.current) {
      const wStage1 = THREE.MathUtils.smoothstep(p, 0.1, 0.42);
      const wStage2 = THREE.MathUtils.smoothstep(p, 0.42, 0.72);
      const wStage3 = THREE.MathUtils.smoothstep(p, 0.72, 0.98);

      for (let i = 0; i < CANDLE_COUNT; i++) {
        const u = i / (CANDLE_COUNT - 1);
        const angle = (i / CANDLE_COUNT) * Math.PI * 2 + (reducedMotion ? 0 : t * 0.2);
        const wave = reducedMotion ? 0 : Math.sin(t * 1.7 - i * 0.45) * 0.08;
        const isBear = CANDLE_BIASES[i] === 'bear';

        // Pose 0: Upward bullish market staircase in front hemisphere
        const arcX = (u - 0.5) * 2.28;
        const arcY = -0.34 + u * 0.68 + (isBear ? -0.1 : 0) + wave * 0.6;
        const arcZ = 0.56 + Math.cos((u - 0.5) * Math.PI) * 0.34;
        const h0 = 0.24 + u * 0.42;

        // Pose 1: Balanced circular risk-parity ring
        const orbR1 = 1.08 + pulse * 0.24;
        const orbX1 = Math.cos(angle) * orbR1;
        const orbY1 = Math.sin(i * 1.1 + (reducedMotion ? 0 : t * 1.2)) * 0.22;
        const orbZ1 = Math.sin(angle) * orbR1;
        const h1 = 0.32 + Math.abs(Math.sin(i * 0.7)) * 0.34;

        // Pose 2: Sweeping velocity helix
        const orbR2 = 1.32 + Math.sin(angle * 2) * 0.18 + pulse * 0.28;
        const orbX2 = Math.cos(angle + 0.6) * orbR2;
        const orbY2 = Math.cos(angle * 2 + (reducedMotion ? 0 : t)) * 0.44;
        const orbZ2 = Math.sin(angle + 0.6) * orbR2;
        const h2 = 0.48 + (i % 4) * 0.12;

        // Pose 3: Tight Sovereign Crown around emerald-gold heart
        const crownR = 0.8 + (i % 2) * 0.16;
        const orbX3 = Math.cos(angle) * crownR;
        const orbY3 = (i % 2 === 0 ? 0.18 : -0.18) + wave * 0.5;
        const orbZ3 = Math.sin(angle) * crownR;
        const h3 = 0.56 - (i % 2) * 0.18;

        let x = THREE.MathUtils.lerp(arcX, orbX1, wStage1);
        let y = THREE.MathUtils.lerp(arcY, orbY1, wStage1);
        let z = THREE.MathUtils.lerp(arcZ, orbZ1, wStage1);
        let h = THREE.MathUtils.lerp(h0, h1, wStage1);

        x = THREE.MathUtils.lerp(x, orbX2, wStage2);
        y = THREE.MathUtils.lerp(y, orbY2, wStage2);
        z = THREE.MathUtils.lerp(z, orbZ2, wStage2);
        h = THREE.MathUtils.lerp(h, h2, wStage2);

        x = THREE.MathUtils.lerp(x, orbX3, wStage3);
        y = THREE.MathUtils.lerp(y, orbY3, wStage3);
        z = THREE.MathUtils.lerp(z, orbZ3, wStage3);
        h = THREE.MathUtils.lerp(h, h3, wStage3);

        _pos.set(x, y, z);
        _euler.set(
          wStage2 * 0.32 * Math.sin(angle),
          -angle * wStage1,
          wStage2 * 0.24 * Math.cos(angle)
        );
        _quat.setFromEuler(_euler);

        // Candle body transform
        _scale.set(1 + pulse * 0.24, h + pulse * 0.28, 1 + pulse * 0.24);
        _mat4.compose(_pos, _quat, _scale);
        barsRef.current.setMatrixAt(i, _mat4);

        // Matching upper/lower metallic wick transform
        _scale.set(1, h * 1.68 + 0.16 + pulse * 0.32, 1);
        _mat4.compose(_pos, _quat, _scale);
        wicksRef.current.setMatrixAt(i, _mat4);
      }

      barsRef.current.instanceMatrix.needsUpdate = true;
      wicksRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={rootRef}>
      {/* Outer Antique Gold Calibrated Meridian Ring + 24 Bright Gold Ticks */}
      <group ref={outerRingRef}>
        <mesh geometry={geometries.outerTorus} material={materials.antiqueBronze} />
        <instancedMesh
          ref={ticksRef}
          args={[geometries.tickGeo, materials.brightGold, TICK_COUNT]}
        />
      </group>

      {/* Warm Rose-Copper Counter-Rotating Gimbal Ring */}
      <mesh
        ref={copperRingRef}
        geometry={geometries.copperTorus}
        material={materials.roseCopper}
        rotation={[Math.PI / 3, 0, 0]}
      />

      {/* Inner 24k Gold Gyroscope */}
      <mesh
        ref={innerRingRef}
        geometry={geometries.innerTorus}
        material={materials.brightGold}
        rotation={[0, Math.PI / 4, 0]}
      />

      {/* Helical Rose-Copper Liquidity Spline */}
      <mesh geometry={geometries.ribbonGeo} material={materials.roseCopper} />

      {/* Central Emerald Crystal Core + Translucent Sapphire Glass Shield */}
      <group ref={coreRef}>
        <mesh geometry={geometries.coreCrystal} material={materials.emeraldHeart} />
        <mesh
          geometry={geometries.coreRingCollar}
          material={materials.brightGold}
          rotation={[Math.PI / 2, 0.3, 0]}
        />
        <mesh geometry={geometries.coreGlassCage} material={materials.sapphireGlassCage} />
      </group>

      {/* 4 Orbiting Session Satellites (London Emerald, NY Gold, Tokyo Copper, Synthetics Ivory) */}
      {SESSION_SATELLITES.map((s, idx) => (
        <mesh
          key={s.label}
          ref={(el) => {
            satRefs.current[idx] = el;
          }}
          geometry={geometries.satGeo}
          material={materials.satMaterials[idx]}
        />
      ))}

      {/* 16 Scroll-Morphing Colored Bullish/Bearish/Gold Candlesticks + Wicks */}
      <instancedMesh
        ref={barsRef}
        args={[geometries.barGeo, materials.candleInstanceMat, CANDLE_COUNT]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={wicksRef}
        args={[geometries.wickGeo, materials.wickMat, CANDLE_COUNT]}
        frustumCulled={false}
      />

      {/* Orbital Multi-Hue Micro-Particles */}
      <points ref={dustRef} geometry={geometries.dustGeo} material={materials.dustMat} />
    </group>
  );
};

const StaticAstrolabeFallback: React.FC<{ activeStage: number }> = ({ activeStage }) => (
  <div className="relative h-[340px] sm:h-[420px] lg:h-[500px] w-full flex flex-col items-center justify-center rounded-2xl border border-[#C9A24B]/20 bg-[#050506] p-8">
    <svg viewBox="0 0 240 240" className="h-56 w-56" aria-label="Kinetic market astrolabe">
      <defs>
        <linearGradient id="static-astro-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D98245" />
          <stop offset="52%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#F0D58A" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="94" fill="none" stroke="url(#static-astro-gold)" strokeOpacity="0.55" strokeWidth="1.4" />
      <ellipse
        cx="120"
        cy="120"
        rx="94"
        ry="34"
        transform={`rotate(${24 + activeStage * 22} 120 120)`}
        fill="none"
        stroke="#22C58B"
        strokeOpacity="0.65"
        strokeWidth="1.5"
      />
      <ellipse
        cx="120"
        cy="120"
        rx="80"
        ry="28"
        transform={`rotate(${-30 - activeStage * 18} 120 120)`}
        fill="none"
        stroke="#D98245"
        strokeOpacity="0.8"
        strokeWidth="1.3"
      />
      {/* Colored Candlestick Trio */}
      <rect x="92" y="106" width="8" height="24" rx="1.5" fill="#22C58B" />
      <rect x="116" y="92" width="8" height="36" rx="1.5" fill="#F0D58A" />
      <rect x="140" y="98" width="8" height="20" rx="1.5" fill="#D9534F" />
    </svg>
    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#9A968C]">
      Step 0{activeStage + 1} · Market Guide
    </p>
  </div>
);

export const ScrollKineticSculpture3D: React.FC<ScrollKineticSculpture3DProps> = ({
  scrollProgressRef,
  activeStage,
  className = '',
}) => {
  const { canRender3D, isSoftwareGl } = useDeviceCapability();
  const reducedMotion = useReducedMotion();
  const [contextLost, setContextLost] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pulseRef = useRef(0);

  if (!canRender3D || contextLost) {
    return <StaticAstrolabeFallback activeStage={activeStage} />;
  }

  return (
    <div
      className={`relative h-[340px] sm:h-[420px] lg:h-[520px] w-full select-none cursor-pointer ${className}`}
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
      onClick={() => {
        if (!reducedMotion) {
          pulseRef.current = 1.0;
        }
      }}
    >
      {/* Multi-tonal radial studio glow (warm gold + deep emerald rim) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-8 rounded-full opacity-70"
        style={{
          background:
            'radial-gradient(circle at 46% 48%, rgba(240,213,138,0.16) 0%, rgba(31,157,107,0.12) 38%, rgba(217,130,69,0.06) 58%, transparent 76%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0.28, 4.75], fov: 38 }}
        dpr={isSoftwareGl ? 1 : [1, 2]}
        gl={{ antialias: !isSoftwareGl, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setContextLost(true);
          });
        }}
      >
        <SceneEnvironment />
        <hemisphereLight args={['#FFE8B8', '#091512', 0.65]} />
        <directionalLight position={[4, 5, 4]} intensity={2.0} color="#FFF0CE" />
        <directionalLight position={[-4.5, 1.5, -2.5]} intensity={2.2} color="#22C58B" />
        <directionalLight position={[4.5, -1.5, -2.5]} intensity={2.1} color="#E08A3C" />
        <pointLight position={[0, 0, 0]} intensity={1.8} distance={3.2} color="#22C58B" />
        <KineticAstrolabeMesh
          scrollProgressRef={scrollProgressRef}
          pointerRef={pointerRef}
          pulseRef={pulseRef}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
};

export default ScrollKineticSculpture3D;
