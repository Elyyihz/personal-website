import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { handleSpotifyRequest } from './server/spotifyHandler';

/**
 * Vite bundler configuration.
 * Configures React plugin, backend edge API middleware for Spotify, and '@/' path alias.
 */
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spotify-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/spotify', async (_req, res) => {
          try {
            const result = await handleSpotifyRequest();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                isFallbackMock: true,
                error: err instanceof Error ? err.message : 'Internal Server Error',
              })
            );
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
