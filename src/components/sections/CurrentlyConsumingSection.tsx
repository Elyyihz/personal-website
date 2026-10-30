import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import {
  HeadphonesIcon,
  BookOpenIcon,
  TvIcon,
  SpotifyIcon,
  PlayIcon,
  ExternalLinkIcon,
} from '@/components/icons';
import { useSpotify } from '@/hooks/useSpotify';
import { useData } from '@/context/DataContext';

/**
 * Formats millisecond duration into mm:ss timecode string.
 *
 * @param ms - Duration value expressed in milliseconds.
 * @returns Standard formatted timecode string.
 */
const formatTimecode = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Currently Consuming section with Reading, Watching, and live/recent Spotify API integration.
 * Injects official cover and reference URL for Philip K. Dick's 'The Man in the High Castle'.
 */
export const CurrentlyConsumingSection: React.FC = () => {
  const { track, isLoading, isFallbackMock, progressMs } = useSpotify();
  const { consumedMedia } = useData();

  const reading = consumedMedia.reading;
  const watching = consumedMedia.watching;

  const progressPercentage = track?.durationMs
    ? Math.min(100, Math.max(0, (progressMs / track.durationMs) * 100))
    : 0;

  /**
   * Helper computing human-readable badge text for Spotify state.
   */
  const getSpotifyBadge = () => {
    if (isFallbackMock) {
      return { label: 'Demonstração (Mock)', isLive: false };
    }
    if (track?.source === 'currently-playing' && track.isPlaying) {
      return { label: 'Ao Vivo (Ouvindo Agora)', isLive: true };
    }
    if (track?.source === 'recently-played') {
      return { label: 'Tocado Recentemente', isLive: true };
    }
    return { label: 'Spotify Conectado', isLive: true };
  };

  const spotifyBadge = getSpotifyBadge();

  return (
    <section id="consumindo" className="scroll-mt-28 py-12">
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

        {/* Card 2: Ouvindo (Spotify API Integration - Live & Recently Played) */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/50 flex flex-col justify-between group transition-all relative overflow-hidden h-full">
          {/* Subtle Background Watermark */}
          <div className="absolute -right-8 -top-8 text-brand-deep opacity-35 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
            <SpotifyIcon className="w-40 h-40" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Header with Spotify Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SpotifyIcon className="w-5 h-5 text-brand-accent" />
                <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold">
                  {track?.isPlaying ? 'Ouvindo Agora' : 'Última Reprodução'}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  spotifyBadge.isLive
                    ? 'text-brand-accent bg-brand-accent/10 border-brand-accent/30'
                    : 'text-brand-textMuted bg-brand-deep/60 border-white/10'
                }`}
              >
                {spotifyBadge.label}
              </span>
            </div>

            {/* Track Info */}
            <div className="flex items-center gap-4 my-2">
              <div className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={
                    track?.albumImageUrl ??
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={track?.title ?? 'Capa do álbum'}
                  className={`w-16 h-16 rounded-lg object-cover shadow-md border border-brand-accent/20 ${
                    track?.isPlaying ? 'animate-spin-slow' : ''
                  }`}
                />
              </div>
              <div className="min-w-0">
                <a
                  href={track?.songUrl ?? 'https://open.spotify.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-brand-heading font-bold text-base hover:text-brand-accent truncate transition-colors"
                >
                  {isLoading ? 'Conectando ao Spotify...' : track?.title ?? 'Sem reprodução ativa'}
                </a>
                <span className="text-xs text-brand-textMuted block truncate">
                  {track?.artist ?? 'Spotify Player'}
                </span>
                {track?.album && (
                  <span className="text-[11px] text-brand-textMuted/70 block truncate">
                    {track.album}
                  </span>
                )}
              </div>
            </div>

            {/* Playhead Progress Bar */}
            <div className="w-full mt-2">
              <div className="flex justify-between text-[11px] font-mono text-brand-textMuted mb-1.5">
                <span>{formatTimecode(progressMs)}</span>
                <span>{formatTimecode(track?.durationMs ?? 169000)}</span>
              </div>
              <div className="h-1.5 bg-brand-deep rounded-full overflow-hidden border border-brand-accent/15">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-300 relative"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-end mt-2">
                <a
                  href={track?.songUrl ?? 'https://open.spotify.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-brand-accent hover:underline font-mono"
                >
                  <span>Abrir no Spotify</span>
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

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
