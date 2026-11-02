import React, { useState, useEffect, useCallback } from 'react';
import { DataProvider } from '@/context/DataContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutMeSection } from '@/components/sections/AboutMeSection';
import { CurrentlyConsumingSection } from '@/components/sections/CurrentlyConsumingSection';
import { WhatIDoSection } from '@/components/sections/WhatIDoSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { HowIWorkSection } from '@/components/sections/HowIWorkSection';
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
  const handleOpenAdmin = useCallback(() => {
    if (isAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  }, [isAuthenticated]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('ely_admin_session', 'true');
    setIsAuthModalOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ely_admin_session');
    sessionStorage.removeItem('ely_jwt_token');
    localStorage.removeItem('ely_jwt_token');
    setIsAdminDashboardOpen(false);
  };

  // Keyboard shortcut & hidden route listener:
  // - Ctrl+Shift+A or Cmd+Shift+A opens admin
  // - URL hash #admin, /admin, ?admin=true opens admin
  // - Ctrl+` or Cmd+` or Ctrl+Shift+T toggles macOS Terminal mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Admin dashboard shortcut (Ctrl+Shift+A or Cmd+Shift+A)
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

    // Secret route check
    const evaluateHiddenRoutes = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        hash === '#admin' ||
        hash === '#painel' ||
        path === '/admin' ||
        search.includes('admin=true')
      ) {
        handleOpenAdmin();
      } else if (hash === '#terminal') {
        setIsTerminalOpen(true);
      }
    };

    evaluateHiddenRoutes();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', evaluateHiddenRoutes);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', evaluateHiddenRoutes);
    };
  }, [handleOpenAdmin]);

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
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />

        {/* Main Semantic Layout */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 space-y-8 md:space-y-12">
          {/* 1. Hero & Apresentação */}
          <HeroSection />

          {/* 2. Sobre mim (com Gostos & Hobbies integrados) */}
          <AboutMeSection />

          {/* 3. Consumindo (Currently Consuming / Live Telemetry) */}
          <CurrentlyConsumingSection />

          {/* 4. O que eu faço (Projetos & Skill Tree) */}
          <WhatIDoSection />

          {/* 5. Alguns artigos da newsletter (Elyy.init) */}
          <NewsletterSection />

          {/* 6. Como eu faço (How I Work: Clean Arch, DDD, Code Review) */}
          <HowIWorkSection />

          {/* 7. Minha Wishlist */}
          <WishlistSection />

          {/* 8. Contato */}
          <ContactsSection />
        </main>

        {/* Semantic Footer */}
        <Footer
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
