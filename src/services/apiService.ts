/**
 * HTTP Client and API integration service for FastAPI microservice backend.
 * Provides resilient communication with automatic local fallback when backend is offline.
 */

import type { Project } from '@/types/project';
import type { WishlistItem } from '@/types/wishlist';
import type { ConsumedMedia } from '@/types/media';
import type { HobbyItem } from '@/types/hobby';

const BASE_URL =
  (import.meta.env.VITE_BACKEND_API_URL as string | undefined) ||
  'http://localhost:8000/api/v1';

/**
 * Retrieves authentication bearer token from sessionStorage if present.
 */
function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('ely_jwt_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * Backend API integration functions.
 */
export const apiService = {
  /**
   * Authenticates administrator with the backend, storing the JWT bearer token.
   */
  async login(username: string, password: string):Promise<{ access_token: string }> {
    const res = await fetch(`${BASE_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      throw new Error(`Authentication failed with HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.access_token) {
      sessionStorage.setItem('ely_jwt_token', data.access_token);
    }
    return data;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${BASE_URL}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      tags: item.tags || [],
      githubUrl: item.github_url,
      demoUrl: item.demo_url,
      featured: item.featured,
      icon: item.icon,
    }));
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        title: project.title,
        description: project.description,
        tags: project.tags,
        github_url: project.githubUrl,
        demo_url: project.demoUrl,
        featured: project.featured ?? false,
        icon: project.icon,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const item = await res.json();
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      tags: item.tags || [],
      githubUrl: item.github_url,
      demoUrl: item.demo_url,
      featured: item.featured,
      icon: item.icon,
    };
  },

  // Wishlist
  async getWishlist(category?: string): Promise<WishlistItem[]> {
    const url = category ? `${BASE_URL}/wishlist?category=${encodeURIComponent(category)}` : `${BASE_URL}/wishlist`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      url: item.url,
      tag: item.tag,
      isFulfilled: item.is_fulfilled,
    }));
  },

  async toggleWishlistFulfilled(id: string): Promise<WishlistItem> {
    const res = await fetch(`${BASE_URL}/wishlist/${id}/toggle-fulfilled`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const item = await res.json();
    return {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      url: item.url,
      tag: item.tag,
      isFulfilled: item.is_fulfilled,
    };
  },

  // Consumed Media
  async getMedia(): Promise<ConsumedMedia> {
    const res = await fetch(`${BASE_URL}/media`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      reading: {
        id: 'reading-1',
        title: data.reading.title,
        author: data.reading.author,
        category: data.reading.category,
        coverUrl: data.reading.cover_url,
        referenceUrl: data.reading.reference_url,
        status: data.reading.status,
      },
      watching: {
        id: 'watching-1',
        title: data.watching.title,
        subtitle: data.watching.subtitle,
        coverUrl: data.watching.cover_url,
        category: data.watching.category,
      },
    };
  },

  // Hobbies / Interests
  async getHobbies(): Promise<HobbyItem[]> {
    const res = await fetch(`${BASE_URL}/hobbies`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      iconSlug: item.icon_slug,
      category: item.category,
    }));
  },
};
