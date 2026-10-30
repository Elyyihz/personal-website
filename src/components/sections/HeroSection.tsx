import React from 'react';
import { SparklesIcon, FolderGitIcon, GiftIcon } from '@/components/icons';
import { profileData } from '@/data/profileData';

/**
 * Hero section component featuring introductory headline, call-to-actions, and profile avatar.
 */
export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="pt-32 pb-16 md:pt-40 md:pb-24">
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
              {profileData.name.split(' ')[0]}
            </span>
            .
          </h1>

          {/* Subtitle / Role Overview */}
          <p className="text-lg md:text-xl text-brand-text/90 max-w-xl leading-relaxed">
            {profileData.role}. {profileData.headline}
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

        {/* Right Column: Visual Avatar with Ambient Glow */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-accent/30 to-brand-primary/40 blur-2xl animate-pulse-subtle" />
          <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-tr from-brand-accent/40 via-blue-500/30 to-brand-accent/20 border border-brand-accent/40 shadow-glow-cyan overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
              alt={`Avatar de ${profileData.name}`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
