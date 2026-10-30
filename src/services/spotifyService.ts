import type { SpotifyTrack } from '@/types/spotify';
import { Logger } from '@/utils/logger';

/**
 * Service adapter responsible for fetching and mapping Spotify Web API playback state.
 * Implements graceful fallback to curated mock data when environment tokens are absent.
 */
export class SpotifyService {
  private readonly logger: Logger;
  private readonly clientId?: string;
  private readonly clientSecret?: string;
  private readonly refreshToken?: string;

  /**
   * Initializes the Spotify service with logging and environment credentials.
   */
  constructor() {
    this.logger = new Logger('SpotifyService');
    // Environment variables can be configured via .env file for production live integration
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    this.refreshToken = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;
  }

  /**
   * Evaluates whether live Spotify API credentials are configured in the current runtime.
   *
   * @returns True if required credentials exist, otherwise false.
   */
  public hasLiveCredentials(): boolean {
    return Boolean(this.clientId && this.clientSecret && this.refreshToken);
  }

  /**
   * Retrieves the currently playing or most recently played track snapshot.
   * Employs guard clause returning mock fallback when live credentials are not present.
   *
   * @returns Promise resolving to SpotifyTrack payload.
   */
  public async getCurrentlyPlaying(): Promise<{ track: SpotifyTrack; isMock: boolean }> {
    this.logger.logStepStart('FetchCurrentlyPlaying', {
      hasCredentials: this.hasLiveCredentials(),
    });

    // Guard clause: fall back immediately if live credentials are not provisioned
    if (!this.hasLiveCredentials()) {
      this.logger.logDecision(
        'UseFallbackMock',
        'Spotify API credentials missing in runtime environment. Serving curated fallback track.'
      );

      const mockTrack = this.getMockTrack();
      this.logger.logStepConclusion('FetchCurrentlyPlaying', 'Loaded mock track payload successfully');
      return { track: mockTrack, isMock: true };
    }

    try {
      this.logger.logDecision(
        'CallSpotifyApi',
        'Valid credentials detected. Proceeding to fetch access token and player state.'
      );

      const liveTrack = await this.fetchLiveTrackFromSpotify();
      this.logger.logStepConclusion('FetchCurrentlyPlaying', 'Live Spotify track fetched successfully');
      return { track: liveTrack, isMock: false };
    } catch (error) {
      this.logger.logError('Failed to retrieve live Spotify track. Reverting to mock fallback.', error);
      this.logger.logDecision('FallbackAfterException', 'Network or auth error occurred on live endpoint.');
      return { track: this.getMockTrack(), isMock: true };
    }
  }

  /**
   * Executes the OAuth token exchange and requests the live Spotify player endpoint.
   *
   * @returns Promise resolving to active track data.
   * @throws Error if network fails or response is not OK.
   */
  private async fetchLiveTrackFromSpotify(): Promise<SpotifyTrack> {
    const basicToken = btoa(`${this.clientId}:${this.clientSecret}`);

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken ?? '',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Spotify token exchange returned status ${tokenResponse.status}`);
    }

    const { access_token } = (await tokenResponse.json()) as { access_token: string };

    const playerResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // HTTP 204 indicates nothing is currently playing
    if (playerResponse.status === 204 || playerResponse.status > 400) {
      return this.getMockTrack();
    }

    const data = (await playerResponse.json()) as {
      is_playing: boolean;
      progress_ms: number;
      item: {
        name: string;
        duration_ms: number;
        external_urls: { spotify: string };
        artists: Array<{ name: string }>;
        album: {
          name: string;
          images: Array<{ url: string }>;
        };
      };
    };

    return {
      title: data.item.name,
      artist: data.item.artists.map((a) => a.name).join(', '),
      album: data.item.album.name,
      albumImageUrl: data.item.album.images[0]?.url ?? 'https://placehold.co/100x100/0f172a/22d3ee?text=Cover',
      songUrl: data.item.external_urls.spotify,
      isPlaying: data.is_playing,
      progressMs: data.progress_ms,
      durationMs: data.item.duration_ms,
    };
  }

  /**
   * Provides default curated mock playback data based on user profile preferences.
   *
   * @returns A realistic SpotifyTrack object.
   */
  public getMockTrack(): SpotifyTrack {
    return {
      title: 'Let Me Down Slowly',
      artist: 'Alec Benjamin',
      album: 'Narrated For You',
      albumImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      songUrl: 'https://open.spotify.com/track/2qxmye6gAegTMjLKEBoR1d',
      isPlaying: true,
      progressMs: 84000,
      durationMs: 169000,
    };
  }
}
