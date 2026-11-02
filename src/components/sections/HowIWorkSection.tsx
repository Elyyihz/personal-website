import React, { useState } from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import {
  HexagonIcon,
  CodeIcon,
  ChevronDownIcon,
  CheckIcon,
} from '@/components/icons';

/**
 * Condensed data structure for Clean Architecture layers.
 */
interface CleanArchLayerItem {
  number: string;
  name: string;
  badge: string;
  summary: string;
  rules: string[];
  repoExample: string;
}

const CLEAN_ARCH_LAYERS: CleanArchLayerItem[] = [
  {
    number: '01',
    name: 'Domínio & Entidades',
    badge: 'Enterprise Rules',
    summary: 'Modelagem do coração do sistema com regras puras e invariantes de negócio.',
    rules: [
      'Zero dependência de bibliotecas externas, drivers ou frameworks HTTP.',
      'Validação de consistência e invariantes no próprio construtor da entidade.',
    ],
    repoExample: 'GameStatus, ConsumedMedia, RAGDocument',
  },
  {
    number: '02',
    name: 'Portas & Gateways',
    badge: 'Dependency Inversion',
    summary: 'Contratos e interfaces abstratas que invertem o acoplamento com a infraestrutura.',
    rules: [
      'A interface define o "o quê" o domínio necessita, nunca o "como".',
      'Permite testes com dublês e troca de fornecedor sem alterar o core.',
    ],
    repoExample: 'SteamGatewayInterface, MediaRepositoryInterface',
  },
  {
    number: '03',
    name: 'Casos de Uso (Aplicação)',
    badge: 'Application Rules',
    summary: 'Orquestração de regras de negócio, fluxos de dados e grafos de inferência.',
    rules: [
      'Depende exclusivamente das portas abstratas, sem conhecer implementações concretas.',
      'Execução idempotente com logging de etapas e decisões de fluxo.',
    ],
    repoExample: 'GetCurrentGameUseCase, LangGraphRAGChatUseCase',
  },
  {
    number: '04',
    name: 'Adaptadores de Infraestrutura',
    badge: 'Interface Adapters',
    summary: 'Implementações concretas de persistência, clientes HTTP e conexões externas.',
    rules: [
      'Clientes reais para Steam Web API, Qdrant, Google Gemini e PostgreSQL.',
      'Isola particularidades de bibliotecas de terceiros da aplicação.',
    ],
    repoExample: 'SteamWebAPIGateway, SqlAlchemyMediaRepository',
  },
  {
    number: '05',
    name: 'Fronteira Externa (API & UI)',
    badge: 'Frameworks & Drivers',
    summary: 'Ponto de entrada do sistema: roteamento HTTP, streaming e renderização reativa.',
    rules: [
      'Roteadores FastAPI com validação estrita de schemas Pydantic.',
      'Interface em React 18, TypeScript e Tailwind CSS desacoplada do backend.',
    ],
    repoExample: 'games_router.py, LiveTelemetryCarousel.tsx',
  },
];

/**
 * Condensed data structure for Code Review taxonomy levels.
 */
interface CodeReviewLevelItem {
  id: string;
  tag: string;
  impact: string;
  badgeStyle: string;
  borderStyle: string;
  summary: string;
  rules: string[];
}

const CODE_REVIEW_LEVELS: CodeReviewLevelItem[] = [
  {
    id: 'blocking',
    tag: '[Bloqueante]',
    impact: 'Impede o merge imediatamente',
    badgeStyle: 'bg-red-950/70 text-red-300 border-red-500/40',
    borderStyle: 'border-red-500/30',
    summary: 'Falhas críticas arquiteturais, de segurança ou de conformidade com contratos.',
    rules: [
      'Violação da Regra de Dependência (ex: Domínio importando framework).',
      'Quebra de contrato de API, schemas OpenAPI sem versionamento ou falta de testes.',
    ],
  },
  {
    id: 'pre-merge',
    tag: '[Antes do merge]',
    impact: 'Exige resolução antes da conclusão',
    badgeStyle: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
    borderStyle: 'border-amber-500/30',
    summary: 'Débito técnico relevante, falta de disciplina de código limpo ou rastreabilidade.',
    rules: [
      'Ausência de logs em pontos de decisão de negócio ou rejeição de parâmetros.',
      'Aninhamentos desnecessários onde cláusulas de guarda simplificam o fluxo.',
    ],
  },
  {
    id: 'non-blocking',
    tag: '[Não bloqueia]',
    impact: 'Sugestão evolutiva opcional',
    badgeStyle: 'bg-sky-950/70 text-sky-300 border-sky-500/40',
    borderStyle: 'border-sky-500/30',
    summary: 'Oportunidades de refatoração futura e refinamentos idiomáticos não urgentes.',
    rules: [
      'Otimizações antecipadas onde a volumetria atual não apresenta gargalo.',
      'Enriquecimento de comentários contextuais no padrão "Explain why".',
    ],
  },
  {
    id: 'nits',
    tag: '[Nits]',
    impact: 'Ajuste cosmético menor',
    badgeStyle: 'bg-slate-800/70 text-slate-300 border-slate-600/40',
    borderStyle: 'border-white/10',
    summary: 'Polimento puramente visual ou de formatação a critério do autor.',
    rules: [
      'Pequenas correções tipográficas em docstrings ou documentação técnica.',
      'Quebras de linha secundárias ou alinhamento vertical estético.',
    ],
  },
];

