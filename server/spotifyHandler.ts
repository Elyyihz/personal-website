import type { SpotifyTrack } from '../src/types/spotify';

/**
 * Standard response payload returned by the Spotify backend/edge endpoint.
 */
export interface SpotifyEndpointResponse {
  track: SpotifyTrack;
  isFallbackMock: boolean;
  error?: string;
}

/**
 * Default fallback track returned when API credentials or responses are unavailable.
 */
const FALLBACK_MOCK_TRACK: SpotifyTrack = {
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

/**
 * Securely exchanges refresh token with Spotify Accounts API and queries player endpoints.
 * Prioritizes 'Currently Playing'; gracefully falls back to 'Recently Played' when inactive.
 * Secrets are exclusively read from server-side environment variables.
 *
 * @returns Promise resolving to formatted playback response.
 */
export async function handleSpotifyRequest(): Promise<SpotifyEndpointResponse> {
  const clientId =
    process.env.SPOTIFY_CLIENT_ID || process.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret =
    process.env.SPOTIFY_CLIENT_SECRET || process.env.VITE_SPOTIFY_CLIENT_SECRET;
  const refreshToken =
    process.env.SPOTIFY_REFRESH_TOKEN || process.env.VITE_SPOTIFY_REFRESH_TOKEN;

  // Guard clause: immediately return mock if credentials are absent
  if (!clientId || !clientSecret || !refreshToken) {
    return {
      track: FALLBACK_MOCK_TRACK,
      isFallbackMock: true,
      error: 'Spotify credentials not configured on backend/edge environment.',
    };
  }

  try {
    // Step 1: Exchange refresh token for ephemeral access token
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed with HTTP status ${tokenResponse.status}`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string };
    const accessToken = tokenData.access_token;

    // Step 2: Query 'Currently Playing' endpoint
    const currentlyPlayingResponse = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If currently playing returns active track (HTTP 200 with content)
    if (currentlyPlayingResponse.status === 200) {
      const data = (await currentlyPlayingResponse.json()) as {
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
        } | null;
      };

      if (data.item) {
        return {
          isFallbackMock: false,
          track: {
            title: data.item.name,
            artist: data.item.artists.map((a) => a.name).join(', '),
            album: data.item.album.name,
            albumImageUrl:
              data.item.album.images[0]?.url ?? FALLBACK_MOCK_TRACK.albumImageUrl,
            songUrl: data.item.external_urls.spotify,
            isPlaying: data.is_playing,
            progressMs: data.progress_ms,
            durationMs: data.item.duration_ms,
            source: 'currently-playing',
          },
        };
      }
    }

    // Step 3: Fall back to 'Recently Played' if not actively playing
    const recentlyPlayedResponse = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (recentlyPlayedResponse.status === 200) {
      const recentData = (await recentlyPlayedResponse.json()) as {
        items: Array<{
          played_at: string;
          track: {
            name: string;
            duration_ms: number;
            external_urls: { spotify: string };
            artists: Array<{ name: string }>;
            album: {
              name: string;
              images: Array<{ url: string }>;
            };
          };
        }>;
      };

      const mostRecent = recentData.items[0];
      if (mostRecent) {
        return {
          isFallbackMock: false,
          track: {
            title: mostRecent.track.name,
            artist: mostRecent.track.artists.map((a) => a.name).join(', '),
            album: mostRecent.track.album.name,
            albumImageUrl:
              mostRecent.track.album.images[0]?.url ??
              FALLBACK_MOCK_TRACK.albumImageUrl,
            songUrl: mostRecent.track.external_urls.spotify,
            isPlaying: false,
            progressMs: 0,
            durationMs: mostRecent.track.duration_ms,
            playedAt: mostRecent.played_at,
            source: 'recently-played',
          },
        };
      }
    }

    // Default to fallback mock if no active or recent tracks exist
    return {
      track: FALLBACK_MOCK_TRACK,
      isFallbackMock: true,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown backend Spotify error';
    return {
      track: FALLBACK_MOCK_TRACK,
      isFallbackMock: true,
      error: errorMsg,
    };
  }
}
