import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutMeSection } from '@/components/sections/AboutMeSection';
import { WhatIDoSection } from '@/components/sections/WhatIDoSection';
import { CurrentlyConsumingSection } from '@/components/sections/CurrentlyConsumingSection';
import { InterestsSection } from '@/components/sections/InterestsSection';
import { WishlistSection } from '@/components/sections/WishlistSection';
import { ContactsSection } from '@/components/sections/ContactsSection';

/**
 * Root Application component assembling core semantic layout sections.
 * Implements strict dark theme palette focused on deep blue, slate-900, slate-300, and cyan-400 highlights.
 */
export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-deep text-brand-text flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Semantic Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 space-y-16 md:space-y-24">
        <HeroSection />
        <AboutMeSection />
        <WhatIDoSection />
        <CurrentlyConsumingSection />
        <InterestsSection />
        <WishlistSection />
        <ContactsSection />
      </main>

      {/* Semantic Footer */}
      <Footer />
    </div>
  );
};

export default App;
