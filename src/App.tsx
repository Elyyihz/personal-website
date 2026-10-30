import React, { useState, useEffect } from 'react';
import { DataProvider } from '@/context/DataContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutMeSection } from '@/components/sections/AboutMeSection';
import { WhatIDoSection } from '@/components/sections/WhatIDoSection';
import { CurrentlyConsumingSection } from '@/components/sections/CurrentlyConsumingSection';
import { InterestsSection } from '@/components/sections/InterestsSection';
import { WishlistSection } from '@/components/sections/WishlistSection';
import { ContactsSection } from '@/components/sections/ContactsSection';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

/**
 * Root Application component assembling core semantic layout sections and private admin controls.
 * Implements strict dark theme palette focused on deep blue, slate-900, slate-300, and cyan-400 highlights.
 */
export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ely_admin_session') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  /**
   * Evaluates authentication status when opening the admin center.
   */
  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('ely_admin_session', 'true');
    setIsAuthModalOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ely_admin_session');
    setIsAdminDashboardOpen(false);
  };

  // Keyboard shortcut listener: Ctrl+Shift+A or Cmd+Shift+A opens admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleOpenAdmin();
      }
    };

    // Check URL hash for direct #admin route
    if (window.location.hash === '#admin') {
      handleOpenAdmin();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  return (
    <DataProvider>
      <div className="min-h-screen bg-brand-deep text-brand-text flex flex-col font-sans selection:bg-brand-primary selection:text-white">
        {/* Top Navigation */}
        <Navbar onOpenAdmin={handleOpenAdmin} />

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
        <Footer onOpenAdmin={handleOpenAdmin} />

        {/* Private Administration Modals */}
        <AdminAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthenticated={handleAuthenticated}
        />

        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </DataProvider>
  );
};

export default App;
