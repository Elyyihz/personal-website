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
 * Minimalist Spotify playback card rendering album artwork, song name, and artists.
 * Handles live playback, background token refresh, and pleasant HTTP 204 idle states.
 */
export const SpotifyPlayerCard: React.FC = () => {
  const { track, isLoading, isIdle204, progressMs } = useSpotify();

  const progressPercentage = track.durationMs
    ? Math.min(100, Math.max(0, (progressMs / track.durationMs) * 100))
    : 0;

  return (
    <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/50 flex flex-col justify-between group transition-all relative overflow-hidden h-full shadow-lg">
      {/* Background Ambient Brandmark */}
      <div className="absolute -right-8 -top-8 text-brand-deep opacity-30 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
        <SpotifyIcon className="w-40 h-40" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header with Status Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SpotifyIcon className="w-5 h-5 text-brand-accent" />
            <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold">
              {track.isPlaying ? 'Ouvindo Agora' : isIdle204 ? 'Spotify em Pausa' : 'Última Reprodução'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {track.isPlaying && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
              </span>
            )}
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                track.isPlaying
                  ? 'text-brand-accent bg-brand-accent/10 border-brand-accent/30'
                  : 'text-brand-textMuted bg-brand-deep/70 border-white/10'
              }`}
            >
              {track.isPlaying
                ? 'Ao Vivo'
                : isIdle204
                ? 'HTTP 204 (Idle)'
                : 'Offline'}
            </span>
          </div>
        </div>

        {/* Minimalist Body: Artwork, Track Name, Artists */}
        <div className="flex items-center gap-4 my-2">
          {/* Album Cover with Vinyl Aura */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <img
              src={track.albumImageUrl}
              alt={`Capa do álbum ${track.album}`}
              className={`w-16 h-16 rounded-lg object-cover shadow-md border border-brand-accent/25 ${
                track.isPlaying ? 'animate-spin-slow' : 'opacity-90'
              }`}
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
              {isLoading ? 'Conectando ao Spotify...' : track.title}
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

        {/* Playhead Progress Bar or HTTP 204 Idle Message */}
        <div className="w-full mt-3">
          {isIdle204 && !track.isPlaying ? (
            <div className="p-2.5 rounded-xl bg-brand-deep/70 border border-brand-accent/10 text-center">
              <p className="text-[11px] text-brand-textMuted leading-tight flex items-center justify-center gap-1.5">
                <HeadphonesIcon className="w-3.5 h-3.5 text-brand-accent" />
                <span>Nenhuma música tocando no momento (Spotify fechado).</span>
              </p>
            </div>
          ) : (
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
          )}

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-accent/10">
            <span className="text-[10px] font-mono text-brand-textMuted/60">
              OAuth 2.0 Web API
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
