import React, { useState } from 'react';
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  LockIcon,
  TerminalIcon,
  WhiteFlagIcon,
} from '@/components/icons';
import { profileData } from '@/data/profileData';
import { playCozyMelody } from '@/utils/cozyAudio';

export interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenTerminal?: () => void;
}

/**
 * Footer component displaying brand mark, copyright, social links,
 * and the White Flag / Cozy Mode Easter Egg.
 * All icons rendered strictly as inline SVGs using currentColor without emojis.
 */
export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenTerminal }) => {
  const currentYear = new Date().getFullYear();
  const [isWaving, setIsWaving] = useState(false);
  const [isCozy, setIsCozy] = useState(() => {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('cozy-mode');
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /**
   * Handles the White Flag click Easter Egg:
   * 1. Plays gentle procedural Stardew Valley-inspired chimes.
   * 2. Triggers the physical flag wobble/wave animation.
   * 3. Dispatches global event and toggles Cozy Mode class on the document root.
   * 4. Displays a friendly, welcoming toast notification.
   */
  const handleWhiteFlagClick = () => {
    // 1. Trigger wave animation
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 850);

    // 2. Play procedural cozy audio
    playCozyMelody();

    // 3. Toggle global cozy mode palette and pixel art aesthetics
    const root = document.documentElement;
    const nextState = !root.classList.contains('cozy-mode');
    if (nextState) {
      root.classList.add('cozy-mode');
      setIsCozy(true);
      setToastMessage('I support this message! Need a break? Grab some coffee!');
    } else {
      root.classList.remove('cozy-mode');
      setIsCozy(false);
      setToastMessage('Retornando ao Modo Cyberpunk.');
    }

    // 4. Dispatch standard DOM event for decoupled subscribers
    window.dispatchEvent(
      new CustomEvent('cozy-mode-toggle', {
        detail: { isCozy: nextState },
      })
    );

    // Dismiss toast after 4.2 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 4200);
  };

  return (
    <footer className="border-t border-brand-accent/15 bg-brand-surface/70 backdrop-blur-sm mt-10 md:mt-12 relative">
      {/* Friendly White Flag Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all">
          <div className="bg-brand-surface border border-brand-accent/50 text-brand-heading px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-lg">
            <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent flex-shrink-0">
              <WhiteFlagIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
              <p className="text-[10px] text-brand-textMuted font-mono">
                {isCozy ? 'Cozy Mode Ativo (Tons Terrosos & Pixel Art)' : 'Cyberpunk Cyan Ativo'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-brand-textMuted hover:text-white text-xs ml-2 cursor-pointer font-bold"
            >
              x
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <a
            href="#"
            className="text-brand-heading font-extrabold text-2xl tracking-tight block mb-1 hover:opacity-90"
          >
            {profileData.handle}
            <span className="text-brand-accent">.</span>
          </a>
          <p className="text-sm text-brand-textMuted">{profileData.role}</p>
        </div>

        {/* Social Network Icon Endpoints & Easter Eggs */}
        <div className="flex items-center gap-3">
          {/* Easter Egg: White Flag Button */}
          <button
            type="button"
            onClick={handleWhiteFlagClick}
            aria-label="Ativar Cozy Mode (Easter Egg Bandeira Branca)"
            title="Bandeira Branca / Cozy Mode (Stardew Valley)"
            className={`w-11 h-11 rounded-xl bg-brand-deep flex items-center justify-center border transition-all hover:scale-110 cursor-pointer ${
              isCozy
                ? 'border-amber-400 text-amber-300 shadow-glow-cyan'
                : 'border-white/20 text-slate-300 hover:text-white hover:border-white/50'
            } ${isWaving ? 'animate-flag-wave' : ''}`}
          >
            <WhiteFlagIcon className="w-5 h-5" />
          </button>

          {onOpenTerminal && (
            <button
              type="button"
              onClick={onOpenTerminal}
              aria-label="Abrir Terminal macOS Zsh"
              title="Terminal Zsh (Ctrl+` ou Cmd+`)"
              className="w-11 h-11 rounded-xl bg-brand-deep flex items-center justify-center border border-cyan-400/20 text-brand-text hover:text-cyan-400 hover:border-cyan-400 transition-all hover:scale-105"
            >
              <TerminalIcon className="w-5 h-5" />
            </button>
          )}
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              aria-label="Abrir Painel Administrativo"
              title="Painel Privado"
              className="w-11 h-11 rounded-xl bg-brand-deep flex items-center justify-center border border-brand-accent/20 text-brand-text hover:text-brand-accent hover:border-brand-accent transition-all hover:scale-105"
            >
              <LockIcon className="w-5 h-5" />
            </button>
          )}
          <a
            href={profileData.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil do GitHub"
            className="w-11 h-11 rounded-xl bg-brand-deep flex items-center justify-center border border-brand-accent/20 text-brand-text hover:text-brand-accent hover:border-brand-accent transition-all hover:scale-105"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={profileData.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil do LinkedIn"
            className="w-11 h-11 rounded-xl bg-brand-deep flex items-center justify-center border border-brand-accent/20 text-brand-text hover:text-brand-accent hover:border-brand-accent transition-all hover:scale-105"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href={profileData.socials.email}
            aria-label="Enviar Email"
            className="w-11 h-11 rounded-xl bg-brand-deep flex items-center justify-center border border-brand-accent/20 text-brand-text hover:text-brand-accent hover:border-brand-accent transition-all hover:scale-105"
          >
            <MailIcon className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="py-4 text-center text-xs text-brand-textMuted/70 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>
          &copy; {currentYear} {profileData.name}. Construído com Clean Architecture, React e Tailwind CSS.
        </span>
        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-[11px] font-mono text-brand-accent hover:underline ml-2"
          >
            [Painel Privado]
          </button>
        )}
      </div>
    </footer>
  );
};
