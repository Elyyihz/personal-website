/**
 * TypeScript definitions for RAG knowledge management and conversational AI assistant.
 */

export interface RAGDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  chunk_count: number;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface RAGIngestPayload {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  sources?: string[];
  isStreaming?: boolean;
}

export interface ChatQueryPayload {
  session_id: string;
  message: string;
  history?: { role: string; content: string }[];
}

export interface ChatQueryResponse {
  session_id: string;
  answer: string;
  sources: string[];
}
