import { validatedEnv } from '@/config/envValidator';
import type {
  SpotifyPlaybackDisplay,
  SpotifyCurrentlyPlayingRawResponse,
} from '@/types/spotifyApi';

const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_CURRENTLY_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing';

/**
 * Curated fallback display data returned when player is idle or offline.
 */
export const DEFAULT_FALLBACK_TRACK: SpotifyPlaybackDisplay = {
  title: 'Let Me Down Slowly',
  artist: 'Alec Benjamin',
  album: 'Narrated For You',
  albumImageUrl:
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
  songUrl: 'https://open.spotify.com/track/2qxmye6gAegTMjLKEBoR1d',
  isPlaying: false,
  progressMs: 0,
  durationMs: 169000,
  isIdle204: true,
  source: 'mock',
};

/**
 * Spotify OAuth 2.0 and API integration manager.
 * Handles automatic background token renewal via refresh_token,
 * OAuth callback authorization exchange, and currently-playing queries with HTTP 204 fallback.
 */
export class SpotifyOAuthManager {
  private cachedAccessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  /**
   * Builds the Spotify OAuth 2.0 authorization URL demanding user-read-currently-playing.
   *
   * @returns HTTPS URL string directing user to Spotify login consent screen.
   */
  public getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: validatedEnv.spotifyClientId,
      response_type: 'code',
      redirect_uri: validatedEnv.spotifyRedirectUri,
      scope: 'user-read-currently-playing user-read-recently-played',
      show_dialog: 'true',
    });
    return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
  }

  /**
   * Exchanges received OAuth authorization code for initial access and refresh tokens.
   *
   * @param code - Authorization code string returned to /callback route.
   * @returns Promise resolving to token payload.
   */
  public async handleAuthorizationCallback(
    code: string
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const authHeader = btoa(
      `${validatedEnv.spotifyClientId}:${validatedEnv.spotifyClientSecret}`
    );

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: validatedEnv.spotifyRedirectUri,
    });

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(
        `OAuth code exchange failed with HTTP status ${response.status}`
      );
    }

    const data = (await response.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    this.cachedAccessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000;

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  }

  /**
   * Retrieves a valid access token, automatically renewing in the background
   * using SPOTIFY_REFRESH_TOKEN if expired or missing.
   *
   * @returns Promise resolving to active Bearer access token string.
   */
  public async getRefreshedAccessToken(): Promise<string | null> {
    const refreshToken = validatedEnv.spotifyRefreshToken;
    if (!refreshToken || !validatedEnv.spotifyClientId || !validatedEnv.spotifyClientSecret) {
      return null;
    }

    // Return cached token if still within valid lifespan
    if (this.cachedAccessToken && Date.now() < this.tokenExpiresAt) {
      return this.cachedAccessToken;
    }

    const authHeader = btoa(
      `${validatedEnv.spotifyClientId}:${validatedEnv.spotifyClientSecret}`
    );

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    try {
      const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as {
        access_token: string;
        expires_in: number;
      };

      this.cachedAccessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000;
      return this.cachedAccessToken;
    } catch {
      return null;
    }
  }

  /**
   * Consumes endpoint https://api.spotify.com/v1/me/player/currently-playing.
   * Handles HTTP 204 gracefully (no active playback) returning pleasing fallback state.
   *
   * @returns Promise resolving to formatted playback presentation object.
   */
  public async fetchCurrentlyPlaying(): Promise<SpotifyPlaybackDisplay> {
    // Check if backend API proxy is available first (FastAPI microservice)
    try {
      const backendUrl = `${validatedEnv.backendApiUrl}/api/v1/spotify/currently-playing`;
      const backendResp = await fetch(backendUrl, {
        headers: { Accept: 'application/json' },
      });

      if (backendResp.ok) {
        const payload = await backendResp.json();
        if (payload.track) {
          return {
            title: payload.track.title,
            artist: payload.track.artist,
            album: payload.track.album,
            albumImageUrl: payload.track.album_image_url,
            songUrl: payload.track.song_url,
            isPlaying: payload.track.is_playing,
            progressMs: payload.track.progress_ms,
            durationMs: payload.track.duration_ms,
            playedAt: payload.track.played_at,
            isIdle204: !payload.track.is_playing,
            source: payload.is_fallback_mock ? 'mock' : 'currently-playing',
          };
        }
      }
    } catch {
      // Backend not running locally; fallback to direct Spotify OAuth token
    }

    // Direct client-side Spotify query if refresh token is present
    const accessToken = await this.getRefreshedAccessToken();
    if (!accessToken) {
      return DEFAULT_FALLBACK_TRACK;
    }

    try {
      const response = await fetch(SPOTIFY_CURRENTLY_PLAYING_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // HTTP 204 No Content: Spotify is closed or paused
      if (response.status === 204) {
        return {
          ...DEFAULT_FALLBACK_TRACK,
          isIdle204: true,
          source: 'idle-204',
        };
      }

      if (!response.ok) {
        return DEFAULT_FALLBACK_TRACK;
      }

      const raw = (await response.json()) as SpotifyCurrentlyPlayingRawResponse;
      if (!raw.item) {
        return {
          ...DEFAULT_FALLBACK_TRACK,
          isIdle204: true,
          source: 'idle-204',
        };
      }

      const artists = raw.item.artists.map((a) => a.name).join(', ');
      const images = raw.item.album.images;
      const albumImageUrl = images.length > 0 ? images[0].url : DEFAULT_FALLBACK_TRACK.albumImageUrl;

      return {
        title: raw.item.name,
        artist: artists || 'Unknown Artist',
        album: raw.item.album.name,
        albumImageUrl,
        songUrl: raw.item.external_urls.spotify,
        isPlaying: raw.is_playing,
        progressMs: raw.progress_ms,
        durationMs: raw.item.duration_ms,
        isIdle204: false,
        source: 'currently-playing',
      };
    } catch {
      return DEFAULT_FALLBACK_TRACK;
    }
  }
}

export const spotifyOAuthManager = new SpotifyOAuthManager();
