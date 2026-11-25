import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Flame,
  LayoutDashboard,
  Lock,
  LogOut,
  Moon,
  PlayCircle,
  Radio,
  Settings,
  Sun,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SignalCard } from '../components/ui/SignalCard';
import { RiskDisclaimer } from '../components/ui/RiskDisclaimer';
import { SovereignRadialProgress } from '../components/ui/SovereignRadialProgress';
import { COURSES, DEMO_SIGNALS } from '../data/academyData';
import { INVESTOR_DEMO_REPORTING } from '../data/extendedData';
import { canAccessArea, PLAN_LABELS, useAuth, type PlanTier } from '../lib/authContext';
import { cn } from '../lib/utils';

type DashTab = 'overview' | 'courses' | 'signals' | 'mentorship' | 'investor' | 'settings';

const NAV_TABS: { id: DashTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
  { id: 'courses', label: 'The Forge', icon: BookOpen },
  { id: 'signals', label: 'Vanguard Feed', icon: Radio },
  { id: 'mentorship', label: 'Strategos', icon: Users },
  { id: 'investor', label: 'Mandate Vault', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ProgressRing: React.FC<{ label: string; percent: number }> = ({ label, percent }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-3.5 rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-4">
      <svg className="h-16 w-16 -rotate-90 shrink-0" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          className="text-stone-200 dark:text-[#141414]"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="url(#titan-gold-grad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      <div>
        <p className="font-mono text-lg font-bold text-stone-900 dark:text-[#EDE6D6] tabular-nums">
          {percent}%
        </p>
        <p className="text-xs text-stone-600 dark:text-[#9A968C]">{label}</p>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const {
    user,
    logout,
    theme,
    toggleTheme,
    updatePlan,
    updateProfile,
    completedLessons,
    toggleLessonComplete,
  } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DashTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [selectedCourseIdx, setSelectedCourseIdx] = useState(0);
  const [activeLessonPos, setActiveLessonPos] = useState({ mod: 0, les: 0 });
  const [lessonNotes, setLessonNotes] = useState(
    'Wait for London sweep before entering displacement FVG. Keep stop below structural swing.'
  );

  const [pairFilter, setPairFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [profileName, setProfileName] = useState(user?.name || '');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const totalLessonsAll = useMemo(
    () =>
      COURSES.reduce(
        (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
        0
      ),
    []
  );
  const overallProgress = Math.min(
    100,
    Math.round((completedLessons.length / Math.max(1, totalLessonsAll)) * 100)
  );

  const selectedCourse = COURSES[selectedCourseIdx] || COURSES[0];
  const activeLesson =
    selectedCourse.modules[activeLessonPos.mod]?.lessons[activeLessonPos.les] ||
    selectedCourse.modules[0].lessons[0];
  const activeLessonKey = `${selectedCourse.id}:${activeLessonPos.mod}:${activeLessonPos.les}`;
  const isLessonCompleted = completedLessons.includes(activeLessonKey);

  const filteredSignals = DEMO_SIGNALS.filter((sig) => {
    const matchPair = pairFilter === 'All' || sig.pair === pairFilter;
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Open' && (sig.status === 'Active' || sig.status === 'Pending' || sig.status === 'TP1 Reached')) ||
      (statusFilter === 'Closed' && sig.status === 'Closed');
    return matchPair && matchStatus;
  });

  const hasAccess = canAccessArea(user.plan, activeTab);

  return (
    <div className="min-h-screen pt-20 pb-14 bg-stone-50 dark:bg-[#000000] text-stone-900 dark:text-[#EDE6D6] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dashboard Top Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label="Toggle dashboard sidebar"
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 dark:border-[#C9A24B]/24 text-stone-600 dark:text-[#9A968C] hover:text-stone-900 dark:hover:text-[#EDE6D6]"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold">
                Command Console
              </h1>
              <p className="text-xs text-stone-600 dark:text-[#9A968C]">
                {user.name} · Active Rank:{' '}
                <span className="font-mono font-semibold text-amber-700 dark:text-[#F0D58A]">
                  {PLAN_LABELS[user.plan]}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark or light mode"
              className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 dark:border-[#C9A24B]/24 px-3 py-2 text-xs font-medium text-stone-700 dark:text-[#EDE6D6] hover:border-[#F0D58A]/55"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-[#F0D58A]" /> : <Moon className="h-3.5 w-3.5 text-[#8C6A1F]" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Collapsible Sidebar */}
          <aside
            className={cn(
              'w-full shrink-0 rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-3 transition-all',
              sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
            )}
          >
            <nav className="flex lg:flex-col gap-1 overflow-x-auto">
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                const locked = !canAccessArea(user.plan, tab.id);
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center justify-between gap-2.5 rounded-md px-3.5 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors',
                      active
                        ? 'bg-gold-gradient text-[#000000] font-semibold'
                        : 'text-stone-600 dark:text-[#9A968C] hover:bg-stone-100 dark:hover:bg-[#141414]'
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span>{tab.label}</span>}
                    </span>
                    {!sidebarCollapsed && locked && (
                      <Lock className="h-3.5 w-3.5 opacity-60" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0">
            {!hasAccess ? (
              <div className="rounded-lg border border-[#C9A24B]/40 bg-white dark:bg-[#0B0B0C] p-8 text-center">
                <Lock className="mx-auto h-10 w-10 text-[#C9A24B] mb-3" />
                <h2 className="font-display text-2xl font-bold">
                  Sector Restricted Under &ldquo;{PLAN_LABELS[user.plan]}&rdquo;
                </h2>
                <p className="mt-2 max-w-md mx-auto text-sm text-stone-600 dark:text-[#9A968C]">
                  Ascend your rank order to unlock this command sector, or switch your preview rank inside Settings to inspect every division.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button variant="primary" onClick={() => updatePlan('full-access')}>
                    Preview Sovereign Titan (Demo)
                  </Button>
                  <Button variant="secondary" to="/pricing">
                    Compare Ranks
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-6">
                      <p className="font-mono text-[11px] uppercase tracking-wider font-semibold text-amber-700 dark:text-[#F0D58A]">
                        Welcome Back, {user.name}
                      </p>
                      <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold">
                        Your Command Desk Overview
                      </h2>
                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <ProgressRing label="The Forge Syllabus" percent={overallProgress} />
                        <ProgressRing
                          label="Risk Shield Mastery"
                          percent={Math.min(100, overallProgress + 22)}
                        />
                        <div className="flex items-center gap-3.5 rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-stone-50 dark:bg-[#141414] p-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#C9A24B]/35 bg-[#C9A24B]/12 text-[#F0D58A]">
                            <Flame className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-mono text-lg font-bold tabular-nums">
                              {user.streakDays} Days
                            </p>
                            <p className="text-xs text-stone-600 dark:text-[#9A968C]">
                              Discipline Streak
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <SovereignRadialProgress
                      completedLessons={completedLessons}
                      onToggleLesson={toggleLessonComplete}
                      onSelectModule={(courseId, modIdx) => {
                        const cIdx = COURSES.findIndex((c) => c.id === courseId);
                        if (cIdx >= 0) setSelectedCourseIdx(cIdx);
                        setActiveLessonPos({ mod: modIdx, les: 0 });
                        setActiveTab('courses');
                      }}
                      variant="compact"
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-6">
                        <p className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#C9A24B]">
                          Next Live Briefing
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold">
                          London Killzone Liquidity Workshop
                        </h3>
                        <p className="mt-1 text-xs text-stone-600 dark:text-[#9A968C]">
                          Wednesday · 13:30 UTC with Marcus Vance
                        </p>
                        <Button className="mt-4" size="sm" onClick={() => setActiveTab('courses')}>
                          Enter The Forge
                        </Button>
                      </div>

                      <div className="rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-6">
                        <p className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#F0D58A]">
                          Upcoming Strategos Review
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold">
                          Weekly 1-on-1 Chart &amp; Ledger Audit
                        </h3>
                        <p className="mt-1 text-xs text-stone-600 dark:text-[#9A968C]">
                          Friday · 14:00 EST · Status: Scheduled (Demo)
                        </p>
                        <Button className="mt-4" size="sm" variant="secondary" onClick={() => setActiveTab('mentorship')}>
                          Inspect Audit Notes
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold mb-3">Latest Vanguard Dispatch Preview</h3>
                      <SignalCard signal={DEMO_SIGNALS[0]} />
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {COURSES.map((c, idx) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedCourseIdx(idx);
                            setActiveLessonPos({ mod: 0, les: 0 });
                          }}
                          className={cn(
                            'rounded-md border px-4 py-2 text-xs font-medium transition-colors',
                            idx === selectedCourseIdx
                              ? 'border-[#F0D58A] bg-gold-gradient text-[#000000] font-semibold'
                              : 'border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] text-stone-700 dark:text-[#9A968C]'
                          )}
                        >
                          {c.level}: {c.title}
                        </button>
                      ))}
                    </div>

                    <SovereignRadialProgress
                      completedLessons={completedLessons}
                      course={selectedCourse}
                      onToggleLesson={toggleLessonComplete}
                      onSelectModule={(_cId, modIdx) =>
                        setActiveLessonPos({ mod: modIdx, les: 0 })
                      }
                      variant="full"
                    />

                    <div className="grid gap-6 lg:grid-cols-12">
                      <div className="lg:col-span-8 space-y-4">
                        <div className="aspect-video rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-[#000000] flex flex-col items-center justify-center p-6 text-center text-[#EDE6D6]">
                          <PlayCircle className="h-14 w-14 text-[#F0D58A] mb-3" />
                          <p className="font-display text-lg font-bold">{activeLesson.title}</p>
                          <p className="mt-1 text-xs text-[#9A968C]">
                            Duration: {activeLesson.duration} · Video Stream Player Placeholder
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-4">
                          <div>
                            <h3 className="text-sm font-semibold">{activeLesson.title}</h3>
                            <p className="text-xs text-stone-600 dark:text-[#9A968C]">
                              {selectedCourse.modules[activeLessonPos.mod]?.title}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={isLessonCompleted ? 'secondary' : 'primary'}
                            onClick={() => toggleLessonComplete(activeLessonKey)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            {isLessonCompleted ? 'Completed' : 'Mark Complete'}
                          </Button>
                        </div>

                        <div className="rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-5 space-y-3">
                          <label htmlFor="lesson-notes" className="block text-xs font-semibold">
                            Personal Lesson Notes
                          </label>
                          <textarea
                            id="lesson-notes"
                            rows={3}
                            value={lessonNotes}
                            onChange={(e) => setLessonNotes(e.target.value)}
                            className="w-full rounded-md border border-stone-200 dark:border-[#C9A24B]/24 bg-stone-50 dark:bg-[#000000] p-3 text-xs focus:border-[#F0D58A] focus:outline-none"
                          />
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const blob = new Blob([lessonNotes], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'bullish-titan-playbook-notes.txt';
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
                              <FileDown className="h-3.5 w-3.5" />
                              Download Notes (.txt)
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-4 rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-4 space-y-4">
                        <h3 className="font-display text-base font-bold">Lesson Playlist</h3>
                        {selectedCourse.modules.map((mod, mIdx) => (
                          <div key={mod.title}>
                            <p className="text-[11px] font-semibold text-amber-700 dark:text-[#F0D58A] mb-2">
                              {mod.title}
                            </p>
                            <div className="space-y-1.5">
                              {mod.lessons.map((les, lIdx) => {
                                const key = `${selectedCourse.id}:${mIdx}:${lIdx}`;
                                const done = completedLessons.includes(key);
                                const current =
                                  mIdx === activeLessonPos.mod && lIdx === activeLessonPos.les;
                                return (
                                  <button
                                    key={les.title}
                                    type="button"
                                    onClick={() => setActiveLessonPos({ mod: mIdx, les: lIdx })}
                                    className={cn(
                                      'w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors',
                                      current
                                        ? 'bg-[#C9A24B]/18 text-amber-800 dark:text-[#F0D58A] font-medium'
                                        : 'hover:bg-stone-100 dark:hover:bg-[#141414]'
                                    )}
                                  >
                                    <span className="truncate">{les.title}</span>
                                    {done && (
                                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#1F9D6B]" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'signals' && (
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-4">
                      <div className="flex flex-wrap gap-2">
                        {['All', 'EUR/USD', 'V75 Index', 'XAU/USD', 'GBP/USD'].map((pair) => (
                          <button
                            key={pair}
                            type="button"
                            onClick={() => setPairFilter(pair)}
                            className={cn(
                              'rounded-md px-3 py-1.5 text-xs font-medium',
                              pairFilter === pair
                                ? 'bg-gold-gradient text-[#000000] font-semibold'
                                : 'bg-stone-100 dark:bg-[#000000] text-stone-700 dark:text-[#9A968C]'
                            )}
                          >
                            {pair}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {['All', 'Open', 'Closed'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStatusFilter(st)}
                            className={cn(
                              'rounded-md px-3 py-1.5 text-xs font-medium',
                              statusFilter === st
                                ? 'border border-[#F0D58A] bg-[#141414] text-[#F0D58A]'
                                : 'bg-stone-100 dark:bg-[#000000] text-stone-700 dark:text-[#9A968C]'
                            )}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredSignals.map((sig) => (
                        <SignalCard key={sig.id} signal={sig} />
                      ))}
                    </div>
                    <RiskDisclaimer compact />
                  </div>
                )}

                {activeTab === 'mentorship' && (
                  <div className="space-y-5">
                    <div className="rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-6">
                      <h3 className="font-display text-xl font-bold mb-4">Strategos Briefings (Demo)</h3>
                      <div className="space-y-3">
                        {[
                          {
                            title: '1-on-1 Execution & Journal Audit',
                            mentor: 'Marcus Vance',
                            when: 'Fri, Nov 20 · 14:00 EST',
                            status: 'Upcoming',
                            notes: 'Focus on avoiding NY open mid-range entries on EUR/USD.',
                          },
                          {
                            title: 'Baseline Risk Calibration Call',
                            mentor: 'David Okafor',
                            when: 'Fri, Nov 13 · 14:00 EST',
                            status: 'Completed',
                            notes: 'Locked 0.75% max risk per setup; reviewed 25 historical trades.',
                          },
                        ].map((b) => (
                          <div
                            key={b.title}
                            className="rounded-md border border-stone-200 dark:border-[#C9A24B]/18 bg-stone-50 dark:bg-[#000000] p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-semibold">{b.title}</span>
                              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-700 dark:text-[#F0D58A]">
                                <Calendar className="h-3.5 w-3.5" />
                                {b.when} · {b.status}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-stone-600 dark:text-[#9A968C]">
                              Commander: {b.mentor}
                            </p>
                            <p className="mt-2 text-xs text-stone-700 dark:text-[#EDE6D6]/90">
                              Audit Notes: {b.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'investor' && (
                  <div className="space-y-5">
                    <div className="rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-6">
                      <h3 className="font-display text-xl font-bold mb-1">
                        Mandate Statements &amp; Governance Ledger (Demo)
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-[#9A968C] mb-5">
                        Placeholder statement archive for qualified Mandate Vault preview.
                      </p>
                      <div className="space-y-2.5">
                        {INVESTOR_DEMO_REPORTING.slice().reverse().map((row) => (
                          <div
                            key={row.statementId}
                            className="flex items-center justify-between rounded-md border border-stone-200 dark:border-[#C9A24B]/18 bg-stone-50 dark:bg-[#000000] px-4 py-3 text-xs"
                          >
                            <span className="font-mono font-semibold">
                              {row.statementId} · {row.month} 2026
                            </span>
                            <span className="font-mono text-stone-600 dark:text-[#9A968C]">
                              Index <span className="text-[#1F9D6B]">{row.equity}</span> · Max DD {row.drawdown}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <RiskDisclaimer compact />
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-6 space-y-4">
                      <h3 className="font-display text-xl font-bold">Profile &amp; Preferences</h3>
                      <div>
                        <label htmlFor="dash-name" className="block text-xs font-medium mb-1.5">
                          Display Name
                        </label>
                        <input
                          id="dash-name"
                          type="text"
                          value={profileName}
                          onChange={(e) => {
                            setProfileName(e.target.value);
                            setProfileSaved(false);
                          }}
                          className="h-10 w-full rounded-md border border-stone-200 dark:border-[#C9A24B]/24 bg-stone-50 dark:bg-[#000000] px-3 text-sm focus:border-[#F0D58A] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2 pt-2 text-xs">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Email Signal Summaries</span>
                          <input
                            type="checkbox"
                            checked={notifEmail}
                            onChange={(e) => setNotifEmail(e.target.checked)}
                            className="h-4 w-4 accent-[#C9A24B]"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span>Push Session Reminders</span>
                          <input
                            type="checkbox"
                            checked={notifPush}
                            onChange={(e) => setNotifPush(e.target.checked)}
                            className="h-4 w-4 accent-[#C9A24B]"
                          />
                        </label>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          updateProfile(profileName.trim() || user.name);
                          setProfileSaved(true);
                        }}
                      >
                        Save Profile
                      </Button>
                      {profileSaved && (
                        <p className="text-xs text-[#F0D58A]">Profile updated.</p>
                      )}
                    </div>

                    <div className="rounded-lg border border-stone-200 dark:border-[#C9A24B]/24 bg-white dark:bg-[#0B0B0C] p-6 space-y-4">
                      <h3 className="font-display text-xl font-bold">Rank Access &amp; Appearance</h3>
                      <p className="text-xs text-stone-600 dark:text-[#9A968C]">
                        Verify sector permissions by switching your active demo rank:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            'free',
                            'academy',
                            'signals',
                            'mentorship',
                            'investor',
                            'full-access',
                          ] as PlanTier[]
                        ).map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => updatePlan(tier)}
                            className={cn(
                              'rounded-md border px-3 py-2 text-xs font-mono transition-colors',
                              user.plan === tier
                                ? 'border-[#F0D58A] bg-[#C9A24B]/18 text-amber-800 dark:text-[#F0D58A] font-semibold'
                                : 'border-stone-200 dark:border-[#C9A24B]/22 text-stone-600 dark:text-[#9A968C]'
                            )}
                          >
                            {PLAN_LABELS[tier]}
                          </button>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-stone-200 dark:border-[#C9A24B]/18 flex items-center justify-between">
                        <span className="text-xs font-medium">Theme Mode</span>
                        <Button size="sm" variant="secondary" onClick={toggleTheme}>
                          {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
