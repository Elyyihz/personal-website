import React, { useState, useMemo } from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import {
  GiftIcon,
  SearchIcon,
  ExternalLinkIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@/components/icons';
import { useData } from '@/context/DataContext';
import type { WishlistCategory, WishlistItem } from '@/types/wishlist';

type CategoryFilter = 'Todos' | WishlistCategory;

const ITEMS_PER_PAGE = 9;

/**
 * Categorized Wishlist section integrating the Amazon book collection and wishlist items.
 * Includes interactive category switching, instant search, and numbered pagination.
 */
export const WishlistSection: React.FC = () => {
  const { wishlistItems } = useData();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories: CategoryFilter[] = ['Todos', 'Livros', 'Tech', 'Lifestyle & Geek'];

  /**
   * Evaluates filtered list based on selected category and text search query.
   */
  const filteredItems = useMemo(() => {
    return wishlistItems.filter((item: WishlistItem) => {
      const matchesCategory =
        activeCategory === 'Todos' || item.category === activeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!searchQuery.trim()) {
        return true;
      }

      const normalizedQuery = searchQuery.toLowerCase().trim();
      const matchesTitle = item.title.toLowerCase().includes(normalizedQuery);
      const matchesSubtitle = item.subtitle
        ? item.subtitle.toLowerCase().includes(normalizedQuery)
        : false;

      return matchesTitle || matchesSubtitle;
    });
  }, [wishlistItems, activeCategory, searchQuery]);

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));

  // Reset pagination when category or search changes
  const handleCategoryChange = (category: CategoryFilter) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const wishlistEl = document.getElementById('wishlist');
    if (wishlistEl) {
      wishlistEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const itemsToDisplay = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /**
   * Generates readable window of page numbers with ellipsis markers (-1).
   */
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, -1, totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
  }, [currentPage, totalPages]);

  return (
    <section id="wishlist" className="scroll-mt-24 py-4 md:py-6">
      <SectionHeading
        title="Wishlist"
        badgeText="Lista de Desejos Categorizada"
        icon={<GiftIcon className="w-7 h-7" />}
        accessory={
          <span className="text-xs font-mono text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1.5 rounded-full">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
          </span>
        }
      />

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeCategory === category
                  ? 'bg-brand-primary text-white shadow-glow-blue'
                  : 'bg-brand-surface text-brand-textMuted hover:text-brand-accent hover:bg-brand-surfaceHover border border-brand-accent/15'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-textMuted">
            <SearchIcon className="w-4 h-4 text-brand-textMuted" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por título ou autor..."
            className="w-full pl-10 pr-4 py-2 bg-brand-surface rounded-xl border border-brand-accent/20 focus:border-brand-accent text-brand-text placeholder-brand-textMuted/60 text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all"
          />
        </div>
      </div>

      {/* Grid of Wishlist Cards */}
      {itemsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {itemsToDisplay.map((item) => (
            <a
              key={item.id}
              href={item.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-5 bg-brand-surface rounded-2xl border border-brand-accent/15 hover:border-brand-accent hover:shadow-card-hover transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.category === 'Livros' && (
                      <BookOpenIcon className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-accent">
                      {item.tag ?? item.category}
                    </span>
                    {item.isFulfilled && (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">
                        Adquirido
                      </span>
                    )}
                  </div>
                  <strong className="block text-sm font-bold text-brand-heading group-hover:text-brand-accent transition-colors truncate">
                    {item.title}
                  </strong>
                  {item.subtitle && (
                    <span className="block text-xs text-brand-textMuted truncate">
                      {item.subtitle}
                    </span>
                  )}
                </div>

                <div className="p-1.5 rounded-lg bg-brand-deep text-brand-textMuted group-hover:text-brand-accent border border-white/5 transition-colors">
                  <ExternalLinkIcon className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center rounded-2xl bg-brand-surface border border-dashed border-brand-accent/20">
          <BookOpenIcon className="w-10 h-10 text-brand-textMuted/50 mx-auto mb-3" />
          <p className="text-brand-textMuted text-sm font-medium">
            Nenhum item encontrado correspondente aos filtros atuais.
          </p>
        </div>
      )}

      {/* Numbered Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-brand-accent/15">
          <span className="text-xs font-mono text-brand-textMuted order-2 sm:order-1">
            Mostrando {Math.min(filteredItems.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}–
            {Math.min(filteredItems.length, currentPage * ITEMS_PER_PAGE)} de {filteredItems.length} itens (Página {currentPage} de {totalPages})
          </span>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-surface border border-brand-accent/20 text-brand-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-surfaceHover hover:border-brand-accent transition-all"
              aria-label="Página anterior"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Page number buttons */}
            {pageNumbers.map((page, idx) =>
              page === -1 ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs font-mono text-brand-textMuted">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-mono font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-brand-primary text-white shadow-glow-blue border border-cyan-400/50'
                      : 'bg-brand-surface text-brand-textMuted hover:text-brand-accent hover:bg-brand-surfaceHover border border-brand-accent/15'
                  }`}
                  aria-label={`Ir para a página ${page}`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-surface border border-brand-accent/20 text-brand-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-surfaceHover hover:border-brand-accent transition-all"
              aria-label="Próxima página"
            >
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
