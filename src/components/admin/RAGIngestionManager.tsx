import React, { useState, useEffect, useRef } from 'react';
import {
  SparklesIcon,
  CodeIcon,
  BookOpenIcon,
  TrashIcon,
  SearchIcon,
  PlusIcon,
  CheckIcon,
} from '@/components/icons';
import { apiService } from '@/services/apiService';
import type { RAGDocument, RAGIngestPayload } from '@/types/rag';

interface PresetItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  description: string;
}

const PRESET_KNOWLEDGE: PresetItem[] = [
  {
    id: 'preset-saed',
    title: 'SAED (AI Augmented SAST Auditor)',
    category: 'project',
    tags: ['Security', 'SAST', 'LLM', 'SARIF', 'CI/CD'],
    description: 'Auditor estático de segurança com validação por LLM local em CI/CD eliminando falsos positivos.',
    content: `SAED (AI Augmented SAST Auditor) é um sistema de auditoria estática de código projetado para eliminar falsos positivos em pipelines de DevSecOps.
Ao invés de sobrecarregar times de segurança com centenas de alertas não acionáveis emitidos por analisadores estáticos convencionais (como Bandit e Semgrep), o SAED intercepta os achados preliminares e executa uma triagem contextual profunda com modelos de linguagem.
A infraestrutura roda integrada ao GitHub Actions, alimentando um agente de análise com o fluxo completo de dados e sanitizações. Achados confirmados são sintetizados em relatórios no formato padrão SARIF (Static Analysis Results Interchange Format) com correções sugeridas prontas para aplicação.`,
  },
  {
    id: 'preset-maia',
    title: 'MAIA (Multi-Agent Intelligent Architect)',
    category: 'project',
    tags: ['MultiAgent', 'LangGraph', 'Architecture', 'CleanCode'],
    description: 'Orquestrador multi-agente inteligente com execução determinística e validação de contratos estritos.',
    content: `MAIA (Multi-Agent Intelligent Architect) é uma plataforma de orquestração multi-agente determinística baseada em LangGraph e Clean Architecture.
O MAIA decompõe demandas arquiteturais de software em grafos de tarefas com sub-agentes especializados: Codebase Researcher (pesquisa de dependências), Contract Architect (definição de interfaces e contratos OpenAPI), Implementer (desenvolvimento focado em TDD) e Security Auditor.
A comunicação entre os nós é rigidamente tipada com schemas Pydantic, impedindo desvios comportamentais ou alucinações. Todo o ciclo de execução é idempotente, monitorável e rastreável via OpenTelemetry.`,
  },
  {
    id: 'preset-docchecker',
    title: 'DocChecker (Doc Semantic Equivalence Engine)',
    category: 'project',
    tags: ['LegalTech', 'RAG', 'Qdrant', 'FastAPI', 'PaddleOCR'],
    description: 'Motor de conformidade e equivalência semântica legal utilizando RAG assíncrono e OCR de precisão.',
    content: `DocChecker é um motor de conformidade e verificação de equivalência semântica para documentos jurídicos e contratuais reestruturados.
O pipeline processa versões digitalizadas e PDFs nativos através de PaddleOCR com correção de orientação e segmentação de cláusulas. As seções são transformadas em representações vetoriais densas e indexadas em coleções Qdrant com distância por cosseno.
O sistema compara o documento reestruturado com a minuta base aprovada, gerando métricas de confiança de paridade semântica e apontando divergências materiais que requeiram revisão humana.`,
  },
  {
    id: 'preset-clean-arch',
    title: 'Artigo Elyy.init: Clean Architecture & DDD em Microserviços',
    category: 'article',
    tags: ['CleanArchitecture', 'DDD', 'Python', 'FastAPI', 'TDD'],
    description: 'Guia prático sobre isolamento do domínio, inversão de controle e regras de dependência estritas.',
    content: `Artigo técnico de referência publicado na Elyy.init explorando a implementação de Clean Architecture e Domain-Driven Design (DDD) em microserviços Python modernos com FastAPI e SQLAlchemy 2.0.
Destaca a aplicação intransigente da Regra de Dependência: as camadas centrais (Domínio e Casos de Uso) são agnósticas a frameworks web e drivers de persistência, interagindo exclusivamente através de contratos abstratos (Ports).
Apresenta o fluxo de desenvolvimento de dentro para fora (escrita ordenada do domínio para a infraestrutura) e a disciplina de TDD garantindo que todas as regras de negócio sejam validadas em isolamento.`,
  },
  {
    id: 'preset-bio',
    title: 'Perfil Técnico & Engenharia de Elynne Lima',
    category: 'bio',
    tags: ['Bio', 'Engineer', 'AI', 'ISTP'],
    description: 'Visão geral sobre especialização em sistemas de IA, pipelines distribuídos e estilo de engenharia.',
    content: `Elynne Lima é Engenheira de Sistemas de IA especializada na concepção de sistemas distribuídos de machine learning, pipelines de inferência em tempo real, orquestração de agentes autônomos com LangGraph e engenharia de software fundamentada em Clean Architecture e DDD.
Personalidade analítica e pragmática (ISTP), orientada a código desacoplado, alta performance e ausência de desperdício conceitual.
Afinidades culturais e interesses pessoais: jogos aconchegantes como Stardew Valley e Pokémon, paleontologia, cafés especiais e engenharia biomimética.`,
  },
];

