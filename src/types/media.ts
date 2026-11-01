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
  currentPage?: number;
  totalPages?: number;
  progressPercentage?: number;
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
 * Contract representing the active video game card in the consuming section.
 */
export interface GamingItem {
  id: string;
  title: string;
  platform: string;
  status: string;
  coverUrl: string;
  hoursPlayed?: number;
}

/**
 * Aggregated consumed media model supporting dynamic management.
 */
export interface ConsumedMedia {
  reading: ReadingItem;
  watching: WatchingItem;
  gaming?: GamingItem;
}
