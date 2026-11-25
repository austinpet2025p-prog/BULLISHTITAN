import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronsDownUp, ChevronsUpDown, Search, X } from 'lucide-react';
import { Accordion, type AccordionItemData } from './Accordion';
import { Button } from './Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export interface FaqEntry {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FaqSearchFilterProps {
  items: FaqEntry[];
  enableCategoryTabs?: boolean;
  enableGlobalShortcut?: boolean;
  placeholder?: string;
  quickTopics?: string[];
  className?: string;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderHighlightedText(text: string, terms: string[]): React.ReactNode {
  if (terms.length === 0) return text;
  const pattern = terms.map(escapeRegExp).join('|');
  if (!pattern) return text;

  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    const isMatch = terms.some((t) => part.toLowerCase() === t.toLowerCase());
    if (!isMatch) return <React.Fragment key={idx}>{part}</React.Fragment>;
    return (
      <mark
        key={idx}
        className="rounded-sm bg-[var(--color-gold-bright)]/22 px-0.5 text-[var(--color-gold-bright)] font-semibold"
      >
        {part}
      </mark>
    );
  });
}

const DEFAULT_QUICK_TOPICS = ['risk', 'vanguard', 'strategos', 'synthetic', 'custody'];

export const FaqSearchFilter: React.FC<FaqSearchFilterProps> = ({
  items,
  enableCategoryTabs = true,
  enableGlobalShortcut = false,
  placeholder = 'Search doctrine (e.g., risk, vanguard, strategos, synthetic, custody)...',
  quickTopics = DEFAULT_QUICK_TOPICS,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const inputId = useId();
  const resultsId = useId();
  const categoryTabId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandAll, setExpandAll] = useState(false);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const item of items) {
      if (item.category) seen.add(item.category);
    }
    return seen.size > 1 ? ['All', ...Array.from(seen)] : [];
  }, [items]);

  const searchTerms = useMemo(
    () =>
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean),
    [query]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchTerms.length === 0) return true;
      const haystack = `${item.question} ${item.answer} ${item.category ?? ''}`.toLowerCase();
      return searchTerms.every((term) => haystack.includes(term));
    });
  }, [items, searchTerms, selectedCategory]);

  // Optional '/' keyboard shortcut to focus search
  useEffect(() => {
    if (!enableGlobalShortcut) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
        return;
      }
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enableGlobalShortcut]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    inputRef.current?.focus();
  };

  const accordionItems: AccordionItemData[] = useMemo(
    () =>
      filteredItems.map((entry, idx) => ({
        id: entry.id ?? `${entry.question}-${idx}`,
        title: renderHighlightedText(entry.question, searchTerms),
        meta: entry.category,
        content: <>{renderHighlightedText(entry.answer, searchTerms)}</>,
      })),
    [filteredItems, searchTerms]
  );

  const hasActiveFilter = query.trim().length > 0 || selectedCategory !== 'All';

  return (
    <div className={cn('space-y-5', className)}>
      {/* Accessible Live Search Bar */}
      <div role="search" aria-label="Filter frequently asked questions" className="space-y-3">
        <label htmlFor={inputId} className="sr-only">
          Search frequently asked questions
        </label>

        <div className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-4 h-4 w-4 text-[#C9A24B]"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && query) {
                e.preventDefault();
                setQuery('');
              }
            }}
            aria-controls={resultsId}
            placeholder={placeholder}
            className="h-12 w-full rounded-xl border border-[#C9A24B]/28 bg-[#091326]/45 pl-11 pr-24 text-sm text-[#EDE6D6] placeholder:text-[#9A968C]/75 transition-colors focus:border-[var(--color-gold-bright)] focus:bg-[#091326]/75 focus:outline-none"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear FAQ search query"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A24B]/24 bg-[#000000]/80 text-[#EDE6D6] hover:border-[var(--color-gold-bright)]/70 hover:text-[var(--color-gold-bright)] transition-colors"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : (
              enableGlobalShortcut && (
                <kbd className="hidden sm:inline-flex h-7 items-center rounded-md border border-[#C9A24B]/22 bg-[#000000]/80 px-2 font-mono text-[10px] text-[#9A968C]">
                  /
                </kbd>
              )
            )}
          </div>
        </div>

        {/* Category Tabs + Match Count + Expand All */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {enableCategoryTabs && categories.length > 0 ? (
            <div
              role="tablist"
              aria-label="Filter FAQ by program topic"
              className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#C9A24B]/22 bg-[#000000] p-1"
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'relative px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors min-h-[36px]',
                      active ? 'text-[#000000] font-semibold' : 'text-[#9A968C] hover:text-[#EDE6D6]'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={categoryTabId}
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 360, damping: 32 }
                        }
                        className="absolute inset-0 rounded-lg bg-gold-gradient"
                      />
                    )}
                    <span className="relative z-10">
                      {cat === 'All' ? 'All Topics' : cat}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#9A968C]">
              <span className="font-mono text-[10px] uppercase tracking-wider">Quick topics:</span>
              {quickTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setQuery(topic)}
                  className="font-mono text-[11px] text-[#C9A24B] hover:text-[var(--color-gold-bright)] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0"
                >
                  {topic}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <span
              aria-live="polite"
              className="font-mono text-[11px] uppercase tracking-wider text-[#9A968C] tabular-nums"
            >
              Showing {filteredItems.length} of {items.length}
            </span>

            {filteredItems.length > 1 && (
              <button
                type="button"
                onClick={() => setExpandAll((prev) => !prev)}
                aria-pressed={expandAll}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#C9A24B]/24 bg-[#000000] px-3 py-1.5 font-mono text-[11px] text-[#EDE6D6] hover:border-[var(--color-gold-bright)]/65 transition-colors whitespace-nowrap shrink-0"
              >
                {expandAll ? (
                  <>
                    <ChevronsDownUp className="h-3.5 w-3.5 text-[#C9A24B]" aria-hidden="true" />
                    <span>Single Open</span>
                  </>
                ) : (
                  <>
                    <ChevronsUpDown className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
                    <span>Expand All</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Filtered FAQ Accordion List */}
      <div id={resultsId}>
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl hairline-sapphire p-8 text-center space-y-4">
            <p className="font-display text-lg font-bold text-[#EDE6D6]">
              No doctrine entries matched &ldquo;{query.trim() || selectedCategory}&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-[#9A968C] max-w-md mx-auto">
              Try searching a single keyword or jump straight to a common admissions topic below.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {quickTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setQuery(topic);
                  }}
                  className="rounded-lg border border-[#60A5FA]/35 bg-[#091326]/70 px-3 py-1.5 font-mono text-xs text-[#93C5FD] hover:border-[var(--color-gold-bright)]/70 hover:text-[var(--color-gold-bright)] transition-colors whitespace-nowrap shrink-0"
                >
                  {topic}
                </button>
              ))}
            </div>

            {hasActiveFilter && (
              <div className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Accordion
            items={accordionItems}
            defaultOpenIndex={0}
            expandAll={expandAll}
          />
        )}
      </div>
    </div>
  );
};
