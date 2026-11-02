import React, { useState, useEffect } from 'react';
import { SpotifyIcon, GamepadIcon } from '@/components/icons';
import { SpotifyPlayerCard } from './SpotifyPlayerCard';
import { ActiveGameCard } from './ActiveGameCard';
import { useSpotify } from '@/hooks/useSpotify';
import { apiService } from '@/services/apiService';
import type { GameTelemetryStatus } from '@/types/game';

export interface LiveTelemetryCarouselProps {
  className?: string;
}

/**
 * Dynamic Tabs and Carousel component smoothly switching between Spotify Live Music
 * and Steam / Discord Active Game telemetry.
 * Automatically highlights the active media stream and displays pulsing indicators.
 */
export const LiveTelemetryCarousel: React.FC<LiveTelemetryCarouselProps> = ({
  className = '',
}) => {
  const [game, setGame] = useState<GameTelemetryStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'spotify' | 'gaming'>('spotify');
  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);
  const { track } = useSpotify();

  const isSpotifyLive = track.isPlaying && Boolean(track.title);
  const isGameLive = Boolean(game && game.is_playing);

  const fetchGameTelemetry = async () => {
    try {
      const data = await apiService.getActiveGame();
      setGame(data);

      // Auto-switch to gaming tab if a game is actively running and Spotify is idle
      if (!hasAutoSwitched && data && data.is_playing && !isSpotifyLive) {
        setActiveTab('gaming');
        setHasAutoSwitched(true);
      }
    } catch {
      setGame(null);
    }
  };

  useEffect(() => {
    fetchGameTelemetry();
    const interval = setInterval(fetchGameTelemetry, 10000);
    return () => clearInterval(interval);
  }, [hasAutoSwitched, isSpotifyLive]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Top Carousel Navigation Tabs */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-brand-accent/15">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-brand-deep/80 border border-brand-accent/20">
          <button
            type="button"
            onClick={() => setActiveTab('spotify')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'spotify'
                ? 'bg-brand-primary text-white shadow-glow-blue border border-cyan-400/30'
                : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <SpotifyIcon className="w-4 h-4 text-brand-accent" />
            <span>Música</span>
            {isSpotifyLive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Música ao vivo" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gaming')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'gaming'
                ? 'bg-brand-primary text-white shadow-glow-blue border border-cyan-400/30'
                : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <GamepadIcon className="w-4 h-4 text-emerald-400" />
            <span>Jogo</span>
            {isGameLive && (
              <span
                className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                title={`Jogando agora: ${game?.title}`}
              />
            )}
          </button>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'spotify' ? 'gaming' : 'spotify')}
            className="p-1 rounded text-brand-textMuted hover:text-white text-xs font-mono cursor-pointer"
            title="Alternar Mídia"
          >
            {activeTab === 'spotify' ? '1 / 2' : '2 / 2'}
          </button>
        </div>
      </div>

      {/* Dynamic Content Display with Smooth Fade Transition */}
      <div className="flex-1 min-h-[260px] transition-all duration-300">
        {activeTab === 'spotify' ? (
          <div className="h-full animate-fadeIn">
            <SpotifyPlayerCard />
          </div>
        ) : (
          <div className="h-full animate-fadeIn">
            <ActiveGameCard game={game} />
          </div>
        )}
      </div>
    </div>
  );
};
