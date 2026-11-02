import React, { useState } from 'react';
import { MailIcon, TerminalIcon } from '@/components/icons';

export interface NavbarProps {
  onOpenAdmin?: () => void;
  onOpenTerminal?: () => void;
}

/**
 * Fixed top navigation bar with blur effect and semantic section anchors.
 * Admin entrance is completely hidden from visible buttons, accessible solely via
 * keyboard shortcut (Ctrl+Shift+A / Cmd+Shift+A) or confidential routing parameters.
 */
export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navLinks = [
    { label: 'Sobre mim', href: '#sobre' },
    { label: 'Consumindo', href: '#consumindo' },
    { label: 'O Que Faço', href: '#projetos' },
    { label: 'Artigos', href: '#artigos' },
    { label: 'Como Faço', href: '#how-i-work' },
    { label: 'Wishlist', href: '#wishlist' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-deep/85 backdrop-blur-md border-b border-brand-accent/15 transition-all">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Brandmark */}
        <a
          href="#"
          className="text-brand-heading font-extrabold text-2xl tracking-tight hover:opacity-90 transition-opacity"
        >
          Ely<span className="text-brand-accent">.</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-brand-text/80 hover:text-brand-accent transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA and Terminal Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenTerminal && (
            <button
              type="button"
              onClick={onOpenTerminal}
              title="Abrir Terminal macOS Zsh (Ctrl+` ou Cmd+`)"
              className="p-2 rounded-lg text-brand-textMuted hover:text-cyan-400 hover:bg-brand-surface border border-white/5 transition-all font-mono"
              aria-label="Abrir Terminal Zsh"
            >
              <TerminalIcon className="w-4 h-4" />
            </button>
          )}

          <a
            href="#contato"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-brand-accent bg-brand-accent/10 border border-brand-accent/30 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-glow-blue"
          >
            <MailIcon className="w-4 h-4 text-currentColor" />
            <span>Contato</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-brand-text hover:text-brand-accent hover:bg-brand-surface border border-white/5"
          aria-label="Alternar menu de navegação"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-surface border-b border-brand-accent/15 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-brand-text hover:text-brand-accent font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            {onOpenTerminal && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTerminal();
                }}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-brand-textMuted hover:text-cyan-400 bg-brand-deep border border-brand-accent/20 flex items-center justify-center gap-2"
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Terminal</span>
              </button>
            )}
            <a
              href="#contato"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-brand-accent bg-brand-accent/10 border border-brand-accent/30 text-center"
            >
              Contato
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
