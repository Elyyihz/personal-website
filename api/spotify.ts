import { handleSpotifyRequest } from '../server/spotifyHandler';

/**
 * Serverless / Edge function entrypoint for Spotify playback status.
 * Handles GET /api/spotify and returns JSON representation of currently or recently played track.
 */
export default async function handler(req: any, res: any) {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const result = await handleSpotifyRequest();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  return res.status(200).json(result);
}
