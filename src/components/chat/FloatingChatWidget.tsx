import React, { useState, useEffect, useRef } from 'react';
import {
  SparklesIcon,
  CloseIcon,
  RefreshIcon,
  UserIcon,
} from '@/components/icons';
import { apiService } from '@/services/apiService';
import type { ChatMessage } from '@/types/rag';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    'Olá! Sou a assistente de IA oficial do portfólio de Elynne Lima. ' +
    'Estou aqui para tirar dúvidas sobre projetos (SAED, MAIA, DocChecker), ' +
    'artigos técnicos da Elyy.init, Clean Architecture e trajetória profissional. Como posso ajudar?',
};

const QUICK_PROMPTS = [
  'Quem é a Elynne e quais suas principais skills?',
  'Como funciona o projeto DocChecker?',
  'Me explique a arquitetura do orquestrador MAIA',
  'O que aborda o artigo de Clean Architecture na Elyy.init?',
];

function getOrCreateSessionId(): string {
  const existing = sessionStorage.getItem('elyy_assistant_session_id');
  if (existing) return existing;
  const newId = `session-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`;
  sessionStorage.setItem('elyy_assistant_session_id', newId);
  return newId;
}

/**
 * Public Floating Chat Widget with real-time SSE streaming from FastAPI backend.
 * Adheres strictly to Zero Emoji rules, Clean Architecture, and visitor session context.
 */
export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('elyy_assistant_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [INITIAL_WELCOME_MESSAGE];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState<string>(getOrCreateSessionId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('elyy_assistant_chat_history', JSON.stringify(messages));
    } catch {
      // Storage quota or restriction fallback
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isStreaming]);

  const handleResetSession = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    sessionStorage.removeItem('elyy_assistant_chat_history');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isStreaming) return;

    setInputMessage('');
    const userMsg: ChatMessage = { role: 'user', content: query };

    // Format historical messages for API payload
    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Placeholder assistant message for typewriter stream
    const assistantPlaceholder: ChatMessage = {
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
    setIsStreaming(true);

    let accumulatedContent = '';

    await apiService.streamChatMessage(
      {
        session_id: sessionId,
        message: query,
        history: historyPayload,
      },
      (token: string) => {
        accumulatedContent += token;
        setMessages((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0 && next[lastIdx].role === 'assistant') {
            next[lastIdx] = {
              ...next[lastIdx],
              content: accumulatedContent,
              isStreaming: true,
            };
          }
          return next;
        });
      },
      () => {
        // Stream completed
        setMessages((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0 && next[lastIdx].role === 'assistant') {
            next[lastIdx] = {
              ...next[lastIdx],
              content: accumulatedContent,
              isStreaming: false,
            };
          }
          return next;
        });
        setIsStreaming(false);
      },
      async (err: any) => {
        console.warn('SSE Streaming failed; attempting sync fallback:', err);
        try {
          const syncRes = await apiService.sendChatMessage({
            session_id: sessionId,
            message: query,
            history: historyPayload,
          });
          setMessages((prev) => {
            const next = [...prev];
            const lastIdx = next.length - 1;
            if (lastIdx >= 0 && next[lastIdx].role === 'assistant') {
              next[lastIdx] = {
                role: 'assistant',
                content: syncRes.answer,
                sources: syncRes.sources,
                isStreaming: false,
              };
            }
            return next;
          });
        } catch (syncErr: any) {
          setMessages((prev) => {
            const next = [...prev];
            const lastIdx = next.length - 1;
            if (lastIdx >= 0 && next[lastIdx].role === 'assistant') {
              next[lastIdx] = {
                role: 'assistant',
                content:
                  'Desculpe, ocorreu uma instabilidade na conexão com o assistente de IA. ' +
                  'Por favor, tente novamente em instantes.',
                isStreaming: false,
              };
            }
            return next;
          });
        } finally {
          setIsStreaming(false);
        }
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-brand-surfaceHover/95 hover:bg-brand-surface border border-brand-accent/40 hover:border-brand-accent shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105"
            aria-label="Abrir assistente de IA"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent" />
            </span>
            <SparklesIcon className="w-5 h-5 text-brand-accent group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xs font-bold text-brand-heading">
              Pergunte à IA
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-brand-deep/95 border border-brand-accent/30 rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-brand-surface border-b border-brand-accent/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-heading flex items-center gap-1.5">
                  <span>Elyy Assistant</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    Online
                  </span>
                </h4>
                <p className="text-[10px] text-brand-textMuted">
                  Assistente Inteligente
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetSession}
                className="p-1.5 rounded-lg text-brand-textMuted hover:text-brand-heading bg-transparent hover:bg-brand-surfaceHover transition-colors"
                title="Reiniciar conversa"
              >
                <RefreshIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-brand-textMuted hover:text-brand-heading bg-transparent hover:bg-brand-surfaceHover transition-colors"
                title="Minimizar chat"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent shrink-0 mt-0.5">
                    <SparklesIcon className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-accent/20 border border-brand-accent/40 text-brand-heading rounded-tr-sm'
                      : 'bg-brand-surface border border-white/5 text-brand-text rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' && msg.isStreaming && !msg.content ? (
                    <div className="flex items-center gap-1.5 py-1 px-1">
                      <span className="w-2 h-2 rounded-full bg-brand-accent animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-brand-accent animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">
                      {msg.content}
                      {msg.isStreaming && (
                        <span className="inline-block w-1.5 h-3 ml-1 bg-brand-accent animate-pulse align-middle" />
                      )}
                    </p>
                  )}

                  {/* Sources pills if present */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-brand-textMuted font-mono">Fontes:</span>
                      {msg.sources.map((src, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-deep border border-brand-accent/20 text-brand-accent"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-brand-surface border border-white/10 flex items-center justify-center text-brand-textMuted shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          {messages.length <= 2 && !isStreaming && (
            <div className="px-4 py-2 border-t border-white/5 bg-brand-surface/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full text-[10px] text-brand-textMuted hover:text-brand-accent bg-brand-deep hover:bg-brand-surface border border-white/5 hover:border-brand-accent/30 shrink-0 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-brand-surface border-t border-brand-accent/20 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              placeholder={isStreaming ? 'Gerando resposta...' : 'Digite sua pergunta sobre a Elynne...'}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-brand-deep border border-white/10 text-brand-heading placeholder:text-brand-textMuted/40 focus:outline-none focus:border-brand-accent disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isStreaming}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-brand-deep bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-brand-accent/20"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
