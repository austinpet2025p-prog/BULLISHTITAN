import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const SceneEnvironment: React.FC = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.18;

    const pmrem = new THREE.PMREMGenerator(gl);
    const env = new RoomEnvironment();
    const renderTarget = pmrem.fromScene(env, 0.04);
    scene.environment = renderTarget.texture;
    env.dispose();

    return () => {
      scene.environment = null;
      renderTarget.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
};