/**
 * Data Ingestion Dashboard component managing RAG document indexing,
 * presets, file upload parsing, and Qdrant vector store synchronization.
 */
export const RAGIngestionManager: React.FC = () => {
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('project');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const docs = await apiService.getRAGDocuments();
      setDocuments(docs);
    } catch (err: any) {
      setErrorMessage(`Erro ao carregar documentos indexados: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleApplyPreset = (preset: PresetItem) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setTagsInput(preset.tags.join(', '));
    setContent(preset.content);
    setSuccessMessage(`Preset '${preset.title}' carregado no formulário.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setContent(text);
        if (!title) {
          const autoTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setTitle(autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1));
        }
        setSuccessMessage(`Arquivo '${file.name}' carregado com sucesso.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Falha ao processar leitura do arquivo.');
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Título e conteúdo são obrigatórios para indexação.');
      return;
    }

    if (content.trim().length < 10) {
      setErrorMessage('O conteúdo deve possuir ao menos 10 caracteres para indexação vetorial.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: RAGIngestPayload = {
      title: title.trim(),
      category: category.trim(),
      tags,
      content: content.trim(),
    };

    try {
      const result = await apiService.ingestRAGDocument(payload);
      setSuccessMessage(
        `Documento '${result.title}' indexado com sucesso! (${result.chunk_count} chunks gerados)`
      );
      setTitle('');
      setContent('');
      setTagsInput('');
      fetchDocuments();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(`Falha na ingestão: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (docId: string, docTitle: string) => {
    if (!window.confirm(`Deseja realmente purgar o documento '${docTitle}' e seus vetores?`)) {
      return;
    }

    try {
      await apiService.deleteRAGDocument(docId);
      setSuccessMessage(`Documento '${docTitle}' purgado com sucesso.`);
      fetchDocuments();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Falha ao remover documento: ${err.message}`);
    }
  };

  const filteredDocuments = documents.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.content.toLowerCase().includes(q)
    );
  });

  const totalChunks = documents.reduce((acc, curr) => acc + (curr.chunk_count || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner and Summary */}
      <div className="bg-brand-surface p-5 rounded-xl border border-brand-accent/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-brand-heading flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-brand-accent" />
            <span>Pipeline RAG & Ingestão de Conhecimento</span>
          </h4>
          <p className="text-xs text-brand-textMuted mt-1">
            Segmentação semântica, cálculo de embeddings densos e indexação no banco vetorial Qdrant para o assistente de IA.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-brand-deep border border-brand-accent/30 text-center">
            <span className="block text-[10px] text-brand-textMuted uppercase tracking-wider">Documentos</span>
            <span className="text-sm font-bold text-brand-heading">{documents.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-brand-deep border border-emerald-500/30 text-center">
            <span className="block text-[10px] text-emerald-400 uppercase tracking-wider">Chunks no Vetor</span>
            <span className="text-sm font-bold text-emerald-300">{totalChunks}</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
          <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Quick Presets Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-brand-textMuted flex items-center gap-1.5">
            <CodeIcon className="w-3.5 h-3.5 text-brand-accent" />
            <span>Presets Rápidos de Engenharia</span>
          </h5>
          <span className="text-[11px] text-brand-textMuted">Clique para carregar no formulário</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_KNOWLEDGE.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-xl bg-brand-surface border border-white/5 hover:border-brand-accent/40 cursor-pointer transition-all hover:bg-brand-surfaceHover group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-brand-heading group-hover:text-brand-accent transition-colors">
                    {preset.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-deep border border-white/10 text-brand-textMuted">
                    {preset.category}
                  </span>
                </div>
                <p className="text-[11px] text-brand-textMuted line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-brand-accent font-medium">
                <PlusIcon className="w-3 h-3" />
                <span>Usar este preset</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingestion Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-brand-surface border border-brand-accent/20 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h5 className="text-sm font-bold text-brand-heading flex items-center gap-2">
            <PlusIcon className="w-4 h-4 text-brand-accent" />
            <span>Nova Ingestão de Documento / Artigo</span>
          </h5>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.json,.csv"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-brand-textMuted hover:text-brand-heading bg-brand-deep border border-white/10 hover:border-brand-accent/30 transition-all flex items-center gap-1.5"
            >
              <BookOpenIcon className="w-3.5 h-3.5" />
              <span>Importar Arquivo (.md / .txt)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-brand-textMuted">Título do Conhecimento</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Motor de Equivalência Semântica DocChecker"
              className="w-full px-3.5 py-2 text-xs rounded-lg bg-brand-deep border border-white/10 text-brand-heading placeholder:text-brand-textMuted/40 focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-textMuted">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-brand-deep border border-white/10 text-brand-heading focus:outline-none focus:border-brand-accent"
            >
              <option value="project">Projeto de Engenharia</option>
              <option value="article">Artigo Técnico (Elyy.init)</option>
              <option value="bio">Perfil & Bio Profissional</option>
              <option value="general">Documentação Geral</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-textMuted">Tags / Palavras-chave (separadas por vírgula)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Ex: LangGraph, CleanArchitecture, Qdrant, FastAPI"
            className="w-full px-3.5 py-2 text-xs rounded-lg bg-brand-deep border border-white/10 text-brand-heading placeholder:text-brand-textMuted/40 focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-brand-textMuted">Conteúdo do Documento (Texto ou Markdown)</label>
            <span className="text-[10px] text-brand-textMuted">{content.length} caracteres</span>
          </div>
          <textarea
            required
            rows={7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cole aqui o texto completo ou especificações detalhadas do projeto..."
            className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg bg-brand-deep border border-white/10 text-brand-heading placeholder:text-brand-textMuted/40 focus:outline-none focus:border-brand-accent resize-y leading-relaxed"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setContent('');
              setTagsInput('');
            }}
            className="px-4 py-2 text-xs font-medium text-brand-textMuted hover:text-brand-heading bg-transparent transition-colors"
          >
            Limpar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg text-xs font-bold text-brand-deep bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-brand-accent/20"
          >
            {isSubmitting ? (
              <span>Chunking & Indexando...</span>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                <span>Indexar no Banco Vetorial</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Indexed Documents Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-brand-textMuted flex items-center gap-1.5">
            <BookOpenIcon className="w-3.5 h-3.5 text-brand-accent" />
            <span>Documentos Indexados ({filteredDocuments.length})</span>
          </h5>

          <div className="relative w-full sm:w-64">
            <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-textMuted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por título ou conteúdo..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-brand-surface border border-white/10 text-brand-heading placeholder:text-brand-textMuted/40 focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-brand-textMuted">
            Carregando documentos indexados...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8 text-center text-xs text-brand-textMuted bg-brand-surface rounded-xl border border-white/5">
            Nenhum documento encontrado na base de conhecimento. Use os presets acima para indexar o conhecimento inicial.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-brand-surface border border-white/5 hover:border-brand-accent/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-brand-heading">{doc.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-deep border border-brand-accent/20 text-brand-accent">
                      {doc.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono">
                      {doc.chunk_count} chunk(s)
                    </span>
                  </div>
                  <p className="text-xs text-brand-textMuted line-clamp-2 leading-relaxed">
                    {doc.content}
                  </p>
                  <div className="text-[10px] text-brand-textMuted font-mono">
                    ID: {doc.id} • Criado em: {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-2 rounded-lg text-brand-textMuted hover:text-red-400 bg-brand-deep hover:bg-red-950/30 border border-white/5 hover:border-red-500/30 transition-all"
                    title="Excluir documento e vetores"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
