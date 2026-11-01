import React, { useState } from 'react';
import { WandIcon, SparklesIcon, HexagonIcon } from '@/components/icons';

/**
 * Interface representing an individual skill node in the RPG talent tree.
 */
export interface SkillNode {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  tier: number;
  category: 'backend' | 'ai' | 'infra';
  tagline: string;
  description: string;
  stats: {
    label: string;
    value: string;
  }[];
  unlocked: boolean;
  projects: string[];
}

/**
 * Interface representing a specialization branch in the skill tree.
 */
export interface SkillBranch {
  id: 'backend' | 'ai' | 'infra';
  name: string;
  archetype: string;
  description: string;
  icon: React.ReactNode;
  nodes: SkillNode[];
}

const SKILL_BRANCHES: SkillBranch[] = [
  {
    id: 'backend',
    name: 'Backend Magic',
    archetype: 'Architect Mage',
    description: 'High-performance microservices, Clean Architecture, and domain-driven distributed systems.',
    icon: <WandIcon className="w-5 h-5" />,
    nodes: [
      {
        id: 'py-core',
        name: 'Python Mastery',
        level: 99,
        maxLevel: 99,
        tier: 1,
        category: 'backend',
        tagline: 'Root Affinity: AsyncIO, Metaprogramming & Type Safety',
        description: 'Deep mastery of asynchronous runtime, memory profiling, and high-throughput concurrent patterns.',
        stats: [
          { label: 'Latency', value: '< 15ms p99' },
          { label: 'Type Rigor', value: 'Strict MyPy' },
        ],
        unlocked: true,
        projects: ['SAED', 'DocChecker', 'MAIA'],
      },
      {
        id: 'fastapi',
        name: 'FastAPI & AsyncIO',
        level: 95,
        maxLevel: 99,
        tier: 2,
        category: 'backend',
        tagline: 'Spell: High-Throughput HTTP & Streaming RPC',
        description: 'Reactive endpoints, dependency injection graphs, streaming responses, and OpenAPI orchestration.',
        stats: [
          { label: 'Throughput', value: '4.8k req/sec' },
          { label: 'Streaming', value: 'SSE & WebSocket' },
        ],
        unlocked: true,
        projects: ['SAED', 'DocChecker'],
      },
      {
        id: 'clean-arch',
        name: 'Clean Architecture & DDD',
        level: 92,
        maxLevel: 99,
        tier: 3,
        category: 'backend',
        tagline: 'Passive: Decoupled Domain Invariants',
        description: 'Strict boundary enforcement between entities, use cases, repository ports, and web delivery adapters.',
        stats: [
          { label: 'Coupling', value: 'Zero Leaks' },
          { label: 'Test Coverage', value: '98% Unit' },
        ],
        unlocked: true,
        projects: ['MAIA', 'SAED'],
      },
      {
        id: 'sql-db',
        name: 'SQLAlchemy & PostgreSQL',
        level: 90,
        maxLevel: 99,
        tier: 4,
        category: 'backend',
        tagline: 'Spell: Query Optimization & Transaction Locks',
        description: 'Relational data modeling, connection pool management, and optimized indexing strategies.',
        stats: [
          { label: 'Pool Safety', value: 'Pre-ping Enabled' },
          { label: 'Migrations', value: 'Alembic Managed' },
        ],
        unlocked: true,
        projects: ['Portfolio Microservice', 'SAED'],
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI & Data Engineering',
    archetype: 'Neural Weaver',
    description: 'Graph-based agentic workflows, semantic vector retrieval, and vision intelligence.',
    icon: <SparklesIcon className="w-5 h-5" />,
    nodes: [
      {
        id: 'agentic-ai',
        name: 'Agentic AI & LangGraph',
        level: 96,
        maxLevel: 99,
        tier: 1,
        category: 'ai',
        tagline: 'Root Affinity: Stateful Cyclical Workflows',
        description: 'Building multi-agent state machines with conditional routing, self-reflection, and fault-tolerant graphs.',
        stats: [
          { label: 'Coordination', value: 'Multi-Agent Mesh' },
          { label: 'Checkpointing', value: 'PostgreSQL / Memory' },
        ],
        unlocked: true,
        projects: ['MAIA', 'DocChecker'],
      },
      {
        id: 'vector-dbs',
        name: 'Qdrant & ChromaDB',
        level: 94,
        maxLevel: 99,
        tier: 2,
        category: 'ai',
        tagline: 'Spell: High-Dimensional Semantic Search',
        description: 'HNSW vector indexing, distance metrics tuning, and filtered hybrid retrieval strategies.',
        stats: [
          { label: 'Dimensions', value: '768 - 1536d' },
          { label: 'Recall Rate', value: '99.4%' },
        ],
        unlocked: true,
        projects: ['DocChecker', 'AI Assistant'],
      },
      {
        id: 'cv-vision',
        name: 'YOLO & PaddleOCR',
        level: 88,
        maxLevel: 99,
        tier: 3,
        category: 'ai',
        tagline: 'Passive: Visual Tokenizer & Structure Parser',
        description: 'Real-time object bounding, document table segmentation, and OCR layout reconstruction.',
        stats: [
          { label: 'Inference', value: 'Real-time TensorRT' },
          { label: 'Extraction', value: '96.8% Accuracy' },
        ],
        unlocked: true,
        projects: ['SAED', 'DocChecker'],
      },
      {
        id: 'rag-eval',
        name: 'RAG Pipeline & LLMs',
        level: 95,
        maxLevel: 99,
        tier: 4,
        category: 'ai',
        tagline: 'Spell: Grounded Context Synthesis',
        description: 'Context-window compression, chunk overlapping, and Hallucination-free answer generation.',
        stats: [
          { label: 'Hallucination', value: '< 1%' },
          { label: 'Embedding Engine', value: 'Gemini / OpenAI' },
        ],
        unlocked: true,
        projects: ['AI Assistant', 'DocChecker'],
      },
    ],
  },
  {
    id: 'infra',
    name: 'Infrastructure & SRE',
    archetype: 'Iron Guardian',
    description: 'Resilient container orchestration, asynchronous message queues, and production telemetry.',
    icon: <HexagonIcon className="w-5 h-5" />,
    nodes: [
      {
        id: 'linux-shell',
        name: 'Linux & macOS Zsh',
        level: 94,
        maxLevel: 99,
        tier: 1,
        category: 'infra',
        tagline: 'Root Affinity: Unix Philosophy & Automation',
        description: 'POSIX compliance, shell scripting, environment isolation, process management, and kernel parameters.',
        stats: [
          { label: 'CLI Fluency', value: 'Automated Tooling' },
          { label: 'OS Targets', value: 'Alpine / Debian / Darwin' },
        ],
        unlocked: true,
        projects: ['Infrastructure Scripts', 'Terminal Mode'],
      },
      {
        id: 'docker',
        name: 'Docker & Compose',
        level: 92,
        maxLevel: 99,
        tier: 2,
        category: 'infra',
        tagline: 'Spell: Multi-Stage Containerization',
        description: 'Minimal rootless container builds, volume persistence, network bridges, and orchestration.',
        stats: [
          { label: 'Image Size', value: '< 85MB Alpine' },
          { label: 'Security', value: 'Non-root Runtime' },
        ],
        unlocked: true,
        projects: ['Full Portfolio Stack', 'SAED'],
      },
      {
        id: 'rabbitmq',
        name: 'RabbitMQ & Queues',
        level: 89,
        maxLevel: 99,
        tier: 3,
        category: 'infra',
        tagline: 'Passive: Guaranteed Delivery Streams',
        description: 'Topic exchanges, dead-letter routing, backpressure mitigation, and durable task queues.',
        stats: [
          { label: 'Reliability', value: 'At-least-once Ack' },
          { label: 'Topology', value: 'Direct & Fanout' },
        ],
        unlocked: true,
        projects: ['Distributed Pipeline', 'MAIA'],
      },
      {
        id: 'observability',
        name: 'OpenTelemetry & Metrics',
        level: 87,
        maxLevel: 99,
        tier: 4,
        category: 'infra',
        tagline: 'Spell: Distributed Tracing & Health Probes',
        description: 'End-to-end span propagation, Prometheus metrics exports, and structured JSON telemetry.',
        stats: [
          { label: 'Span Context', value: 'W3C TraceContext' },
          { label: 'Alerting', value: 'SLA Monitoring' },
        ],
        unlocked: true,
        projects: ['Telemetry Anomaly Agent'],
      },
    ],
  },
];

/**
 * Interactive RPG-style Skill Tree component.
 * Allows users to inspect skill trees across Backend Magic, AI & Data Engineering, and Infrastructure.
 */
export const SkillTree: React.FC = () => {
  const [activeBranchId, setActiveBranchId] = useState<'backend' | 'ai' | 'infra'>('backend');
  const [selectedNode, setSelectedNode] = useState<SkillNode>(SKILL_BRANCHES[0].nodes[0]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeBranch = SKILL_BRANCHES.find((b) => b.id === activeBranchId) || SKILL_BRANCHES[0];

  return (
    <div className="bg-brand-surface/90 border border-brand-accent/20 rounded-2xl p-6 sm:p-8 mt-10 shadow-2xl backdrop-blur-md">
      {/* Header and Branch Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-accent/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-accent px-2 py-0.5 rounded bg-brand-accent/10 border border-brand-accent/25">
              RPG Talent Tree
            </span>
            <span className="text-xs text-brand-textMuted font-mono">
              Build: Full-Stack AI Engineer
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-brand-heading mt-1">
            Árvore de Habilidades & Tecnologias
          </h3>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-0.5">
            Selecione uma especialização para visualizar as conexões da árvore de talentos.
          </p>
        </div>

        {/* Branch Selection Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {SKILL_BRANCHES.map((branch) => {
            const isActive = branch.id === activeBranchId;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => {
                  setActiveBranchId(branch.id);
                  setSelectedNode(branch.nodes[0]);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-glow-blue border border-cyan-400/50 scale-[1.02]'
                    : 'bg-brand-deep/80 text-brand-textMuted hover:text-white border border-white/5 hover:border-cyan-400/30'
                }`}
              >
                <span className={isActive ? 'text-cyan-300' : 'text-slate-400'}>
                  {branch.icon}
                </span>
                <span>{branch.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
        {/* Left Side: SVG Connection Canvas & Nodes */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between px-2 mb-4 text-xs font-mono text-brand-textMuted">
            <span className="text-cyan-400 font-bold tracking-wider">
              {activeBranch.archetype.toUpperCase()}
            </span>
            <span>Progresso da Ramo: 4 / 4 Habilidades Dominadas</span>
          </div>

          {/* Interactive RPG Node Tree with SVG Connection Curves */}
          <div className="relative w-full py-4 px-2 sm:px-6">
            {/* SVG Connecting Paths */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ minHeight: '380px' }}
            >
              <defs>
                <linearGradient id="cyanLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connecting vertical bezier spine */}
              <path
                d="M 50% 45 C 50% 120, 50% 160, 50% 240 S 50% 320, 50% 340"
                stroke="url(#cyanLineGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            </svg>

            {/* Vertically Aligned RPG Skill Nodes */}
            <div className="relative z-10 flex flex-col gap-6">
              {activeBranch.nodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isHovered = hoveredNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className={`group relative flex items-center gap-4 p-3.5 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-deep border-cyan-400 shadow-glow-cyan scale-[1.01]'
                        : isHovered
                        ? 'bg-brand-deep/90 border-cyan-400/60 shadow-lg'
                        : 'bg-brand-deep/50 border-white/10 hover:border-cyan-400/40'
                    }`}
                  >
                    {/* Level Hexagon / Badge */}
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 transition-transform font-mono border ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 scale-105'
                          : 'bg-brand-surface border-brand-accent/25 text-brand-textMuted group-hover:border-cyan-400/60'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-tighter text-slate-400">
                        Tier {node.tier}
                      </span>
                      <span className="text-sm font-black text-cyan-400">
                        {node.level}
                      </span>
                    </div>

                    {/* Node Summary */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4
                          className={`text-sm sm:text-base font-bold truncate transition-colors ${
                            isSelected ? 'text-cyan-300' : 'text-brand-heading group-hover:text-cyan-400'
                          }`}
                        >
                          {node.name}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-400/30 text-cyan-400">
                          MAX
                        </span>
                      </div>
                      <p className="text-xs text-brand-textMuted truncate">
                        {node.tagline}
                      </p>
                    </div>

                    {/* Status Pip */}
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-cyan-400/80">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Desbloqueado</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Skill Detail Codex / RPG Inspector Card */}
        <div className="lg:col-span-5 bg-brand-deep/95 border border-cyan-400/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Archetype Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
                {activeBranch.archetype}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Status: Mastery Ativa
              </span>
            </div>

            {/* Skill Title & Level */}
            <h4 className="text-xl font-extrabold text-white mb-1">
              {selectedNode.name}
            </h4>
            <p className="text-xs font-mono text-cyan-400 mb-4">
              {selectedNode.tagline}
            </p>

            {/* In-depth Lore / Description */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 bg-brand-surface/60 p-3.5 rounded-xl border border-white/5">
              {selectedNode.description}
            </div>

            {/* Key Skill Modifiers / Attributes */}
            <div className="space-y-2 mb-5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Métricas & Atributos de Engenharia
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {selectedNode.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-400/20 flex flex-col justify-between"
                  >
                    <span className="text-[10px] text-slate-400">{stat.label}</span>
                    <span className="text-xs font-bold text-cyan-300 mt-0.5">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Real-world Projects */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Aplicações em Produção
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.projects.map((proj) => (
                  <span
                    key={proj}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-400/30 text-cyan-300"
                  >
                    {proj}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Ramo de Habilidade: {activeBranch.name}</span>
            <span className="text-cyan-400 font-bold">Nível {selectedNode.level}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
