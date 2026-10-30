import React from 'react';
import { GithubIcon, LinkedinIcon, MailIcon, LockIcon } from '@/components/icons';
import { profileData } from '@/data/profileData';

export interface FooterProps {
  onOpenAdmin?: () => void;
}

/**
 * Footer component displaying brand mark, copyright, and direct social links.
 * All icons rendered strictly as inline SVGs using currentColor.
 */
export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-accent/15 bg-brand-surface/70 backdrop-blur-sm mt-24">
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

        {/* Social Network Icon Endpoints */}
        <div className="flex items-center gap-3">
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
