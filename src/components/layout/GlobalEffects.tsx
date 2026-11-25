import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const GlobalEffects: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { progress } = useScrollProgress();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatSent, setChatSent] = useState(false);

  // Silky Apple-grade wheel & trackpad inertia scrolling via Lenis
  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  const handleQuickChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatSent(true);
    setChatMessage('');
  };

  return (
    <>
      {/* Razor-Thin Metallic Gold Top Scroll Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent pointer-events-none"
      >
        <div
          className="h-full bg-gold-gradient origin-left"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Floating WhatsApp / Telegram Support Drawer Bottom-Right */}
      <div className="fixed bottom-5 right-5 z-40">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 w-80 rounded-2xl hairline-gold-bright p-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C9A24B]/18">
                <div>
                  <p className="text-sm font-semibold text-[#EDE6D6]">
                    Admissions &amp; Desk Support
                  </p>
                  <p className="text-[11px] text-[#9A968C]">
                    Telegram &amp; WhatsApp Desk Channels
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  aria-label="Close support chat"
                  className="rounded-lg p-1.5 text-[#9A968C] hover:text-[#EDE6D6]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3">
                <a
                  href="#telegram-desk"
                  onClick={(e) => {
                    e.preventDefault();
                    setChatSent(true);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[#C9A24B]/30 bg-[#141414] py-2 text-xs font-medium text-[#EDE6D6] hover:border-[#F0D58A]/65 hover:text-[#F0D58A] transition-colors"
                >
                  <Send className="h-3.5 w-3.5 text-[#C9A24B]" />
                  Telegram
                </a>
                <a
                  href="#whatsapp-desk"
                  onClick={(e) => {
                    e.preventDefault();
                    setChatSent(true);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[#C9A24B]/30 bg-[#141414] py-2 text-xs font-medium text-[#EDE6D6] hover:border-[#F0D58A]/65 hover:text-[#F0D58A] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#C9A24B]" />
                  WhatsApp
                </a>
              </div>

              {chatSent ? (
                <div className="rounded-xl border border-[#C9A24B]/35 bg-[#141414] p-3 text-xs text-[#EDE6D6]">
                  Desk ticket queued. Our admissions coordinator will follow up with your program details.
                </div>
              ) : (
                <form onSubmit={handleQuickChatSubmit} className="space-y-2">
                  <textarea
                    rows={2}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask about Training, Mentorship, or Signals..."
                    className="w-full rounded-xl border border-[#C9A24B]/24 bg-[#141414] p-2.5 text-xs text-[#EDE6D6] placeholder:text-[#9A968C]/70 focus:border-[#F0D58A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gold-gradient py-2 text-xs font-semibold text-[#000000] hover:brightness-105 transition-all"
                  >
                    Send Quick Inquiry
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => {
            setChatOpen((v) => !v);
            if (chatSent) setChatSent(false);
          }}
          aria-label="Open Telegram and WhatsApp desk chat"
          className="flex h-12 items-center gap-2 rounded-2xl border border-[#C9A24B]/45 bg-[#0B0B0C] px-4 text-xs font-semibold text-[#EDE6D6] hover:border-[#F0D58A] transition-all"
        >
          <MessageCircle className="h-4 w-4 text-[#F0D58A]" />
          <span className="hidden sm:inline">Desk Chat</span>
        </button>
      </div>
    </>
  );
};
