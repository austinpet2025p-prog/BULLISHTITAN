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

      <ShieldSectionDivider label="Four Divisions" />

      {/* 4. Four Divisions (01–04) + Live Apple 3D Division Gallery */}
      <FourWaysSection />

      {/* Scroll-velocity-reactive horizontal market philosophy stream */}
      <FlowVelocityBand />

      <RisingArrowConnector align="right" className="pt-4" />

      {/* 5. Results with scroll-zoom settle & self-drawing equity curve */}
      <ResultsPreviewSection />

      <ShieldSectionDivider label="Rank Placement" />

      {/* 6. Animated Apple-Grade Track Calibration Quiz */}
      <FindYourPathQuiz />

      <ShieldSectionDivider label="The Phalanx" />

      {/* 7. Swipeable Testimonials Carousel */}
      <TestimonialsSection />

      <ShieldSectionDivider label="Rank Orders & Access" />

      {/* 8. Pricing and Enrollment */}
      <PricingEnrollmentSection />

      <ShieldSectionDivider label="Admissions Doctrine" />

      {/* 9. Interactive Live Search FAQ & Command Invitation */}
      <FaqCtaSection />
    </div>
  );
};

export default HomePage;