/**
 * How I Work Section documenting Clean Architecture and Code Review practices.
 * Utilizes collapsible accordion elements (sanfonas) to keep the information concise and scannable.
 */
export const HowIWorkSection: React.FC = () => {
  // Accordion state: index of active layer (null if closed)
  const [openLayer, setOpenLayer] = useState<number | null>(0);
  // Accordion state: id of active review level (null if closed)
  const [openReview, setOpenReview] = useState<string | null>('blocking');

  const toggleLayer = (index: number) => {
    setOpenLayer((prev) => (prev === index ? null : index));
  };

  const toggleReview = (id: string) => {
    setOpenReview((prev) => (prev === id ? null : id));
  };

  return (
    <section id="how-i-work" className="scroll-mt-24 py-4 md:py-6">
      <SectionHeading
        title="How I Work"
        badgeText="Clean Architecture & Code Review"
        icon={<HexagonIcon className="w-7 h-7" />}
      />

      {/* Structured 2-Column Accordion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1: Clean Architecture (Sanfona das 5 Camadas) */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <HexagonIcon className="w-5 h-5 text-brand-accent" />
              <div>
                <h3 className="text-base font-bold text-brand-heading">
                  Clean Architecture &amp; DDD
                </h3>
                <p className="text-xs text-brand-textMuted">
                  Regra de Dependência: do centro para a borda.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/25 text-brand-accent">
              5 Camadas
            </span>
          </div>

          {/* Accordion List (Sanfona) */}
          <div className="space-y-2.5">
            {CLEAN_ARCH_LAYERS.map((layer, idx) => {
              const isOpen = openLayer === idx;

              return (
                <div
                  key={layer.number}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-brand-accent/50 bg-brand-deep/70 shadow-sm'
                      : 'border-white/5 bg-brand-deep/30 hover:border-brand-accent/30'
                  }`}
                >
                  {/* Accordion Header / Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleLayer(idx)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                          isOpen
                            ? 'bg-brand-accent/20 text-brand-accent'
                            : 'bg-white/5 text-brand-textMuted'
                        }`}
                      >
                        {layer.number}
                      </span>
                      <span
                        className={`text-sm font-semibold truncate ${
                          isOpen ? 'text-brand-heading' : 'text-brand-text'
                        }`}
                      >
                        {layer.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="hidden sm:inline text-[10px] font-mono text-brand-textMuted">
                        {layer.badge}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 text-brand-accent transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Accordion Collapsible Body */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/5 text-xs animate-fadeIn">
                      <p className="text-brand-text/90 leading-relaxed">
                        {layer.summary}
                      </p>

                      <div className="space-y-1.5 pl-1">
                        {layer.rules.map((rule, i) => (
                          <div key={i} className="flex items-start gap-2 text-brand-textMuted">
                            <CheckIcon className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-[11px] font-mono border-t border-white/5 text-brand-textMuted">
                        <span className="text-brand-accent font-semibold">Exemplos: </span>
                        <span className="text-brand-heading">{layer.repoExample}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Code Review Taxonomy (Sanfona dos 4 Níveis) */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-accent/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <CodeIcon className="w-5 h-5 text-brand-accent" />
              <div>
                <h3 className="text-base font-bold text-brand-heading">
                  Taxonomia de Code Review
                </h3>
                <p className="text-xs text-brand-textMuted">
                  Previsibilidade e rigor na revisão de pull requests.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/25 text-brand-accent">
              4 Níveis
            </span>
          </div>

          {/* Accordion List (Sanfona) */}
          <div className="space-y-2.5">
            {CODE_REVIEW_LEVELS.map((level) => {
              const isOpen = openReview === level.id;

              return (
                <div
                  key={level.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? `${level.borderStyle} bg-brand-deep/70 shadow-sm`
                      : 'border-white/5 bg-brand-deep/30 hover:border-white/20'
                  }`}
                >
                  {/* Accordion Header / Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleReview(level.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${level.badgeStyle}`}
                      >
                        {level.tag}
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isOpen ? 'text-brand-heading' : 'text-brand-text'
                        }`}
                      >
                        {level.impact}
                      </span>
                    </div>

                    <ChevronDownIcon
                      className={`w-4 h-4 text-brand-accent transition-transform duration-300 flex-shrink-0 ml-2 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {/* Accordion Collapsible Body */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/5 text-xs animate-fadeIn">
                      <p className="text-brand-text/90 leading-relaxed">
                        {level.summary}
                      </p>

                      <div className="space-y-1.5 pl-1">
                        {level.rules.map((rule, i) => (
                          <div key={i} className="flex items-start gap-2 text-brand-textMuted">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/70 shrink-0 mt-1.5" />
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
