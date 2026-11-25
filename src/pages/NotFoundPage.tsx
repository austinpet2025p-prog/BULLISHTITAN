import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const NotFoundPage: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="min-h-[82vh] pt-24 pb-16 flex items-center justify-center px-4 bg-[#000000]">
      <div className="max-w-lg text-center">
        {/* Animated Broken Candlestick Chart Graphic */}
        <div className="mx-auto mb-8 w-64">
          <svg
            viewBox="0 0 260 150"
            className="w-full h-auto"
            aria-label="Broken candlestick chart illustration"
          >
            <line x1="16" y1="130" x2="244" y2="130" stroke="#242016" strokeWidth="1.5" />
            <rect x="34" y="82" width="14" height="36" rx="2" fill="#8C6A1F" fillOpacity="0.85" />
            <line x1="41" y1="68" x2="41" y2="124" stroke="#8C6A1F" strokeWidth="1.5" />
            <rect x="70" y="64" width="14" height="44" rx="2" fill="#C9A24B" />
            <line x1="77" y1="48" x2="77" y2="118" stroke="#C9A24B" strokeWidth="1.5" />
            <rect x="106" y="42" width="14" height="52" rx="2" fill="#F0D58A" />
            <line x1="113" y1="26" x2="113" y2="104" stroke="#F0D58A" strokeWidth="1.5" />

            <motion.g
              animate={
                reducedMotion
                  ? undefined
                  : { rotate: [0, 14, 10], y: [0, 10, 8] }
              }
              transition={{ duration: 2.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              style={{ transformOrigin: '160px 80px' }}
            >
              <rect x="152" y="68" width="14" height="40" rx="2" fill="#EF4444" />
              <line x1="159" y1="54" x2="159" y2="116" stroke="#EF4444" strokeWidth="1.5" />
            </motion.g>

            <path
              d="M126 52 L198 112"
              stroke="#EF4444"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <rect x="206" y="96" width="14" height="24" rx="2" fill="#242016" />
          </svg>
        </div>

        <p className="font-mono text-xs font-semibold text-gold-gradient uppercase tracking-[0.2em]">
          Error 404 · Liquidity Gap
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold text-[#EDE6D6]">
          Route Not Found
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#9A968C] leading-relaxed">
          The page you requested has moved or does not exist. Return to the main desk or explore our structured trading programs.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Button to="/" variant="primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <Button to="/training" variant="secondary">
            <Compass className="h-4 w-4 text-[#C9A24B]" />
            Inspect Divisions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
