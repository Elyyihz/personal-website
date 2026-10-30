/**
 * Represents a musical track snapshot payload from Spotify Web API or local fallback.
 */
export interface SpotifyTrack {
  /** Name of the song or musical composition */
  title: string;

  /** Primary performing artist or band */
  artist: string;

  /** Studio album title */
  album: string;

  /** Direct HTTPS URL pointing to the album cover artwork */
  albumImageUrl: string;

  /** Spotify open web client URL for immediate track playback */
  songUrl: string;

  /** Current playback state reported by the player context */
  isPlaying: boolean;

  /** Playhead elapsed progress expressed in milliseconds */
  progressMs: number;

  /** Total track length expressed in milliseconds */
  durationMs: number;
}

/**
 * State container for Spotify consumption widget lifecycle.
 */
export interface SpotifyState {
  /** Currently resolved track or null when nothing is playing */
  track: SpotifyTrack | null;

  /** Indicates asynchronous fetching status */
  isLoading: boolean;

  /** Network or authentication error message if fetch failed */
  error: string | null;

  /** Flags whether data is simulated via mock fallback due to missing live API tokens */
  isFallbackMock: boolean;
}
