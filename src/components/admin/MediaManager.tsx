import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import {
  BookOpenIcon,
  TvIcon,
  SpotifyIcon,
  CheckIcon,
  ExternalLinkIcon,
} from '@/components/icons';

/**
 * Media Manager interface allowing modification of Currently Reading, Watching, and Spotify settings.
 */
export const MediaManager: React.FC = () => {
  const { consumedMedia, updateConsumedMedia } = useData();

  const [readingForm, setReadingForm] = useState(consumedMedia.reading);
  const [watchingForm, setWatchingForm] = useState(consumedMedia.watching);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    updateConsumedMedia({
      reading: readingForm,
      watching: watchingForm,
    });
    setSaveSuccessMessage('Mídias consumidas atualizadas com sucesso!');
    setTimeout(() => setSaveSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-brand-accent/15">
        <h4 className="text-lg font-bold text-brand-heading">
          Gerenciador de Mídias Consumidas
        </h4>
        <p className="text-xs text-brand-textMuted">
          Atualize o livro atual, recomendações de vídeo e monitore a integração com o Spotify.
        </p>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 rounded-xl bg-cyan-950/60 border border-brand-accent/40 text-brand-accent text-xs font-semibold flex items-center gap-2">
          <CheckIcon className="w-4 h-4" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveMedia} className="space-y-6">
        {/* Section 1: Currently Reading */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-accent/15">
            <BookOpenIcon className="w-5 h-5 text-brand-primary" />
            <h5 className="text-sm font-bold text-brand-heading">
              Lendo Atualmente (Livro em Destaque)
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Título da Obra *
              </label>
              <input
                type="text"
                required
                value={readingForm.title}
                onChange={(e) => setReadingForm({ ...readingForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Autor(a) *
              </label>
              <input
                type="text"
                required
                value={readingForm.author}
                onChange={(e) => setReadingForm({ ...readingForm, author: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Gênero / Categoria
              </label>
              <input
                type="text"
                value={readingForm.category}
                onChange={(e) => setReadingForm({ ...readingForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Status / Rótulo
              </label>
              <input
                type="text"
                value={readingForm.status}
                onChange={(e) => setReadingForm({ ...readingForm, status: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                URL da Capa Oficial
              </label>
              <input
                type="url"
                required
                value={readingForm.coverUrl}
                onChange={(e) => setReadingForm({ ...readingForm, coverUrl: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono text-[11px]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                URL de Referência / Amazon
              </label>
              <input
                type="url"
                required
                value={readingForm.referenceUrl}
                onChange={(e) =>
                  setReadingForm({ ...readingForm, referenceUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Currently Watching */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-accent/15">
            <TvIcon className="w-5 h-5 text-brand-accent" />
            <h5 className="text-sm font-bold text-brand-heading">
              Assistindo Atualmente (Séries / Mídia)
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Título
              </label>
              <input
                type="text"
                required
                value={watchingForm.title}
                onChange={(e) => setWatchingForm({ ...watchingForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Subtítulo / Temporada
              </label>
              <input
                type="text"
                value={watchingForm.subtitle}
                onChange={(e) =>
                  setWatchingForm({ ...watchingForm, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                URL da Imagem de Prévia / Backdrop
              </label>
              <input
                type="url"
                required
                value={watchingForm.coverUrl}
                onChange={(e) =>
                  setWatchingForm({ ...watchingForm, coverUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Spotify Architecture Status */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-accent/15">
            <SpotifyIcon className="w-5 h-5 text-brand-accent" />
            <h5 className="text-sm font-bold text-brand-heading">
              Arquitetura de Integração Spotify Web API
            </h5>
          </div>
          <p className="text-xs text-brand-textMuted leading-relaxed">
            A integração de áudio opera através do endpoint seguro backend/edge{' '}
            <code className="text-brand-accent font-mono">GET /api/spotify</code>, realizando a
            renovação automática de token no lado do servidor com fallback para a última faixa
            reproduzida (<code className="text-brand-accent font-mono">recently-played</code>).
          </p>
          <div className="p-3 bg-brand-deep rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-xs text-brand-text">Endpoint ativo:</span>
            <a
              href="/api/spotify"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-brand-accent hover:underline font-mono"
            >
              <span>/api/spotify</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-glow-blue flex items-center gap-2 transition-all"
          >
            <CheckIcon className="w-4 h-4" />
            <span>Salvar Alterações de Mídia</span>
          </button>
        </div>
      </form>
    </div>
  );
};
