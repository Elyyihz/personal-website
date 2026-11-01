import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import {
  BookOpenIcon,
  TvIcon,
  GamepadIcon,
  SpotifyIcon,
  CheckIcon,
  ExternalLinkIcon,
} from '@/components/icons';

/**
 * Media Manager interface allowing modification of Currently Reading (including page progress),
 * Watching, Gaming status, and Spotify integration monitoring.
 */
export const MediaManager: React.FC = () => {
  const { consumedMedia, updateConsumedMedia } = useData();

  const [readingForm, setReadingForm] = useState({
    ...consumedMedia.reading,
    currentPage: consumedMedia.reading.currentPage ?? 184,
    totalPages: consumedMedia.reading.totalPages ?? 260,
  });

  const [watchingForm, setWatchingForm] = useState(consumedMedia.watching);

  const [gamingForm, setGamingForm] = useState(
    consumedMedia.gaming || {
      id: 'gaming-1',
      title: 'Stardew Valley',
      platform: 'PC / Steam',
      status: 'Em Progresso (Ano 3)',
      coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
      hoursPlayed: 142.5,
    }
  );

  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    updateConsumedMedia({
      reading: {
        ...readingForm,
        currentPage: Number(readingForm.currentPage) || 0,
        totalPages: Number(readingForm.totalPages) || 1,
      },
      watching: watchingForm,
      gaming: {
        ...gamingForm,
        hoursPlayed: Number(gamingForm.hoursPlayed) || 0,
      },
    });
    setSaveSuccessMessage('Mídias consumidas, progresso de leitura e jogos atualizados com sucesso!');
    setTimeout(() => setSaveSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-brand-accent/15">
        <h4 className="text-lg font-bold text-brand-heading">
          Gerenciador de Mídias Consumidas &amp; Atividades
        </h4>
        <p className="text-xs text-brand-textMuted">
          Atualize checkpoints de leitura (páginas lidas), recomendações audiovisuais e status de jogos.
        </p>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 rounded-xl bg-cyan-950/60 border border-brand-accent/40 text-brand-accent text-xs font-semibold flex items-center gap-2">
          <CheckIcon className="w-4 h-4" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveMedia} className="space-y-6">
        {/* Section 1: Currently Reading & Page Checkpoint */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-accent/15">
            <BookOpenIcon className="w-5 h-5 text-brand-primary" />
            <h5 className="text-sm font-bold text-brand-heading">
              Lendo Atualmente (Progresso de Leitura em Páginas)
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
                Página Atual (Progresso) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={readingForm.currentPage}
                onChange={(e) => setReadingForm({ ...readingForm, currentPage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Total de Páginas da Obra *
              </label>
              <input
                type="number"
                min={1}
                required
                value={readingForm.totalPages}
                onChange={(e) => setReadingForm({ ...readingForm, totalPages: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono"
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

        {/* Section 2: Active Gaming Status */}
        <div className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/20 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-accent/15">
            <GamepadIcon className="w-5 h-5 text-emerald-400" />
            <h5 className="text-sm font-bold text-brand-heading">
              Jogando Atualmente (Games &amp; Atividades)
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Título do Jogo *
              </label>
              <input
                type="text"
                required
                value={gamingForm.title}
                onChange={(e) => setGamingForm({ ...gamingForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Plataforma / Console
              </label>
              <input
                type="text"
                value={gamingForm.platform}
                onChange={(e) => setGamingForm({ ...gamingForm, platform: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Status / Progresso
              </label>
              <input
                type="text"
                value={gamingForm.status}
                onChange={(e) => setGamingForm({ ...gamingForm, status: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Horas Jogadas
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={gamingForm.hoursPlayed}
                onChange={(e) => setGamingForm({ ...gamingForm, hoursPlayed: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                URL da Imagem / Artwork do Jogo
              </label>
              <input
                type="url"
                required
                value={gamingForm.coverUrl}
                onChange={(e) => setGamingForm({ ...gamingForm, coverUrl: e.target.value })}
                className="w-full px-3 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Currently Watching */}
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

        {/* Section 4: Spotify Architecture Status */}
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
            <span>Salvar Alterações de Mídia &amp; Jogos</span>
          </button>
        </div>
      </form>
    </div>
  );
};
