import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RisingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
  bright: boolean;
}

/**
 * Soft brushed-gold particles drifting slowly upward like rising price action.
 * Pauses offscreen and disables motion cleanly under prefers-reduced-motion.
 */
export const AmbientMeshCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    let rafId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();

    const count = 34;
    const particles: RisingParticle[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * (canvas.width || 1280),
      y: Math.random() * (canvas.height || 760),
      vx: 0.04 + Math.random() * 0.09,
      vy: -(0.18 + Math.random() * 0.28),
      r: 0.9 + Math.random() * 1.4,
      alpha: 0.14 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
      bright: i % 3 === 0,
    }));

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let tick = 0;
    const draw = () => {
      if (isVisible && !document.hidden) {
        tick += 0.012;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(tick + p.phase) * 0.12;

          if (p.y < -12) {
            p.y = h + 12;
            p.x = Math.random() * w;
          }
          if (p.x > w + 12) p.x = -12;
          if (p.x < -12) p.x = w + 12;

          // Fade gracefully near top & bottom horizon edges
          const verticalFade = Math.min(1, Math.min(p.y / 90, (h - p.y) / 90));
          const finalAlpha = Math.max(0, p.alpha * verticalFade);

          // Soft multi-chromatic ambient halo (Gold, Sapphire, Emerald)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.6);
          const colorType = Math.round(p.phase * 10) % 5;
          if (colorType === 0) {
            grad.addColorStop(0, `rgba(96, 165, 250, ${finalAlpha})`);
            grad.addColorStop(1, 'rgba(96, 165, 250, 0)');
          } else if (colorType === 1) {
            grad.addColorStop(0, `rgba(52, 211, 153, ${finalAlpha})`);
            grad.addColorStop(1, 'rgba(52, 211, 153, 0)');
          } else if (p.bright) {
            grad.addColorStop(0, `rgba(240, 213, 138, ${finalAlpha})`);
            grad.addColorStop(1, 'rgba(240, 213, 138, 0)');
          } else {
            grad.addColorStop(0, `rgba(201, 162, 75, ${finalAlpha})`);
            grad.addColorStop(1, 'rgba(201, 162, 75, 0)');
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.6, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.72, 0, Math.PI * 2);
          ctx.fillStyle =
            colorType === 0
              ? `rgba(147, 197, 253, ${Math.min(0.6, finalAlpha * 1.4)})`
              : colorType === 1
                ? `rgba(110, 231, 183, ${Math.min(0.6, finalAlpha * 1.4)})`
                : p.bright
                  ? `rgba(240, 213, 138, ${Math.min(0.55, finalAlpha * 1.4)})`
                  : `rgba(201, 162, 75, ${Math.min(0.45, finalAlpha * 1.3)})`;
          ctx.fill();
        }
      }
      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Sovereign Sapphire, Imperial Emerald & Brushed Gold atmospheric mesh */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 78% 26%, rgba(59, 130, 246, 0.14), transparent 70%), radial-gradient(ellipse 52% 45% at 18% 68%, rgba(16, 185, 129, 0.11), transparent 70%), radial-gradient(ellipse 46% 40% at 50% 48%, rgba(201, 162, 75, 0.09), transparent 72%)',
        }}
      />
      {!reducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
};
