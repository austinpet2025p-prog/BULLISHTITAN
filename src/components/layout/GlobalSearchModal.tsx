import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Headset,
  Layers,
  Radio,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  runGlobalSearch,
  type SearchCategory,
  type SearchableItem,
} from '../../lib/globalSearch';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { VoiceTranscribeButton } from '../ui/VoiceTranscribeButton';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORY_TABS: { id: SearchCategory; label: string }[] = [
  { id: 'all', label: 'All Modules' },
  { id: 'training', label: 'Training (The Forge)' },
  { id: 'mentorship', label: 'Mentorship (Strategos)' },
  { id: 'signals', label: 'Signals (Vanguard)' },
  { id: 'plans', label: 'Plans & Mandates' },
  { id: 'guides', label: 'FAQ & Guides' },
];

const QUICK_QUERIES = [
  'beginner training modules',
  '1-on-1 Strategos mentorship',
  'V75 synthetic signal',
  'The Forge Foundation Rank',
  'lot size calculator',
  'investment plans $1500',
];

function CategoryIcon({ category }: { category: SearchableItem['category'] }) {
  switch (category) {
    case 'training':
      return <BookOpen className="h-4 w-4 text-[#60A5FA]" />;
    case 'mentorship':
      return <Users className="h-4 w-4 text-[#C084FC]" />;
    case 'signals':
      return <Radio className="h-4 w-4 text-[#34D399]" />;
    case 'plans':
      return <Layers className="h-4 w-4 text-[#F0D58A]" />;
    case 'guides':
    default:
      return <Compass className="h-4 w-4 text-[#C9A24B]" />;
  }
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [voiceError, setVoiceError] = useState('');

  const results = useMemo(
    () => runGlobalSearch(query, category, 18),
    [query, category]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, category, open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const activeEl = resultRefs.current[activeIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleSelectItem = (item: SearchableItem) => {
    onClose();
    navigate(item.to);
  };

  const handleAskReceptionist = () => {
    const prompt = query.trim();
    onClose();
    window.dispatchEvent(
      new CustomEvent('bt:ask-receptionist', {
        detail: { query: prompt },
      })
    );
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown' && results.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
        return;
      }
      if (e.key === 'ArrowUp' && results.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
        return;
      }
      if (e.key === 'Enter' && document.activeElement === inputRef.current) {
        if (results.length > 0) {
          e.preventDefault();
          handleSelectItem(results[activeIndex] ?? results[0]);
        } else if (query.trim()) {
          e.preventDefault();
          handleAskReceptionist();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, results, activeIndex, query]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-16 sm:pt-24"
          role="dialog"
          aria-modal="true"
          aria-label="Global site search"
        >
          {/* Backdrop */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/82 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.36, 1] }}
            className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl glass-surface-solid hairline-gold-bright shadow-[0_28px_72px_rgba(0,0,0,0.92)]"
          >
            {/* Search Bar */}
            <div className="flex items-center gap-3 border-b border-[#C9A24B]/24 bg-[#080A0F] px-4 py-3.5">
              <Search className="h-5 w-5 shrink-0 text-[#F0D58A]" />
              <label htmlFor="global-search-input" className="sr-only">
                Search training, mentorship, and signal modules in plain or Spartan terminology
              </label>
              <input
                id="global-search-input"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search naturally (e.g. 'beginner courses', 'Strategos coach', 'V75 signal', '$1500 invest')..."
                className="flex-1 min-w-0 bg-transparent text-sm sm:text-base text-[#EDE6D6] placeholder:text-[#9A968C]/70 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search query"
                  className="rounded-lg border border-[#C9A24B]/20 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#9A968C] hover:text-[#EDE6D6]"
                >
                  Clear
                </button>
              )}
              <VoiceTranscribeButton
                compact
                label="Voice Search"
                onTranscript={(text) => {
                  setVoiceError('');
                  setQuery(text);
                }}
                onError={(msg) => setVoiceError(msg)}
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close global search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#C9A24B]/24 bg-[#0D1017] text-[#9A968C] hover:border-[#F0D58A]/50 hover:text-[#EDE6D6] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {voiceError && (
              <div className="border-b border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-1.5 text-[11px] text-[#FCA5A5]">
                {voiceError}
              </div>
            )}

            {/* Category Filter Strip */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-[#C9A24B]/16 bg-[#06070B] px-4 py-2.5 no-scrollbar">
              {CATEGORY_TABS.map((tab) => {
                const active = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id)}
                    className={cn(
                      'shrink-0 whitespace-nowrap rounded-md border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors',
                      active
                        ? 'border-[#F0D58A]/70 bg-gold-gradient text-[#000000] font-semibold'
                        : 'border-[#C9A24B]/20 bg-[#0B0D13] text-[#9A968C] hover:border-[#C9A24B]/45 hover:text-[#EDE6D6]'
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Natural-Language Suggestions when empty */}
            {!query.trim() && (
              <div className="border-b border-[#C9A24B]/14 bg-[#07090E] px-4 py-2.5">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#9A968C]">
                  Try Natural Search Queries (Plain or Spartan)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUERIES.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setQuery(sample)}
                      className="rounded-md border border-[#C9A24B]/22 bg-[#0D1017] px-2.5 py-1 text-xs text-[#EDE6D6]/90 hover:border-[#F0D58A]/60 hover:text-[#F0D58A] transition-colors"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            <div className="max-h-[min(410px,55vh)] overflow-y-auto bg-[#050609] p-3 space-y-2">
              {results.length > 0 ? (
                results.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        resultRefs.current[idx] = el;
                      }}
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => handleSelectItem(item)}
                      className={cn(
                        'group flex w-full items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-all',
                        isActive
                          ? 'border-[#F0D58A]/70 bg-[#111623] shadow-[0_0_24px_rgba(201,162,75,0.12)]'
                          : 'border-[#C9A24B]/18 bg-[#0A0C12] hover:border-[#F0D58A]/65 hover:bg-[#10141F]'
                      )}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C9A24B]/25 bg-[#050609]">
                          <CategoryIcon category={item.category} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={cn(
                                'font-display text-sm sm:text-base font-bold transition-colors',
                                isActive
                                  ? 'text-[#F0D58A]'
                                  : 'text-[#EDE6D6] group-hover:text-[#F0D58A]'
                              )}
                            >
                              {item.title}
                            </h3>
                            <span className="rounded-md border border-[#C9A24B]/22 bg-[#06070B] px-2 py-0.5 font-mono text-[10px] text-[#C9A24B]">
                              {item.meta}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                            <span className="rounded border border-[#60A5FA]/25 bg-[#0A1324] px-1.5 py-0.5 text-[#93C5FD]">
                              Standard: {item.plainLabel}
                            </span>
                            {item.spartanTerm && (
                              <span className="rounded border border-[#C9A24B]/30 bg-[#141008] px-1.5 py-0.5 text-[#F0D58A]">
                                Spartan: {item.spartanTerm}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs text-[#EDE6D6]/75 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight
                        className={cn(
                          'h-4 w-4 shrink-0 mt-1 transition-colors',
                          isActive
                            ? 'text-[#F0D58A]'
                            : 'text-[#9A968C] group-hover:text-[#F0D58A]'
                        )}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="rounded-xl border border-[#C9A24B]/20 bg-[#0A0C12] p-6 text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-[#F0D58A]" />
                  <p className="mt-2 font-display text-base font-bold text-[#EDE6D6]">
                    No direct catalog match for &ldquo;{query}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-[#9A968C]">
                    Try simpler keywords like &ldquo;training&rdquo;, &ldquo;mentorship&rdquo;, &ldquo;V75&rdquo;, or ask our 24/7 AI Receptionist directly.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Shortcuts & Handoff to AI Receptionist */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[#C9A24B]/20 bg-[#080A0F] px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#9A968C]">
                <span>↑↓ Navigate</span>
                <span>·</span>
                <span>↵ Open</span>
                <span>·</span>
                <span>Esc Close</span>
                <span className="hidden md:inline">· Spartan &amp; Plain Terms</span>
              </div>
              <button
                type="button"
                onClick={handleAskReceptionist}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#C9A24B]/35 bg-[#111520] px-3 py-1.5 font-mono text-[11px] text-[#F0D58A] hover:border-[#F0D58A] transition-colors"
              >
                <Headset className="h-3.5 w-3.5" />
                {query.trim() ? 'Ask 24/7 AI Receptionist' : 'Open 24/7 AI Receptionist'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
