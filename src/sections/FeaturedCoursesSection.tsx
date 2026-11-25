import React, { useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Clock, PlayCircle } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { SafeImage } from '../components/ui/SafeImage';
import { ShieldFrame, GoldHairlineDivider, EditorialReveal } from '../components/ui/TitanMotifs';
import { COURSES, type CourseItem } from '../data/academyData';
import { formatCurrency, cn } from '../lib/utils';

export const FeaturedCoursesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewCourse, setPreviewCourse] = useState<CourseItem | null>(null);

  const featured = COURSES[activeIndex];
  const companions = COURSES.map((c, idx) => ({ course: c, idx })).filter(
    ({ idx }) => idx !== activeIndex
  );

  const next = () => setActiveIndex((i) => (i + 1) % COURSES.length);
  const prev = () => setActiveIndex((i) => (i - 1 + COURSES.length) % COURSES.length);

  return (
    <Section
      romanIndex="03"
      kicker="The Forge Curriculum"
      title="Flagship Forging Syllabi"
      subtitle="Inspect our featured curriculum monograph or switch ranks below to preview complete module breakdowns."
    >
      {/* Editorial Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#C9A24B]/22">
        <div className="flex flex-wrap items-center gap-6">
          {COURSES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'pb-1.5 text-left transition-colors duration-300 border-b-2 font-mono text-xs uppercase tracking-wider',
                idx === activeIndex
                  ? 'border-[#C9A24B] text-[#F0D58A] font-semibold'
                  : 'border-transparent text-[#9A968C] hover:text-[#EDE6D6]'
              )}
            >
              0{idx + 1}. {c.level}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous course"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/28 bg-[#0B0B0C] text-[#EDE6D6] hover:border-[#F0D58A]/65 transition-colors duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next course"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/28 bg-[#0B0B0C] text-[#EDE6D6] hover:border-[#F0D58A]/65 transition-colors duration-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lead Asymmetric Feature Monograph (6 / 6 Split — No Generic 3-Card Row) */}
      <div className="grid gap-10 lg:grid-cols-12 items-center mb-12">
        <div className="lg:col-span-6">
          <ShieldFrame
            variant="landscape"
            bright
            innerClassName="aspect-[16/10] w-full"
            caption={`TRACK 0${activeIndex + 1} · ${featured.marketFocus}`}
          >
            <SafeImage
              src={featured.image}
              alt={`${featured.title} preview desk`}
              width={960}
              height={600}
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#000000]/70 via-transparent to-transparent"
            />
          </ShieldFrame>
        </div>

        <EditorialReveal className="lg:col-span-6 space-y-6" delay={0.1}>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-gradient font-semibold">
              {featured.level} · Featured Monograph
            </p>
            <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#EDE6D6] leading-[1.1]">
              {featured.title}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#9A968C] leading-relaxed">
              {featured.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 py-3.5 border-y border-[#C9A24B]/20 text-xs font-mono text-[#EDE6D6]/85 tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#C9A24B]" />
              {featured.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#F0D58A]" />
              {featured.lessons} Lessons
            </span>
            <span className="text-gold-gradient font-semibold">
              Tuition {formatCurrency(featured.price)}
            </span>
          </div>

          <ul className="space-y-2.5">
            {featured.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#EDE6D6]/90">
                <Check className="h-4 w-4 shrink-0 text-[#C9A24B] mt-0.5" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button variant="primary" size="lg" to="/training">
              Explore Full Syllabus
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setPreviewCourse(featured)}>
              <PlayCircle className="h-4 w-4 text-[#F0D58A]" />
              Preview Sample Module
            </Button>
          </div>
        </EditorialReveal>
      </div>

      <GoldHairlineDivider className="mb-8" />

      {/* Companion Tracks Ruled Editorial Dossiers */}
      <div className="grid gap-6 md:grid-cols-2">
          {companions.map(({ course, idx }, i) => (
          <EditorialReveal
            key={course.id}
            delay={i * 0.12}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-[#C9A24B]/16 pb-6"
          >
            <div className="space-y-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C9A24B]">
                Rank 0{idx + 1} · {course.level} · {course.duration}
              </p>
              <h4 className="font-display text-xl font-bold text-[#EDE6D6]">
                {course.title}
              </h4>
              <p className="text-xs text-[#9A968C] max-w-md">{course.marketFocus}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-base font-semibold text-[#EDE6D6] tabular-nums">
                {formatCurrency(course.price)}
              </span>
              <Button variant="secondary" size="sm" onClick={() => setActiveIndex(idx)}>
                Inspect Rank
              </Button>
            </div>
          </EditorialReveal>
        ))}
      </div>

      <Modal
        isOpen={Boolean(previewCourse)}
        onClose={() => setPreviewCourse(null)}
        title={previewCourse ? previewCourse.title : ''}
        subtitle={
          previewCourse
            ? `${previewCourse.level} · ${previewCourse.duration} · ${previewCourse.lessons} Lessons`
            : undefined
        }
        size="lg"
      >
        {previewCourse && (
          <div className="space-y-5">
            <div className="relative aspect-video rounded-lg hairline-gold bg-[#000000] flex flex-col items-center justify-center p-6 text-center">
              <PlayCircle className="h-12 w-12 text-[#F0D58A] mb-3" />
              <p className="text-sm font-medium text-[#EDE6D6]">
                Sample Lesson Walkthrough Placeholder
              </p>
              <p className="mt-1 text-xs text-[#9A968C] max-w-md">
                Video stream module slot ready for LMS embed: {previewCourse.modules[0]?.lessons[0]?.title}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#EDE6D6] mb-3">
                Included Curriculum Modules
              </h4>
              <div className="space-y-2.5">
                {previewCourse.modules.map((mod) => (
                  <div
                    key={mod.title}
                    className="rounded-md border border-[#C9A24B]/18 bg-[#141414] p-3.5"
                  >
                    <p className="text-xs font-semibold text-[#F0D58A]">{mod.title}</p>
                    <p className="mt-1 text-xs text-[#9A968C]">
                      {mod.lessons.map((l) => l.title).join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setPreviewCourse(null)}>
                Close
              </Button>
              <Button to="/training" variant="primary" onClick={() => setPreviewCourse(null)}>
                Open Full Forge Curriculum
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
};
