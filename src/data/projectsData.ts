import type { Project } from '@/types/project';

/**
 * Portfolio projects dataset displayed in the 'What I Do' (O Que Eu Faço) section.
 */
export const projectsData: Project[] = [
  {
    id: 'doc-semantic-equivalence',
    title: 'Doc Semantic Equivalence Engine',
    description:
      'Motor de equivalência semântica e conformidade legal utilizando RAG assíncrono, busca vetorial densa e OCR de precisão para análise documental automatizada.',
    tags: ['FastAPI', 'LangGraph', 'vLLM', 'Qdrant', 'PaddleOCR'],
    githubUrl: 'https://github.com/Elyyihz/doc-semantic-equivalence-engine',
    featured: true,
  },
  {
    id: 'distributed-video-inference',
    title: 'Distributed Video Inference Pipeline',
    description:
      'Pipeline distribuído para processamento de vídeo e detecção de objetos em lote com workers desacoplados via mensageria AMQP e aceleração de hardware.',
    tags: ['FastAPI', 'RabbitMQ', 'YOLOv8', 'ONNX Runtime', 'PostgreSQL'],
    githubUrl: 'https://github.com/Elyyihz/distributed-video-inference-pipeline',
    featured: true,
  },
  {
    id: 'telemetry-anomaly-agent',
    title: 'Telemetry Anomaly Autonomous Agent',
    description:
      'Agente autônomo com inferência local que correlaciona métricas time-series e traces distribuídos para diagnóstico e remediação proativa de incidentes SRE.',
    tags: ['Python', 'LangGraph', 'llama.cpp (GGUF)', 'OpenTelemetry', 'Prometheus'],
    githubUrl: 'https://github.com/Elyyihz/telemetry-anomaly-autonomous-agent',
    featured: false,
  },
  {
    id: 'ai-augmented-sast-auditor',
    title: 'AI Augmented SAST Auditor',
    description:
      'Auditor estático de segurança com validação por LLM local em pipelines de CI/CD, eliminando falsos positivos e emitindo relatórios no padrão SARIF.',
    tags: ['Python CLI', 'Bandit', 'GGUF Local', 'GitHub Actions'],
    githubUrl: 'https://github.com/Elyyihz/ai-augmented-sast-auditor',
    featured: false,
  },
  {
    id: 'dynamic-llm-inference-router',
    title: 'Dynamic LLM Inference Router',
    description:
      'API Gateway compatível com OpenAI que roteia requisições dinamicamente entre vLLM (GPU KV-Cache) e llama.cpp (Edge GGUF) ponderando latência e complexidade do prompt.',
    tags: ['FastAPI', 'vLLM', 'llama.cpp', 'OpenTelemetry', 'Grafana'],
    githubUrl: 'https://github.com/Elyyihz/dynamic-llm-inference-router',
    featured: false,
  },
  {
    id: 'saed-platform',
    title: 'Plataforma SAED',
    description:
      'Aplicação full-stack do Sistema de Avaliação Educacional. Arquitetura resiliente e painéis interativos de alto desempenho para análise de indicadores analíticos em larga escala.',
    tags: ['Angular', 'Tailwind CSS', 'Node.js', 'Clean Architecture'],
    demoUrl: '#',
    featured: true,
  },
];
