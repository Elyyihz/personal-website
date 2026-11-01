import React, { useState } from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import {
  CodeIcon,
  HexagonIcon,
  CheckIcon,
} from '@/components/icons';

interface CleanArchLayer {
  number: string;
  name: string;
  subtitle: string;
  responsibility: string;
  invariants: string[];
  techExample: string;
}

const CLEAN_ARCH_LAYERS: CleanArchLayer[] = [
  {
    number: '01',
    name: 'Domínio & Entidades',
    subtitle: 'Enterprise Business Rules',
    responsibility: 'O coração da aplicação. Modela agregados, value objects e validações invariantes de negócio.',
    invariants: [
      'Zero dependência de bibliotecas externas, drivers ou frameworks HTTP',
      'Invariantes validadas no construtor via exceções puras de domínio',
      'Regras imutáveis de negócio e cálculo de pontuação de paridade',
    ],
    techExample: 'ConsumedMedia, RAGDocument, DocumentChunk, Article',
  },
  {
    number: '02',
    name: 'Portas & Gateways (Abstração)',
    subtitle: 'Dependency Inversion Principle',
    responsibility: 'Contratos e interfaces abstratas (ports) que invertem a direção de dependência com a infraestrutura.',
    invariants: [
      'Interfaces definem o QUE o domínio precisa, nunca o COMO',
      'Permite troca de tecnologia sem alterar uma única linha de regra de negócio',
      'Mocking e testabilidade em isolamento sem conexões com bancos reais',
    ],
    techExample: 'VectorStoreRepository, LLMGatewayInterface, ArticleRepository',
  },
  {
    number: '03',
    name: 'Casos de Uso (Aplicação)',
    subtitle: 'Application Business Rules',
    responsibility: 'Orquestração de fluxos de negócio, processamento de DTOs, segmentação recursiva e grafos LangGraph.',
    invariants: [
      'Orquestra o grafo determinístico de execução do RAG',
      'Segmenta blocos de texto respeitando fronteiras semânticas e overlap',
      'Execução idempotente com logs rastreáveis de decisões e rejeições',
    ],
    techExample: 'LangGraphRAGChatUseCase, IngestRAGDocumentUseCase, SyncNewsletterFeedUseCase',
  },
  {
    number: '04',
    name: 'Adaptadores de Infraestrutura',
    subtitle: 'Interface Adapters & Persistence',
    responsibility: 'Implementações concretas que conectam as portas abstratas aos sistemas reais e serviços de nuvem.',
    invariants: [
      'Qdrant Vector Store para busca densa por cosseno (768 dimensões)',
      'Google Gemini GenAI SDK para embeddings e inferência conversacional',
      'SQLAlchemy 2.0 ORM conectando PostgreSQL em produção e SQLite em testes',
    ],
    techExample: 'QdrantVectorStoreAdapter, GeminiLLMGateway, SqlAlchemyArticleRepository',
  },
  {
    number: '05',
    name: 'Fronteira Externa (API & UI)',
    subtitle: 'Frameworks, Drivers & Devices',
    responsibility: 'A camada mais externa e descartável do sistema, responsável pela comunicação HTTP e renderização visual.',
    invariants: [
      'Endpoints FastAPI tipados com validação Pydantic estrita',
      'Streaming Server-Sent Events (SSE) para efeito typewriter em tempo real',
      'Interface reativa em React 18, TypeScript estrito e Tailwind CSS',
    ],
    techExample: 'chat_router.py, rag_router.py, FloatingChatWidget.tsx, RAGIngestionManager.tsx',
  },
];

interface ReviewLevel {
  tag: string;
  colorBadge: string;
  colorBorder: string;
  colorBg: string;
  title: string;
  description: string;
  criteria: string[];
}

