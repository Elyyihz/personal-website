import React, { useEffect, useState } from 'react';
import { spotifyOAuthManager } from '@/services/spotifyOAuth';
import { SpotifyIcon, CheckIcon, CloseIcon } from '@/components/icons';

/**
 * Handles Spotify OAuth redirect authorization code exchange.
 */
export const SpotifyCallbackHandler: React.FC = () => {
  const [status, setStatus] = useState<'exchanging' | 'success' | 'error'>('exchanging');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(`Spotify consent denied: ${error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMessage('No authorization code found in redirect URI parameters.');
      return;
    }

    spotifyOAuthManager
      .handleAuthorizationCallback(code)
      .then(() => {
        setStatus('success');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Unknown authorization error');
      });
  }, []);

  return (
    <div className="min-h-screen bg-brand-deep flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-brand-surface border border-brand-accent/30 rounded-2xl p-8 shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-deep border border-brand-accent/20 flex items-center justify-center mx-auto text-brand-accent">
          <SpotifyIcon className="w-8 h-8" />
        </div>

        {status === 'exchanging' && (
          <>
            <h2 className="text-xl font-bold text-brand-heading">Conectando ao Spotify...</h2>
            <p className="text-xs text-brand-textMuted">
              Trocando código de autorização por tokens de acesso seguros em background.
            </p>
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mt-4" />
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-10 h-10 rounded-full bg-green-950/60 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto">
              <CheckIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-brand-heading">Conexão Estabelecida!</h2>
            <p className="text-xs text-brand-textMuted">
              Autenticação concluída com sucesso. Redirecionando para a página principal...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <CloseIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-brand-heading">Falha na Autenticação</h2>
            <p className="text-xs text-red-400">{errorMessage}</p>
            <a
              href="/"
              className="inline-block mt-4 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl"
            >
              Voltar ao Início
            </a>
          </>
        )}
      </div>
    </div>
  );
};
