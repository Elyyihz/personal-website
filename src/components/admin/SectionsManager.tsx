import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { SECTIONS_CATALOG, type SectionKey } from '@/types/section';
import {
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  SparklesIcon,
} from '@/components/icons';

/**
 * Sections Visibility Manager interface for the administrative control panel.
 * Enables granular toggling of each semantic section of the portfolio without deleting any data.
 */
export const SectionsManager: React.FC = () => {
  const { sectionVisibility, toggleSectionVisibility, updateSectionVisibility } = useData();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const activeCount = Object.values(sectionVisibility).filter(Boolean).length;
  const totalCount = SECTIONS_CATALOG.length;

  const showToast = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleToggle = (id: SectionKey, label: string) => {
    const nextState = !sectionVisibility[id];
    toggleSectionVisibility(id);
    showToast(`Seção "${label}" agora está ${nextState ? 'visível' : 'oculta'} no site.`);
  };

  const handleShowAll = () => {
    updateSectionVisibility({
      hero: true,
      about: true,
      consuming: true,
      projects: true,
      newsletter: true,
      howIWork: true,
      wishlist: true,
      contacts: true,
    });
    showToast('Todas as seções foram definidas como visíveis no site.');
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-accent/15">
        <div>
          <h4 className="text-lg font-bold text-brand-heading flex items-center gap-2">
            <span>Visibilidade das Seções do Site</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
              {activeCount} de {totalCount} ativas
            </span>
          </h4>
          <p className="text-xs text-brand-textMuted mt-0.5">
            Oculte ou exiba seções inteiras na página principal sem perder ou apagar nenhum dado cadastrado.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShowAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-surface hover:bg-brand-surfaceHover text-brand-text hover:text-cyan-400 border border-brand-accent/20 rounded-xl text-xs font-semibold transition-all"
          >
            <EyeIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exibir Todas</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {feedbackMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Information Banner */}
      <div className="p-4 bg-brand-surface/70 border border-brand-accent/20 rounded-2xl flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-cyan-400 shrink-0 mt-0.5">
          <SparklesIcon className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <p className="font-semibold text-brand-heading">
            Como funciona a alternância de visibilidade:
          </p>
          <p className="text-brand-textMuted leading-relaxed">
            Ao desativar uma seção (por exemplo, a Wishlist), ela deixa de ser renderizada na página principal e seu link de navegação é automaticamente removido do menu superior. Todo o catálogo de itens, livros e configurações permanece 100% preservado no banco e no painel para quando você desejar reativá-la.
          </p>
        </div>
      </div>

      {/* Sections Grid / List */}
      <div className="space-y-3">
        {SECTIONS_CATALOG.map((sec, index) => {
          const isVisible = sectionVisibility[sec.id];

          return (
            <div
              key={sec.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isVisible
                  ? 'bg-brand-surface border-brand-accent/20 hover:border-brand-accent/40 shadow-sm'
                  : 'bg-brand-deep/80 border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                    isVisible
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-500'
                  }`}
                >
                  {isVisible ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-deep border border-brand-accent/20 text-brand-textMuted">
                      #{index + 1}
                    </span>
                    <strong className="text-sm font-bold text-brand-heading truncate">
                      {sec.label}
                    </strong>
                    <span className="text-[10px] font-mono text-brand-textMuted/80">
                      {sec.anchor}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                        isVisible
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {isVisible ? 'Visível no Site' : 'Oculta'}
                    </span>
                  </div>
                  <p className="text-xs text-brand-textMuted leading-relaxed">
                    {sec.description}
                  </p>
                </div>
              </div>

              {/* Action Toggle Button */}
              <div className="flex items-center gap-2 shrink-0 sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggle(sec.id, sec.label)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    isVisible
                      ? 'bg-brand-surfaceHover border-white/10 text-brand-text hover:text-amber-400 hover:border-amber-500/30'
                      : 'bg-brand-primary text-white border-brand-primary hover:bg-brand-primaryHover shadow-glow-blue'
                  }`}
                >
                  {isVisible ? (
                    <>
                      <EyeOffIcon className="w-4 h-4 text-amber-400" />
                      <span>Ocultar Seção</span>
                    </>
                  ) : (
                    <>
                      <EyeIcon className="w-4 h-4 text-white" />
                      <span>Tornar Visível</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
