import React, { useState, useMemo } from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import {
  GiftIcon,
  SearchIcon,
  ExternalLinkIcon,
  BookOpenIcon,
  ChevronRightIcon,
} from '@/components/icons';
import { useData } from '@/context/DataContext';
import type { WishlistCategory, WishlistItem } from '@/types/wishlist';

type CategoryFilter = 'Todos' | WishlistCategory;

const PAGE_SIZE = 12;

/**
 * Categorized Wishlist section integrating the Amazon book collection and wishlist items.
 * Includes interactive category switching, instant title/author search, and pagination.
 */
export const WishlistSection: React.FC = () => {
  const { wishlistItems } = useData();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

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
  }, [activeCategory, searchQuery]);

  // Reset pagination when category or search changes
  const handleCategoryChange = (category: CategoryFilter) => {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const itemsToDisplay = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <section id="wishlist" className="scroll-mt-28 py-12">
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

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-surface hover:bg-brand-surfaceHover border border-brand-accent/30 hover:border-brand-accent transition-all shadow-sm hover:shadow-glow-cyan"
          >
            <span>Carregar Mais ({filteredItems.length - visibleCount} restantes)</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
