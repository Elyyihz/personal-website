import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import {
  HeadphonesIcon,
  BookOpenIcon,
  TvIcon,
  PlayIcon,
  ExternalLinkIcon,
} from '@/components/icons';
import { SpotifyPlayerCard } from '@/components/common/SpotifyPlayerCard';
import { useData } from '@/context/DataContext';

/**
 * Currently Consuming section with Reading, Watching, and live/recent Spotify API integration.
 * Injects official cover and reference URL for Philip K. Dick's 'The Man in the High Castle'.
 */
export const CurrentlyConsumingSection: React.FC = () => {
  const { consumedMedia } = useData();

  const reading = consumedMedia.reading;
  const watching = consumedMedia.watching;

  return (
    <section id="consumindo" className="scroll-mt-24 py-4 md:py-6">
      <SectionHeading
        title="Consumindo Atualmente"
        badgeText="Leituras, Músicas & Mídia"
        icon={<HeadphonesIcon className="w-7 h-7" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr items-stretch">
        {/* Card 1: Lendo (Injected: The Man in the High Castle) */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/40 flex flex-col justify-between group transition-all h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5 text-brand-primary" />
                <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold">
                  {reading.status}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/25 text-brand-primary">
                Livro
              </span>
            </div>

            {/* Official Book Cover Container */}
            <div className="flex gap-4 items-center mb-4">
              <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-lg border border-brand-accent/25 group-hover:scale-105 transition-transform">
                <img
                  src={reading.coverUrl}
                  alt={`Capa oficial do livro ${reading.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <strong className="block text-base font-bold text-brand-heading leading-tight mb-1">
                  {reading.title}
                </strong>
                <span className="block text-xs text-brand-accent font-medium mb-1">
                  {reading.author}
                </span>
                <span className="block text-[11px] text-brand-textMuted leading-tight">
                  {reading.category}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-accent/10 flex items-center justify-end">
            <a
              href={reading.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-accent hover:underline font-mono"
            >
              <span>Ver Referência / Amazon</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 2: Ouvindo (Minimalist Spotify Web API Card with HTTP 204 Fallback) */}
        <SpotifyPlayerCard />

        {/* Card 3: Assistindo */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/40 flex flex-col justify-between group transition-all h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TvIcon className="w-5 h-5 text-brand-accent" />
                <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold">
                  Assistindo
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent">
                {watching.category}
              </span>
            </div>

            <div className="w-full h-28 bg-brand-deep rounded-xl shadow-lg mb-3 flex items-center justify-center relative overflow-hidden border border-brand-accent/20 group-hover:border-brand-accent/50 transition-colors">
              <img
                src={watching.coverUrl}
                alt="Prévia de série"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform"
              />
              <div className="w-10 h-10 rounded-full bg-brand-primary/80 flex items-center justify-center text-white z-10 shadow-glow-blue group-hover:scale-110 transition-transform">
                <PlayIcon className="w-4 h-4 ml-0.5" />
              </div>
            </div>

            <strong className="text-brand-heading font-bold text-base block mb-0.5">
              {watching.title}
            </strong>
            <span className="text-xs text-brand-textMuted block">
              {watching.subtitle}
            </span>
          </div>

          <div className="pt-3 border-t border-brand-accent/10 flex items-center justify-between text-xs text-brand-textMuted">
            <span>Temporada & Análise</span>
            <span className="text-brand-accent font-mono text-[11px]">Em andamento</span>
          </div>
        </div>
      </div>
    </section>
  );
};
