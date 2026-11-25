import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface AccordionItemData {
  id?: string;
  title: React.ReactNode;
  meta?: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenIndex?: number | null;
  expandAll?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
  expandAll = false,
  className,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  useEffect(() => {
    setOpenIndex(defaultOpenIndex);
  }, [defaultOpenIndex, items.length]);

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, idx) => {
        const isOpen = expandAll || openIndex === idx;
        return (
          <div
            key={item.id ?? idx}
            className="rounded-2xl hairline-gold overflow-hidden transition-colors hover:border-[#C9A24B]/45"
          >
            <button
              type="button"
              onClick={() => {
                if (expandAll) return;
                setOpenIndex(isOpen ? null : idx);
              }}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-[var(--color-gold-bright)]"
            >
              <div className="min-w-0">
                <span className="block text-sm sm:text-base font-medium text-[#EDE6D6]">
                  {item.title}
                </span>
                {item.meta && (
                  <span className="mt-0.5 block font-mono text-[11px] text-[#9A968C]">
                    {item.meta}
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-[#C9A24B] transition-transform duration-200',
                  isOpen && 'rotate-180 text-[#F0D58A]'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#C9A24B]/15 px-5 py-4 text-sm text-[#9A968C] leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
