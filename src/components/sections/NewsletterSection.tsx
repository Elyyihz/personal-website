import React, { useState, useEffect } from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BookOpenIcon, ExternalLinkIcon, SparklesIcon } from '@/components/icons';
import { apiService } from '@/services/apiService';
import { Logger } from '@/utils/logger';

export interface NewsletterArticle {
  id: string;
  title: string;
  link: string;
  description: string;
  pub_date: string;
  author: string;
  tags: string[];
}

/**
 * Curated fallback articles for Elyy.init newsletter when database is empty or offline.
 */
const DEFAULT_ARTICLES: NewsletterArticle[] = [
  {
    id: 'art-1',
    title: 'Construindo RAG Resiliente com LangGraph e Qdrant',
    link: 'https://elyyihz.substack.com',
    description:
      'Uma análise profunda sobre roteamento multi-agente, chunking semântico e recuperação híbrida em grafos de decisão.',
    pub_date: '2026-03-15T10:00:00Z',
    author: 'Elynne Lima',
    tags: ['GenAI', 'LangGraph', 'Qdrant', 'Python'],
  },
  {
    id: 'art-2',
    title: 'Clean Architecture na Prática: Desacoplando Domínio de Frameworks',
    link: 'https://elyyihz.substack.com',
    description:
      'Como aplicar Ports & Adapters em projetos modernos, isolando regras de negócio de ORMs e APIs externas.',
    pub_date: '2026-02-28T14:30:00Z',
    author: 'Elynne Lima',
    tags: ['Clean Architecture', 'DDD', 'Design Patterns'],
  },
  {
    id: 'art-3',
    title: 'Por que o Linux e Zsh Continuam Sendo a Base do Meu Workflow',
    link: 'https://elyyihz.substack.com',
    description:
      'Reflexões sobre automação de ambientes, ergonomia de terminal, dotfiles versionados e eficiência no desenvolvimento.',
    pub_date: '2026-01-20T09:00:00Z',
    author: 'Elynne Lima',
    tags: ['Linux', 'Terminal', 'Developer Experience'],
  },
];

/**
 * Section component highlighting technical articles published in the Elyy.init newsletter.
 * Fetches dynamic syndicated articles with resilient curated fallbacks.
 */
export const NewsletterSection: React.FC = () => {
  const logger = new Logger('NewsletterSection');
  const [articles, setArticles] = useState<NewsletterArticle[]>(DEFAULT_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        logger.logStepStart('FetchArticles', { source: 'backend_api' });
        const data = await apiService.getNewsletterArticles();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setArticles(data);
          logger.logStepConclusion('FetchArticles', `Successfully loaded ${data.length} articles`);
        }
      } catch (err) {
        logger.logDecision('FallbackCuratedArticles', 'Backend newsletter feed unavailable, using local articles');
        logger.logError('Failed to fetch remote newsletter articles', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchArticles();

    return () => {
      isMounted = false;
    };
  }, [logger]);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section id="artigos" className="scroll-mt-24 py-4 md:py-6">
      <SectionHeading
        title="Alguns artigos da newsletter"
        badgeText="Elyy.init"
        icon={<BookOpenIcon className="w-7 h-7" />}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-brand-surface/50 border border-brand-accent/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group p-6 bg-brand-surface rounded-2xl border border-brand-accent/20 hover:border-brand-accent/60 transition-all flex flex-col justify-between hover:shadow-card-hover"
            >
              <div className="space-y-3">
                {/* Top Meta info */}
                <div className="flex items-center justify-between text-xs text-brand-textMuted font-mono">
                  <span className="flex items-center gap-1.5 text-brand-accent">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>{formatDate(article.pub_date)}</span>
                  </span>
                  <span>{article.author}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-brand-heading group-hover:text-brand-accent transition-colors leading-snug">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-brand-text/80 leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </div>

              {/* Bottom: Tags & Link */}
              <div className="pt-6 mt-4 border-t border-brand-accent/15 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-brand-deep border border-brand-accent/20 text-brand-textMuted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-deep hover:bg-brand-primary hover:text-white border border-brand-accent/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Ler Artigo Completo</span>
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
