/**
 * Predefined taxonomy categories for personal wishlist items.
 */
export type WishlistCategory = 'Livros' | 'Tech' | 'Lifestyle & Geek';

/**
 * Individual item registered in the categorized wishlist.
 */
export interface WishlistItem {
  /** Deterministic identifier for list rendering and filtering keys */
  id: string;

  /** Primary item designation or book title */
  title: string;

  /** Supporting metadata such as author, edition, or technical specs */
  subtitle?: string;

  /** Taxonomy grouping classification */
  category: WishlistCategory;

  /** Destination URL to Amazon search, store product page, or marketplace */
  url?: string;

  /** Optional badge descriptor (e.g. 'Amazon', 'Colecionador', 'Indie') */
  tag?: string;

  /** Boolean flag indicating whether the item has already been acquired or fulfilled */
  isFulfilled?: boolean;
}
