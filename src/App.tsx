import React, { useState, useEffect } from 'react';
import { DataProvider } from '@/context/DataContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutMeSection } from '@/components/sections/AboutMeSection';
import { WhatIDoSection } from '@/components/sections/WhatIDoSection';
import { HowIWorkSection } from '@/components/sections/HowIWorkSection';
import { CurrentlyConsumingSection } from '@/components/sections/CurrentlyConsumingSection';
import { InterestsSection } from '@/components/sections/InterestsSection';
import { WishlistSection } from '@/components/sections/WishlistSection';
import { ContactsSection } from '@/components/sections/ContactsSection';
import { AdminAuthModal } from '@/components/admin/AdminAuthModal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { MacTerminal } from '@/components/terminal/MacTerminal';
import { SpotifyCallbackHandler } from '@/components/common/SpotifyCallbackHandler';
import { FloatingChatWidget } from '@/components/chat/FloatingChatWidget';

/**
 * Root Application component assembling core semantic layout sections, private admin controls,
 * interactive macOS Zsh terminal emulation, and Spotify OAuth callback interception.
 * Implements strict dark theme palette focused on deep blue, slate-900, slate-300, and cyan-400 highlights.
 */
export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ely_admin_session') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Check if current route is Spotify OAuth callback
  const isSpotifyCallback =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/callback' ||
      window.location.search.includes('code='));

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

  // Keyboard shortcut listener:
  // - Ctrl+Shift+A or Cmd+Shift+A opens admin
  // - Ctrl+` or Cmd+` or Ctrl+Shift+T toggles macOS Terminal mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Admin dashboard shortcut
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleOpenAdmin();
        return;
      }

      // Terminal mode hidden shortcut
      if (
        ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't')
      ) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };

    // Check URL hash for direct #admin or #terminal route
    if (window.location.hash === '#admin') {
      handleOpenAdmin();
    } else if (window.location.hash === '#terminal') {
      setIsTerminalOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  if (isSpotifyCallback) {
    return <SpotifyCallbackHandler />;
  }

  // When Terminal Mode is active via shortcut or UI trigger, hide the main DOM
  // and render full macOS Zsh terminal emulation
  if (isTerminalOpen) {
    return (
      <MacTerminal
        isOpen={true}
        isTakeover={true}
        onClose={() => setIsTerminalOpen(false)}
      />
    );
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-brand-deep text-brand-text flex flex-col font-sans selection:bg-brand-primary selection:text-white">
        {/* Top Navigation */}
        <Navbar
          onOpenAdmin={handleOpenAdmin}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />

        {/* Main Semantic Layout */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 space-y-8 md:space-y-12">
          <HeroSection />
          <AboutMeSection />
          <WhatIDoSection />
          <HowIWorkSection />
          <CurrentlyConsumingSection />
          <InterestsSection />
          <WishlistSection />
          <ContactsSection />
        </main>

        {/* Semantic Footer */}
        <Footer
          onOpenAdmin={handleOpenAdmin}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />

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

        {/* Hidden macOS Zsh Terminal Mode */}
        <MacTerminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
        />

        {/* Public Interactive AI Assistant Floating Widget */}
        <FloatingChatWidget />
      </div>
    </DataProvider>
  );
};

export default App;
