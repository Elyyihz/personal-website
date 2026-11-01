import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import {
  HeadphonesIcon,
  BookOpenIcon,
  TvIcon,
  PlayIcon,
  ExternalLinkIcon,
  GamepadIcon,
} from '@/components/icons';
import { SpotifyPlayerCard } from '@/components/common/SpotifyPlayerCard';
import { useData } from '@/context/DataContext';

/**
 * Currently Consuming section with Reading (page progress), Spotify live music,
 * Watching, and Gaming status cards.
 */
export const CurrentlyConsumingSection: React.FC = () => {
  const { consumedMedia } = useData();

  const reading = consumedMedia.reading;
  const watching = consumedMedia.watching;
  const gaming = consumedMedia.gaming || {
    id: 'gaming-default',
    title: 'Stardew Valley',
    platform: 'PC / Steam',
    status: 'Em Progresso (Ano 3)',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    hoursPlayed: 142.5,
  };

  const currentPage = reading.currentPage ?? 184;
  const totalPages = reading.totalPages ?? 260;
  const progressPercent = reading.progressPercentage ?? Math.round((currentPage / totalPages) * 100);

  return (
    <section id="consumindo" className="scroll-mt-24 py-4 md:py-6">
      <SectionHeading
        title="Consumindo Atualmente"
        badgeText="Leituras, Jogos & Mídia"
        icon={<HeadphonesIcon className="w-7 h-7" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr items-stretch">
        {/* Card 1: Lendo (With Page Progression Bar) */}
        <div className="bg-brand-surface rounded-2xl p-5 border border-brand-accent/20 hover:border-brand-accent/40 flex flex-col justify-between group transition-all h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4 text-brand-primary" />
                <span className="text-[11px] uppercase tracking-wider text-brand-textMuted font-semibold">
                  {reading.status}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/25 text-brand-primary">
                Livro
              </span>
            </div>

            {/* Book Cover and Info */}
            <div className="flex gap-3 items-center mb-3">
              <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-lg border border-brand-accent/25 group-hover:scale-105 transition-transform">
                <img
                  src={reading.coverUrl}
                  alt={`Capa do livro ${reading.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <strong className="block text-sm font-bold text-brand-heading leading-tight mb-1 truncate">
                  {reading.title}
                </strong>
                <span className="block text-xs text-brand-accent font-medium mb-1">
                  {reading.author}
                </span>
                <span className="block text-[10px] text-brand-textMuted leading-tight">
                  {reading.category}
                </span>
              </div>
            </div>

            {/* Reading Page Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-brand-accent/10">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-brand-textMuted">Pág. {currentPage} de {totalPages}</span>
                <span className="text-brand-accent font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-brand-deep rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-brand-accent rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-brand-accent/10 flex items-center justify-end">
            <a
              href={reading.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-brand-accent hover:underline font-mono"
            >
              <span>Referência</span>
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 2: Ouvindo (Spotify Player) */}
        <SpotifyPlayerCard />

        {/* Card 3: Assistindo */}
        <div className="bg-brand-surface rounded-2xl p-5 border border-brand-accent/20 hover:border-brand-accent/40 flex flex-col justify-between group transition-all h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TvIcon className="w-4 h-4 text-brand-accent" />
                <span className="text-[11px] uppercase tracking-wider text-brand-textMuted font-semibold">
                  Assistindo
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent">
                {watching.category}
              </span>
            </div>

            <div className="w-full h-24 bg-brand-deep rounded-xl shadow-lg mb-2.5 flex items-center justify-center relative overflow-hidden border border-brand-accent/20 group-hover:border-brand-accent/50 transition-colors">
              <img
                src={watching.coverUrl}
                alt="Prévia de série"
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform"
              />
              <div className="w-8 h-8 rounded-full bg-brand-primary/80 flex items-center justify-center text-white z-10 shadow-glow-blue group-hover:scale-110 transition-transform">
                <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
              </div>
            </div>

            <strong className="text-brand-heading font-bold text-sm block mb-0.5 truncate">
              {watching.title}
            </strong>
            <span className="text-xs text-brand-textMuted block">
              {watching.subtitle}
            </span>
          </div>

          <div className="pt-3 border-t border-brand-accent/10 flex items-center justify-between text-[11px] text-brand-textMuted">
            <span>Análise & Lore</span>
            <span className="text-brand-accent font-mono text-[10px]">Em andamento</span>
          </div>
        </div>

        {/* Card 4: Jogando (Gaming Status) */}
        <div className="bg-brand-surface rounded-2xl p-5 border border-brand-accent/20 hover:border-brand-accent/40 flex flex-col justify-between group transition-all h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GamepadIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] uppercase tracking-wider text-brand-textMuted font-semibold">
                  Jogando
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                {gaming.platform}
              </span>
            </div>

            <div className="flex gap-3 items-center mb-3">
              <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-brand-accent/25 group-hover:scale-105 transition-transform bg-brand-deep">
                <img
                  src={gaming.coverUrl}
                  alt={`Artwork do jogo ${gaming.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <strong className="block text-sm font-bold text-brand-heading leading-tight mb-1 truncate">
                  {gaming.title}
                </strong>
                <span className="block text-xs text-emerald-400 font-medium leading-tight">
                  {gaming.status}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-accent/10 flex items-center justify-between text-[11px] text-brand-textMuted font-mono">
            <span>Horas Registradas</span>
            <span className="text-brand-heading font-bold">{gaming.hoursPlayed ?? 142.5}h</span>
          </div>
        </div>
      </div>
    </section>
  );
};
