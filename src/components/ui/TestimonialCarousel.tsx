import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  type PanInfo,
} from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { ShieldCrestBadge, GoldHairlineDivider } from './TitanMotifs';
import { TESTIMONIAL_TEMPLATES } from '../../data/academyData';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export type CarouselMode = 'slider' | 'marquee';
export type CarouselVariant = 'editorial' | 'photo';

export interface CarouselTestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  image?: string;
  imageAlt?: string;
  slot?: string;
  initials?: string;
  location?: string;
  focusAsset?: string;
  metricValue?: string;
  metricLabel?: string;
  timeframe?: string;
  outcomeNote?: string;
}

export interface TestimonialCarouselProps {
  items?: CarouselTestimonialItem[];
  defaultMode?: CarouselMode;
  variant?: CarouselVariant;
  showModeToggle?: boolean;
  autoAdvanceMs?: number;
  marqueeSpeedPxPerSec?: number;
  className?: string;
}

const APPLE_SPRING = { type: 'spring', stiffness: 280, damping: 32, mass: 0.9 } as const;

interface ClientResultCardProps {
  item: CarouselTestimonialItem;
  variant: CarouselVariant;
  isActive?: boolean;
  onSelect?: () => void;
  className?: string;
}

const ClientResultCard: React.FC<ClientResultCardProps> = ({
  item,
  variant,
  isActive = false,
  onSelect,
  className,
}) => {
  if (variant === 'photo') {
    return (
      <article
        onClick={onSelect}
        className={cn(
          'group flex h-full flex-col justify-between rounded-xl p-4 sm:p-5 transition-colors duration-300 select-none',
          isActive
            ? 'hairline-gold-bright bg-[#141414]/95'
            : 'hairline-gold bg-[#0B0B0C]/92 hover:bg-[#141414]/80',
          onSelect ? 'cursor-pointer' : '',
          className
        )}
      >
        <div>
          {/* Clean Aspect-Locked Image Slot (ready for 15 cat/portrait replacements) */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[#C9A24B]/22 bg-[#000000]">
            <SafeImage
              src={item.image}
              alt={item.imageAlt || `${item.name} testimonial`}
              fallbackTitle={item.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000000]/65 via-transparent to-transparent"
            />
            {item.slot && (
              <span className="absolute bottom-2.5 right-3 font-mono text-[10px] tracking-[0.18em] text-[#F0D58A]/90 tabular-nums">
                {item.slot} / 15
              </span>
            )}
          </div>

          <blockquote className="mt-4 font-display italic text-sm sm:text-base text-[#EDE6D6]/95 leading-relaxed line-clamp-3">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        </div>

        <div className="mt-4 pt-3 border-t border-[#C9A24B]/16">
          <p className="font-display text-sm font-bold text-[#EDE6D6] truncate">
            {item.name}
          </p>
          <p className="text-[11px] text-[#9A968C] truncate">{item.role}</p>
        </div>
      </article>
    );
  }

  const metric = item.metricValue ?? '';
  const isPositiveMetric =
    metric.startsWith('+') || metric.includes(':') || metric.includes('%');

  return (
    <article
      onClick={onSelect}
      className={cn(
        'group flex h-full flex-col justify-between rounded-xl p-6 sm:p-7 transition-colors duration-300 select-none',
        isActive
          ? 'hairline-gold-bright bg-[#141414]/95'
          : 'hairline-gold bg-[#0B0B0C]/90 hover:bg-[#141414]/75',
        onSelect ? 'cursor-pointer' : '',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#C9A24B]/18">
          <div className="flex items-center gap-2 min-w-0 font-mono text-[10px] uppercase tracking-[0.18em]">
            <Quote className="h-3.5 w-3.5 shrink-0 text-[#C9A24B]" aria-hidden="true" />
            <span className="text-gold-gradient font-semibold truncate">
              {item.focusAsset ?? 'FX & Synthetics'}
            </span>
          </div>
          {item.timeframe && (
            <span className="font-mono text-[10px] text-[#9A968C] whitespace-nowrap shrink-0 tabular-nums">
              {item.timeframe}
            </span>
          )}
        </div>

        {metric && (
          <div className="mt-5 mb-4 flex items-baseline justify-between gap-3">
            <span
              className={cn(
                'font-display text-3xl sm:text-4xl font-bold tabular-nums leading-none',
                isPositiveMetric ? 'text-[#22C58B]' : 'text-gold-gradient'
              )}
            >
              {metric}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9A968C] text-right">
              {item.metricLabel}
            </span>
          </div>
        )}

        <blockquote className="font-display italic text-base sm:text-lg text-[#EDE6D6]/95 leading-relaxed">
          &ldquo;{item.quote}&rdquo;
        </blockquote>
      </div>

      <div className="mt-6">
        <GoldHairlineDivider className="mb-4" />
        <div className="flex items-center gap-3">
          {item.initials && (
            <ShieldCrestBadge className="h-10 w-9 shrink-0">
              <span className="font-mono text-[11px] font-bold text-[#F0D58A]">
                {item.initials}
              </span>
            </ShieldCrestBadge>
          )}
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-[#EDE6D6] truncate">
              {item.name}
            </p>
            <p className="text-xs text-[#9A968C] truncate">
              {item.role}
              {item.location ? ` · ${item.location}` : ''}
            </p>
          </div>
        </div>
        {item.outcomeNote && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[#C9A24B]/90 truncate">
            {item.outcomeNote}
          </p>
        )}
      </div>
    </article>
  );
};

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  items = TESTIMONIAL_TEMPLATES,
  defaultMode = 'slider',
  variant = 'editorial',
  showModeToggle = true,
  autoAdvanceMs = 6000,
  marqueeSpeedPxPerSec = 42,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const modeTabId = useId();
  const regionRef = useRef<HTMLDivElement>(null);
  const trackViewportRef = useRef<HTMLDivElement>(null);
  const marqueeSetRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<CarouselMode>(defaultMode);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [cardStepPx, setCardStepPx] = useState(380);
  const [marqueeSetWidth, setMarqueeSetWidth] = useState(0);

  const sliderX = useMotionValue(0);
  const marqueeX = useMotionValue(0);

  const total = items.length;
  const maxIndex = Math.max(0, total - cardsPerView);

  useEffect(() => {
    const gap = 20;
    const measure = () => {
      const vw = trackViewportRef.current?.clientWidth ?? window.innerWidth;
      let perView = 1;
      if (variant === 'photo') {
        if (vw >= 1100) perView = 4;
        else if (vw >= 768) perView = 3;
        else if (vw >= 520) perView = 2;
      } else {
        if (vw >= 1024) perView = 3;
        else if (vw >= 640) perView = 2;
      }

      const singleWidth = Math.max(240, (vw - gap * (perView - 1)) / perView);
      setCardsPerView(perView);
      setCardStepPx(singleWidth + gap);

      if (marqueeSetRef.current) {
        setMarqueeSetWidth(marqueeSetRef.current.scrollWidth + gap);
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (trackViewportRef.current) ro.observe(trackViewportRef.current);
    if (marqueeSetRef.current) ro.observe(marqueeSetRef.current);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [mode, total, variant]);

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const snapToIndex = useCallback(
    (nextIdx: number) => {
      const clamped = Math.max(0, Math.min(maxIndex, nextIdx));
      setActiveIndex(clamped);
      const targetX = -clamped * cardStepPx;
      if (reducedMotion) {
        sliderX.set(targetX);
      } else {
        animate(sliderX, targetX, APPLE_SPRING);
      }
    },
    [cardStepPx, maxIndex, reducedMotion, sliderX]
  );

  useEffect(() => {
    if (mode === 'slider') {
      sliderX.set(-activeIndex * cardStepPx);
    }
  }, [activeIndex, cardStepPx, mode, sliderX]);

  const prev = useCallback(() => {
    snapToIndex(activeIndex <= 0 ? maxIndex : activeIndex - 1);
  }, [activeIndex, maxIndex, snapToIndex]);

  const next = useCallback(() => {
    snapToIndex(activeIndex >= maxIndex ? 0 : activeIndex + 1);
  }, [activeIndex, maxIndex, snapToIndex]);

  useEffect(() => {
    if (
      mode !== 'slider' ||
      reducedMotion ||
      paused ||
      isHovering ||
      isFocusWithin ||
      isDragging ||
      maxIndex <= 0
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((cur) => {
        const nxt = cur >= maxIndex ? 0 : cur + 1;
        animate(sliderX, -nxt * cardStepPx, APPLE_SPRING);
        return nxt;
      });
    }, autoAdvanceMs);
    return () => window.clearInterval(timer);
  }, [
    autoAdvanceMs,
    cardStepPx,
    isDragging,
    isFocusWithin,
    isHovering,
    maxIndex,
    mode,
    paused,
    reducedMotion,
    sliderX,
  ]);

  useAnimationFrame((_, delta) => {
    if (
      mode !== 'marquee' ||
      reducedMotion ||
      paused ||
      isHovering ||
      isFocusWithin ||
      isDragging ||
      marqueeSetWidth <= 0
    ) {
      return;
    }
    const dt = Math.min(delta, 50) / 1000;
    let nextX = marqueeX.get() - marqueeSpeedPxPerSec * dt;
    if (nextX <= -marqueeSetWidth) {
      nextX += marqueeSetWidth;
    } else if (nextX > 0) {
      nextX -= marqueeSetWidth;
    }
    marqueeX.set(nextX);
  });

  const handleSliderDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const projectedOffset = sliderX.get() + info.velocity.x * 0.16;
    const targetIdx = Math.round(-projectedOffset / cardStepPx);
    snapToIndex(targetIdx);
  };

  const handleMarqueePan = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (marqueeSetWidth <= 0) return;
    let nextX = marqueeX.get() + info.delta.x;
    if (nextX <= -marqueeSetWidth) nextX += marqueeSetWidth;
    if (nextX > 0) nextX -= marqueeSetWidth;
    marqueeX.set(nextX);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (mode === 'marquee') {
        const shifted = marqueeX.get() + 260;
        marqueeX.set(shifted > 0 ? shifted - marqueeSetWidth : shifted);
      } else {
        prev();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (mode === 'marquee') {
        const shifted = marqueeX.get() - 260;
        marqueeX.set(shifted <= -marqueeSetWidth ? shifted + marqueeSetWidth : shifted);
      } else {
        next();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      snapToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      snapToIndex(maxIndex);
    }
  };

  const singleCardWidth = Math.max(240, cardStepPx - 20);
  const currentRangeLabel =
    mode === 'marquee'
      ? `${total} Client Testimonials Scrolling`
      : `Showing ${activeIndex + 1}–${Math.min(total, activeIndex + cardsPerView)} of ${total}`;

  const marqueeCardWidthClass =
    variant === 'photo'
      ? 'w-[250px] sm:w-[270px] lg:w-[285px]'
      : 'w-[300px] sm:w-[340px] lg:w-[360px]';

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client Testimonials Carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocusWithin(false);
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={cn(
        'hairline-gold rounded-2xl p-5 sm:p-7 lg:p-8 focus-visible:outline-2 focus-visible:outline-[#C9A24B]',
        className
      )}
    >
      {/* Top Accessible Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#C9A24B]/18">
        <div className="flex flex-wrap items-center gap-3">
          {showModeToggle && (
            <div
              role="tablist"
              aria-label="Carousel display mode"
              className="inline-flex items-center gap-1 rounded-xl border border-[#C9A24B]/24 bg-[#000000] p-1"
            >
              {(
                [
                  { key: 'slider', label: 'Snap Slider' },
                  { key: 'marquee', label: 'Continuous Stream' },
                ] as const
              ).map((opt) => {
                const active = mode === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMode(opt.key)}
                    className={cn(
                      'relative px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors min-h-[36px]',
                      active ? 'text-[#000000] font-semibold' : 'text-[#9A968C] hover:text-[#EDE6D6]'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={modeTabId}
                        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-gold-gradient"
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <span
            aria-live="polite"
            className="font-mono text-[11px] uppercase tracking-wider text-[#9A968C] tabular-nums"
          >
            {currentRangeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? 'Resume testimonial scroll' : 'Pause testimonial scroll'}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-xs font-medium text-[#EDE6D6] hover:border-[#F0D58A]/65 transition-colors whitespace-nowrap shrink-0"
            >
              {paused ? (
                <Play className="h-3.5 w-3.5 text-[#22C58B]" aria-hidden="true" />
              ) : (
                <Pause className="h-3.5 w-3.5 text-[#F0D58A]" aria-hidden="true" />
              )}
              <span>{paused ? 'Resume' : 'Pause'}</span>
            </button>
          )}

          {mode === 'slider' && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonials"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-[#C9A24B]/28 bg-[#000000] text-[#EDE6D6] hover:border-[#F0D58A]/70 hover:text-[#F0D58A] transition-colors shrink-0"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonials"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-[#C9A24B]/28 bg-[#000000] text-[#EDE6D6] hover:border-[#F0D58A]/70 hover:text-[#F0D58A] transition-colors shrink-0"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Viewport Track */}
      <div ref={trackViewportRef} className="relative overflow-hidden touch-pan-y">
        {mode === 'marquee' && !reducedMotion && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-14 bg-gradient-to-r from-[#0B0B0C] to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-14 bg-gradient-to-l from-[#0B0B0C] to-transparent"
            />
          </>
        )}

        {mode === 'slider' ? (
          <motion.div
            style={{ x: sliderX }}
            drag={reducedMotion ? false : 'x'}
            dragConstraints={{
              left: -maxIndex * cardStepPx,
              right: 0,
            }}
            dragElastic={0.14}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleSliderDragEnd}
            className="flex gap-5 cursor-grab active:cursor-grabbing will-change-transform"
          >
            {items.map((item, idx) => {
              const inWindow = idx >= activeIndex && idx < activeIndex + cardsPerView;
              return (
                <div
                  key={item.id}
                  style={{ width: `${singleCardWidth}px` }}
                  className="shrink-0"
                >
                  <ClientResultCard
                    item={item}
                    variant={variant}
                    isActive={idx === activeIndex}
                    onSelect={() => snapToIndex(Math.min(idx, maxIndex))}
                    className={inWindow ? 'opacity-100' : 'opacity-75'}
                  />
                </div>
              );
            })}
          </motion.div>
        ) : reducedMotion ? (
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2">
            {items.map((item) => (
              <div key={item.id} className={cn(marqueeCardWidthClass, 'shrink-0 snap-start')}>
                <ClientResultCard item={item} variant={variant} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            style={{ x: marqueeX }}
            onPanStart={() => setIsDragging(true)}
            onPan={handleMarqueePan}
            onPanEnd={() => setIsDragging(false)}
            className="flex gap-5 cursor-grab active:cursor-grabbing will-change-transform"
          >
            <div ref={marqueeSetRef} className="flex gap-5 shrink-0">
              {items.map((item) => (
                <div key={item.id} className={cn(marqueeCardWidthClass, 'shrink-0')}>
                  <ClientResultCard item={item} variant={variant} />
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="flex gap-5 shrink-0">
              {items.map((item) => (
                <div key={`${item.id}-clone`} className={cn(marqueeCardWidthClass, 'shrink-0')}>
                  <ClientResultCard item={item} variant={variant} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Indicator & Gesture Guidance */}
      <div className="mt-6 pt-4 border-t border-[#C9A24B]/16 flex flex-wrap items-center justify-between gap-4">
        {mode === 'slider' ? (
          <div className="flex items-center gap-2" role="tablist" aria-label="Slide index">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Go to slide ${idx + 1} of ${maxIndex + 1}`}
                  onClick={() => snapToIndex(idx)}
                  className="group py-2 px-0.5 focus-visible:outline-2 focus-visible:outline-[#C9A24B] rounded"
                >
                  <span
                    className={cn(
                      'block h-1.5 rounded-full transition-all duration-300',
                      active
                        ? 'w-8 bg-gold-gradient'
                        : 'w-2 bg-[#C9A24B]/30 group-hover:bg-[#C9A24B]/65'
                    )}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#C9A24B]">
            Auto-scrolling stream · Hover or focus to pause · Drag to scrub
          </p>
        )}

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A968C]">
          Swipe · Drag · Arrow Keys
        </p>
      </div>
    </div>
  );
};
