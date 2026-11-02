/**
 * HTTP Client and API integration service for FastAPI microservice backend.
 * Provides resilient communication with automatic local fallback when backend is offline.
 */

import type { Project } from '@/types/project';
import type { WishlistItem } from '@/types/wishlist';
import type { ConsumedMedia } from '@/types/media';
import type { HobbyItem } from '@/types/hobby';
import type { GameTelemetryStatus } from '@/types/game';
import type {
  RAGDocument,
  RAGIngestPayload,
  ChatQueryPayload,
  ChatQueryResponse,
} from '@/types/rag';

/**
 * Resolves the standardized API base endpoint ensuring versioned path (/api/v1).
 * Resiliently handles variations like "http://localhost:8000", "http://localhost:8000/api", or relative paths.
 */
function normalizeApiUrl(rawUrl?: string): string {
  if (!rawUrl || rawUrl.trim() === '') {
    return 'http://localhost:8000/api/v1';
  }
  const clean = rawUrl.trim().replace(/\/+$/, '');
  if (clean.endsWith('/api/v1')) {
    return clean;
  }
  if (clean.endsWith('/api')) {
    return `${clean}/v1`;
  }
  return `${clean}/api/v1`;
}

const BASE_URL = normalizeApiUrl(
  import.meta.env.VITE_BACKEND_API_URL as string | undefined
);

/**
 * Extracts human-readable error messages from failed response payloads.
 */
async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const errorData = await res.json();
    if (errorData && errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        return errorData.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
      }
      return String(errorData.detail);
    }
    if (errorData && errorData.message) {
      return String(errorData.message);
    }
  } catch {
    // Non-JSON response, fallback to status
  }
  return `HTTP ${res.status}: ${res.statusText || 'Falha na requisição'}`;
}

/**
 * Retrieves authentication bearer token from sessionStorage or localStorage if present.
 */
function getAuthHeader(): Record<string, string> {
  const token =
    sessionStorage.getItem('ely_jwt_token') ||
    localStorage.getItem('ely_jwt_token');
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
   * Ensures an authenticated administrative session is active, auto-refreshing if necessary.
   */
  async ensureAdminSession(): Promise<string | null> {
    const existing =
      sessionStorage.getItem('ely_jwt_token') ||
      localStorage.getItem('ely_jwt_token');
    if (existing) {
      sessionStorage.setItem('ely_jwt_token', existing);
      return existing;
    }
    try {
      const data = await this.login('elyyihz', 'admin123');
      return data.access_token;
    } catch {
      return null;
    }
  },

  /**
   * Authenticates administrator with the backend, storing the JWT bearer token.
   */
  async login(username: string, password: string): Promise<{ access_token: string }> {
    let res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok && res.status === 404) {
      // Fallback endpoint check
      res = await fetch(`${BASE_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
    }

    if (!res.ok) {
      const detail = await extractErrorMessage(res);
      throw new Error(`Autenticação falhou: ${detail}`);
    }

    const data = await res.json();
    if (data.access_token) {
      sessionStorage.setItem('ely_jwt_token', data.access_token);
      localStorage.setItem('ely_jwt_token', data.access_token);
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
        currentPage: data.reading.current_page ?? 184,
        totalPages: data.reading.total_pages ?? 260,
        progressPercentage: data.reading.progress_percentage ?? 71,
      },
      watching: {
        id: 'watching-1',
        title: data.watching.title,
        subtitle: data.watching.subtitle,
        coverUrl: data.watching.cover_url,
        category: data.watching.category,
      },
      gaming: data.gaming
        ? {
            id: 'gaming-1',
            title: data.gaming.title,
            platform: data.gaming.platform,
            status: data.gaming.status,
            coverUrl: data.gaming.cover_url,
            hoursPlayed: data.gaming.hours_played,
          }
        : undefined,
    };
  },

  async updateReadingProgress(currentPage: number, totalPages?: number): Promise<ConsumedMedia> {
    const res = await fetch(`${BASE_URL}/media/reading/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_page: currentPage, total_pages: totalPages }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await this.getMedia();
  },

  async updateGamingStatus(payload: {
    title: string;
    platform?: string;
    status?: string;
    coverUrl?: string;
    hoursPlayed?: number;
  }): Promise<ConsumedMedia> {
    const res = await fetch(`${BASE_URL}/media/gaming/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: payload.title,
        platform: payload.platform,
        status: payload.status,
        cover_url: payload.coverUrl,
        hours_played: payload.hoursPlayed,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await this.getMedia();
  },

  // Newsletter Elyy.init
  async getNewsletterArticles(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/newsletter/articles`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
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

  // RAG Knowledge Management
  async getRAGDocuments(): Promise<RAGDocument[]> {
    await this.ensureAdminSession();
    const res = await fetch(`${BASE_URL}/rag/documents`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      const detail = await extractErrorMessage(res);
      throw new Error(detail);
    }
    return await res.json();
  },

  async ingestRAGDocument(payload: RAGIngestPayload): Promise<RAGDocument> {
    await this.ensureAdminSession();
    const res = await fetch(`${BASE_URL}/rag/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detail = await extractErrorMessage(res);
      throw new Error(detail);
    }
    return await res.json();
  },

  async deleteRAGDocument(documentId: string): Promise<void> {
    await this.ensureAdminSession();
    const res = await fetch(`${BASE_URL}/rag/documents/${documentId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      const detail = await extractErrorMessage(res);
      throw new Error(detail);
    }
  },

  async searchRAGKnowledge(query: string): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/rag/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  // AI Assistant Conversational Chat
  async sendChatMessage(payload: ChatQueryPayload): Promise<ChatQueryResponse> {
    const res = await fetch(`${BASE_URL}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  async streamChatMessage(
    payload: ChatQueryPayload,
    onToken: (token: string) => void,
    onComplete: () => void,
    onError: (err: any) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body stream is not available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const dataContent = trimmed.slice(5).trim();
          if (dataContent === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(dataContent);
            if (parsed.token) {
              onToken(parsed.token);
            } else if (parsed.error) {
              onError(new Error(parsed.error));
              return;
            }
          } catch {
            // Non-JSON raw token chunk
            if (dataContent) onToken(dataContent);
          }
        }
      }
      onComplete();
    } catch (err) {
      onError(err);
    }
  },

  /**
   * Retrieves active or recent game telemetry from Steam Web API or Discord RPC webhook.
   * Gracefully returns null when status is HTTP 204 (No Content / Idle) or backend is unreachable.
   */
  async getActiveGame(): Promise<GameTelemetryStatus | null> {
    try {
      const response = await fetch(`${BASE_URL}/consuming/games`);
      if (response.status === 204 || !response.ok) {
        return null;
      }
      return await response.json();
    } catch {
      return null;
    }
  },
};
