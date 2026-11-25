import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../ui/Button';
import { setAnalyticsConsent } from '../../lib/analytics';

const CONSENT_KEY = 'bt_cookie_consent_v1';

export const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(CONSENT_KEY);
    } catch {
      return false;
    }
  });

  const handleChoice = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // ignore storage errors
    }
    setAnalyticsConsent(choice === 'all');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="region"
          aria-label="Cookie preferences"
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40 rounded-2xl hairline-gold-bright p-4"
        >
          <p className="text-xs font-semibold text-[#EDE6D6]">
            Cookie &amp; Analytics Preferences
          </p>
          <p className="mt-1 text-[11px] text-[#9A968C] leading-relaxed">
            We use essential storage for portal state and optional analytics to improve curriculum flows. Read our{' '}
            <Link to="/legal/privacy" className="text-[#F0D58A] underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={() => handleChoice('all')}>
              Accept All
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleChoice('essential')}>
              Essential Only
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
