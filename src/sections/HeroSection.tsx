import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { animate, motion, useMotionValue } from 'motion/react';
import { ArrowRight, FastForward, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  getCachedTransparentCrestUrl,
  loadTransparentCrestUrl,
} from '../lib/transparentLogo';

export const HERO_CREST_IMAGE =
  '/assets/aistudio/tsk_5beac2cdfd8b3dba927c484075c61334_44d53053.png';

// Pre-warm transparent crest extraction immediately at module load so no white frame ever renders
if (typeof window !== 'undefined') {
  void loadTransparentCrestUrl(HERO_CREST_IMAGE);
}

const FOREX_SYNTHETIC_PAIRS: Array<[string, number]> = [
  ['XAU/USD', 2742.6],
  ['EUR/USD', 1.0842],
  ['GBP/USD', 1.2731],
  ['NAS100', 20480.3],
  ['US30', 42890.5],
  ['V75 Index', 418620.4],
  ['Boom 1000', 14218.75],
  ['USD/JPY', 153.42],
];

const HEADLINE_LEAD_WORDS = ['Simple,', 'Calm'];
const HEADLINE_ACCENT_WORDS = ['Smart', 'Trading.'];

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
}

interface SmokePuff {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  ph: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  g: number;
}

interface HoloChartPoint {
  x: number;
  y: number;
  price: number;
  pctDelta: number;
  timeLabel: string;
}

interface HoloHoverPayload {
  symbol: string;
  point: HoloChartPoint;
  clientX: number;
  clientY: number;
}

