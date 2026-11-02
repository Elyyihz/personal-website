import type { ArticleItem } from '@/types/article';

export const defaultArticlesData: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'Construindo RAG Resiliente com LangGraph e Qdrant',
    link: 'https://elyyihz.substack.com',
    description:
      'Uma análise profunda sobre roteamento multi-agente, chunking semântico e recuperação híbrida em grafos de decisão.',
    pub_date: '2026-03-15T10:00:00Z',
    author: 'Elynne Lima',
    tags: ['GenAI', 'LangGraph', 'Qdrant', 'Python'],
    visible: true,
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
    visible: true,
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
    visible: true,
  },
];
