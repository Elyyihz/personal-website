import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BookOpenIcon, ExternalLinkIcon, SparklesIcon } from '@/components/icons';
import { useData } from '@/context/DataContext';

/**
 * Section component highlighting technical articles published in the Elyy.init newsletter.
 * Dynamically rendered from DataContext with visibility controls and custom URLs.
 */
export const NewsletterSection: React.FC = () => {
  const { articles } = useData();

  // Filter only articles marked as visible by the administrator
  const visibleArticles = articles.filter((article) => article.visible !== false);

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
        accessory={
          <span className="text-xs font-mono text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1.5 rounded-full">
            {visibleArticles.length} {visibleArticles.length === 1 ? 'publicação' : 'publicações'}
          </span>
        }
      />

      {visibleArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleArticles.map((article) => (
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
      ) : (
        <div className="py-12 text-center rounded-2xl bg-brand-surface border border-dashed border-brand-accent/20">
          <BookOpenIcon className="w-10 h-10 text-brand-textMuted/50 mx-auto mb-3" />
          <p className="text-brand-textMuted text-sm font-medium">
            Nenhum artigo marcado como visível no momento.
          </p>
        </div>
      )}
    </section>
  );
};
