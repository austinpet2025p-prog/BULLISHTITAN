import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneEnvironment } from './SceneEnvironment';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface PointerOffset {
  x: number;
  y: number;
}

/**
 * Procedural soft radial gold glow sprite texture behind the helmet.
 * Zero external image dependencies.
 */
function createGoldGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const half = size / 2;
    const grad = ctx.createRadialGradient(half, half, 4, half, half, half);
    grad.addColorStop(0, 'rgba(240, 213, 138, 0.72)');
    grad.addColorStop(0.28, 'rgba(201, 162, 75, 0.34)');
    grad.addColorStop(0.62, 'rgba(140, 106, 31, 0.10)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Lightweight heroic 3D Corinthian / Spartan Helmet built from clean procedural geometry:
 * - Lathe crown shell with flared neck guard
 * - Sweeping tall arched crest + sculpted ridge base
 * - V-cut brow ridge + central nasal guard
 * - Forward-sweeping mirrored cheek guards framing a narrow eye slit
 * - Matte obsidian interior core for sharp eye-slit contrast
 */
const SpartanHelmetMesh: React.FC<{
  pointerRef: React.MutableRefObject<PointerOffset>;
  reducedMotion: boolean;
}> = ({ pointerRef, reducedMotion }) => {
  const spinGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    // 1. Helmet Cranium Dome + Flared Neck Apron (Lathe, partial frontal cutout around face)
    // Full revolved upper dome (above brow) + rear/side shell
    const domeProfile = [
      new THREE.Vector2(0.001, 1.06),
      new THREE.Vector2(0.32, 1.02),
      new THREE.Vector2(0.62, 0.84),
      new THREE.Vector2(0.76, 0.56),
      new THREE.Vector2(0.8, 0.32),
      new THREE.Vector2(0.78, 0.16),
    ];
    const craniumGeo = new THREE.LatheGeometry(domeProfile, 28);

    // Rear & side shell extending down into subtle flared Corinthian neck guard
    // theta leaves frontal ~104 deg window open for face/eye slit
    const rearShellProfile = [
      new THREE.Vector2(0.79, 0.34),
      new THREE.Vector2(0.79, 0.05),
      new THREE.Vector2(0.76, -0.25),
      new THREE.Vector2(0.84, -0.58),
      new THREE.Vector2(0.92, -0.78),
    ];
    const rearShellGeo = new THREE.LatheGeometry(
      rearShellProfile,
      24,
      Math.PI * 0.3,
      Math.PI * 1.4
    );

    // 2. Heroic Tall Sweeping Plume Crest (Extruded arc centered in YZ plane)
    const crestShape = new THREE.Shape();
    crestShape.moveTo(0.05, 1.0);
    crestShape.quadraticCurveTo(0.68, 1.38, 0.85, 0.92);
    crestShape.quadraticCurveTo(1.06, 0.25, 0.92, -0.55);
    crestShape.quadraticCurveTo(1.18, 0.22, 1.04, 1.06);
    crestShape.quadraticCurveTo(0.84, 1.72, -0.1, 1.56);
    crestShape.quadraticCurveTo(-0.74, 1.42, -0.92, 0.86);
    crestShape.quadraticCurveTo(-0.56, 1.12, 0.05, 1.0);
    crestShape.closePath();

    const crestGeo = new THREE.ExtrudeGeometry(crestShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.024,
      bevelSegments: 2,
      curveSegments: 16,
    });
    crestGeo.center();
    // Rotate crest into YZ sagittal plane (running front-to-back over crown)
    crestGeo.rotateY(Math.PI / 2);

    // Sculpted gold crest holder/comb running along the top crown ridge
    const combShape = new THREE.Shape();
    combShape.moveTo(-0.62, 0.36);
    combShape.quadraticCurveTo(-0.42, 0.92, 0.0, 1.05);
    combShape.quadraticCurveTo(0.56, 0.96, 0.78, 0.12);
    combShape.quadraticCurveTo(0.64, -0.4, 0.56, -0.45);
    combShape.quadraticCurveTo(0.66, 0.22, 0.44, 0.72);
    combShape.quadraticCurveTo(0.0, 0.88, -0.42, 0.68);
    combShape.closePath();

    const combGeo = new THREE.ExtrudeGeometry(combShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 14,
    });
    combGeo.center();
    combGeo.rotateY(Math.PI / 2);

    // 3. Brow Band + Central Nasal Guard (shapes the upper edge of the narrow eye slit)
    const nasalShape = new THREE.Shape();
    nasalShape.moveTo(-0.48, 0.26);
    nasalShape.lineTo(0.48, 0.26);
    nasalShape.lineTo(0.44, 0.14);
    nasalShape.lineTo(0.085, 0.06);
    nasalShape.lineTo(0.065, -0.34);
    nasalShape.lineTo(-0.065, -0.34);
    nasalShape.lineTo(-0.085, 0.06);
    nasalShape.lineTo(-0.44, 0.14);
    nasalShape.closePath();

    const nasalGeo = new THREE.ExtrudeGeometry(nasalShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.016,
      bevelSegments: 2,
      curveSegments: 8,
    });
    nasalGeo.center();

    // 4. Sculpted Cheek Guards (left + right symmetric beveled plates framing the narrow eye slit)
    const makeCheekShape = (sign: 1 | -1) => {
      const s = new THREE.Shape();
      // Start near temple, wrap forward & downward leaving a narrow angular eye slit
      s.moveTo(sign * 0.46, 0.14);
      s.lineTo(sign * 0.15, 0.01); // lower outer eye-slit corner
      s.lineTo(sign * 0.13, -0.18); // breathing slot outer edge
      s.lineTo(sign * 0.24, -0.66); // jaw point
      s.quadraticCurveTo(sign * 0.56, -0.56, sign * 0.68, -0.22);
      s.lineTo(sign * 0.62, 0.16);
      s.closePath();
      return s;
    };

    const cheekExtrudeOpts: THREE.ExtrudeGeometryOptions = {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 8,
    };

    const leftCheekGeo = new THREE.ExtrudeGeometry(makeCheekShape(-1), cheekExtrudeOpts);
    const rightCheekGeo = new THREE.ExtrudeGeometry(makeCheekShape(1), cheekExtrudeOpts);

    // 5. Recessed crown trim ring for architectural polish
    const collarGeo = new THREE.TorusGeometry(0.79, 0.024, 10, 32);

    // 6. Inner dark shadow core (for deep contrast behind narrow eye slit & jaw opening)
    const innerCoreGeo = new THREE.CylinderGeometry(0.65, 0.56, 1.02, 20);

    return {
      craniumGeo,
      rearShellGeo,
      crestGeo,
      combGeo,
      nasalGeo,
      leftCheekGeo,
      rightCheekGeo,
      collarGeo,
      innerCoreGeo,
    };
  }, []);

  const materials = useMemo(() => {
    const polishedGold = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D9B24C'),
      metalness: 0.96,
      roughness: 0.14,
      clearcoat: 0.35,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.55,
      side: THREE.DoubleSide,
    });

    const crestGold = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F0D58A'),
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.25,
      clearcoatRoughness: 0.16,
      envMapIntensity: 1.45,
    });

    const antiqueTrimGold = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8C6A1F'),
      metalness: 0.9,
      roughness: 0.34,
      envMapIntensity: 1.2,
    });

    const obsidianCore = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#040404'),
      metalness: 0.08,
      roughness: 0.94,
    });

    return { polishedGold, crestGold, antiqueTrimGold, obsidianCore };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [geometries, materials]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    if (!reducedMotion && spinGroupRef.current) {
      // Smooth slow 360-degree heroic rotation
      spinGroupRef.current.rotation.y += clampedDelta * 0.36;
    }

    if (tiltGroupRef.current) {
      const targetX = reducedMotion ? 0.06 : 0.06 - pointerRef.current.y * 0.14;
      const targetZ = reducedMotion ? 0 : -pointerRef.current.x * 0.08;
      const targetY = reducedMotion ? 0 : pointerRef.current.x * 0.18;

      tiltGroupRef.current.rotation.x = THREE.MathUtils.damp(
        tiltGroupRef.current.rotation.x,
        targetX,
        4.2,
        clampedDelta
      );
      tiltGroupRef.current.rotation.z = THREE.MathUtils.damp(
        tiltGroupRef.current.rotation.z,
        targetZ,
        4.2,
        clampedDelta
      );
      tiltGroupRef.current.rotation.y = THREE.MathUtils.damp(
        tiltGroupRef.current.rotation.y,
        targetY,
        4.2,
        clampedDelta
      );
    }
  });

  return (
    <group ref={tiltGroupRef} position={[0, -0.22, 0]} scale={1.12}>
      <group ref={spinGroupRef}>
        {/* Primary Cranium Dome */}
        <mesh geometry={geometries.craniumGeo} material={materials.polishedGold} />

        {/* Rear & Temple Shell with Neck Flare */}
        <mesh geometry={geometries.rearShellGeo} material={materials.polishedGold} />

        {/* Brow Ridge Trim Band */}
        <mesh
          geometry={geometries.collarGeo}
          material={materials.antiqueTrimGold}
          position={[0, 0.34, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* Heroic Tall Crest Comb & Plume */}
        <mesh
          geometry={geometries.combGeo}
          material={materials.antiqueTrimGold}
          position={[0, 0.54, 0.05]}
        />
        <mesh
          geometry={geometries.crestGeo}
          material={materials.crestGold}
          position={[0, 0.72, 0.06]}
        />

        {/* Brow + Nasal Bar forming upper edge of narrow eye slit */}
        <mesh
          geometry={geometries.nasalGeo}
          material={materials.polishedGold}
          position={[0, 0.08, 0.73]}
          rotation={[0.08, 0, 0]}
        />

        {/* Angled Left Cheek Guard framing narrow eye slit */}
        <mesh
          geometry={geometries.leftCheekGeo}
          material={materials.polishedGold}
          position={[-0.02, -0.02, 0.56]}
          rotation={[0, -0.34, 0]}
        />

        {/* Angled Right Cheek Guard framing narrow eye slit */}
        <mesh
          geometry={geometries.rightCheekGeo}
          material={materials.polishedGold}
          position={[0.02, -0.02, 0.56]}
          rotation={[0, 0.34, 0]}
        />

        {/* Obsidian Interior Shadow Core */}
        <mesh
          geometry={geometries.innerCoreGeo}
          material={materials.obsidianCore}
          position={[0, -0.08, -0.04]}
        />
      </group>
    </group>
  );
};

