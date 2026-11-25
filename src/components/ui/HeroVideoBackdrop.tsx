import React, { useEffect, useRef } from 'react';
import { useDeviceCapability } from '../../hooks/useDeviceCapability';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ParallaxTarget {
  x: number;
  y: number;
}

interface GoldParticle {
  x: number; // normalized [0, 1]
  y: number; // normalized [0, 1]
  radius: number;
  speedY: number; // normalized screens per sec
  swayFreq: number;
  swayAmp: number;
  phase: number;
  alpha: number;
  blurred: boolean;
  depthFactor: number; // px shift at full pointer deflection
}

interface CandlePoint {
  xNorm: number;
  yNorm: number;
  bodyRatio: number;
  wickRatio: number;
  phase: number;
  bullish: boolean;
}

const PRICE_SERIES = [
  0.86, 0.85, 0.825, 0.838, 0.808, 0.79, 0.802, 0.778, 0.755,
  0.768, 0.745, 0.725, 0.736, 0.715, 0.695, 0.708, 0.688, 0.668,
];

function createParticles(isMobile: boolean): GoldParticle[] {
  const fineCount = isMobile ? 16 : 44;
  const bokehCount = isMobile ? 3 : 6;
  const items: GoldParticle[] = [];

  for (let i = 0; i < fineCount; i++) {
    const seed = (i * 9301 + 49297) % 233280;
    const r1 = seed / 233280;
    const r2 = ((seed * 7 + 13) % 233280) / 233280;
    const r3 = ((seed * 19 + 41) % 233280) / 233280;
    items.push({
      x: r1,
      y: r2,
      radius: 0.9 + r3 * 1.9,
      speedY: 0.012 + r3 * 0.018, // calm upward price-action drift
      swayFreq: 0.25 + (i % 3) * 0.12,
      swayAmp: 0.004 + r1 * 0.007,
      phase: r2 * Math.PI * 2,
      alpha: 0.09 + r3 * 0.24,
      blurred: false,
      depthFactor: 9 + r3 * 8,
    });
  }

  for (let i = 0; i < bokehCount; i++) {
    const t = (i + 1) / (bokehCount + 1);
    items.push({
      x: (i * 0.37 + 0.12) % 0.9 + 0.05,
      y: t,
      radius: isMobile ? 12 + i * 3 : 15 + i * 3.2,
      speedY: 0.02 + (i % 2) * 0.008,
      swayFreq: 0.2,
      swayAmp: 0.008,
      phase: i * 1.4,
      alpha: 0.04 + (i % 3) * 0.014,
      blurred: true,
      depthFactor: 20 + i * 2,
    });
  }

  return items;
}

function createCandles(isMobile: boolean): CandlePoint[] {
  const step = isMobile ? 2 : 1;
  const points: CandlePoint[] = [];
  for (let i = 0; i < PRICE_SERIES.length; i += step) {
    const norm = i / (PRICE_SERIES.length - 1);
    const curr = PRICE_SERIES[i];
    const prev = PRICE_SERIES[Math.max(0, i - 1)];
    const bodyRatio = 0.018 + Math.abs(curr - prev) * 0.42 + ((i * 3) % 3) * 0.005;
    points.push({
      xNorm: 0.06 + norm * 0.88,
      yNorm: curr,
      bodyRatio,
      wickRatio: bodyRatio * 1.85,
      phase: norm * Math.PI * 2,
      bullish: curr <= prev,
    });
  }
  return points;
}

