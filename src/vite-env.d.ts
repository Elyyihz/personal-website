/// <reference types="vite/client" />

/**
 * Strict TypeScript typing for all runtime environment variables.
 * Enforces definition of required Spotify credentials and backend URL.
 */
interface ImportMetaEnv {
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_CLIENT_SECRET: string;
  readonly SPOTIFY_REDIRECT_URI: string;
  readonly SPOTIFY_REFRESH_TOKEN: string;

  // Client-exposed optional aliases
  readonly VITE_SPOTIFY_CLIENT_ID?: string;
  readonly VITE_SPOTIFY_CLIENT_SECRET?: string;
  readonly VITE_SPOTIFY_REDIRECT_URI?: string;
  readonly VITE_SPOTIFY_REFRESH_TOKEN?: string;

  // Backend microservice gateway
  readonly VITE_BACKEND_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
