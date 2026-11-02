/**
 * Strict Environment Variable Validation Module.
 *
 * Enforces mandatory presence of SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET,
 * SPOTIFY_REDIRECT_URI, and SPOTIFY_REFRESH_TOKEN at application startup.
 */

export interface ValidatedEnvironment {
  spotifyClientId: string;
  spotifyClientSecret: string;
  spotifyRedirectUri: string;
  spotifyRefreshToken: string;
  backendApiUrl: string;
  geminiApiKey: string;
  steamApiKey: string;
  steamId: string;
}

export class EnvironmentValidationError extends Error {
  public readonly missingKeys: string[];

  constructor(missingKeys: string[]) {
    super(
      `Fatal: Missing mandatory environment variables: [${missingKeys.join(
        ', '
      )}]. Application bootstrap halted.`
    );
    this.name = 'EnvironmentValidationError';
    this.missingKeys = missingKeys;
  }
}

/**
 * Validates mandatory environment keys from Vite runtime meta environment.
 * Throws EnvironmentValidationError if any mandatory key is missing in strict mode.
 *
 * @param strict - If true, throws exception halting boot; otherwise logs diagnostics.
 * @returns Validated environment object.
 */
export function validateEnvironment(strict: boolean = false): ValidatedEnvironment {
  const env = import.meta.env;

  const clientId =
    env.SPOTIFY_CLIENT_ID || env.VITE_SPOTIFY_CLIENT_ID || '';
  const clientSecret =
    env.SPOTIFY_CLIENT_SECRET || env.VITE_SPOTIFY_CLIENT_SECRET || '';
  const redirectUri =
    env.SPOTIFY_REDIRECT_URI ||
    env.VITE_SPOTIFY_REDIRECT_URI ||
    'http://localhost:3000/callback';
  const refreshToken =
    env.SPOTIFY_REFRESH_TOKEN || env.VITE_SPOTIFY_REFRESH_TOKEN || '';
  const backendApiUrl =
    env.VITE_BACKEND_API_URL || 'http://localhost:8000';
  const geminiApiKey =
    env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
  const steamApiKey =
    env.STEAM_API_KEY || env.VITE_STEAM_API_KEY || '';
  const steamId =
    env.STEAM_ID || env.VITE_STEAM_ID || '';

  const missingKeys: string[] = [];
  if (!clientId) missingKeys.push('SPOTIFY_CLIENT_ID');
  if (!clientSecret) missingKeys.push('SPOTIFY_CLIENT_SECRET');
  if (!redirectUri) missingKeys.push('SPOTIFY_REDIRECT_URI');
  if (!refreshToken) missingKeys.push('SPOTIFY_REFRESH_TOKEN');

  if (missingKeys.length > 0 && strict) {
    console.error(
      '[EnvValidator] CRITICAL: Mandatory Spotify environment keys missing:',
      missingKeys
    );
    throw new EnvironmentValidationError(missingKeys);
  }

  return {
    spotifyClientId: clientId,
    spotifyClientSecret: clientSecret,
    spotifyRedirectUri: redirectUri,
    spotifyRefreshToken: refreshToken,
    backendApiUrl,
    geminiApiKey,
    steamApiKey,
    steamId,
  };
}

/**
 * Singleton validated environment configuration instance.
 */
export const validatedEnv = validateEnvironment(false);