function createGlowSprite(
  size: number,
  blurred: boolean,
  tone: 'gold' | 'sapphire' | 'emerald' = 'gold'
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const gctx = c.getContext('2d');
  if (gctx) {
    const half = size / 2;
    const grad = gctx.createRadialGradient(half, half, 0, half, half, half);
    if (tone === 'sapphire') {
      grad.addColorStop(0, blurred ? 'rgba(96, 165, 250, 0.55)' : 'rgba(147, 197, 253, 0.95)');
      grad.addColorStop(0.4, 'rgba(59, 130, 246, 0.35)');
      grad.addColorStop(0.75, 'rgba(30, 64, 175, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (tone === 'emerald') {
      grad.addColorStop(0, blurred ? 'rgba(52, 211, 153, 0.52)' : 'rgba(110, 231, 183, 0.95)');
      grad.addColorStop(0.4, 'rgba(16, 185, 129, 0.34)');
      grad.addColorStop(0.75, 'rgba(6, 95, 70, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (blurred) {
      grad.addColorStop(0, 'rgba(240, 213, 138, 0.55)');
      grad.addColorStop(0.35, 'rgba(201, 162, 75, 0.32)');
      grad.addColorStop(0.7, 'rgba(140, 106, 31, 0.09)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      grad.addColorStop(0, 'rgba(240, 213, 138, 1)');
      grad.addColorStop(0.38, 'rgba(201, 162, 75, 0.65)');
      grad.addColorStop(0.78, 'rgba(140, 106, 31, 0.14)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, size, size);
  }
  return c;
}

export interface HeroVideoBackdropProps {
  parallaxRef?: React.MutableRefObject<ParallaxTarget>;
  children?: React.ReactNode;
}

/**
 * Hero Animation Backdrop Stage:
 * - Prepared clean canvas & DOM layer for custom HTML/CSS/JS hero animations
 * - Deep Obsidian backdrop with Sovereign Sapphire & Imperial Emerald atmospheric washes
 * - Lower-third candlesticks, rising trend trajectory, diagonal rays & parallax particles
 */
export const HeroVideoBackdrop: React.FC<HeroVideoBackdropProps> = ({
  parallaxRef,
  children,
}) => {
  const reducedMotion = useReducedMotion();
  const { isMobileViewport } = useDeviceCapability();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const sharpSprite = createGlowSprite(24, false, 'gold');
    const sharpSapphireSprite = createGlowSprite(24, false, 'sapphire');
    const sharpEmeraldSprite = createGlowSprite(24, false, 'emerald');
    const bokehSprite = createGlowSprite(64, true, 'gold');
    const bokehSapphireSprite = createGlowSprite(64, true, 'sapphire');
    const particles = createParticles(isMobileViewport);
    const candles = createCandles(isMobileViewport);

    let width = 1280;
    let height = 720;
    let dpr = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(320, Math.floor(rect.width));
      height = Math.max(320, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, isMobileViewport ? 1 : 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    let isVisibleInViewport = true;
    let rafId = 0;
    let lastTs = performance.now();
    let elapsed = 0;
    const smoothPointer: ParallaxTarget = { x: 0, y: 0 };

    const drawScene = (timeSec: number, isStatic: boolean) => {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Deep Obsidian base with subtle Sovereign Sapphire & Imperial Emerald atmospheric washes
      ctx.fillStyle = '#020306';
      ctx.fillRect(0, 0, width, height);

      const px = isStatic ? 0 : smoothPointer.x;
      const py = isStatic ? 0 : smoothPointer.y;

      const sapGrad = ctx.createRadialGradient(
        width * (0.22 - px * 0.04),
        height * (0.28 - py * 0.03),
        0,
        width * 0.22,
        height * 0.28,
        Math.max(width, height) * 0.65
      );
      sapGrad.addColorStop(0, 'rgba(37, 99, 235, 0.14)');
      sapGrad.addColorStop(0.5, 'rgba(30, 58, 138, 0.06)');
      sapGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sapGrad;
      ctx.fillRect(0, 0, width, height);

      const emGrad = ctx.createRadialGradient(
        width * (0.78 - px * 0.04),
        height * (0.68 - py * 0.03),
        0,
        width * 0.78,
        height * 0.68,
        Math.max(width, height) * 0.55
      );
      emGrad.addColorStop(0, 'rgba(16, 185, 129, 0.11)');
      emGrad.addColorStop(0.55, 'rgba(6, 78, 59, 0.05)');
      emGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = emGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Soft diagonal gold & sapphire light rays sweeping slowly every 10 seconds
      if (!isStatic) {
        const rayCycle = (timeSec % 10) / 10;
        const sweepCenter = -0.35 + rayCycle * 1.7;
        const sweepFade = Math.sin(rayCycle * Math.PI);

        const drawBeam = (
          offsetNorm: number,
          beamWidthRatio: number,
          peakAlpha: number,
          rgb: string
        ) => {
          const cx = (sweepCenter + offsetNorm) * width;
          const beamW = width * beamWidthRatio;
          const skew = height * 0.42;

          const grad = ctx.createLinearGradient(cx - beamW * 0.6, 0, cx + beamW * 0.6, 0);
          grad.addColorStop(0, `rgba(${rgb}, 0)`);
          grad.addColorStop(0.5, `rgba(${rgb}, ${peakAlpha * sweepFade})`);
          grad.addColorStop(1, `rgba(${rgb}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(cx - beamW * 0.5, 0);
          ctx.lineTo(cx + beamW * 0.5, 0);
          ctx.lineTo(cx + beamW * 0.5 - skew, height);
          ctx.lineTo(cx - beamW * 0.5 - skew, height);
          ctx.closePath();
          ctx.fill();
        };

        drawBeam(0, 0.34, 0.042, '240, 213, 138');
        drawBeam(0.22, 0.22, 0.032, '96, 165, 250');
      }

      // 2. Lower-third emerald/crimson candlestick chart + prismatic emerald-gold trend line
      const chartShiftX = -px * 6;
      const chartShiftY = -py * 4;
      const trendPts: Array<{ x: number; y: number }> = [];

      ctx.save();
      ctx.translate(chartShiftX, chartShiftY);

      const candleWidth = isMobileViewport ? 5 : 6;
      for (let i = 0; i < candles.length; i++) {
        const c = candles[i];
        const bx = c.xNorm * width;
        const breathe = isStatic ? 0 : Math.sin(timeSec * 0.45 + c.phase) * 3.5;
        const bodyH = c.bodyRatio * height;
        const wickH = c.wickRatio * height;
        const cy = c.yNorm * height + breathe;

        trendPts.push({ x: bx, y: cy - bodyH * 0.35 });

        const candleAlpha = c.bullish ? 0.16 : 0.11;
        ctx.strokeStyle = c.bullish
          ? `rgba(52, 211, 153, ${candleAlpha})`
          : `rgba(244, 63, 94, ${candleAlpha * 0.9})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx, cy - wickH * 0.5);
        ctx.lineTo(bx, cy + wickH * 0.5);
        ctx.stroke();

        ctx.fillStyle = c.bullish
          ? `rgba(34, 197, 139, ${candleAlpha})`
          : `rgba(244, 63, 94, ${candleAlpha * 0.85})`;
        ctx.fillRect(bx - candleWidth * 0.5, cy - bodyH * 0.5, candleWidth, bodyH);
      }

      if (trendPts.length > 1) {
        const cycleDur = 12.5;
        const cyclePos = isStatic ? 0.5 : (timeSec % cycleDur) / cycleDur;
        let drawProgress = 1;
        let lineAlpha = 0.36;

        if (!isStatic) {
          if (cyclePos < 0.72) {
            const p = cyclePos / 0.72;
            drawProgress = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
            lineAlpha = 0.36;
          } else if (cyclePos < 0.9) {
            drawProgress = 1;
            lineAlpha = 0.36;
          } else {
            drawProgress = 1;
            lineAlpha = 0.36 * (1 - (cyclePos - 0.9) / 0.1);
          }
        }

        const totalSegs = trendPts.length - 1;
        const exactSeg = drawProgress * totalSegs;
        const fullSegs = Math.floor(exactSeg);
        const frac = exactSeg - fullSegs;

        const lineGrad = ctx.createLinearGradient(
          trendPts[0].x,
          trendPts[0].y,
          trendPts[trendPts.length - 1].x,
          trendPts[trendPts.length - 1].y
        );
        lineGrad.addColorStop(0, `rgba(96, 165, 250, ${lineAlpha * 0.85})`);
        lineGrad.addColorStop(0.5, `rgba(240, 213, 138, ${lineAlpha * 1.1})`);
        lineGrad.addColorStop(1, `rgba(52, 211, 153, ${lineAlpha * 1.15})`);

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.45;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(trendPts[0].x, trendPts[0].y);

        for (let i = 1; i <= fullSegs && i < trendPts.length; i++) {
          ctx.lineTo(trendPts[i].x, trendPts[i].y);
        }

        let tipX = trendPts[Math.min(fullSegs, totalSegs)].x;
        let tipY = trendPts[Math.min(fullSegs, totalSegs)].y;
        if (fullSegs < totalSegs && frac > 0) {
          const p0 = trendPts[fullSegs];
          const p1 = trendPts[fullSegs + 1];
          tipX = p0.x + (p1.x - p0.x) * frac;
          tipY = p0.y + (p1.y - p0.y) * frac;
          ctx.lineTo(tipX, tipY);
        }
        ctx.stroke();

        if (!isStatic && drawProgress > 0.02 && drawProgress < 0.995) {
          ctx.globalAlpha = lineAlpha * 1.5;
          ctx.drawImage(sharpEmeraldSprite, tipX - 7, tipY - 7, 14, 14);
          ctx.globalAlpha = 1;
        }
      }
      ctx.restore();

      // 3. Upward-drifting gold, sapphire & emerald particles at varied depths
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const yNorm = isStatic
          ? p.y
          : (((p.y - timeSec * p.speedY) % 1.08) + 1.08) % 1.08 - 0.04;
        const swayX = isStatic
          ? 0
          : Math.sin(timeSec * p.swayFreq + p.phase) * p.swayAmp * width;

        const drawX = p.x * width + swayX - px * p.depthFactor;
        const drawY = yNorm * height - py * (p.depthFactor * 0.65);

        const edgeFade = Math.min(
          1,
          Math.max(0, yNorm * 7),
          Math.max(0, (1 - yNorm) * 7)
        );
        const alpha = p.alpha * edgeFade;
        if (alpha <= 0.005) continue;

        const sprite = p.blurred
          ? i % 2 === 0
            ? bokehSprite
            : bokehSapphireSprite
          : i % 5 === 0
            ? sharpSapphireSprite
            : i % 7 === 0
              ? sharpEmeraldSprite
              : sharpSprite;
        const size = p.radius * (p.blurred ? 2.9 : 4.2);

        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, drawX - size * 0.5, drawY - size * 0.5, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (document.hidden || !isVisibleInViewport) {
        lastTs = now;
        return;
      }

      const dt = Math.min(0.05, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;
      elapsed += dt;

      const targetX = parallaxRef?.current.x ?? 0;
      const targetY = parallaxRef?.current.y ?? 0;
      smoothPointer.x += (targetX - smoothPointer.x) * 0.06;
      smoothPointer.y += (targetY - smoothPointer.y) * 0.06;

      drawScene(elapsed, false);
    };

    const handleVisibilityChange = () => {
      if (reducedMotion) return;
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        lastTs = performance.now();
        if (!rafId) {
          rafId = window.requestAnimationFrame(tick);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleInViewport = entries[0]?.isIntersecting ?? true;
        if (isVisibleInViewport && !reducedMotion && !document.hidden && !rafId) {
          lastTs = performance.now();
          rafId = window.requestAnimationFrame(tick);
        }
      },
      { threshold: 0.02 }
    );
    observer.observe(container);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (reducedMotion) {
      drawScene(0, true);
    } else if (!document.hidden) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, [isMobileViewport, parallaxRef, reducedMotion]);

  return (
    <div
      id="hero-animation-stage"
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#000000]"
    >
      {/* Clean Atmospheric Canvas Bed */}
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Custom HTML/CSS/JS Animation Slot */}
      {children}

      {/* Subtle film grain finish */}
      <div className="hero-film-grain pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-screen" />

      {/* Measured Dark Navy & Obsidian Vignette + Lower Headline Legibility Scrim */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 38%, rgba(2,3,6,0.08) 0%, rgba(2,3,6,0.52) 70%, rgba(0,0,0,0.94) 100%), linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(2,3,6,0.42) 38%, rgba(2,3,6,0.14) 100%)',
        }}
      />
    </div>
  );
};
