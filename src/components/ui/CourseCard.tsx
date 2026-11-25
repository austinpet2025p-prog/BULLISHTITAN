import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Layers, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { SafeImage } from './SafeImage';
import { ShieldFrame } from './TitanMotifs';
import { type CourseItem } from '../../data/academyData';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn, formatCurrency } from '../../lib/utils';

export interface CourseCardProps {
  course: CourseItem;
  onPreview?: (course: CourseItem) => void;
  onSelect?: (course: CourseItem) => void;
  selected?: boolean;
}

const TILT_SPRING = { stiffness: 220, damping: 24, mass: 0.7 };

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPreview,
  onSelect,
  selected = false,
}) => {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [touchExpanded, setTouchExpanded] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, TILT_SPRING);
  const springY = useSpring(rawY, TILT_SPRING);

  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const glareX = useTransform(springX, [-0.5, 0.5], [15, 85]);
  const glareY = useTransform(springY, [-0.5, 0.5], [15, 85]);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(240, 213, 138, 0.16), rgba(52, 211, 153, 0.08) 42%, transparent 72%)`;

  const outcomesVisible = isHovered || isFocused || touchExpanded;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === 'touch' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5));
    const ny = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5));
    rawX.set(nx);
    rawY.set(ny);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') {
      setIsHovered(true);
    }
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
      style={
        reducedMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 950,
              transformStyle: 'preserve-3d',
            }
      }
      className={cn(
        'group relative flex flex-col h-full rounded-xl p-5 sm:p-6 transition-[border-color,box-shadow] duration-300',
        selected ? 'hairline-gold-bright shadow-[0_20px_50px_rgba(201,162,75,0.14)]' : 'hairline-gold',
        outcomesVisible && 'border-[#F0D58A]/55 shadow-[0_24px_56px_rgba(0,0,0,0.85)]'
      )}
    >
      {/* Interactive cursor-tracking specular gold & emerald glare */}
      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ background: glareBackground }}
          className={cn(
            'pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Visual Frame + Hover/Focus Key Learning Outcomes Reveal Overlay */}
      <div className="relative z-10">
        <ShieldFrame variant="landscape" bright={selected || outcomesVisible} innerClassName="aspect-[16/10] w-full">
          <SafeImage
            src={course.image}
            alt={`${course.title} preview desk`}
            width={800}
            height={450}
            className={cn(
              'h-full w-full object-cover transition-transform duration-500',
              outcomesVisible ? 'scale-[1.06] brightness-50' : 'group-hover:scale-[1.04]'
            )}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#07080B]/85 via-[#07080B]/20 to-transparent"
          />

          {/* Top Status Cue */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="rounded-md border border-[#C9A24B]/35 bg-[#050608]/85 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#F0D58A]">
              {course.modules.length} Modules
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md transition-colors duration-200',
                outcomesVisible
                  ? 'border-[#34D399]/55 bg-[#071914]/90 text-[#34D399]'
                  : 'border-[#C9A24B]/30 bg-[#050608]/80 text-[#EDE6D6]/85'
              )}
            >
              <Sparkles className="h-2.5 w-2.5" />
              {outcomesVisible ? 'Outcomes Unlocked' : 'Hover for Outcomes'}
            </span>
          </div>

          {/* Interactive 3D Hover Reveal Layer: Key Learning Outcomes */}
          <AnimatePresence>
            {outcomesVisible && (
              <motion.div
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#040807]/96 via-[#07110E]/92 to-[#050609]/80 p-4 backdrop-blur-[3px]"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-gold mb-2">
                  Key Learning Outcomes
                </p>
                <ul className="space-y-1.5">
                  {course.outcomes.map((outcome, i) => (
                    <motion.li
                      key={outcome}
                      initial={reducedMotion ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reducedMotion ? 0 : i * 0.045, duration: 0.18 }}
                      className="flex items-start gap-2 text-[11px] sm:text-xs text-[#EDE6D6] leading-snug"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#34D399] mt-0.5" />
                      <span>{outcome}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </ShieldFrame>
      </div>

      {/* Card Copy & Metrics */}
      <div
        className="relative z-10 flex flex-1 flex-col pt-5"
        style={reducedMotion ? undefined : { transform: 'translateZ(18px)' }}
      >
        <div className="mb-4 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wider font-semibold text-gold-gradient">
            {course.level} · {course.marketFocus}
          </p>
          <h3 className="mt-2 font-display text-xl font-bold text-[#EDE6D6] leading-snug">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-[#9A968C] leading-relaxed">
            {course.summary}
          </p>
        </div>

        {/* Meta Strip + Mobile Tap Reveal Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#9A968C] py-3 border-y border-[#C9A24B]/15 tabular-nums">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#C9A24B]" />
              {course.duration}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#F0D58A]" />
              {course.lessons} Lessons
            </span>
          </div>

          <button
            type="button"
            onClick={() => setTouchExpanded((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-[#C9A24B]/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#F0D58A] hover:border-[#F0D58A] transition-colors lg:hidden"
          >
            <Layers className="h-3 w-3" />
            {touchExpanded ? 'Hide Outcomes' : 'Outcomes'}
          </button>
        </div>

        {/* Bottom Pricing & Controls */}
        <div className="pt-4 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] text-[#9A968C]">Tuition</span>
            <span className="font-mono text-xl font-semibold text-[#EDE6D6] tabular-nums">
              {formatCurrency(course.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onPreview && (
              <Button variant="ghost" size="sm" onClick={() => onPreview(course)}>
                Preview
              </Button>
            )}
            {onSelect ? (
              <Button
                variant={selected ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onSelect(course)}
              >
                {selected ? 'Selected' : 'View Track'}
              </Button>
            ) : (
              <Button variant="secondary" size="sm" to="/training">
                Syllabus
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
