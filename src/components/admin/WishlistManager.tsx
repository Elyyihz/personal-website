import React, { useState, useMemo } from 'react';
import type { WishlistItem, WishlistCategory } from '@/types/wishlist';
import { useData } from '@/context/DataContext';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon,
  SearchIcon,
  ExternalLinkIcon,
  BookOpenIcon,
  GiftIcon,
} from '@/components/icons';

interface WishlistFormData {
  title: string;
  subtitle: string;
  category: WishlistCategory;
  url: string;
  tag: string;
  isFulfilled: boolean;
}

const emptyFormData: WishlistFormData = {
  title: '',
  subtitle: '',
  category: 'Livros',
  url: '',
  tag: '',
  isFulfilled: false,
};

/**
 * Wishlist CRUD management interface for the admin control panel.
 * Enables adding, searching, editing, and deleting items across categories.
 */
export const WishlistManager: React.FC = () => {
  const { wishlistItems, createWishlistItem, updateWishlistItem, deleteWishlistItem } =
    useData();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WishlistFormData>(emptyFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Todos' | WishlistCategory>('Todos');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const categories: Array<'Todos' | WishlistCategory> = [
    'Todos',
    'Livros',
    'Tech',
    'Lifestyle & Geek',
  ];

  /**
   * Filters the wishlist items based on active category and text query.
   */
  const filteredItems = useMemo(() => {
    return wishlistItems.filter((item) => {
      const matchesCat =
        categoryFilter === 'Todos' || item.category === categoryFilter;

      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
      );
    });
  }, [wishlistItems, categoryFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingItemId(null);
    setFormData(emptyFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: WishlistItem) => {
    setEditingItemId(item.id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle ?? '',
      category: item.category,
      url: item.url ?? '',
      tag: item.tag ?? '',
      isFulfilled: Boolean(item.isFulfilled),
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || undefined,
      category: formData.category,
      url: formData.url.trim() || undefined,
      tag: formData.tag.trim() || undefined,
      isFulfilled: formData.isFulfilled,
    };

    if (editingItemId) {
      updateWishlistItem(editingItemId, payload);
      setFeedbackMessage('Item da wishlist salvo com sucesso!');
    } else {
      createWishlistItem(payload);
      setFeedbackMessage('Item cadastrado na wishlist com sucesso!');
    }

    setIsFormOpen(false);
    setEditingItemId(null);
    setFormData(emptyFormData);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleDelete = (id: string) => {
    deleteWishlistItem(id);
    setDeleteConfirmId(null);
    setFeedbackMessage('Item removido da wishlist com sucesso!');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-accent/15">
        <div>
          <h4 className="text-lg font-bold text-brand-heading">Gerenciador da Wishlist</h4>
          <p className="text-xs text-brand-textMuted">
            Adicione e edite livros da Amazon, periféricos ou itens colecionáveis ({wishlistItems.length} cadastrados).
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl text-xs font-semibold shadow-glow-blue transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Adicionar Item</span>
          </button>
        )}
      </div>

      {/* Feedback Toast Notification */}
      {feedbackMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Item Form */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="p-5 bg-brand-deep rounded-2xl border border-brand-accent/30 space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-brand-accent/15">
            <h5 className="text-sm font-bold text-brand-heading">
              {editingItemId ? 'Editar Item da Wishlist' : 'Adicionar Novo Item'}
            </h5>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-brand-textMuted hover:text-brand-accent"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Título do Item ou Livro *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: The Man in the High Castle"
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Subtítulo / Autor(a)
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Ex: Philip K. Dick"
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as WishlistCategory })
                }
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              >
                <option value="Livros">Livros</option>
                <option value="Tech">Tech</option>
                <option value="Lifestyle & Geek">Lifestyle & Geek</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Tag Descritiva
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="Ex: Ficção Científica, Hardware, Setup"
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                Link de Referência / Busca na Amazon
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.amazon.com.br/s?k=..."
                className="w-full px-3 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFulfilledCheckbox"
                checked={formData.isFulfilled}
                onChange={(e) => setFormData({ ...formData, isFulfilled: e.target.checked })}
                className="w-4 h-4 rounded text-brand-primary bg-brand-surface border-brand-accent/30 focus:ring-brand-accent"
              />
              <label htmlFor="isFulfilledCheckbox" className="text-xs font-medium text-brand-heading cursor-pointer">
                Item já adquirido / realizado (is_fulfilled)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-brand-accent/15">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-text bg-brand-surface hover:bg-brand-surfaceHover border border-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-primaryHover shadow-glow-blue flex items-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4" />
              <span>{editingItemId ? 'Salvar Item' : 'Cadastrar Item'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-surface text-brand-textMuted hover:text-brand-accent border border-brand-accent/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-textMuted">
            <SearchIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por título..."
            className="w-full pl-9 pr-3 py-1.5 bg-brand-deep rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-heading text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {filteredItems.slice(0, 30).map((item) => {
          const isConfirming = deleteConfirmId === item.id;

          return (
            <div
              key={item.id}
              className="p-3 bg-brand-surface rounded-xl border border-brand-accent/15 hover:border-brand-accent/30 flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-brand-deep flex items-center justify-center text-brand-accent flex-shrink-0">
                  {item.category === 'Livros' ? (
                    <BookOpenIcon className="w-3.5 h-3.5" />
                  ) : (
                    <GiftIcon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs text-brand-heading truncate block">
                      {item.title}
                    </strong>
                    <span className="text-[10px] font-mono text-brand-accent bg-brand-accent/10 px-1.5 py-0.2 rounded border border-brand-accent/20 flex-shrink-0">
                      {item.tag ?? item.category}
                    </span>
                    {item.isFulfilled && (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.2 rounded flex-shrink-0">
                        Adquirido
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <span className="text-[11px] text-brand-textMuted truncate block">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-brand-deep text-brand-textMuted hover:text-brand-accent transition-colors"
                    title="Abrir Link"
                  >
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => updateWishlistItem(item.id, { isFulfilled: !item.isFulfilled })}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    item.isFulfilled
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-brand-deep border-white/5 text-brand-textMuted hover:text-brand-accent'
                  }`}
                  title={item.isFulfilled ? 'Marcar como não adquirido' : 'Marcar como adquirido'}
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-brand-deep text-brand-textMuted hover:text-brand-accent transition-colors"
                  title="Editar"
                >
                  <EditIcon className="w-3.5 h-3.5" />
                </button>

                {isConfirming ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold text-white bg-red-600 hover:bg-red-700"
                    >
                      Excluir
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="p-1 text-brand-textMuted"
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg bg-brand-deep text-brand-textMuted hover:text-red-400 transition-colors"
                    title="Remover"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length > 30 && (
          <p className="text-center text-xs text-brand-textMuted pt-2">
            Mostrando 30 de {filteredItems.length} itens correspondentes. Refine a busca para encontrar itens específicos.
          </p>
        )}
      </div>
    </div>
  );
};