/**
 * Step 1: Soft gold radial light & glow plane sitting directly behind the helmet.
 */
const BackGoldGlow: React.FC = () => {
  const tex = useMemo(() => createGoldGlowTexture(), []);

  useEffect(() => {
    return () => {
      tex.dispose();
    };
  }, [tex]);

  return (
    <group position={[0, 0.15, -1.65]}>
      {/* Warm gold point light illuminating behind the helmet for halo rim glow */}
      <pointLight color="#F0D58A" intensity={7.5} distance={7} decay={2} />
      <mesh>
        <planeGeometry args={[4.4, 4.4]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.78}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const StaticHeroFallback: React.FC = () => (
  <div className="relative h-full w-full flex items-center justify-center">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute h-64 w-64 rounded-full opacity-55 blur-2xl"
      style={{
        background:
          'radial-gradient(circle, rgba(240,213,138,0.34) 0%, rgba(201,162,75,0.12) 55%, transparent 75%)',
      }}
    />
    <img
      src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.43.04_PM_dff4afd1.jpeg"
      alt="Bullish Titan golden Spartan crest"
      referrerPolicy="no-referrer"
      className="relative z-10 h-60 w-60 object-contain mix-blend-lighten select-none"
    />
  </div>
);

export const HeroScene3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { canRender3D, isSoftwareGl } = useDeviceCapability();
  const reducedMotion = useReducedMotion();
  const [contextLost, setContextLost] = useState(false);
  const pointerRef = useRef<PointerOffset>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Step 3: Window-level smooth mouse-follow event clamped to container viewport
  useEffect(() => {
    if (reducedMotion) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      pointerRef.current.x = Math.max(-1, Math.min(1, nx));
      pointerRef.current.y = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseLeaveWindow = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [reducedMotion]);

  if (!canRender3D || contextLost) {
    return <StaticHeroFallback />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-[340px] sm:h-[420px] lg:h-[500px] w-full flex items-center justify-center bg-transparent ${className}`}
      onPointerMove={(e) => {
        if (reducedMotion || e.pointerType === 'touch') return;
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current.x = Math.max(
          -1,
          Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2)
        );
        pointerRef.current.y = Math.max(
          -1,
          Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2)
        );
      }}
      onPointerLeave={() => {
        pointerRef.current.x = 0;
        pointerRef.current.y = 0;
      }}
    >
      {/* Step 2: Transparent Canvas Background (alpha: true, clearColor alpha = 0) */}
      <Canvas
        camera={{ position: [0, 0.25, 4.4], fov: 38 }}
        dpr={isSoftwareGl ? 1 : [1, 2]}
        gl={{
          antialias: !isSoftwareGl,
          alpha: true,
          powerPreference: 'high-performance',
        }}
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

        {/* Soft ambient grounding + front studio polish fill */}
        <hemisphereLight args={['#F0D58A', '#090909', 0.42]} />
        <directionalLight position={[0.8, 3.6, 4.2]} intensity={1.45} color="#FFF4D6" />

        {/* Warm metallic rim lights from left and right carving gold silhouette against darkness */}
        <directionalLight position={[-4.5, 1.4, -2.0]} intensity={2.8} color="#F0D58A" />
        <directionalLight position={[4.5, 1.1, -2.0]} intensity={2.4} color="#C9A24B" />

        {/* Step 1: Soft gold light behind the helmet for glow */}
        <BackGoldGlow />

        <SpartanHelmetMesh pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default HeroScene3D;
