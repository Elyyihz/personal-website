import React, { useState } from 'react';
import type { ArticleItem } from '@/types/article';
import { useData } from '@/context/DataContext';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  BookOpenIcon,
  ExternalLinkIcon,
  CloseIcon,
} from '@/components/icons';

interface ArticleFormData {
  title: string;
  link: string;
  description: string;
  author: string;
  pub_date: string;
  tagsString: string;
  visible: boolean;
}

const emptyFormData: ArticleFormData = {
  title: '',
  link: '',
  description: '',
  author: 'Elynne Lima',
  pub_date: new Date().toISOString().split('T')[0],
  tagsString: 'GenAI, Clean Architecture',
  visible: true,
};

/**
 * Administrative manager allowing modification of newsletter articles, links, and public visibility.
 * Implements full CRUD with instant reactivity and persistent storage.
 */
export const NewsletterManager: React.FC = () => {
  const { articles, createArticle, updateArticle, deleteArticle, toggleArticleVisibility } = useData();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(emptyFormData);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const visibleCount = articles.filter((a) => a.visible !== false).length;

  const handleOpenCreate = () => {
    setEditingArticleId(null);
    setFormData({
      ...emptyFormData,
      pub_date: new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (article: ArticleItem) => {
    setEditingArticleId(article.id);
    setFormData({
      title: article.title,
      link: article.link,
      description: article.description,
      author: article.author,
      pub_date: article.pub_date.includes('T') ? article.pub_date.split('T')[0] : article.pub_date,
      tagsString: article.tags.join(', '),
      visible: article.visible !== false,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.link.trim()) {
      return;
    }

    const tagsArray = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        title: formData.title.trim(),
        link: formData.link.trim(),
        description: formData.description.trim(),
        author: formData.author.trim() || 'Elynne Lima',
        pub_date: formData.pub_date,
        tags: tagsArray,
        visible: formData.visible,
      });
      setFeedbackMessage('Artigo atualizado com sucesso!');
    } else {
      createArticle({
        title: formData.title.trim(),
        link: formData.link.trim(),
        description: formData.description.trim(),
        author: formData.author.trim() || 'Elynne Lima',
        pub_date: formData.pub_date,
        tags: tagsArray,
        visible: formData.visible,
      });
      setFeedbackMessage('Novo artigo adicionado à newsletter!');
    }

    setIsFormOpen(false);
    setEditingArticleId(null);
    setFormData(emptyFormData);

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const handleDelete = (id: string) => {
    deleteArticle(id);
    setDeleteConfirmId(null);
    setFeedbackMessage('Artigo excluído do catálogo.');
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-accent/15">
        <div>
          <h4 className="text-lg font-bold text-brand-heading flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-brand-accent" />
            <span>Gestão de Artigos &amp; Newsletter</span>
          </h4>
          <p className="text-xs text-brand-textMuted mt-1">
            Controle quais publicações da newsletter Elyy.init aparecem no site e edite seus links e resumos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1.5 rounded-xl">
            {visibleCount} de {articles.length} visíveis
          </span>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primaryHover transition-all shadow-glow-blue"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Novo Artigo</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Form Drawer / Modal for Add or Edit */}
      {isFormOpen && (
        <form onSubmit={handleFormSubmit} className="p-5 bg-brand-surface rounded-2xl border border-brand-accent/30 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h5 className="text-sm font-bold text-brand-heading">
              {editingArticleId ? 'Editar Artigo' : 'Cadastrar Novo Artigo'}
            </h5>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingArticleId(null);
              }}
              className="p-1 rounded-lg text-brand-textMuted hover:text-white"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Título do Artigo *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Construindo RAG Resiliente..."
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Link de Destino (URL) *
              </label>
              <input
                type="url"
                required
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://elyyihz.substack.com/p/..."
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Resumo / Descrição *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Uma breve contextualização técnica do conteúdo..."
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                placeholder="GenAI, LangGraph, Python"
                className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                  Autor
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                  Data de Publicação
                </label>
                <input
                  type="date"
                  value={formData.pub_date}
                  onChange={(e) => setFormData({ ...formData, pub_date: e.target.value })}
                  className="w-full px-3.5 py-2 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-primary bg-brand-deep border-brand-accent/30 focus:ring-brand-accent"
                />
                <span className="text-xs font-semibold text-brand-heading">
                  Exibir publicamente na página inicial (Visível no site)
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingArticleId(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-textMuted hover:text-white bg-brand-surfaceHover"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-glow-blue"
            >
              {editingArticleId ? 'Salvar Alterações' : 'Cadastrar Artigo'}
            </button>
          </div>
        </form>
      )}

      {/* Articles Listing */}
      <div className="space-y-3">
        {articles.length === 0 ? (
          <div className="p-8 text-center bg-brand-surface rounded-2xl border border-dashed border-brand-accent/20">
            <p className="text-xs text-brand-textMuted">Nenhum artigo cadastrado na lista.</p>
          </div>
        ) : (
          articles.map((article) => {
            const isVisible = article.visible !== false;

            return (
              <div
                key={article.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isVisible
                    ? 'bg-brand-surface border-brand-accent/20 hover:border-brand-accent/40'
                    : 'bg-brand-surface/40 border-white/5 opacity-70'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Visibility Toggle Badge */}
                    <button
                      type="button"
                      onClick={() => toggleArticleVisibility(article.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                        isVisible
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title="Clique para alternar visibilidade pública"
                    >
                      {isVisible ? 'Visível no Site' : 'Oculto'}
                    </button>

                    <span className="text-[11px] font-mono text-brand-textMuted">
                      {article.pub_date.includes('T') ? article.pub_date.split('T')[0] : article.pub_date}
                    </span>
                    <span className="text-[11px] font-mono text-brand-textMuted">
                      por {article.author}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-brand-heading truncate">
                    {article.title}
                  </h5>

                  <p className="text-xs text-brand-text/75 line-clamp-2">
                    {article.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-accent hover:underline"
                    >
                      <span>{article.link}</span>
                      <ExternalLinkIcon className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1 flex-wrap pl-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-deep text-brand-textMuted border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(article)}
                    className="p-2 rounded-xl text-brand-textMuted hover:text-brand-accent bg-brand-deep border border-brand-accent/20 hover:border-brand-accent transition-colors"
                    title="Editar artigo e link"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === article.id ? (
                    <div className="flex items-center gap-1.5 p-1 bg-red-950/70 border border-red-500/40 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-lg"
                      >
                        Excluir
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 text-xs text-brand-textMuted hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(article.id)}
                      className="p-2 rounded-xl text-brand-textMuted hover:text-red-400 bg-brand-deep border border-brand-accent/20 hover:border-red-500/40 transition-colors"
                      title="Excluir artigo"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
