import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneEnvironment } from './SceneEnvironment';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const BOLT_COUNT = 12;
const _mat4 = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3(1, 1, 1);
const _euler = new THREE.Euler();

const VaultGyroscope: React.FC<{
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}> = ({ pointerRef, reducedMotion }) => {
  const rootRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Group>(null);
  const middleRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreGroupRef = useRef<THREE.Group>(null);
  const boltsRef = useRef<THREE.InstancedMesh>(null);

  const boltGeo = useMemo(() => new THREE.CylinderGeometry(0.038, 0.038, 0.14, 10), []);
  const boltMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#D98245',
        metalness: 0.94,
        roughness: 0.18,
        clearcoat: 0.4,
      }),
    []
  );

  useEffect(() => {
    if (boltsRef.current) {
      for (let i = 0; i < BOLT_COUNT; i++) {
        const a = (i / BOLT_COUNT) * Math.PI * 2;
        _pos.set(Math.cos(a) * 1.44, Math.sin(a) * 1.44, 0);
        _euler.set(0, 0, a + Math.PI / 2);
        _quat.setFromEuler(_euler);
        _mat4.compose(_pos, _quat, _scale);
        boltsRef.current.setMatrixAt(i, _mat4);
      }
      boltsRef.current.instanceMatrix.needsUpdate = true;
      boltsRef.current.computeBoundingSphere();
    }
    return () => {
      boltGeo.dispose();
      boltMat.dispose();
    };
  }, [boltGeo, boltMat]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      const targetX = reducedMotion ? 0 : -pointerRef.current.y * 0.24;
      const targetY = reducedMotion ? 0 : pointerRef.current.x * 0.3;
      rootRef.current.rotation.x = THREE.MathUtils.damp(rootRef.current.rotation.x, targetX, 4.5, dt);
      rootRef.current.rotation.y = THREE.MathUtils.damp(rootRef.current.rotation.y, targetY, 4.5, dt);
    }

    if (!reducedMotion) {
      if (outerRef.current) {
        outerRef.current.rotation.x += dt * 0.2;
        outerRef.current.rotation.y += dt * 0.32;
      }
      if (middleRef.current) {
        middleRef.current.rotation.y -= dt * 0.42;
        middleRef.current.rotation.z += dt * 0.25;
      }
      if (innerRef.current) {
        innerRef.current.rotation.x -= dt * 0.55;
        innerRef.current.rotation.z -= dt * 0.3;
      }
      if (coreGroupRef.current) {
        coreGroupRef.current.rotation.y += dt * 0.72;
        coreGroupRef.current.position.y = Math.sin(t * 1.45) * 0.075;
        coreGroupRef.current.scale.setScalar(1 + Math.sin(t * 1.85) * 0.055);
      }
    }
  });

  return (
    <group ref={rootRef}>
      {/* Outer Heavy Dark Titanium Vault Ring with 12 Rose-Copper Locking Bolts */}
      <group ref={outerRef}>
        <mesh>
          <torusGeometry args={[1.44, 0.052, 22, 72]} />
          <meshPhysicalMaterial color="#1C1D22" metalness={0.86} roughness={0.22} clearcoat={0.6} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.38, 0.015, 14, 72]} />
          <meshPhysicalMaterial color="#F0D58A" metalness={0.96} roughness={0.14} />
        </mesh>
        <instancedMesh ref={boltsRef} args={[boltGeo, boltMat, BOLT_COUNT]} />
      </group>

      {/* Middle Warm Rose-Copper Stabilizing Gimbal */}
      <mesh ref={middleRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.12, 0.032, 18, 64]} />
        <meshPhysicalMaterial color="#D98245" metalness={0.92} roughness={0.2} clearcoat={0.45} />
      </mesh>

      {/* Inner Precision Emerald-Gold Equilibrium Ring */}
      <mesh ref={innerRef} rotation={[0, Math.PI / 4, Math.PI / 4]}>
        <torusGeometry args={[0.84, 0.024, 16, 56]} />
        <meshPhysicalMaterial
          color="#22C58B"
          emissive="#147850"
          emissiveIntensity={0.42}
          metalness={0.78}
          roughness={0.18}
          clearcoat={0.6}
        />
      </mesh>

      {/* Central Emerald Crystal Core inside Golden Octahedron Shield */}
      <group ref={coreGroupRef}>
        <mesh>
          <octahedronGeometry args={[0.38, 0]} />
          <meshPhysicalMaterial
            color="#22C58B"
            emissive="#147850"
            emissiveIntensity={0.65}
            metalness={0.35}
            roughness={0.12}
            clearcoat={1.0}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color="#F0D58A" wireframe transparent opacity={0.48} />
        </mesh>
      </group>

      {/* Dual-Tone Calibrated Floor Plinth Rings */}
      <mesh position={[0, -1.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.12, 1.18, 64]} />
        <meshBasicMaterial color="#22C58B" transparent opacity={0.38} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.26, 1.3, 64]} />
        <meshBasicMaterial color="#F0D58A" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const StaticVaultFallback: React.FC = () => (
  <div className="relative h-[260px] sm:h-[300px] w-full rounded-2xl hairline-gold flex items-center justify-center p-6">
    <svg viewBox="0 0 220 220" className="h-44 w-44" aria-label="Risk governance gyroscope emblem">
      <circle cx="110" cy="110" r="82" fill="none" stroke="#F0D58A" strokeOpacity="0.6" strokeWidth="2.5" />
      <ellipse cx="110" cy="110" rx="82" ry="34" transform="rotate(28 110 110)" fill="none" stroke="#D98245" strokeWidth="2" />
      <ellipse cx="110" cy="110" rx="82" ry="34" transform="rotate(-32 110 110)" fill="none" stroke="#22C58B" strokeOpacity="0.85" strokeWidth="2" />
      <polygon points="110,74 138,110 110,146 82,110" fill="#22C58B" fillOpacity="0.28" stroke="#F0D58A" strokeWidth="2.5" />
    </svg>
  </div>
);

export const RiskVaultScene3D: React.FC = () => {
  const { canRender3D, isSoftwareGl } = useDeviceCapability();
  const reducedMotion = useReducedMotion();
  const [contextLost, setContextLost] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  if (!canRender3D || contextLost) {
    return <StaticVaultFallback />;
  }

  return (
    <div
      className="relative h-[260px] sm:h-[300px] w-full rounded-2xl border border-[#C9A24B]/24 bg-[#050608] overflow-hidden"
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
        camera={{ position: [0, 0.25, 4.45], fov: 40 }}
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
        <hemisphereLight args={['#FFE8B8', '#081814', 0.72]} />
        <directionalLight position={[4, 5, 4]} intensity={2.1} color="#FFF0CE" />
        <directionalLight position={[-4, -2, -3]} intensity={1.7} color="#22C58B" />
        <VaultGyroscope pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default RiskVaultScene3D;
