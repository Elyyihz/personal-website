import React from 'react';
import { SpotifyIcon, ExternalLinkIcon, HeadphonesIcon } from '@/components/icons';
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
 * Minimalist Spotify playback card rendering live active track or graceful idle state.
 * Refreshes every 10 seconds via background polling.
 * Zero emojis, zero mock tracks, and no exposed technical HTTP status codes.
 */
export const SpotifyPlayerCard: React.FC = () => {
  const { track, progressMs } = useSpotify();

  const isPlayingLive = track.isPlaying && Boolean(track.title);

  const progressPercentage = track.durationMs
    ? Math.min(100, Math.max(0, (progressMs / track.durationMs) * 100))
    : 0;

  // Render idle card when no music is actively playing live
  if (!isPlayingLive) {
    return (
      <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/50 flex flex-col justify-between group transition-all relative overflow-hidden h-full shadow-lg">
        {/* Background Ambient Brandmark */}
        <div className="absolute -right-8 -top-8 text-brand-deep opacity-30 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
          <SpotifyIcon className="w-40 h-40" />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SpotifyIcon className="w-5 h-5 text-brand-accent" />
              <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold">
                Spotify
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-slate-600" title="Repouso" />
          </div>

          {/* Minimalist Idle Message */}
          <div className="flex items-center gap-4 py-3">
            <div className="w-14 h-14 rounded-xl bg-brand-deep border border-brand-accent/15 flex items-center justify-center text-brand-textMuted/70 flex-shrink-0 group-hover:text-brand-accent transition-colors">
              <HeadphonesIcon className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block text-brand-heading font-bold text-sm sm:text-base leading-snug">
                No momento não estou ouvindo nada
              </strong>
              <p className="text-xs text-brand-textMuted mt-1 leading-relaxed">
                Quando eu der play em alguma música no Spotify, ela aparecerá aqui ao vivo.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-brand-accent/10">
            <span className="text-[10px] font-mono text-brand-textMuted/60">
              Sincronizado a cada 10s
            </span>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-brand-accent hover:underline font-mono"
            >
              <span>Abrir Spotify</span>
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render live playback card when music is actively playing
  return (
    <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/50 flex flex-col justify-between group transition-all relative overflow-hidden h-full shadow-lg">
      {/* Background Ambient Brandmark */}
      <div className="absolute -right-8 -top-8 text-brand-deep opacity-30 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
        <SpotifyIcon className="w-40 h-40" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header with Live Status Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SpotifyIcon className="w-5 h-5 text-brand-accent" />
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold">
              Ouvindo Agora
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-brand-accent bg-brand-accent/10 border-brand-accent/30 font-semibold">
              Ao Vivo
            </span>
          </div>
        </div>

        {/* Live Body: Artwork, Track Name, Artists */}
        <div className="flex items-center gap-4 my-2">
          {/* Album Cover */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <img
              src={track.albumImageUrl}
              alt={`Capa do álbum ${track.album}`}
              className="w-16 h-16 rounded-lg object-cover shadow-md border border-brand-accent/25"
            />
          </div>

          <div className="min-w-0 flex-1">
            <a
              href={track.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-brand-heading font-bold text-base hover:text-brand-accent truncate transition-colors leading-snug"
              title={track.title}
            >
              {track.title}
            </a>
            <span
              className="text-xs text-brand-textMuted font-medium block truncate"
              title={track.artist}
            >
              {track.artist}
            </span>
            <span className="text-[11px] text-brand-textMuted/70 block truncate">
              {track.album}
            </span>
          </div>
        </div>

        {/* Playhead Progress Bar */}
        <div className="w-full mt-3">
          <div>
            <div className="flex justify-between text-[11px] font-mono text-brand-textMuted mb-1.5">
              <span>{formatTimecode(progressMs)}</span>
              <span>{formatTimecode(track.durationMs)}</span>
            </div>
            <div className="h-1.5 bg-brand-deep rounded-full overflow-hidden border border-brand-accent/15">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-accent/10">
            <span className="text-[10px] font-mono text-brand-accent/80 font-medium">
              Ao vivo no Spotify
            </span>
            <a
              href={track.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-brand-accent hover:underline font-mono"
            >
              <span>Ouvir no Spotify</span>
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
