/**
 * Contract representing the currently reading book item in the consuming section.
 */
export interface ReadingItem {
  id: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  referenceUrl: string;
  status: string;
}

/**
 * Contract representing the watching media card in the consuming section.
 */
export interface WatchingItem {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  category: string;
}

/**
 * Aggregated consumed media model supporting dynamic management.
 */
export interface ConsumedMedia {
  reading: ReadingItem;
  watching: WatchingItem;
}
