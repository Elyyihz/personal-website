/**
 * Contract representing an interest, hobby, or affinity item.
 * Managed dynamically via the Admin Dashboard and FastAPI backend.
 */
export interface HobbyItem {
  id: string;
  name: string;
  iconSlug: string;
  category: string;
}

export type InterestItem = HobbyItem;
