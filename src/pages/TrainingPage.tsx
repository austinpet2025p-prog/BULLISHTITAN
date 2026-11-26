import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Award,
  BarChart2,
  BookOpen,
  Brain,
  CheckCircle2,
  FileDown,
  FlaskConical,
  Layers,
  PlayCircle,
  ShieldCheck,
  TrendingUp,
  Video,
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CourseCard } from '../components/ui/CourseCard';
import { Accordion } from '../components/ui/Accordion';
import { Tabs } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { SafeImage } from '../components/ui/SafeImage';
import { AmbientMeshCanvas } from '../components/ui/AmbientMeshCanvas';
import { SovereignRadialProgress } from '../components/ui/SovereignRadialProgress';
import {
  RisingArrowConnector,
  ShieldCrestBadge,
  ShieldFrame,
  ShieldSectionDivider,
} from '../components/ui/TitanMotifs';
import { COURSES, MENTORS, type CourseItem } from '../data/academyData';
import { useAuth } from '../lib/authContext';
import { formatCurrency } from '../lib/utils';
import trainingSpartanBg from '../assets/images/training_spartan_widescreen_1795620108869.jpg';

const TrainingScene3D = lazy(() => import('../components/three/TrainingScene3D'));

const SKILLS_GRID = [
  {
    roman: 'I',
    icon: TrendingUp,
    title: 'Reading Price Charts Clearly',
    desc: 'See where price is truly moving without cluttered lines or confusing indicators.',
  },
  {
    roman: 'II',
    icon: ShieldCheck,
    title: 'Protecting Your Money First',
    desc: 'Use simple 0.5% to 1.0% safety limits so one bad trade never hurts your account.',
  },
  {
    roman: 'III',
    icon: Brain,
    title: 'Calm Trading Habits',
    desc: 'Follow an easy pre-trade checklist so you stay patient and never chase trades.',
  },
  {
    roman: 'IV',
    icon: Layers,
    title: 'How Markets Move',
    desc: 'Match big-picture daily trends with smart, clean entries on smaller timeframes.',
  },
  {
    roman: 'V',
    icon: BarChart2,
    title: 'Step-by-Step Setups',
    desc: 'Learn repeatable London and New York trading hours setups you can practice every week.',
  },
  {
    roman: 'VI',
    icon: FlaskConical,
    title: 'Practicing Before Risking',
    desc: 'Test your plan across 100 practice trades so you trust your rules before going live.',
  },
];

const LEARNING_FORMATS = [
  {
    icon: Video,
    title: 'Clear HD Video Lessons',
    desc: 'Short 15 to 30 minute chart walkthroughs organized from beginner to advanced.',
  },
  {
    icon: BookOpen,
    title: 'Live Weekly Classes',
    desc: 'Friendly Q&A calls breaking down upcoming Forex and Synthetic Indices setups.',
  },
  {
    icon: FileDown,
    title: 'Printable Checklists & Guides',
    desc: 'Easy PDF trade checklists, safety spreadsheets, and simple trade journals.',
  },
  {
    icon: Award,
    title: 'Completion Certificate',
    desc: 'Earned after finishing your safety check and practice trade journal.',
  },
];

