import { useState, useEffect, useCallback } from 'react';
import type { SpotifyPlaybackDisplay } from '@/types/spotifyApi';
import { spotifyOAuthManager, DEFAULT_FALLBACK_TRACK } from '@/services/spotifyOAuth';

/**
 * Custom React hook managing Spotify playback integration and live timer tick.
 * Supports background access token renewal and visually pleasing HTTP 204 fallback state.
 */
export const useSpotify = () => {
  const [playback, setPlayback] = useState<SpotifyPlaybackDisplay>(DEFAULT_FALLBACK_TRACK);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progressMs, setProgressMs] = useState<number>(0);

  /**
   * Refreshes playback status by querying Spotify Web API or backend proxy.
   */
  const loadTrack = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await spotifyOAuthManager.fetchCurrentlyPlaying();
      setPlayback(data);
      setProgressMs(data.progressMs);
    } catch {
      setPlayback(DEFAULT_FALLBACK_TRACK);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTrack();
    // Poll every 30 seconds for live updates
    const pollInterval = setInterval(() => {
      void loadTrack();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [loadTrack]);

  // Advances progress bar locally while the track is active
  useEffect(() => {
    if (!playback.isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setProgressMs((current) => {
        const next = current + 1000;
        return next > playback.durationMs ? 0 : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playback.isPlaying, playback.durationMs]);

  const loginWithSpotify = () => {
    window.location.href = spotifyOAuthManager.getAuthorizationUrl();
  };

  return {
    track: playback,
    isLoading,
    isIdle204: playback.isIdle204,
    progressMs,
    refreshTrack: loadTrack,
    loginWithSpotify,
  };
};
