import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneEnvironment } from './SceneEnvironment';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const SESSION_ARCS: Array<{
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  packetColor: string;
}> = [
  { start: [0.95, 0.45, 0.5], end: [-0.85, 0.72, 0.42], color: '#22C58B', packetColor: '#6EE7B7' }, // London -> NY Emerald
  { start: [-0.95, -0.25, 0.58], end: [0.75, 0.8, -0.35], color: '#E08A3C', packetColor: '#FDE68A' }, // NY -> Tokyo Amber
  { start: [0.2, 1.05, 0.3], end: [0.85, -0.6, 0.55], color: '#F0D58A', packetColor: '#FFFFFF' }, // Gold Liquidity
  { start: [-0.45, 0.55, -0.92], end: [0.9, 0.25, 0.56], color: '#22C58B', packetColor: '#F0D58A' }, // Cross-session
];

const _arcPt = new THREE.Vector3();

function createFinancialGlobeTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 256;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (ctx) {
    // Rich deep midnight sapphire ocean gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#091118');
    bg.addColorStop(0.5, '#0D1821');
    bg.addColorStop(1, '#081016');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle longitude/latitude grid
    ctx.strokeStyle = 'rgba(201, 162, 75, 0.16)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Stylized sculpted gold & emerald financial hub continents/zones
    const landmasses: Array<[number, number, number, number, string]> = [
      [115, 76, 48, 34, 'rgba(201, 162, 75, 0.34)'],   // N America / NY
      [148, 160, 28, 42, 'rgba(140, 106, 31, 0.28)'],  // S America
      [252, 72, 34, 24, 'rgba(34, 197, 139, 0.38)'],   // Europe / London
      [268, 136, 38, 46, 'rgba(201, 162, 75, 0.32)'],  // Africa
      [340, 88, 66, 38, 'rgba(224, 138, 60, 0.34)'],   // Middle East & Asia / Dubai & Tokyo
      [416, 174, 30, 20, 'rgba(34, 197, 139, 0.28)'],  // Oceania
    ];
    landmasses.forEach(([x, y, rx, ry, col]) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(240, 213, 138, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const RotatingGlobe: React.FC<{
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}> = ({ pointerRef, reducedMotion }) => {
  const tiltRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Group>(null);
  const meridianRef = useRef<THREE.Mesh>(null);
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);

  const globeTex = useMemo(() => createFinancialGlobeTexture(), []);

  const arcGeometries = useMemo(() => {
    return SESSION_ARCS.map((arc, idx) => {
      const v0 = new THREE.Vector3(...arc.start).normalize().multiplyScalar(1.16);
      const v2 = new THREE.Vector3(...arc.end).normalize().multiplyScalar(1.16);
      const mid = v0.clone().add(v2).multiplyScalar(0.5).normalize().multiplyScalar(1.62);
      const curve = new THREE.QuadraticBezierCurve3(v0, mid, v2);
      const geo = new THREE.TubeGeometry(curve, 36, 0.015, 8, false);
      return { geo, curve, v0, v2, ...arc, phase: idx * 0.27 };
    });
  }, []);

  useEffect(() => {
    return () => {
      globeTex.dispose();
      arcGeometries.forEach((a) => a.geo.dispose());
    };
  }, [globeTex, arcGeometries]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (tiltRef.current) {
      const targetX = reducedMotion ? 0.2 : 0.2 - pointerRef.current.y * 0.22;
      const targetZ = reducedMotion ? -0.1 : -0.1 - pointerRef.current.x * 0.16;
      tiltRef.current.rotation.x = THREE.MathUtils.damp(tiltRef.current.rotation.x, targetX, 4.5, dt);
      tiltRef.current.rotation.z = THREE.MathUtils.damp(tiltRef.current.rotation.z, targetZ, 4.5, dt);
    }

    if (globeRef.current && !reducedMotion) {
      globeRef.current.rotation.y += dt * 0.24;
    }
    if (meridianRef.current && !reducedMotion) {
      meridianRef.current.rotation.z += dt * 0.18;
    }

    if (!reducedMotion) {
      for (let i = 0; i < arcGeometries.length; i++) {
        const packet = packetRefs.current[i];
        if (!packet) continue;
        const u = (t * 0.36 + arcGeometries[i].phase) % 1;
        arcGeometries[i].curve.getPointAt(u, _arcPt);
        packet.position.copy(_arcPt);
        packet.scale.setScalar(0.7 + Math.sin(u * Math.PI) * 0.65);
      }
    }
  });

  return (
    <group ref={tiltRef} rotation={[0.2, 0, -0.1]}>
      <group ref={globeRef}>
        {/* Textured Deep Midnight Sapphire & Gold Financial Globe */}
        <mesh>
          <sphereGeometry args={[1.14, 48, 48]} />
          <meshPhysicalMaterial
            map={globeTex}
            metalness={0.38}
            roughness={0.32}
            clearcoat={0.75}
            clearcoatRoughness={0.14}
          />
        </mesh>

        {/* Subtle outer atmosphere glass shell */}
        <mesh>
          <sphereGeometry args={[1.18, 36, 36]} />
          <meshPhysicalMaterial
            color="#22C58B"
            transparent
            opacity={0.07}
            depthWrite={false}
            roughness={0.1}
          />
        </mesh>

        {/* Equatorial Rose-Copper & Meridian 24k Gold Orbit Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.28, 0.016, 14, 72]} />
          <meshPhysicalMaterial color="#F0D58A" metalness={0.94} roughness={0.18} clearcoat={0.4} />
        </mesh>
        <mesh ref={meridianRef} rotation={[0.35, 0.6, 0]}>
          <torusGeometry args={[1.4, 0.013, 14, 72]} />
          <meshPhysicalMaterial color="#D98245" metalness={0.92} roughness={0.22} clearcoat={0.35} />
        </mesh>

        {/* Multi-Color Session Flow Arcs & Capital Packets */}
        {arcGeometries.map((item, idx) => (
          <group key={idx}>
            <mesh geometry={item.geo}>
              <meshStandardMaterial
                color={item.color}
                emissive={item.color}
                emissiveIntensity={0.48}
                metalness={0.82}
                roughness={0.2}
              />
            </mesh>
            <mesh
              ref={(el) => {
                packetRefs.current[idx] = el;
              }}
            >
              <sphereGeometry args={[0.056, 14, 14]} />
              <meshStandardMaterial
                color={item.packetColor}
                emissive={item.color}
                emissiveIntensity={1.0}
              />
            </mesh>
            <mesh position={item.v0}>
              <sphereGeometry args={[0.052, 16, 16]} />
              <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.7} />
            </mesh>
            <mesh position={item.v2}>
              <sphereGeometry args={[0.052, 16, 16]} />
              <meshStandardMaterial color="#F0D58A" emissive="#C9A24B" emissiveIntensity={0.65} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

export const InvestmentScene3D: React.FC = () => {
  const { canRender3D, isSoftwareGl } = useDeviceCapability();
  const reducedMotion = useReducedMotion();
  const [lost, setLost] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  if (!canRender3D || lost) {
    return (
      <div className="flex h-[320px] sm:h-[380px] w-full items-center justify-center rounded-3xl hairline-gold p-8">
        <svg viewBox="0 0 220 220" className="h-48 w-48" aria-label="Global structured capital network">
          <circle cx="110" cy="110" r="76" fill="#091118" stroke="#D98245" strokeOpacity="0.65" strokeWidth="1.5" />
          <ellipse cx="110" cy="110" rx="76" ry="26" fill="none" stroke="#F0D58A" strokeOpacity="0.7" strokeWidth="1.5" />
          <ellipse cx="110" cy="110" rx="34" ry="76" fill="none" stroke="#22C58B" strokeOpacity="0.6" strokeWidth="1.3" />
          <path d="M52 84 Q110 38 168 92" fill="none" stroke="#22C58B" strokeWidth="2.4" />
          <circle cx="52" cy="84" r="5" fill="#22C58B" />
          <circle cx="168" cy="92" r="5" fill="#F0D58A" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="h-[320px] sm:h-[400px] w-full relative"
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
        camera={{ position: [0, 0.25, 4.15], fov: 40 }}
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
        <hemisphereLight args={['#FFE8B8', '#07141D', 0.72]} />
        <directionalLight position={[4, 5, 4]} intensity={2.1} color="#FFF0CE" />
        <directionalLight position={[-4, 1, -3]} intensity={1.75} color="#22C58B" />
        <RotatingGlobe pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default InvestmentScene3D;