const CODE_REVIEW_LEVELS: ReviewLevel[] = [
  {
    tag: '[Bloqueante]',
    colorBadge: 'bg-red-950/80 text-red-300 border-red-500/50',
    colorBorder: 'border-red-500/40 hover:border-red-500/70',
    colorBg: 'bg-red-950/20',
    title: 'Impede o Merge Imediatamente',
    description: 'Falhas críticas arquiteturais, de segurança ou de corretude que violam as premissas inegociáveis do sistema.',
    criteria: [
      'Violação da Regra de Dependência (ex: Domínio importando FastAPI, SQLAlchemy ou SDKs)',
      'Quebra de retrocompatibilidade de contrato de API (schemas OpenAPI/JSON alterados sem versionamento)',
      'Vazamento de credenciais, chaves de API ou ausência de validações de acesso administrativo',
      'Ausência de cobertura de testes unitários ou de integração em novos fluxos críticos de negócio',
    ],
  },
  {
    tag: '[Antes do merge / Pontos Cruciais]',
    colorBadge: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
    colorBorder: 'border-amber-500/40 hover:border-amber-500/70',
    colorBg: 'bg-amber-950/20',
    title: 'Exige Resolução Antes do Merge',
    description: 'Débito técnico relevante, falta de disciplina de código limpo ou ausência de observabilidade operacional.',
    criteria: [
      'Ausência de logs em pontos de decisão de negócio ou rejeição de parâmetros (regra de rastreabilidade)',
      'Aninhamento profundo de if/else onde cláusulas de guarda (Beck\'s tidies) simplificam o fluxo',
      'Uso de tipagem opaca (any não justificado) ou ausência de JSDocs/Google-style docstrings completas',
      'Tratamento genérico de exceções que mascare causas raiz em chamadas assíncronas',
    ],
  },
  {
    tag: '[Não bloqueia]',
    colorBadge: 'bg-sky-950/80 text-sky-300 border-sky-500/50',
    colorBorder: 'border-sky-500/40 hover:border-sky-500/70',
    colorBg: 'bg-sky-950/20',
    title: 'Sugestão Evolutiva Opcional',
    description: 'Oportunidades de refatoração futura, simplificações idiomáticas ou enriquecimento de documentação.',
    criteria: [
      'Sugestão de otimização de queries ou loops onde a volumetria atual não apresenta gargalo',
      'Ideias de abstração futura que ainda não possuem dois consumidores concretos ativos',
      'Enriquecimento de comentários contextuais de negócio no padrão "Explain why, not what"',
      'Sugestão de nomenclatura alternativa que seja ligeiramente mais expressiva',
    ],
  },
  {
    tag: '[Nits]',
    colorBadge: 'bg-slate-800/80 text-slate-300 border-slate-600/50',
    colorBorder: 'border-white/10 hover:border-white/25',
    colorBg: 'bg-slate-900/30',
    title: 'Ajuste Cosmético Menor',
    description: 'Polimento puramente visual ou de formatação que o autor pode aplicar livremente a seu critério.',
    criteria: [
      'Quebras de linha secundárias ou alinhamento vertical em declarações extensas',
      'Pequenas correções tipográficas em docstrings ou documentações técnicas internas',
      'Agrupamento estético de imports alfabéticos quando o linter não acusa erro',
      'Ajustes de pontuação em descrições de parâmetros',
    ],
  },
];

/**
 * How I Work Section documenting Clean Architecture, Domain-Driven Design (DDD),
 * and the 4-Level Code Review Taxonomy.
 */