interface HoloPanelSpec {
  id: string;
  sym: string;
  basePrice: number;
  isChart: boolean;
  transform: string;
  z: number;
  basePhase: number;
  floatAmplitude: number;
  floatDuration: number;
  floatDelay: number;
  initialPrice: number;
  initialPct: number;
  points: HoloChartPoint[];
  pointsAttr: string;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

const formatPrice = (v: number) =>
  v < 10
    ? v.toFixed(4)
    : v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

function buildSparklinePoints(basePrice: number): {
  points: HoloChartPoint[];
  pointsAttr: string;
  latestPrice: number;
} {
  const count = 18;
  const rawPrices: number[] = [];
  let running = basePrice * rand(0.986, 0.998);
  for (let i = 0; i < count; i++) {
    running = running * (1 + rand(-0.0038, 0.0046));
    rawPrices.push(running);
  }
  const startPrice = rawPrices[0];
  const points: HoloChartPoint[] = rawPrices.map((price, i) => ({
    x: (i * 120) / (count - 1),
    y: 20,
    price,
    pctDelta: ((price - startPrice) / startPrice) * 100,
    timeLabel: i === count - 1 ? 'Live Close' : `-${count - 1 - i}h`,
  }));
  const pointsAttr = computeSparklineAttr(points, basePrice);
  return { points, pointsAttr, latestPrice: points[points.length - 1].price };
}

function computeSparklineAttr(points: HoloChartPoint[], basePrice: number): string {
  let minP = Infinity;
  let maxP = -Infinity;
  for (const pt of points) {
    if (pt.price < minP) minP = pt.price;
    if (pt.price > maxP) maxP = pt.price;
  }
  const span = Math.max(maxP - minP, basePrice * 0.0005);
  return points
    .map((pt) => {
      pt.y = 35 - ((pt.price - minP) / span) * 29;
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');
}

function generateHoloPanels(width: number, height: number): HoloPanelSpec[] {
  const count = width < 700 ? 8 : 14;
  const result: HoloPanelSpec[] = [];
  for (let i = 0; i < count; i++) {
    const z = rand(-1500, -300);
    const fs = 800 / (800 - (z + 1000));
    let sx = 0;
    let sy = 0;
    do {
      sx = rand(-0.48, 0.48) * width;
      sy = rand(-0.42, 0.42) * height;
    } while (Math.abs(sx) < width * 0.22 && Math.abs(sy) < height * 0.22);

    const [sym, basePrice] = FOREX_SYNTHETIC_PAIRS[i % FOREX_SYNTHETIC_PAIRS.length];
    const isChart = i % 2 === 0;
    const spark = buildSparklinePoints(basePrice);

    result.push({
      id: `holo-${i}-${sym}`,
      sym,
      basePrice,
      isChart,
      transform: `translate3d(${(sx / fs).toFixed(1)}px, ${(sy / fs).toFixed(1)}px, ${z.toFixed(1)}px) translate(-50%, -50%)`,
      z,
      basePhase: rand(0, Math.PI * 2),
      floatAmplitude: Number(rand(5.5, 13.5).toFixed(1)),
      floatDuration: Number(rand(3.4, 6.8).toFixed(2)),
      floatDelay: Number(rand(0, 2.2).toFixed(2)),
      initialPrice: isChart ? spark.latestPrice : basePrice * rand(0.992, 1.008),
      initialPct: rand(-0.85, 2.85),
      points: spark.points,
      pointsAttr: spark.pointsAttr,
    });
  }
  return result;
}

interface HoloPanelCardProps {
  panel: HoloPanelSpec;
  idx: number;
  reducedMotion: boolean;
  panelDomRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  pxDomRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  chgDomRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  polyDomRefs: React.MutableRefObject<(SVGPolylineElement | null)[]>;
  hitPolyDomRefs: React.MutableRefObject<(SVGPolylineElement | null)[]>;
  guideDomRefs: React.MutableRefObject<(SVGLineElement | null)[]>;
  intervalBandDomRefs: React.MutableRefObject<(SVGRectElement | null)[]>;
  intervalTagDomRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  dotDomRefs: React.MutableRefObject<(SVGCircleElement | null)[]>;
  hoverIdxRefs: React.MutableRefObject<number[]>;
  chartPulseTriggersRef: React.MutableRefObject<Array<(() => void) | undefined>>;
  onShowTooltip: (payload: HoloHoverPayload) => void;
  onHideTooltip: () => void;
}

const HoloPanelCard: React.FC<HoloPanelCardProps> = ({
  panel,
  idx,
  reducedMotion,
  panelDomRefs,
  pxDomRefs,
  chgDomRefs,
  polyDomRefs,
  hitPolyDomRefs,
  guideDomRefs,
  intervalBandDomRefs,
  intervalTagDomRefs,
  dotDomRefs,
  hoverIdxRefs,
  chartPulseTriggersRef,
  onShowTooltip,
  onHideTooltip,
}) => {
  const pulseScale = useMotionValue(1);

  useEffect(() => {
    if (!panel.isChart || reducedMotion) {
      chartPulseTriggersRef.current[idx] = undefined;
      pulseScale.set(1);
      return;
    }

    let delayTimer: number | undefined;
    const triggerPulse = () => {
      window.clearTimeout(delayTimer);
      delayTimer = window.setTimeout(() => {
        const isHovered = hoverIdxRefs.current[idx] >= 0;
        const peakScale = isHovered ? 1.022 : 1.042;
        animate(pulseScale, [1, peakScale, 1], {
          duration: 0.46,
          times: [0, 0.34, 1],
          ease: [0.22, 1, 0.36, 1],
        });
      }, (idx % 5) * 65);
    };

    chartPulseTriggersRef.current[idx] = triggerPulse;
    return () => {
      window.clearTimeout(delayTimer);
      chartPulseTriggersRef.current[idx] = undefined;
    };
  }, [idx, panel.isChart, reducedMotion, pulseScale, hoverIdxRefs, chartPulseTriggersRef]);

  return (
    <div
      ref={(el) => {
        panelDomRefs.current[idx] = el;
      }}
      className="bt-holo-panel"
      style={{ transform: panel.transform }}
    >
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                y: [
                  -panel.floatAmplitude,
                  panel.floatAmplitude,
                  -panel.floatAmplitude,
                ],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: panel.floatDuration,
                delay: panel.floatDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        style={panel.isChart && !reducedMotion ? { scale: pulseScale } : undefined}
        className={`bt-holo-card ${panel.isChart ? 'bt-chart' : 'bt-tick'}`}
      >
        {panel.isChart ? (
          <>
            <div className="bt-row">
              <span className="bt-sym">{panel.sym}</span>
              <span
                ref={(el) => {
                  chgDomRefs.current[idx] = el;
                }}
                className={`bt-chg ${panel.initialPct >= 0 ? 'bt-up' : 'bt-down'}`}
              >
                {formatPct(panel.initialPct)}
              </span>
            </div>
            <div className="bt-chart-stage">
              <span
                ref={(el) => {
                  intervalTagDomRefs.current[idx] = el;
                }}
                className="bt-interval-tag"
              />
              <svg
                viewBox="0 0 120 40"
                preserveAspectRatio="none"
                onPointerMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  if (rect.width <= 0) return;
                  const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
                  const mouseSvgX = ratio * 120;
                  const count = panel.points.length;
                  const ptIdx = Math.round(ratio * (count - 1));
                  hoverIdxRefs.current[idx] = ptIdx;
                  const pt = panel.points[ptIdx];

                  // Highlight active data point's time-interval column along the x-axis
                  const stepW = count > 1 ? 120 / (count - 1) : 120;
                  const bandStart = clamp(pt.x - stepW * 0.5, 0, 120);
                  const bandEnd = clamp(pt.x + stepW * 0.5, 0, 120);
                  const bandEl = intervalBandDomRefs.current[idx];
                  if (bandEl) {
                    bandEl.setAttribute('x', bandStart.toFixed(2));
                    bandEl.setAttribute(
                      'width',
                      Math.max(2, bandEnd - bandStart).toFixed(2)
                    );
                    bandEl.setAttribute('opacity', '1');
                  }

                  // Vertical crosshair line smoothly tracks cursor X within the SVG
                  const guideEl = guideDomRefs.current[idx];
                  if (guideEl) {
                    guideEl.setAttribute('x1', mouseSvgX.toFixed(2));
                    guideEl.setAttribute('x2', mouseSvgX.toFixed(2));
                    guideEl.setAttribute('opacity', '1');
                  }

                  // Snap active vertex indicator to the highlighted interval's data point
                  const dotEl = dotDomRefs.current[idx];
                  if (dotEl) {
                    dotEl.setAttribute('cx', pt.x.toFixed(1));
                    dotEl.setAttribute('cy', pt.y.toFixed(1));
                    dotEl.setAttribute('opacity', '1');
                  }

                  // Track time-interval badge along the top edge without SVG text stretching
                  const tagEl = intervalTagDomRefs.current[idx];
                  if (tagEl) {
                    const pctLeft = clamp(ratio * 100, 16, 84);
                    tagEl.textContent = pt.timeLabel;
                    tagEl.style.left = `${pctLeft.toFixed(1)}%`;
                    tagEl.style.transform = 'translateX(-50%)';
                    tagEl.style.opacity = '1';
                  }

                  onShowTooltip({
                    symbol: panel.sym,
                    point: pt,
                    clientX: e.clientX,
                    clientY: e.clientY,
                  });
                }}
                onPointerLeave={() => {
                  hoverIdxRefs.current[idx] = -1;
                  intervalBandDomRefs.current[idx]?.setAttribute('opacity', '0');
                  guideDomRefs.current[idx]?.setAttribute('opacity', '0');
                  dotDomRefs.current[idx]?.setAttribute('opacity', '0');
                  const tagEl = intervalTagDomRefs.current[idx];
                  if (tagEl) tagEl.style.opacity = '0';
                  onHideTooltip();
                }}
              >
                <defs>
                  <linearGradient
                    id={`bt-holo-interval-grad-${panel.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="rgba(240, 213, 138, 0.24)" />
                    <stop offset="60%" stopColor="rgba(52, 211, 153, 0.16)" />
                    <stop offset="100%" stopColor="rgba(52, 211, 153, 0.04)" />
                  </linearGradient>
                </defs>
                <rect
                  ref={(el) => {
                    intervalBandDomRefs.current[idx] = el;
                  }}
                  className="bt-holo-interval-band"
                  style={{ fill: `url(#bt-holo-interval-grad-${panel.id})` }}
                  x="0"
                  y="0"
                  width="8"
                  height="40"
                  rx="1"
                  opacity="0"
                />
                <line
                  ref={(el) => {
                    guideDomRefs.current[idx] = el;
                  }}
                  className="bt-holo-crosshair"
                  y1="0"
                  y2="40"
                  opacity="0"
                />
                <polyline
                  ref={(el) => {
                    polyDomRefs.current[idx] = el;
                  }}
                  className="bt-holo-line"
                  points={panel.pointsAttr}
                />
                <polyline
                  ref={(el) => {
                    hitPolyDomRefs.current[idx] = el;
                  }}
                  className="bt-holo-hit"
                  points={panel.pointsAttr}
                />
                <circle
                  ref={(el) => {
                    dotDomRefs.current[idx] = el;
                  }}
                  r="2.8"
                  fill="#34D399"
                  stroke="#F0D58A"
                  strokeWidth="1.2"
                  opacity="0"
                  style={{ pointerEvents: 'none' }}
                />
              </svg>
            </div>
            <span
              ref={(el) => {
                pxDomRefs.current[idx] = el;
              }}
              className="bt-px"
            >
              {formatPrice(panel.initialPrice)}
            </span>
          </>
        ) : (
          <>
            <span className="bt-sym">{panel.sym}</span>
            <span
              ref={(el) => {
                pxDomRefs.current[idx] = el;
              }}
              className="bt-px"
            >
              {formatPrice(panel.initialPrice)}
            </span>
            <span
              ref={(el) => {
                chgDomRefs.current[idx] = el;
              }}
              className={`bt-chg ${panel.initialPct >= 0 ? 'bt-up' : 'bt-down'}`}
            >
              {formatPct(panel.initialPct)}
            </span>
          </>
        )}
      </motion.div>
    </div>
  );
};

export const HeroSection: React.FC = () => {
  const reducedMotion = useReducedMotion();

  // Start as null (never raw white PNG!) until transparent alpha extraction completes
  const [crestUrl, setCrestUrl] = useState<string | null>(() =>
    getCachedTransparentCrestUrl(HERO_CREST_IMAGE)
  );
  const [logoFailed, setLogoFailed] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparksCanvasRef = useRef<HTMLCanvasElement>(null);
  const bullRef = useRef<SVGSVGElement>(null);
  const holoWorldRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoInnerRef = useRef<HTMLDivElement>(null);
  const logoShineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);
  const primaryCtaRef = useRef<HTMLDivElement>(null);
  const holoTooltipRef = useRef<HTMLDivElement>(null);

  const [holoPanels, setHoloPanels] = useState<HoloPanelSpec[]>(() =>
    typeof window !== 'undefined'
      ? generateHoloPanels(window.innerWidth, window.innerHeight)
      : []
  );
  const holoPanelsRef = useRef<HoloPanelSpec[]>(holoPanels);
  holoPanelsRef.current = holoPanels;

  const panelDomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pxDomRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const chgDomRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const polyDomRefs = useRef<(SVGPolylineElement | null)[]>([]);
  const hitPolyDomRefs = useRef<(SVGPolylineElement | null)[]>([]);
  const guideDomRefs = useRef<(SVGLineElement | null)[]>([]);
  const intervalBandDomRefs = useRef<(SVGRectElement | null)[]>([]);
  const intervalTagDomRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotDomRefs = useRef<(SVGCircleElement | null)[]>([]);
  const hoverIdxRefs = useRef<number[]>([]);
  const chartPulseTriggersRef = useRef<Array<(() => void) | undefined>>([]);
  const livePricesRef = useRef<{ price: number; pct: number }[]>([]);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const restartFnRef = useRef<(() => void) | null>(null);

  const showHoloTooltip = useCallback(({ symbol, point, clientX, clientY }: HoloHoverPayload) => {
    const tip = holoTooltipRef.current;
    const hero = heroRef.current;
    if (!tip || !hero) return;
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.width <= 0) return;

    const symEl = tip.querySelector('[data-tip-sym]');
    const timeEl = tip.querySelector('[data-tip-time]');
    const priceEl = tip.querySelector('[data-tip-price]');
    const chgEl = tip.querySelector('[data-tip-chg]');

    if (symEl) symEl.textContent = symbol;
    if (timeEl) timeEl.textContent = point.timeLabel;
    if (priceEl) priceEl.textContent = formatPrice(point.price);
    if (chgEl) {
      chgEl.textContent = formatPct(point.pctDelta);
      chgEl.className =
        point.pctDelta >= 0
          ? 'font-mono text-[11px] font-semibold text-[#34D399]'
          : 'font-mono text-[11px] font-semibold text-[#F87171]';
    }

    const relX = clamp(clientX - heroRect.left, 88, heroRect.width - 88);
    const relY = Math.max(76, clientY - heroRect.top - 14);
    tip.style.transform = `translate3d(${relX.toFixed(1)}px, ${relY.toFixed(1)}px, 0) translate(-50%, -100%)`;
    tip.style.opacity = '1';
  }, []);

  const hideHoloTooltip = useCallback(() => {
    const tip = holoTooltipRef.current;
    if (!tip) return;
    tip.style.opacity = '0';
  }, []);

  // Resolve transparent crest URL asynchronously without ever flashing the raw white sheet
  useEffect(() => {
    if (crestUrl) return;
    let active = true;
    loadTransparentCrestUrl(HERO_CREST_IMAGE).then((cleanUrl) => {
      if (active) setCrestUrl(cleanUrl);
    });
    return () => {
      active = false;
    };
  }, [crestUrl]);

  // Synchronize masked metallic shine only once transparent crest URL is ready
  useEffect(() => {
    const shine = logoShineRef.current;
    if (!shine || !crestUrl) return;
    shine.style.webkitMaskImage = `url("${crestUrl}")`;
    shine.style.maskImage = `url("${crestUrl}")`;
  }, [crestUrl]);

  // Master 12-second GSAP intro + continuous video-like live loop motion
  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const fx = fxCanvasRef.current;
    const sk = sparksCanvasRef.current;
    const bull = bullRef.current;
    const holo = holoWorldRef.current;
    const flash = flashRef.current;
    const topBar = topBarRef.current;
    const bottomBar = bottomBarRef.current;
    const logoWrap = logoWrapRef.current;
    const logoInner = logoInnerRef.current;
    const shine = logoShineRef.current;
    const content = contentRef.current;
    const sub = subRef.current;
    const ctaWrap = ctaWrapRef.current;
    const primaryCta = primaryCtaRef.current;

    if (
      !hero ||
      !stage ||
      !fx ||
      !sk ||
      !bull ||
      !holo ||
      !flash ||
      !topBar ||
      !bottomBar ||
      !logoWrap ||
      !logoInner ||
      !content ||
      !sub ||
      !ctaWrap ||
      !primaryCta
    ) {
      return;
    }

    const ctx = fx.getContext('2d');
    const sctx = sk.getContext('2d');
    if (!ctx || !sctx) return;

    const DURATION = 12;
    const N = 72;
    const chars = Array.from(content.querySelectorAll<HTMLElement>('.bt-char'));

    let W = 1280;
    let H = 720;
    let isVisibleInViewport = true;
    let liveElapsed = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = hero.getBoundingClientRect();
      W = Math.max(320, r.width);
      H = Math.max(460, r.height);

      fx.width = Math.round(W * dpr);
      fx.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sk.width = Math.round(W * dpr);
      sk.height = Math.round(H * dpr);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ---------- Continuous Moving Candlestick Chart ---------- */
    let candles: Candle[] = [];
    let shift = 0;
    let pushAcc = 0;
    let yMin = 94;
    let yMax = 106;
    const cwOf = () => (W * 0.94) / (N - 1);

    const makeCandle = (prev: Candle | null, surge: boolean): Candle => {
      const open = prev ? prev.close : 100;
      let close = open + rand(-2.2, 2.2) + 0.22;
      if (surge) close += rand(0.6, 3.0);
      return {
        open,
        close,
        high: Math.max(open, close) + rand(0.3, 2.0),
        low: Math.min(open, close) - rand(0.3, 2.0),
      };
    };

    const seedCandles = () => {
      candles = [];
      let prev: Candle | null = null;
      for (let i = 0; i < N; i++) {
        prev = makeCandle(prev, i > N * 0.58);
        candles.push(prev);
      }
      shift = 0;
      pushAcc = 0;
      yMin = 94;
      yMax = 106;
    };

    const drawSweepingBeams = (totalTime: number) => {
      if (reducedMotion) return;

      // Continuous breathing Sovereign Sapphire & Champagne Gold aurora behind the scene
      const ax1 = W * (0.28 + Math.sin(totalTime * 0.24) * 0.14);
      const ay1 = H * (0.34 + Math.cos(totalTime * 0.19) * 0.1);
      const g1 = ctx.createRadialGradient(ax1, ay1, 0, ax1, ay1, Math.max(W, H) * 0.55);
      g1.addColorStop(0, 'rgba(59, 130, 246, 0.16)');
      g1.addColorStop(0.55, 'rgba(30, 58, 138, 0.06)');
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      const ax2 = W * (0.72 + Math.cos(totalTime * 0.21) * 0.14);
      const ay2 = H * (0.64 + Math.sin(totalTime * 0.27) * 0.1);
      const g2 = ctx.createRadialGradient(ax2, ay2, 0, ax2, ay2, Math.max(W, H) * 0.48);
      g2.addColorStop(0, 'rgba(201, 162, 75, 0.12)');
      g2.addColorStop(0.55, 'rgba(16, 185, 129, 0.05)');
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      const cycle = (totalTime % 9.5) / 9.5;
      const sweepCenter = -0.35 + cycle * 1.7;
      const fade = Math.sin(cycle * Math.PI);

      const drawBeam = (offset: number, widthRatio: number, peak: number, rgb: string) => {
        const cx = (sweepCenter + offset) * W;
        const beamW = W * widthRatio;
        const skew = H * 0.4;
        const grad = ctx.createLinearGradient(cx - beamW * 0.55, 0, cx + beamW * 0.55, 0);
        grad.addColorStop(0, `rgba(${rgb}, 0)`);
        grad.addColorStop(0.5, `rgba(${rgb}, ${peak * fade})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx - beamW * 0.5, 0);
        ctx.lineTo(cx + beamW * 0.5, 0);
        ctx.lineTo(cx + beamW * 0.5 - skew, H);
        ctx.lineTo(cx - beamW * 0.5 - skew, H);
        ctx.closePath();
        ctx.fill();
      };

      drawBeam(0, 0.34, 0.058, '240, 213, 138');
      drawBeam(0.24, 0.24, 0.042, '96, 165, 250');
    };

    const drawChart = (t: number, totalTime: number, dt: number, live: boolean) => {
      const reveal = live ? 1 : easeInOut(seg(t, 0.5, 6.8));
      const alpha = live ? 0.46 : 0.14 + 0.44 * easeOut(seg(t, 0.3, 6.5));
      const n = N * reveal;
      const full = Math.floor(n);
      const frac = n - full;
      const count = Math.min(N, full + (frac > 0 ? 1 : 0));
      if (count < 2) return;

      const top = H * 0.24;
      const h = H * 0.58;
      const left = W * 0.03;
      const cw = cwOf();

      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 0; i < count; i++) {
        if (candles[i].low < lo) lo = candles[i].low;
        if (candles[i].high > hi) hi = candles[i].high;
      }
      const pad = (hi - lo) * 0.1 + 0.5;
      lo -= pad;
      hi += pad;

      const k = 1 - Math.exp(-dt * 4);
      yMin += (lo - yMin) * k;
      yMax += (hi - yMax) * k;
      const Y = (v: number) => top + h * (1 - (v - yMin) / (yMax - yMin));

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.12)';
      ctx.lineWidth = 1;
      for (let g = 0; g <= 5; g++) {
        const y = top + (h * g) / 5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      for (let i = 0; i < count; i++) {
        const c = candles[i];
        const x = left + i * cw + shift;
        const up = c.close >= c.open;
        ctx.globalAlpha = alpha * (i === full && frac > 0 ? frac : 1);
        const col = up ? '#F0D58A' : '#8C6A1F';
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = 'rgba(201, 162, 75, 0.65)';
        ctx.shadowBlur = up ? 10 : 0;

        ctx.beginPath();
        ctx.moveTo(x, Y(c.high));
        ctx.lineTo(x, Y(c.low));
        ctx.stroke();

        const y1 = Y(Math.max(c.open, c.close));
        const y2 = Y(Math.min(c.open, c.close));
        ctx.fillRect(x - cw * 0.28, y1, cw * 0.56, Math.max(2, y2 - y1));
      }

      ctx.globalAlpha = Math.min(1, alpha * 1.35);
      ctx.beginPath();
      let lastX = left;
      let lastY = Y(candles[0].close);
      for (let i = 0; i < count; i++) {
        lastX = left + i * cw + shift;
        lastY = Y(candles[i].close);
        if (i) ctx.lineTo(lastX, lastY);
        else ctx.moveTo(lastX, lastY);
      }

      const lineGrad = ctx.createLinearGradient(left, top, lastX, lastY);
      lineGrad.addColorStop(0, '#60A5FA');
      lineGrad.addColorStop(0.5, '#F0D58A');
      lineGrad.addColorStop(1, '#34D399');

      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(240, 213, 138, 0.85)';
      ctx.shadowBlur = 14;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.lineTo(lastX, top + h);
      ctx.lineTo(left + shift, top + h);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, top, 0, top + h);
      areaGrad.addColorStop(0, 'rgba(201, 162, 75, 0.2)');
      areaGrad.addColorStop(0.6, 'rgba(59, 130, 246, 0.06)');
      areaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Continuous live beacon pulse at chart frontier
      ctx.globalAlpha = Math.min(1, alpha * 1.55);
      ctx.shadowColor = '#F0D58A';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#FFF3C4';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3.8 + 2.0 * Math.sin(totalTime * 4.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    /* ---------- Volumetric Gold & Sapphire Mist (Continuous Flow) ---------- */
    const smokeSprite = document.createElement('canvas');
    smokeSprite.width = 256;
    smokeSprite.height = 256;
    {
      const g = smokeSprite.getContext('2d');
      if (g) {
        const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        gr.addColorStop(0, 'rgba(201, 162, 75, 0.44)');
        gr.addColorStop(0.5, 'rgba(59, 130, 246, 0.18)');
        gr.addColorStop(1, 'rgba(0, 0, 0, 0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, 256, 256);
      }
    }

    let smoke: SmokePuff[] = [];
    const seedSmoke = () => {
      smoke = Array.from({ length: 32 }, () => ({
        x: rand(-0.1, 1.1),
        y: rand(0.45, 1.15),
        r: rand(0.18, 0.42),
        vx: rand(-0.015, 0.015),
        vy: rand(-0.032, -0.01),
        a: rand(0.48, 0.95),
        ph: rand(0, Math.PI * 2),
      }));
    };

    const drawSmoke = (t: number, dt: number, live: boolean) => {
      const amt = live
        ? 0.48
        : easeOut(seg(t, 1.2, 3.6)) * (1 - 0.52 * easeInOut(seg(t, 8, 11)));
      if (amt <= 0.001) return;

      ctx.save();
      for (const p of smoke) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.ph += dt * 0.45;
        if (p.y < 0.12) {
          p.y = 1.15;
          p.x = rand(-0.1, 1.1);
        }
        ctx.globalAlpha = amt * 0.48 * p.a * clamp((p.y - 0.12) / 0.3);
        const s = p.r * W * 2 * (1 + 0.08 * Math.sin(p.ph));
        ctx.drawImage(
          smokeSprite,
          p.x * W - s / 2 + Math.sin(p.ph) * 12,
          p.y * H - s / 2,
          s,
          s
        );
      }
      ctx.restore();
    };

    /* ---------- Continuous Gold Spark Particle Layer ---------- */
    const sparks: SparkParticle[] = [];
    let streamAcc = 0;
    let chartAcc = 0;
    let ambAcc = 0;
    let burst = false;

    const emit = (
      x: number,
      y: number,
      n: number,
      sMin: number,
      sMax: number,
      aMin: number,
      aMax: number
    ) => {
      for (let i = 0; i < n && sparks.length < 750; i++) {
        const a = rand(aMin, aMax);
        const s = rand(sMin, sMax);
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          max: rand(0.8, 2.0),
          size: rand(1.1, 2.6),
          g: rand(170, 225),
        });
      }
    };

    const emitters = (t: number, dt: number, live: boolean) => {
      if (t >= 3.0 && t < 6.8) {
        streamAcc += dt * 92;
        while (streamAcc >= 1) {
          streamAcc--;
          emit(W * rand(0.3, 0.7), H * rand(0.5, 0.8), 1, 120, 520, -Math.PI * 0.95, -Math.PI * 0.05);
        }
      }
      if (t >= 4.2 && t < 6.4) {
        chartAcc += dt * 68;
        while (chartAcc >= 1) {
          chartAcc--;
          emit(W * rand(0.7, 0.95), H * rand(0.45, 0.65), 1, 200, 620, -1.3, -0.35);
        }
      }
      if (!burst && t >= 10 && t < 10.6) {
        burst = true;
        emit(W / 2, H * 0.36, 220, 140, 900, 0, Math.PI * 2);
      }
      // Rich continuous rising sparks in live mode (like a looping video hero)
      if (live) {
        ambAcc += dt * 26;
        while (ambAcc >= 1) {
          ambAcc--;
          emit(W * rand(0.04, 0.96), H * rand(0.58, 1.02), 1, 28, 108, -Math.PI * 0.84, -Math.PI * 0.16);
        }
      }
    };

    const drawSparks = (dt: number) => {
      sctx.clearRect(0, 0, W, H);
      sctx.globalCompositeOperation = 'lighter';
      sctx.lineCap = 'round';
      const drag = Math.pow(0.35, dt);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.max) {
          sparks.splice(i, 1);
          continue;
        }
        s.vx *= drag;
        s.vy = s.vy * drag + 85 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        const a = Math.pow(1 - s.life / s.max, 2);
        sctx.strokeStyle = `rgba(255, ${s.g | 0}, 90, ${a})`;
        sctx.lineWidth = s.size;
        sctx.beginPath();
        sctx.moveTo(s.x - s.vx * 0.04, s.y - s.vy * 0.04);
        sctx.lineTo(s.x, s.y);
        sctx.stroke();

        sctx.fillStyle = `rgba(255, 220, 130, ${a * 0.35})`;
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.size * 1.4, 0, Math.PI * 2);
        sctx.fill();
      }
      sctx.globalCompositeOperation = 'source-over';
    };

    /* ---------- Live Tick Updates for Framer Motion .bt-holo-card Panels ---------- */
    const syncLiveTickState = (items: HoloPanelSpec[]) => {
      livePricesRef.current = items.map((item) => ({
        price: item.initialPrice,
        pct: item.initialPct,
      }));
      hoverIdxRefs.current = items.map(() => -1);
    };
    syncLiveTickState(holoPanelsRef.current);

    const priceInterval = window.setInterval(() => {
      if (document.hidden || !isVisibleInViewport) return;
      const items = holoPanelsRef.current;
      items.forEach((panel, idx) => {
        const state = livePricesRef.current[idx];
        if (!state) return;
        state.price *= 1 + rand(-0.0012, 0.0016);
        state.pct += rand(-0.14, 0.18);

        const pxEl = pxDomRefs.current[idx];
        if (pxEl) pxEl.textContent = formatPrice(state.price);

        const chgEl = chgDomRefs.current[idx];
        if (chgEl) {
          chgEl.textContent = formatPct(state.pct);
          chgEl.className = `bt-chg ${state.pct >= 0 ? 'bt-up' : 'bt-down'}`;
        }

        if (panel.isChart && panel.points.length > 0) {
          const prevPtsAttr = polyDomRefs.current[idx]?.getAttribute('points') ?? panel.pointsAttr;
          const last = panel.points[panel.points.length - 1];
          last.price = state.price;
          last.pctDelta = ((state.price - panel.points[0].price) / panel.points[0].price) * 100;
          const ptsAttr = computeSparklineAttr(panel.points, panel.basePrice);
          polyDomRefs.current[idx]?.setAttribute('points', ptsAttr);
          hitPolyDomRefs.current[idx]?.setAttribute('points', ptsAttr);
          const hoveredIdx = hoverIdxRefs.current[idx];
          if (hoveredIdx >= 0 && hoveredIdx < panel.points.length) {
            const activePt = panel.points[hoveredIdx];
            const dotEl = dotDomRefs.current[idx];
            if (dotEl) {
              dotEl.setAttribute('cx', activePt.x.toFixed(1));
              dotEl.setAttribute('cy', activePt.y.toFixed(1));
            }
          }
          if (ptsAttr !== prevPtsAttr) {
            chartPulseTriggersRef.current[idx]?.();
          }
        }
      });
    }, 1100);

    /* ---------- Pointer Parallax & Shared Animation State ---------- */
    const S = { cam: 0, reveal: 0, dim: 1 };
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, amt: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    gsap.set(bull, { xPercent: -50 });

    /* ---------- Continuous Ambient Loops in Live Mode ---------- */
    let ctaGlow: gsap.core.Tween | null = null;
    let logoFloatTween: gsap.core.Tween | null = null;
    let logoShineLoop: gsap.core.Tween | null = null;

    const startContinuousLoops = () => {
      if (reducedMotion) return;

      // Gentle levitation on the crest emblem
      if (!logoFloatTween) {
        logoFloatTween = gsap.to(logoInner, {
          y: -6,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Periodic metallic gold light sweep across the crest every 4.5s
      if (!logoShineLoop && logoShineRef.current) {
        logoShineLoop = gsap.fromTo(
          logoShineRef.current,
          { backgroundPosition: '180% 0' },
          {
            backgroundPosition: '-80% 0',
            duration: 1.4,
            repeat: -1,
            repeatDelay: 3.5,
            ease: 'power2.inOut',
            delay: 2.5,
          }
        );
      }
    };

    const stopContinuousLoops = () => {
      if (ctaGlow) {
        ctaGlow.kill();
        ctaGlow = null;
        gsap.set(primaryCta, { clearProps: 'boxShadow' });
      }
      if (logoFloatTween) {
        logoFloatTween.kill();
        logoFloatTween = null;
        gsap.set(logoInner, { y: 0 });
      }
      if (logoShineLoop) {
        logoShineLoop.kill();
        logoShineLoop = null;
      }
    };

    const goLive = () => {
      setIsLiveMode(true);
      ctaWrap.style.pointerEvents = 'auto';
      if (reducedMotion) return;
      gsap.to(mouse, { amt: 1, duration: 1.8, ease: 'power2.out' });
      ctaGlow = gsap.to(primaryCta, {
        boxShadow: '0 0 42px rgba(201, 162, 75, 0.55)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      startContinuousLoops();
    };

    const leaveLive = () => {
      setIsLiveMode(false);
      hideHoloTooltip();
      stopContinuousLoops();
      gsap.killTweensOf(mouse);
      mouse.amt = 0;
      ctaWrap.style.pointerEvents = 'none';
    };

    /* ---------- Master 12-Second GSAP Timeline ---------- */
    const tl = gsap.timeline({ paused: true, onComplete: goLive });
    timelineRef.current = tl;

    // 0.2s: Cinematic letterbox opens
    tl.fromTo(
      [topBar, bottomBar],
      { scaleY: 1 },
      { scaleY: 0, duration: 1.5, ease: 'expo.inOut' },
      0.2
    );

    // 1.8s: Golden Bull + Titan silhouette rises through volumetric smoke, then softens into backdrop
    tl.fromTo(
      bull,
      { opacity: 0, yPercent: 24, scale: 0.94 },
      { opacity: 0.95, yPercent: 0, scale: 1, duration: 3.6, ease: 'power3.out' },
      1.8
    );
    tl.to(bull, { opacity: 0.18, scale: 1.1, duration: 2.4, ease: 'power2.inOut' }, 7.6);

    // 5.5s: Camera pushes through 3D holographic charts and tickers
    tl.to(stage, { scale: 1.1, duration: 5.5, ease: 'power2.inOut' }, 5.5);
    tl.fromTo(S, { reveal: 0 }, { reveal: 1, duration: 3, ease: 'none' }, 5.4);
    tl.fromTo(S, { cam: 0 }, { cam: 1000, duration: 4.7, ease: 'power2.inOut' }, 5.5);
    tl.fromTo(S, { dim: 1 }, { dim: 0.36, duration: 1, ease: 'power2.inOut' }, 9.6);

    // 10.0s: Impact flash + micro-shake + transparent Bullish Titan crest arrival + shine sweep
    tl.fromTo(flash, { opacity: 0 }, { opacity: 0.6, duration: 0.06, ease: 'none' }, 10);
    tl.to(flash, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 10.06);
    tl.to(
      stage,
      {
        x: 'random(-8,8)',
        y: 'random(-6,6)',
        duration: 0.05,
        repeat: 7,
        yoyo: true,
        repeatRefresh: true,
        ease: 'none',
      },
      10
    );
    tl.to(stage, { x: 0, y: 0, duration: 0.14, ease: 'power2.out' }, 10.42);

    tl.fromTo(
      logoWrap,
      { opacity: 0, scale: 1.42, filter: 'blur(14px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.95, ease: 'back.out(1.7)' },
      10
    );
    if (shine) {
      tl.fromTo(
        shine,
        { backgroundPosition: '180% 0' },
        { backgroundPosition: '-80% 0', duration: 1.2, ease: 'power2.inOut' },
        10.55
      );
    }

    // 10.85s: Playfair headline characters, subcopy & CTAs reveal cleanly inside centered flow
    tl.set(content, { opacity: 1 }, 10.85);
    tl.from(
      chars,
      {
        opacity: 0,
        y: 34,
        rotationX: -75,
        transformOrigin: '50% 100%',
        filter: 'blur(7px)',
        duration: 0.75,
        stagger: 0.02,
        ease: 'power3.out',
      },
      10.9
    );
    tl.from(sub, { opacity: 0, y: 18, duration: 0.75, ease: 'power2.out' }, 11.35);
    tl.from(ctaWrap, { opacity: 0, scale: 0.9, y: 18, duration: 0.7, ease: 'back.out(1.8)' }, 11.6);
    tl.set({}, {}, DURATION);

    /* ---------- Subtle Magnetic Hover on Primary CTA ---------- */
    const onCtaMove = (e: PointerEvent) => {
      if (reducedMotion || e.pointerType === 'touch') return;
      const r = primaryCta.getBoundingClientRect();
      gsap.to(primaryCta, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.2,
        y: (e.clientY - (r.top + r.height / 2)) * 0.28,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    const onCtaLeave = () => {
      gsap.to(primaryCta, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'elastic.out(1, 0.45)',
        overwrite: 'auto',
      });
    };
    primaryCta.addEventListener('pointermove', onCtaMove);
    primaryCta.addEventListener('pointerleave', onCtaLeave);

    /* ---------- Replay Handler ---------- */
    restartFnRef.current = () => {
      leaveLive();
      liveElapsed = 0;
      burst = false;
      sparks.length = 0;
      streamAcc = 0;
      chartAcc = 0;
      ambAcc = 0;
      seedCandles();
      seedSmoke();
      tl.restart();
    };

    /* ---------- Resize & Viewport Observer ---------- */
    let resizeTimer: number | undefined;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        hideHoloTooltip();
        const nextPanels = generateHoloPanels(W, H);
        syncLiveTickState(nextPanels);
        setHoloPanels(nextPanels);
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleInViewport = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    observer.observe(hero);

    /* ---------- Unified GSAP Ticker Loop (Non-Stop 60fps Video-Like Motion) ---------- */
    const TICK_STEP_SEC = 0.56;
    const onTick = (_time: number, deltaTime: number) => {
      if (document.hidden || !isVisibleInViewport) return;

      const dt = Math.min(0.05, (deltaTime || 16) / 1000);
      liveElapsed += dt;
      const t = tl.time();
      const live = tl.progress() >= 1 && !reducedMotion;
      const totalTime = live ? DURATION + liveElapsed : t;

      // Seamless non-stop 60fps horizontal candlestick stream
      if (live) {
        pushAcc += dt;
        while (pushAcc >= TICK_STEP_SEC) {
          pushAcc -= TICK_STEP_SEC;
          candles.push(makeCandle(candles[candles.length - 1], false));
          candles.shift();
        }
        shift = cwOf() * (1 - pushAcc / TICK_STEP_SEC);
      }

      ctx.clearRect(0, 0, W, H);
      drawSweepingBeams(totalTime);
      drawChart(t, totalTime, dt, tl.progress() >= 1);
      drawSmoke(t, dt, live);
      emitters(t, dt, live);
      drawSparks(dt);

      const k = 1 - Math.exp(-dt * 3);
      mouse.x += (mouse.tx - mouse.x) * k;
      mouse.y += (mouse.ty - mouse.y) * k;

      // Continuous 3D orbital camera & depth motion even without mouse movement
      const idleOrbitY = live ? Math.sin(totalTime * 0.44) * 4.2 : Math.sin(t * 0.35) * 2.5;
      const idleOrbitX = live ? Math.cos(totalTime * 0.35) * 2.6 : Math.cos(t * 0.27) * 1.5;
      const idleCamDrift = live ? S.cam + Math.sin(totalTime * 0.52) * 58 : S.cam;

      gsap.set(holo, {
        z: idleCamDrift,
        rotationY: idleOrbitY + mouse.x * 4 * mouse.amt,
        rotationX: idleOrbitX - mouse.y * 3 * mouse.amt,
      });

      const items = holoPanelsRef.current;
      const n = items.length;
      for (let i = 0; i < n; i++) {
        const panelEl = panelDomRefs.current[i];
        if (!panelEl) continue;
        const p = items[i];
        const appear = easeOut(clamp((S.reveal - (i / n) * 0.6) / 0.4));
        const zFade = 1 - seg(p.z + S.cam, 80, 420);
        const pulse = live ? 0.78 + 0.22 * Math.sin(totalTime * 1.15 + p.basePhase) : 1;
        panelEl.style.opacity = (appear * zFade * S.dim * pulse).toFixed(3);
      }

      // Continuous subtle camera & Bull+Titan breathing in live mode
      const bullBreathY = live ? Math.sin(totalTime * 0.9) * 9 : 0;
      const bullBreathScale = live ? 1.1 + Math.sin(totalTime * 0.65) * 0.028 : undefined;

      gsap.set(bull, {
        x: -mouse.x * 16 * mouse.amt + (live ? Math.sin(totalTime * 0.38) * 12 : 0),
        y: -mouse.y * 10 * mouse.amt + bullBreathY,
        ...(bullBreathScale !== undefined ? { scale: bullBreathScale } : {}),
      });

      gsap.set(logoWrap, {
        x: mouse.x * 8 * mouse.amt,
        y: mouse.y * 6 * mouse.amt,
      });
    };

    resize();
    seedCandles();
    seedSmoke();
    gsap.ticker.add(onTick);

    if (reducedMotion) {
      burst = true;
      tl.progress(1, false);
    } else {
      tl.play(0);
    }

    return () => {
      gsap.ticker.remove(onTick);
      stopContinuousLoops();
      tl.kill();
      gsap.killTweensOf([
        mouse,
        primaryCta,
        bull,
        logoWrap,
        logoInner,
        stage,
        holo,
        flash,
        content,
        sub,
        ctaWrap,
        chars,
      ]);
      window.clearInterval(priceInterval);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      primaryCta.removeEventListener('pointermove', onCtaMove);
      primaryCta.removeEventListener('pointerleave', onCtaLeave);
      observer.disconnect();
    };
  }, [reducedMotion]);

  const handleStageAction = () => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (tl.progress() < 1) {
      tl.progress(1, false);
    } else {
      restartFnRef.current?.();
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      aria-label="Bullish Titan Academy"
      className="relative isolate min-h-screen min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#000000]"
      style={{
        background:
          'radial-gradient(ellipse at 50% 62%, #0C1C38 0%, #060D1C 48%, #000000 100%)',
      }}
    >
      {/* Animated Stage (Canvas Chart & Smoke + Rising Golden Bull-Titan + CSS 3D Holo Panels) */}
      <div
        id="hero-animation-stage"
        ref={stageRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-[50%_55%] will-change-transform"
      >
        <canvas ref={fxCanvasRef} className="relative z-[1] block h-full w-full" />

        {/* Rising Golden Bull + Titan Crest Silhouette */}
        <svg
          ref={bullRef}
          className="bt-hero-bull"
          viewBox="0 0 400 360"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="bt-bull-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFE9A6" />
              <stop offset="0.45" stopColor="#F0D58A" />
              <stop offset="1" stopColor="#8C6A1F" />
            </linearGradient>
            <linearGradient id="bt-bull-dark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#B8841E" />
              <stop offset="1" stopColor="#3A2606" />
            </linearGradient>
          </defs>
          <circle
            cx="200"
            cy="165"
            r="135"
            fill="none"
            stroke="url(#bt-bull-gold)"
            strokeWidth="1.5"
            opacity="0.45"
          />
          <circle
            cx="200"
            cy="165"
            r="150"
            fill="none"
            stroke="url(#bt-bull-gold)"
            strokeWidth="0.8"
            opacity="0.25"
          />
          <path
            d="M0 360 C25 290 95 262 150 256 L250 256 C305 262 375 290 400 360 Z"
            fill="url(#bt-bull-dark)"
          />
          <path d="M160 230 L240 230 L254 262 L146 262 Z" fill="#8C6A1F" />
          <path
            d="M128 118 C70 112 38 70 52 14 C70 58 98 80 140 90 Z"
            fill="url(#bt-bull-gold)"
          />
          <path
            d="M272 118 C330 112 362 70 348 14 C330 58 302 80 260 90 Z"
            fill="url(#bt-bull-gold)"
          />
          <path d="M132 108 L84 112 L98 140 L134 134 Z" fill="url(#bt-bull-gold)" />
          <path d="M268 108 L316 112 L302 140 L266 134 Z" fill="url(#bt-bull-gold)" />
          <path
            d="M135 92 L265 92 C292 130 276 196 244 244 C228 270 216 286 200 290 C184 286 172 270 156 244 C124 196 108 130 135 92 Z"
            fill="url(#bt-bull-gold)"
          />
          <ellipse cx="200" cy="262" rx="34" ry="20" fill="#9A6D16" opacity="0.55" />
          <ellipse
            cx="172"
            cy="150"
            rx="11"
            ry="3.2"
            fill="#FFF7D1"
            transform="rotate(14 172 150)"
          />
          <ellipse
            cx="228"
            cy="150"
            rx="11"
            ry="3.2"
            fill="#FFF7D1"
            transform="rotate(-14 228 150)"
          />
          <circle cx="200" cy="276" r="9" fill="none" stroke="#FFE9A6" strokeWidth="3" />
        </svg>

        {/* 3D Floating Holographic Forex & Synthetic Indices Panels (Framer Motion Varied Float) */}
        <div className="bt-holo-layer">
          <div ref={holoWorldRef} className="bt-holo-world">
            {holoPanels.map((panel, idx) => (
              <HoloPanelCard
                key={panel.id}
                panel={panel}
                idx={idx}
                reducedMotion={reducedMotion}
                panelDomRefs={panelDomRefs}
                pxDomRefs={pxDomRefs}
                chgDomRefs={chgDomRefs}
                polyDomRefs={polyDomRefs}
                hitPolyDomRefs={hitPolyDomRefs}
                guideDomRefs={guideDomRefs}
                intervalBandDomRefs={intervalBandDomRefs}
                intervalTagDomRefs={intervalTagDomRefs}
                dotDomRefs={dotDomRefs}
                hoverIdxRefs={hoverIdxRefs}
                chartPulseTriggersRef={chartPulseTriggersRef}
                onShowTooltip={showHoloTooltip}
                onHideTooltip={hideHoloTooltip}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sparks Particle Canvas */}
      <canvas
        ref={sparksCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4] block h-full w-full"
      />

      {/* Atmospheric Vignette + Seamless Obsidian Floor Fade + Subtle Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 42%, rgba(0, 0, 0, 0.78) 100%), linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.62) 15%, rgba(0, 0, 0, 0) 38%)',
        }}
      />
      <div aria-hidden="true" className="bt-hero-grain" />

      {/* 10s Impact Flash */}
      <div
        ref={flashRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[6] opacity-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(240, 213, 138, 0.92) 0%, rgba(201, 162, 75, 0.34) 30%, transparent 62%)',
        }}
      />

      {/* Cinematic Letterbox Opening Bars */}
      <div
        ref={topBarRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[15] h-[9%] w-full origin-top bg-[#000000]"
      />
      <div
        ref={bottomBarRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-[15] h-[9%] w-full origin-bottom bg-[#000000]"
      />

      {/* Skip / Replay Cinematic Control (Architectural Hairline below Navbar) */}
      {!reducedMotion && (
        <button
          type="button"
          onClick={handleStageAction}
          className="absolute right-4 top-20 z-20 inline-flex items-center gap-1.5 rounded-sm border border-[#C9A24B]/45 bg-[#091326]/75 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#F0D58A] backdrop-blur-sm transition-colors hover:border-[#F0D58A]/80 hover:bg-[#C9A24B]/15 sm:right-8 sm:top-24"
        >
          {isLiveMode ? (
            <>
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Replay Chronicle
            </>
          ) : (
            <>
              <FastForward className="h-3 w-3" aria-hidden="true" />
              Advance
            </>
          )}
        </button>
      )}

      {/* Interactive Floating Tooltip for .bt-holo-card SVG Polyline Data Points */}
      <div
        ref={holoTooltipRef}
        role="status"
        aria-live="polite"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 z-30 min-w-[148px] rounded-lg border border-[#F0D58A]/55 bg-[#07090E]/94 px-3 py-2 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.85)] transition-opacity duration-150"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#C9A24B]/20 pb-1">
          <span data-tip-sym="" className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#EDE6D6]" />
          <span data-tip-time="" className="font-mono text-[10px] text-[#9A968C]" />
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <span data-tip-price="" className="font-mono text-sm font-bold text-[#F0D58A] tabular-nums" />
          <span data-tip-chg="" className="font-mono text-[11px] font-semibold tabular-nums" />
        </div>
      </div>

      {/* Centered Responsive Foreground Stage (Transparent Crest + Headline + Sub + CTAs) */}
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-20 sm:pt-28">
        {/* Transparent Keyed Bullish Titan Crest (Zero White Flash) + Radial Corona + Masked Light Sweep */}
        <div
          ref={logoWrapRef}
          className="relative mb-7 flex items-center justify-center opacity-0 will-change-[transform,opacity,filter] sm:mb-9"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-16 rounded-full blur-2xl"
            style={{
              background:
                'radial-gradient(circle, rgba(240, 213, 138, 0.3) 0%, rgba(201, 162, 75, 0.14) 36%, rgba(59, 130, 246, 0.14) 60%, rgba(16, 185, 129, 0.06) 76%, transparent 88%)',
            }}
          />

          <div ref={logoInnerRef} className="bt-logo-inner relative flex items-center justify-center">
            {logoFailed ? (
              <div className="flex h-36 flex-col items-center justify-center py-4 text-center font-display font-bold tracking-[0.12em] sm:h-44 md:h-48">
                <span className="block text-3xl text-gold-gradient sm:text-5xl">
                  BULLISH TITAN
                </span>
                <small className="mt-1.5 block font-sans text-xs tracking-[0.45em] text-[#F0D58A]/80">
                  TRADING ACADEMY
                </small>
              </div>
            ) : crestUrl ? (
              <>
                <img
                  src={crestUrl}
                  alt="Bullish Titan Academy crest"
                  width={220}
                  height={280}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoFailed(true)}
                  className="relative z-10 h-36 w-auto select-none object-contain sm:h-44 md:h-48"
                />
                <div ref={logoShineRef} aria-hidden="true" className="bt-logo-shine z-20" />
              </>
            ) : (
              <div aria-hidden="true" className="h-36 w-32 sm:h-44 sm:w-40 md:h-48" />
            )}
          </div>
        </div>

        {/* Blended Serif Headline + Subheadline + Site CTAs */}
        <div
          ref={contentRef}
          className="pointer-events-none flex flex-col items-center opacity-0"
        >
          <h1
            className="max-w-4xl font-display text-4xl font-bold leading-[1.06] tracking-tight text-[#EDE6D6] sm:text-6xl lg:text-[66px]"
            style={{
              perspective: '600px',
              textShadow: '0 4px 28px rgba(0, 0, 0, 0.72), 0 0 32px rgba(201, 162, 75, 0.2)',
            }}
          >
            {HEADLINE_LEAD_WORDS.map((word, wIdx) => (
              <React.Fragment key={word}>
                <span className="inline-block whitespace-nowrap">
                  {Array.from(word).map((ch, cIdx) => (
                    <span
                      key={`${word}-${cIdx}`}
                      className="bt-char inline-block will-change-[transform,opacity]"
                    >
                      {ch}
                    </span>
                  ))}
                </span>
                {wIdx < HEADLINE_LEAD_WORDS.length - 1 ? ' ' : ' '}
              </React.Fragment>
            ))}

            <span className="italic font-semibold text-[#F0D58A]">
              {HEADLINE_ACCENT_WORDS.map((word, wIdx) => (
                <React.Fragment key={word}>
                  <span className="inline-block whitespace-nowrap">
                    {Array.from(word).map((ch, cIdx) => (
                      <span
                        key={`${word}-${cIdx}`}
                        className="bt-char inline-block will-change-[transform,opacity]"
                        style={{
                          textShadow: '0 0 26px rgba(240, 213, 138, 0.38)',
                        }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                  {wIdx < HEADLINE_ACCENT_WORDS.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </span>
          </h1>

          <p
            ref={subRef}
            className="mt-5 max-w-xl text-sm leading-relaxed text-[#C8C2B6] sm:mt-6 sm:text-base lg:text-lg"
            style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.85)' }}
          >
            Learn Forex and Synthetic Indices step by step—built for everyday people who want clear rules, steady habits, and peace of mind.
          </p>

          <div
            ref={ctaWrapRef}
            className="mt-8 flex w-full flex-col items-stretch justify-center gap-4 sm:mt-9 sm:w-auto sm:flex-row sm:items-center"
          >
            <div ref={primaryCtaRef} className="inline-flex">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('pricing-enrollment')}
                className="min-h-[48px] w-full px-9 sm:w-auto"
              >
                Start Learning Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('programs')}
              className="min-h-[48px] border border-[#60A5FA]/45 bg-[#091326]/65 px-9 hover:border-[#34D399]/75 hover:bg-[#0D1A33]/80"
            >
              See All Programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
