import type { SpotifyTrack } from '@/types/spotify';
import { Logger } from '@/utils/logger';

/**
 * Service adapter responsible for fetching Spotify playback state from secure backend/edge endpoint.
 * Protects client secrets by delegating OAuth token refresh to server-side handler.
 */
export class SpotifyService {
  private readonly logger: Logger;
  private readonly apiEndpoint: string;

  /**
   * Initializes the Spotify client service with configured endpoint.
   */
  constructor() {
    this.logger = new Logger('SpotifyService');
    this.apiEndpoint = '/api/spotify';
  }

  /**
   * Retrieves the currently playing or recently played track snapshot from the backend/edge API.
   * Employs guard clause with local fallback if network is interrupted.
   *
   * @returns Promise resolving to SpotifyTrack payload and status flag.
   */
  public async getCurrentlyPlaying(): Promise<{ track: SpotifyTrack; isMock: boolean }> {
    this.logger.logStepStart('FetchPlaybackFromApi', {
      endpoint: this.apiEndpoint,
    });

    try {
      const response = await fetch(this.apiEndpoint, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Spotify endpoint returned HTTP ${response.status}`);
      }

      const payload = (await response.json()) as {
        track: SpotifyTrack;
        isFallbackMock: boolean;
        error?: string;
      };

      if (payload.isFallbackMock) {
        this.logger.logDecision(
          'BackendReturnedMock',
          payload.error ?? 'Backend configured with fallback mock'
        );
      } else {
        this.logger.logDecision(
          'LiveTrackReceived',
          `Source: ${payload.track.source ?? 'api'}`
        );
      }

      this.logger.logStepConclusion(
        'FetchPlaybackFromApi',
        `Successfully loaded track '${payload.track.title}' (mock=${payload.isFallbackMock})`
      );

      return {
        track: payload.track,
        isMock: payload.isFallbackMock,
      };
    } catch (error) {
      this.logger.logError('Network failure connecting to Spotify endpoint. Using local fallback.', error);
      this.logger.logDecision('LocalFallbackActivated', 'Endpoint unreachable or errored');

      return {
        track: this.getMockTrack(),
        isMock: true,
      };
    }
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
      albumImageUrl:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      songUrl: 'https://open.spotify.com/track/2qxmye6gAegTMjLKEBoR1d',
      isPlaying: true,
      progressMs: 84000,
      durationMs: 169000,
      source: 'mock',
    };
  }
}