export const HowIWorkSection: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(0);

  return (
    <section id="how-i-work" className="py-4 md:py-6">
      <SectionHeading
        title="How I Work"
        badgeText="Clean Architecture, DDD & Code Review"
        icon={<HexagonIcon className="w-7 h-7" />}
      />

      <div className="space-y-12">
        {/* Sub-section 1: Clean Architecture & DDD Flow */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-bold text-brand-heading flex items-center gap-2">
                <HexagonIcon className="w-4 h-4 text-brand-accent" />
                <span>Fluxo Arquitetural: Clean Architecture &amp; Domain-Driven Design</span>
              </h3>
              <p className="text-xs text-brand-textMuted mt-1">
                A Regra de Dependência: Camadas internas desconhecem detalhes externos.
              </p>
            </div>
            <div className="text-[11px] font-mono px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent self-start sm:self-auto">
              Escrita: Dentro para Fora • Leitura: Fora para Dentro
            </div>
          </div>

          {/* Interactive Layers Step Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CLEAN_ARCH_LAYERS.map((layer, idx) => (
              <button
                key={layer.number}
                type="button"
                onClick={() => setSelectedLayer(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedLayer === idx
                    ? 'bg-brand-surface border-brand-accent shadow-lg shadow-brand-accent/10'
                    : 'bg-brand-deep/80 border-white/5 hover:border-white/20 text-brand-textMuted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${selectedLayer === idx ? 'text-brand-accent' : 'text-brand-textMuted'}`}>
                    {layer.number}
                  </span>
                  {selectedLayer === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                  )}
                </div>
                <div className="mt-2">
                  <span className={`text-xs font-bold block ${selectedLayer === idx ? 'text-brand-heading' : 'text-brand-text'}`}>
                    {layer.name}
                  </span>
                  <span className="text-[10px] text-brand-textMuted line-clamp-1">
                    {layer.subtitle}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Active Layer Card */}
          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none text-8xl font-black font-mono">
              {CLEAN_ARCH_LAYERS[selectedLayer].number}
            </div>

            <div className="space-y-4 max-w-3xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-accent/15 text-brand-accent border border-brand-accent/30 font-bold">
                    Camada {CLEAN_ARCH_LAYERS[selectedLayer].number}
                  </span>
                  <span className="text-xs text-brand-textMuted font-mono">
                    {CLEAN_ARCH_LAYERS[selectedLayer].subtitle}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-brand-heading mt-1">
                  {CLEAN_ARCH_LAYERS[selectedLayer].name}
                </h4>
                <p className="text-xs text-brand-text leading-relaxed mt-2">
                  {CLEAN_ARCH_LAYERS[selectedLayer].responsibility}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-textMuted block">
                  Invariantes &amp; Práticas de Engenharia:
                </span>
                <ul className="space-y-1.5">
                  {CLEAN_ARCH_LAYERS[selectedLayer].invariants.map((inv, i) => (
                    <li key={i} className="text-xs text-brand-textMuted flex items-start gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-[11px] font-mono text-brand-textMuted">
                <span className="text-brand-accent font-semibold">Exemplos reais no repositório: </span>
                <span className="text-brand-heading">{CLEAN_ARCH_LAYERS[selectedLayer].techExample}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-section 2: 4-Level Code Review Taxonomy */}
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-brand-heading flex items-center gap-2">
              <CodeIcon className="w-4 h-4 text-brand-accent" />
              <span>Taxonomia de Code Review em Quatro Níveis</span>
            </h3>
            <p className="text-xs text-brand-textMuted mt-1">
              Feedback explícito, previsível e calibrado para acelerar o ciclo de entrega mantendo padrão arquitetural estrito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CODE_REVIEW_LEVELS.map((level) => (
              <div
                key={level.tag}
                className={`p-5 rounded-2xl bg-brand-surface border ${level.colorBorder} transition-all duration-300 flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${level.colorBadge}`}>
                      {level.tag}
                    </span>
                    <span className="text-[11px] text-brand-textMuted font-medium">
                      {level.title}
                    </span>
                  </div>

                  <p className="text-xs text-brand-text leading-relaxed">
                    {level.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-textMuted block">
                    Critérios de Classificação:
                  </span>
                  <ul className="space-y-1.5">
                    {level.criteria.map((crit, idx) => (
                      <li key={idx} className="text-xs text-brand-textMuted flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/60 shrink-0 mt-1.5" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
