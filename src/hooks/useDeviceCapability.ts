import { useEffect, useState } from 'react';
import { hasWebGLSupport, isSoftwareWebGL } from '../lib/webgl';
import { useReducedMotion } from './useReducedMotion';

interface NetworkInformationLike extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g' | string;
  saveData?: boolean;
}

export interface DeviceCapability {
  canRender3D: boolean;
  isLowPower: boolean;
  isSoftwareGl: boolean;
  isMobileViewport: boolean;
  isSlowConnection: boolean;
}

function detectSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g';
}

export function useDeviceCapability(): DeviceCapability {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<DeviceCapability>(() => {
    const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const webgl = hasWebGLSupport();
    const software = isSoftwareWebGL();
    const slowConn = detectSlowConnection();
    const lowMem =
      typeof navigator !== 'undefined' &&
      'deviceMemory' in navigator &&
      Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) <= 2;

    return {
      canRender3D: webgl && !reducedMotion && !mobile && !lowMem && !slowConn,
      isLowPower: mobile || lowMem || slowConn || reducedMotion,
      isSoftwareGl: software,
      isMobileViewport: mobile,
      isSlowConnection: slowConn,
    };
  });

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      const webgl = hasWebGLSupport();
      const software = isSoftwareWebGL();
      const slowConn = detectSlowConnection();
      const lowMem =
        'deviceMemory' in navigator &&
        Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) <= 2;

      setState({
        canRender3D: webgl && !reducedMotion && !mobile && !lowMem && !slowConn,
        isLowPower: mobile || lowMem || slowConn || reducedMotion,
        isSoftwareGl: software,
        isMobileViewport: mobile,
        isSlowConnection: slowConn,
      });
    };

    window.addEventListener('resize', update);
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    conn?.addEventListener?.('change', update);

    return () => {
      window.removeEventListener('resize', update);
      conn?.removeEventListener?.('change', update);
    };
  }, [reducedMotion]);

  return state;
}