export const TrainingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { completedLessons, toggleLessonComplete } = useAuth();
  const requestedCourse = searchParams.get('course');
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (requestedCourse && COURSES.some((c) => c.id === requestedCourse)) {
      return requestedCourse;
    }
    return COURSES[0].id;
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [enrollConfirm, setEnrollConfirm] = useState(false);

  useEffect(() => {
    if (requestedCourse && COURSES.some((c) => c.id === requestedCourse)) {
      setSelectedId(requestedCourse);
    }
  }, [requestedCourse]);

  const selectedCourse = COURSES.find((c) => c.id === selectedId) || COURSES[0];

  return (
    <div className="relative isolate bg-[#000000] overflow-x-clip">
      {/* The Forge Spartan Warrior Background Layer (100% width, blended at 22% opacity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen w-full overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 68% 72% at 50% 44%, rgba(201, 162, 75, 0.08), rgba(30, 58, 138, 0.08) 56%, rgba(0, 0, 0, 0.92) 92%)',
          }}
        />
        <img
          src={trainingSpartanBg}
          alt=""
          referrerPolicy="no-referrer"
          className="relative h-full w-full object-cover object-center opacity-[0.22] mix-blend-lighten select-none"
        />
        {/* Seamless obsidian & sapphire perimeter blend */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 78% 84% at 50% 46%, transparent 38%, rgba(2, 5, 13, 0.44) 74%, #000000 98%), linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, transparent 15%, transparent 80%, #000000 100%)',
          }}
        />
      </div>

      <div className="relative z-10 pt-20">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 border-b border-[#C9A24B]/18 overflow-hidden">
        <AmbientMeshCanvas />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-gold-gradient" aria-hidden="true" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-gold-gradient">
                  01 · Video Trading Courses
                </p>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EDE6D6] leading-[1.06]">
                Learn Forex &amp; Synthetic Indices With{' '}
                <span className="italic font-semibold text-gold-gradient">
                  Calm Confidence
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base text-[#9A968C] leading-relaxed">
                Three simple course levels built to guide you from your very first chart to calm, steady trading—backed by step-by-step videos, weekly classes, and clear money-safety rules.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Button variant="primary" size="lg" onClick={() => setPreviewOpen(true)}>
                  <PlayCircle className="h-4 w-4" />
                  Watch Free Lesson Preview
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See All Lessons
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ShieldFrame
                variant="crest"
                bright
                caption="PLATE I — VIDEO COURSE GUIDE"
              >
                <Suspense
                  fallback={
                    <div className="h-[340px] flex items-center justify-center text-xs font-mono text-[#9A968C]">
                      Loading 3D Guide...
                    </div>
                  }
                >
                  <TrainingScene3D />
                </Suspense>
              </ShieldFrame>
            </div>
          </div>
        </div>
      </section>

      <RisingArrowConnector align="right" className="pt-6" />

      {/* Three Level Cards */}
      <Section
        romanIndex="01"
        kicker="Skill Levels"
        title="Three Clear Course Levels"
        subtitle="Start at the level that fits you today, or move step by step from Beginner to Advanced."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {COURSES.map((course: CourseItem) => (
            <CourseCard
              key={course.id}
              course={course}
              selected={course.id === selectedId}
              onSelect={(c) => setSelectedId(c.id)}
              onPreview={() => setPreviewOpen(true)}
            />
          ))}
        </div>
      </Section>

      <ShieldSectionDivider label="Lesson List" />

      {/* Curriculum Accordion + Sticky Enroll Side Card */}
      <Section
        id="curriculum"
        romanIndex="02"
        kicker="Course Lessons"
        title="See Every Lesson &amp; Exercise"
        subtitle="Pick a level below to check every video topic and lesson length."
      >
        <div className="mb-8">
          <Tabs
            value={selectedId}
            onChange={setSelectedId}
            options={COURSES.map((c) => ({ value: c.id, label: c.level }))}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8">
            <Accordion
              items={selectedCourse.modules.map((mod, mIdx) => ({
                title: mod.title,
                meta: `${mod.lessons.filter((_l, lIdx) => completedLessons.includes(`${selectedCourse.id}:${mIdx}:${lIdx}`)).length}/${mod.lessons.length} Done`,
                content: (
                  <ul className="space-y-3">
                    {mod.lessons.map((lesson, lIdx) => {
                      const lessonKey = `${selectedCourse.id}:${mIdx}:${lIdx}`;
                      const isDone = completedLessons.includes(lessonKey);
                      return (
                        <li
                          key={lesson.title}
                          className="flex items-center justify-between gap-4 rounded-md border border-[#C9A24B]/18 bg-[#000000]/75 px-4 py-2.5"
                        >
                          <button
                            type="button"
                            onClick={() => toggleLessonComplete(lessonKey)}
                            className="flex items-center gap-2.5 text-left text-sm text-[#EDE6D6] hover:text-[#F0D58A] transition-colors"
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                            ) : (
                              <PlayCircle className="h-4 w-4 text-[#C9A24B] shrink-0" />
                            )}
                            <span>{lesson.title}</span>
                          </button>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono text-xs text-[#9A968C] tabular-nums">
                              {lesson.duration}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleLessonComplete(lessonKey)}
                              className={
                                isDone
                                  ? 'rounded border border-[#1F9D6B]/45 bg-[#1F9D6B]/15 px-2 py-0.5 font-mono text-[10px] uppercase text-[#34D399]'
                                  : 'rounded border border-[#C9A24B]/25 px-2 py-0.5 font-mono text-[10px] uppercase text-[#9A968C] hover:border-[#F0D58A] hover:text-[#F0D58A]'
                              }
                            >
                              {isDone ? 'Done' : 'Complete'}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ),
              }))}
            />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <Card featured>
              <p className="font-mono text-[11px] uppercase tracking-wider font-semibold text-gold-gradient">
                {selectedCourse.level}
              </p>
              <h3 className="mt-1.5 font-display text-2xl font-bold text-[#EDE6D6]">
                {selectedCourse.title}
              </h3>
              <p className="mt-2 text-xs text-[#9A968C]">
                {selectedCourse.duration} · {selectedCourse.lessons} Lessons · Lifetime Updates
              </p>

              <div className="my-5 py-4 border-y border-[#C9A24B]/20 flex items-baseline justify-between">
                <span className="text-xs text-[#9A968C]">One-time Course Fee</span>
                <span className="font-mono text-3xl font-semibold text-[#EDE6D6] tabular-nums">
                  {formatCurrency(selectedCourse.price)}
                </span>
              </div>

              <div className="space-y-2.5">
                <Button fullWidth variant="primary" onClick={() => setEnrollConfirm(true)}>
                  Start {selectedCourse.level}
                </Button>
                <Button fullWidth variant="outline" onClick={() => setPreviewOpen(true)}>
                  Preview Sample Lesson
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* What You Will Learn */}
      <Section
        romanIndex="03"
        kicker="Core Skills"
        title="What You Will Learn"
        subtitle="Six practical habits taught in every lesson and practice exercise."
      >
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 border-t border-[#C9A24B]/30 pt-6">
            <p className="font-display italic text-2xl text-[#EDE6D6] leading-snug">
              &ldquo;Calm, steady trading starts when guesswork ends.&rdquo;
            </p>
            <p className="mt-3 text-sm text-[#9A968C] leading-relaxed">
              Every module shows you where smart buyers and sellers step in, where to place your safety stop, and how to review your trades across Forex and Synthetic Indices.
            </p>
            <RisingArrowConnector align="left" className="px-0 mt-5" />
          </div>

          <div className="lg:col-span-8 border-y border-[#C9A24B]/25 divide-y divide-[#C9A24B]/18">
            {SKILLS_GRID.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="py-5 sm:py-6 flex items-start gap-5">
                  <div className="flex items-center gap-3 shrink-0 pt-0.5">
                    <span className="font-display italic text-base text-[#C9A24B] w-6">
                      {item.roman}.
                    </span>
                    <ShieldCrestBadge className="h-10 w-9">
                      <Icon className="h-4 w-4 text-[#F0D58A]" />
                    </ShieldCrestBadge>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#EDE6D6]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#9A968C] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Learning Format + Student Progress Sample UI + Lead Instructor */}
      <Section
        romanIndex="04"
        kicker="How You Learn"
        title="Inside Your Student Courses"
        subtitle="Easy video lessons paired with live weekly classes, simple checklists, and clear progress tracking."
      >
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 border-y border-[#C9A24B]/22 divide-y divide-[#C9A24B]/16">
            {LEARNING_FORMATS.map((fmt) => {
              const Icon = fmt.icon;
              return (
                <div key={fmt.title} className="py-5 flex items-start gap-4">
                  <ShieldCrestBadge className="h-10 w-9 mt-0.5">
                    <Icon className="h-4 w-4 text-[#F0D58A]" />
                  </ShieldCrestBadge>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#EDE6D6]">
                      {fmt.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#9A968C] leading-relaxed">
                      {fmt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5">
            <SovereignRadialProgress
              completedLessons={completedLessons}
              course={selectedCourse}
              onToggleLesson={toggleLessonComplete}
              variant="compact"
            />

            <Card className="flex items-center gap-4 py-4">
              <ShieldCrestBadge className="h-14 w-12 overflow-hidden">
                <SafeImage
                  src={MENTORS[0].image}
                  alt={MENTORS[0].name}
                  className="h-full w-full object-cover object-[52%_32%]"
                />
              </ShieldCrestBadge>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#C9A24B]">
                  Lead Curriculum Instructor
                </p>
                <p className="font-display text-base font-bold text-[#EDE6D6]">{MENTORS[0].name}</p>
                <p className="text-xs text-[#9A968C]">{MENTORS[0].experience}</p>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* Training FAQ & CTA */}
      <Section romanIndex="05" kicker="Course Questions" title="Common Questions About Our Courses">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <Accordion
              items={[
                {
                  title: 'How long do I keep access to the course videos?',
                  content:
                    'Once you join a course level, you keep ongoing access to its video lessons, printable checklists, and all future lesson updates.',
                },
                {
                  title: 'Do the courses cover both Forex and Synthetic Indices?',
                  content:
                    'Yes. Our chart reading and safety rules work across major Forex pairs, Gold, and Synthetic Indices (Volatility 75, V100, and Boom/Crash), with clear examples on stop placement and trade sizing.',
                },
                {
                  title: 'Can I move up from Beginner to Intermediate or 1-on-1 Coaching later?',
                  content:
                    'Yes. Everything you pay for your current course can go smoothly toward higher levels or our 12-week 1-on-1 Coaching program.',
                },
              ]}
            />
          </div>

          <Card featured className="lg:col-span-5">
            <h3 className="font-display text-2xl font-bold text-[#EDE6D6]">
              Ready to Start Learning?
            </h3>
            <p className="mt-2.5 text-sm text-[#9A968C] leading-relaxed">
              Not sure whether to start with Beginner, Intermediate, or 1-on-1 Coaching? Talk with our support team or enroll today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => setEnrollConfirm(true)}>
                Join This Course
              </Button>
              <Button variant="outline" to="/mentorship">
                Explore 1-on-1 Coaching
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* Free Lesson Preview Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Free Lesson Preview · Reading Price &amp; Session Highs"
        subtitle="Sample Module 01 Walkthrough (Video Player Placeholder)"
        size="lg"
      >
        <div className="space-y-4">
          <div className="aspect-video rounded-lg hairline-gold bg-[#000000] flex flex-col items-center justify-center p-6 text-center">
            <PlayCircle className="h-14 w-14 text-[#F0D58A] mb-3" />
            <p className="font-display text-lg font-bold text-[#EDE6D6]">
              Lesson 01: How Forex &amp; Synthetic Markets Move Each Day
            </p>
            <p className="mt-1.5 text-xs text-[#9A968C] max-w-md">
              18:24 · Sample video player ready for your live course stream.
            </p>
          </div>
          <p className="text-xs text-[#9A968C] leading-relaxed">
            In this starter lesson, {MENTORS[0].name} walks through Asian session highs and lows, why price pauses at key levels, and how waiting for clear confirmation keeps your risk small.
          </p>
        </div>
      </Modal>

      {/* Enrollment Confirmation Modal */}
      <Modal
        isOpen={enrollConfirm}
        onClose={() => setEnrollConfirm(false)}
        title="Track Enrollment Summary"
        subtitle={selectedCourse.title}
      >
        <div className="space-y-4 text-center py-2">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[#C9A24B]" />
          <p className="text-sm text-[#EDE6D6]">
            You selected <strong className="text-[#F0D58A]">{selectedCourse.level}</strong> ({formatCurrency(selectedCourse.price)}).
          </p>
          <p className="text-xs text-[#9A968C]">
            Front-end checkout preview ready to connect with Stripe, Paystack, or Flutterwave processing.
          </p>
          <Button fullWidth onClick={() => setEnrollConfirm(false)}>
            Continue Browsing
          </Button>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default TrainingPage;
