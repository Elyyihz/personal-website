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
 * Currently Consuming section with Reading, Watching, and live/mock Spotify API integration.
 */
export const CurrentlyConsumingSection: React.FC = () => {
  const { track, isLoading, isFallbackMock, progressMs } = useSpotify();

  const progressPercentage = track?.durationMs
    ? Math.min(100, Math.max(0, (progressMs / track.durationMs) * 100))
    : 0;

  return (
    <section id="consumindo" className="scroll-mt-28 py-12">
      <SectionHeading
        title="Consumindo Atualmente"
        badgeText="Leituras, Músicas & Mídia"
        icon={<HeadphonesIcon className="w-7 h-7" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Lendo */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/40 flex flex-col items-center text-center group transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-deep flex items-center justify-center mb-4 text-brand-text group-hover:text-brand-accent border border-brand-accent/15 transition-colors">
            <BookOpenIcon className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold mb-4">
            Lendo Atualmente
          </span>
          <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
            <div className="w-28 h-40 bg-gradient-to-tr from-brand-deep to-slate-800 rounded-lg shadow-xl border border-brand-accent/20 flex flex-col justify-between p-3 text-left overflow-hidden">
              <span className="text-[10px] font-mono text-brand-accent uppercase">Livro</span>
              <div>
                <strong className="block text-xs text-brand-heading font-semibold leading-tight line-clamp-2">
                  Babel
                </strong>
                <span className="text-[10px] text-brand-textMuted">R.F. Kuang</span>
              </div>
            </div>
          </div>
          <strong className="text-brand-heading font-bold text-base">Ficção & Dark Academia</strong>
          <span className="text-xs text-brand-textMuted mt-1">R.F. Kuang / Martin Kleppmann</span>
        </div>

        {/* Card 2: Ouvindo (Spotify API Placeholder & Real Live Hook) */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/50 flex flex-col justify-between group transition-all relative overflow-hidden">
          {/* Subtle Background Watermark */}
          <div className="absolute -right-8 -top-8 text-brand-deep opacity-40 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
            <SpotifyIcon className="w-40 h-40" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Header with Spotify Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SpotifyIcon className="w-5 h-5 text-brand-accent" />
                <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold">
                  Ouvindo Agora
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isFallbackMock
                    ? 'text-brand-textMuted bg-brand-deep/60 border-white/10'
                    : 'text-brand-accent bg-brand-accent/10 border-brand-accent/30'
                }`}
                title={
                  isFallbackMock
                    ? 'Exibindo demonstração local (adicione credenciais Spotify no .env para dados em tempo real)'
                    : 'Conectado à API oficial do Spotify'
                }
              >
                {isFallbackMock ? 'Spotify Mock' : 'Spotify Live'}
              </span>
            </div>

            {/* Track Info */}
            <div className="flex items-center gap-4 my-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={
                    track?.albumImageUrl ??
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={track?.title ?? 'Capa do álbum'}
                  className="w-16 h-16 rounded-lg object-cover shadow-md border border-brand-accent/20 animate-spin-slow"
                />
              </div>
              <div className="min-w-0">
                <a
                  href={track?.songUrl ?? 'https://open.spotify.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-brand-heading font-bold text-base hover:text-brand-accent truncate transition-colors"
                >
                  {isLoading ? 'Carregando reprodução...' : track?.title ?? 'Sem reprodução ativa'}
                </a>
                <span className="text-xs text-brand-textMuted block truncate">
                  {track?.artist ?? 'Spotify Player'}
                </span>
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
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/40 flex flex-col items-center text-center group transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-deep flex items-center justify-center mb-4 text-brand-text group-hover:text-brand-accent border border-brand-accent/15 transition-colors">
            <TvIcon className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold mb-4">
            Assistindo
          </span>
          <div className="w-full h-32 bg-brand-deep rounded-xl shadow-lg mb-4 flex items-center justify-center relative overflow-hidden border border-brand-accent/20 group-hover:border-brand-accent/50 transition-colors">
            <img
              src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&auto=format&fit=crop&q=80"
              alt="Prévia de série"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="w-10 h-10 rounded-full bg-brand-primary/80 flex items-center justify-center text-white z-10 shadow-glow-blue group-hover:scale-110 transition-transform">
              <PlayIcon className="w-4 h-4 ml-0.5" />
            </div>
          </div>
          <strong className="text-brand-heading font-bold text-base">Ficção Científica & Animação</strong>
          <span className="text-xs text-brand-textMuted mt-1">Séries, Lore & Documentários Tech</span>
        </div>
      </div>
    </section>
  );
};
