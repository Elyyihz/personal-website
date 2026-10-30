import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SpotifyState } from '@/types/spotify';
import { SpotifyService } from '@/services/spotifyService';

/**
 * Custom React hook managing Spotify playback integration and live timer tick.
 * Automatically switches between live API response and placeholder fallback.
 *
 * @returns Combined state object and refresh trigger.
 */
export const useSpotify = () => {
  const service = useMemo(() => new SpotifyService(), []);

  const [state, setState] = useState<SpotifyState>({
    track: null,
    isLoading: true,
    error: null,
    isFallbackMock: false,
  });

  const [progressMs, setProgressMs] = useState<number>(0);

  /**
   * Refreshes track information by invoking the underlying service.
   */
  const loadTrack = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { track, isMock } = await service.getCurrentlyPlaying();
      setState({
        track,
        isLoading: false,
        error: null,
        isFallbackMock: isMock,
      });
      setProgressMs(track.progressMs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown playback error';
      setState({
        track: service.getMockTrack(),
        isLoading: false,
        error: errorMessage,
        isFallbackMock: true,
      });
    }
  }, [service]);

  useEffect(() => {
    void loadTrack();
  }, [loadTrack]);

  // Advances progress bar locally while the track is active
  useEffect(() => {
    if (!state.track?.isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setProgressMs((current) => {
        if (!state.track) return current;
        const next = current + 1000;
        return next > state.track.durationMs ? 0 : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.track]);

  return {
    ...state,
    progressMs,
    refreshTrack: loadTrack,
  };
};
