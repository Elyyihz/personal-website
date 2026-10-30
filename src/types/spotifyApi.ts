/**
 * Strict TypeScript interfaces mapping Spotify Web API payload structures.
 * Focuses rigorously on item.name, item.artists, and item.album.images.
 */

export interface SpotifyArtist {
  /** Name of the musical artist */
  name: string;

  /** External Spotify profile link */
  external_urls?: {
    spotify: string;
  };
}

export interface SpotifyAlbumImage {
  /** Direct HTTPS CDN URL to image asset */
  url: string;

  /** Image vertical dimension in pixels */
  height?: number;

  /** Image horizontal dimension in pixels */
  width?: number;
}

export interface SpotifyAlbum {
  /** Album or single designation */
  name: string;

  /** Array of cover artwork assets at various resolutions */
  images: SpotifyAlbumImage[];

  /** External link to album on Spotify */
  external_urls?: {
    spotify: string;
  };
}

export interface SpotifyTrackItem {
  /** Exact song title (item.name) */
  name: string;

  /** Performing musicians and bands (item.artists) */
  artists: SpotifyArtist[];

  /** Studio album metadata and artwork (item.album) */
  album: SpotifyAlbum;

  /** Total track duration in milliseconds */
  duration_ms: number;

  /** External link to play track */
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyCurrentlyPlayingRawResponse {
  /** Playback activity boolean state */
  is_playing: boolean;

  /** Elapsed playhead progress in milliseconds */
  progress_ms: number;

  /** Track payload; null when nothing is actively playing (or HTTP 204) */
  item: SpotifyTrackItem | null;

  /** Playback context type (album, playlist, artist) */
  context?: {
    type: string;
    href: string;
  } | null;
}

export interface SpotifyPlaybackDisplay {
  /** Song title */
  title: string;

  /** Comma-separated list of artist names */
  artist: string;

  /** Album title */
  album: string;

  /** Selected album cover artwork URL */
  albumImageUrl: string;

  /** Direct Spotify track link */
  songUrl: string;

  /** True if actively playing, false if paused or idle */
  isPlaying: boolean;

  /** Elapsed track progress in milliseconds */
  progressMs: number;

  /** Total track duration in milliseconds */
  durationMs: number;

  /** ISO timestamp for recently played fallback */
  playedAt?: string;

  /** True if Spotify is idle or closed (HTTP 204 No Content state) */
  isIdle204: boolean;

  /** Data origin: live API, recently played fallback, or mock */
  source: 'currently-playing' | 'recently-played' | 'idle-204' | 'mock';
}
