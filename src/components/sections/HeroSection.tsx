import React from 'react';
import { SparklesIcon, FolderGitIcon, GiftIcon } from '@/components/icons';
import { useData } from '@/context/DataContext';

/**
 * Hero section component featuring introductory headline, call-to-actions, and profile avatar.
 */
export const HeroSection: React.FC = () => {
  const { profile } = useData();

  return (
    <section id="hero" className="pt-24 pb-4 md:pt-32 md:pb-6">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Left Column: Headline and Call to Actions */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <SparklesIcon className="w-3.5 h-3.5 text-brand-accent" />
            <span>Welcome to my space</span>
          </div>

          {/* Main Display Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-heading leading-tight tracking-tight">
            Oi, eu sou a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-cyan-300 to-brand-primary">
              {profile.name.split(' ')[0]}
            </span>
            .
          </h1>

          {/* Subtitle / Role Overview */}
          <p className="text-lg md:text-xl text-brand-text/90 max-w-xl leading-relaxed">
            {profile.role}. {profile.headline}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <a
              href="#projetos"
              className="px-6 py-3.5 rounded-xl font-semibold text-white bg-brand-primary hover:bg-brand-primaryHover transition-all flex items-center gap-2.5 shadow-glow-blue hover:scale-[1.02]"
            >
              <FolderGitIcon className="w-5 h-5 text-white" />
              <span>Meus Projetos</span>
            </a>
            <a
              href="#wishlist"
              className="px-6 py-3.5 rounded-xl font-semibold text-brand-text bg-brand-surface hover:bg-brand-surfaceHover border border-brand-accent/20 hover:border-brand-accent/50 transition-all flex items-center gap-2.5 hover:scale-[1.02] shadow-sm"
            >
              <GiftIcon className="w-5 h-5 text-brand-accent" />
              <span>Ver Wishlist</span>
            </a>
          </div>
        </div>

        {/* Right Column: Visual Avatar rendering memoji image directly without background sphere */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex-shrink-0 flex items-center justify-center">
          <img
            src="/memoji.png"
            alt={`Avatar Memoji de ${profile.name}`}
            className="w-full h-full object-contain select-none transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};
