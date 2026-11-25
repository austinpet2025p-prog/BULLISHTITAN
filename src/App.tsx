import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalEffects } from './components/layout/GlobalEffects';
import { CookieConsentBanner } from './components/layout/CookieConsentBanner';
import { AiReceptionistWidget } from './components/layout/AiReceptionistWidget';
import { PageTransition } from './components/layout/PageTransition';
import { LogoIntro } from './components/layout/LogoIntro';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AuthProvider } from './lib/authContext';
import { usePageMeta } from './hooks/usePageMeta';
import { trackPageView } from './lib/analytics';

const HomePage = lazy(() => import('./pages/HomePage'));
const TrainingPage = lazy(() => import('./pages/TrainingPage'));
const MentorshipPage = lazy(() => import('./pages/MentorshipPage'));
const SignalsPage = lazy(() => import('./pages/SignalsPage'));
const InvestmentPage = lazy(() => import('./pages/InvestmentPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const RouteEffects: React.FC = () => {
  const { pathname, hash } = useLocation();
  usePageMeta(pathname);

  useEffect(() => {
    trackPageView(pathname);
    if (hash) {
      const id = hash.replace('#', '');
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      let attempts = 0;
      const timer = window.setInterval(() => {
        const el = document.getElementById(id);
        attempts += 1;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          window.clearInterval(timer);
        } else if (attempts >= 12) {
          window.clearInterval(timer);
        }
      }, 150);
      return () => window.clearInterval(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

const RouteFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center pt-24">
    <div className="text-xs font-mono text-[#9A968C]">Calibrating Command Desk...</div>
  </div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <PageTransition routeKey={location.pathname} id="main-content" className="flex-1">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/mentorship" element={<MentorshipPage />} />
          <Route path="/signals" element={<SignalsPage />} />
          <Route path="/investment" element={<InvestmentPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal/:doc" element={<LegalPage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          <Route path="/forgot-password" element={<AuthPage initialMode="forgot" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
};

export default function App() {
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <BrowserRouter>
            {mapsQuotaExceeded && (
              <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
                <span>
                  Google Maps Platform quota reached. If you are the app owner, visit{' '}
                  <a
                    href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold text-amber-950 hover:text-amber-800"
                  >
                    maps developer site
                  </a>{' '}
                  for instructions to update your account.
                </span>
              </div>
            )}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute h-0 w-0 overflow-hidden"
            >
              <defs>
                <linearGradient id="titan-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8C6A1F" />
                  <stop offset="52%" stopColor="#C9A24B" />
                  <stop offset="100%" stopColor="#F0D58A" />
                </linearGradient>
              </defs>
            </svg>
            <LogoIntro />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-xl focus:bg-gold-gradient focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#000000]"
            >
              Skip to main content
            </a>
            <RouteEffects />
            <GlobalEffects />
            <div className="relative z-10 min-h-screen flex flex-col bg-[#000000] text-[#EDE6D6]">
              <Navbar />
              <AnimatedRoutes />
              <Footer />
            </div>
            <CookieConsentBanner />
            <AiReceptionistWidget />
          </BrowserRouter>
        </AuthProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
