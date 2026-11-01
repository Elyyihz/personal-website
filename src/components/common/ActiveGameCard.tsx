import React, { useState, useEffect } from 'react';
import { GamepadIcon } from '@/components/icons';
import { apiService } from '@/services/apiService';
import type { GameTelemetryStatus } from '@/types/game';

export interface ActiveGameCardProps {
  className?: string;
  game?: GameTelemetryStatus | null;
}

/**
 * Minimalist gaming presence card rendering live active game telemetry from Steam / Discord RPC.
 * Automatically polls backend endpoint /api/consuming/games every 10 seconds.
 * Fallbacks to HTTP 204 idle state when not in-game or disconnected.
 * Strictly adheres to zero emojis and inline SVGs with currentColor.
 */
export const ActiveGameCard: React.FC<ActiveGameCardProps> = ({
  className = '',
  game: initialGame,
}) => {
  const [game, setGame] = useState<GameTelemetryStatus | null>(initialGame ?? null);

  useEffect(() => {
    if (initialGame !== undefined) {
      setGame(initialGame);
    }
  }, [initialGame]);

  const fetchGameTelemetry = async () => {
    try {
      const data = await apiService.getActiveGame();
      setGame(data);
    } catch {
      setGame(null);
    }
  };

  useEffect(() => {
    if (initialGame === undefined) {
      fetchGameTelemetry();
      const interval = setInterval(fetchGameTelemetry, 10000);
      return () => clearInterval(interval);
    }
  }, [initialGame]);

  const isPlaying = game && game.is_playing;

  // Render Idle / Standby state when no game is active (HTTP 204)
  if (!isPlaying) {
    return (
      <div
        className={`bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-accent/50 flex flex-col justify-between group transition-all relative overflow-hidden h-full shadow-lg ${className}`}
      >
        {/* Background Ambient Controller Watermark */}
        <div className="absolute -right-8 -top-8 text-brand-deep opacity-30 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
          <GamepadIcon className="w-40 h-40 text-brand-accent" />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GamepadIcon className="w-5 h-5 text-emerald-400" />
              <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold">
                Steam & Discord RPC
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-slate-600" title="Repouso" />
          </div>

          {/* Minimalist Idle Message */}
          <div className="flex items-center gap-4 py-3">
            <div className="w-14 h-14 rounded-xl bg-brand-deep border border-brand-accent/15 flex items-center justify-center text-brand-textMuted/70 flex-shrink-0 group-hover:text-emerald-400 transition-colors">
              <GamepadIcon className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block text-brand-heading font-bold text-sm sm:text-base leading-snug">
                Nenhum jogo em execução no momento
              </strong>
              <p className="text-xs text-brand-textMuted mt-1 leading-relaxed">
                Quando eu iniciar uma sessão na Steam (Linux/Heroic) ou Discord RPC, o status aparecerá aqui ao vivo.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-brand-accent/10">
            <span className="text-[10px] font-mono text-brand-textMuted/60">
              Sincronizado a cada 10s
            </span>
            <span className="text-[11px] font-mono text-emerald-400/80">
              Pronta para Cozy Games
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render Active Gameplay Card
  return (
    <div
      className={`bg-brand-surface rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/60 flex flex-col justify-between group transition-all relative overflow-hidden h-full shadow-lg ${className}`}
    >
      {/* Background Ambient Graphic */}
      <div className="absolute -right-8 -top-8 text-brand-deep opacity-30 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
        <GamepadIcon className="w-40 h-40 text-emerald-400" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header with Pulsing Live Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GamepadIcon className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase tracking-widest text-brand-textMuted font-semibold">
              {game.platform || 'Steam / Linux'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold">{game.status_message || 'Farming right now...'}</span>
          </div>
        </div>

        {/* Game Title, Banner and Active State */}
        <div className="flex gap-4 items-center my-2">
          {game.banner_url ? (
            <div className="relative w-20 h-16 sm:w-24 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-emerald-500/30 group-hover:scale-105 transition-transform bg-brand-deep">
              <img
                src={game.banner_url}
                alt={`Banner de ${game.title}`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-brand-deep border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <GamepadIcon className="w-8 h-8" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <strong className="block text-brand-heading font-extrabold text-base sm:text-lg leading-snug truncate group-hover:text-emerald-300 transition-colors">
              {game.title}
            </strong>
            <p className="text-xs text-brand-textMuted mt-0.5 truncate">
              {game.status_message || 'Ativa no momento'}
            </p>
            <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-emerald-400/90">
              <span>Total: {game.total_hours.toFixed(1)}h</span>
              {game.hours_last_2weeks > 0 && (
                <span>Recente: {game.hours_last_2weeks.toFixed(1)}h</span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-accent/10 mt-2">
          <span className="text-[10px] font-mono text-brand-textMuted/70">
            Rich Presence Ativa
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            Sessão Aberta
          </span>
        </div>
      </div>
    </div>
  );
};
