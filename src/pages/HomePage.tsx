import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { AboutStatsSection } from '../sections/AboutStatsSection';
import { SpatialFlowSection } from '../sections/SpatialFlowSection';
import { FourWaysSection } from '../sections/FourWaysSection';
import { ResultsPreviewSection } from '../sections/ResultsPreviewSection';
import { FindYourPathQuiz } from '../sections/FindYourPathQuiz';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { PricingEnrollmentSection } from '../sections/PricingEnrollmentSection';
import { FaqCtaSection } from '../sections/FaqCtaSection';
import { FlowVelocityBand } from '../components/ui/FlowVelocityBand';
import { ScrollChapterNav } from '../components/ui/ScrollChapterNav';
import { RisingArrowConnector, ShieldSectionDivider } from '../components/ui/TitanMotifs';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-[#000000]">
      {/* Minimal vertical section navigation rail on wide desktop */}
      <ScrollChapterNav />

      {/* 1. Full-screen Code-Only Animated Hero */}
      <HeroSection />

      {/* 2. Short About Section with counter-parallax stats */}
      <AboutStatsSection />

      {/* 3. Interactive Sticky Scroll-Scrubbed 3D Market Astrolabe */}
      <SpatialFlowSection />

      <ShieldSectionDivider label="Four Programs" />

      {/* 4. Four Programs (01–04) + Live 3D Program Gallery */}
      <FourWaysSection />

      {/* Scroll-velocity-reactive horizontal market philosophy stream */}
      <FlowVelocityBand />

      <RisingArrowConnector align="right" className="pt-4" />

      {/* 5. Results with scroll-zoom settle & self-drawing equity curve */}
      <ResultsPreviewSection />

      <ShieldSectionDivider label="Quick Quiz" />

      {/* 6. Animated Track Calibration Quiz */}
      <FindYourPathQuiz />

      <ShieldSectionDivider label="Student Stories" />

      {/* 7. Swipeable Testimonials Carousel */}
      <TestimonialsSection />

      <ShieldSectionDivider label="Simple Pricing" />

      {/* 8. Pricing and Enrollment */}
      <PricingEnrollmentSection />

      <ShieldSectionDivider label="Common Questions" />

      {/* 9. Interactive Live Search FAQ & Welcome Invitation */}
      <FaqCtaSection />
    </div>
  );
};

export default HomePage;
