/**
 * Section visibility configuration contract.
 * Controls the conditional rendering of main layout sections on the portfolio.
 */

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  consuming: boolean;
  projects: boolean;
  newsletter: boolean;
  howIWork: boolean;
  wishlist: boolean;
  contacts: boolean;
}

export type SectionKey = keyof SectionVisibility;

export const defaultSectionVisibility: SectionVisibility = {
  hero: true,
  about: true,
  consuming: true,
  projects: true,
  newsletter: true,
  howIWork: true,
  wishlist: true,
  contacts: true,
};

export interface SectionMetadata {
  id: SectionKey;
  label: string;
  description: string;
  anchor: string;
}

export const SECTIONS_CATALOG: SectionMetadata[] = [
  {
    id: 'hero',
    label: 'Hero & Apresentação',
    description: 'Avatar Memoji interativo, headline de Engenharia de IA, biografia inicial e links sociais rápidos.',
    anchor: '#',
  },
  {
    id: 'about',
    label: 'Sobre Mim & Gostos',
    description: 'Visão de engenharia, traços analíticos (ISTP) e afinidades/hobbies integrados.',
    anchor: '#sobre',
  },
  {
    id: 'consuming',
    label: 'Consumindo Agora (Telemetria)',
    description: 'Leitura ativa (The Man in the High Castle), Spotify em tempo real, séries e jogos na Steam.',
    anchor: '#consumindo',
  },
  {
    id: 'projects',
    label: 'O Que Eu Faço (Projetos & Skills)',
    description: 'Vitrine de projetos em destaque (SAED, MAIA, DocChecker) e árvore técnica de habilidades.',
    anchor: '#projetos',
  },
  {
    id: 'newsletter',
    label: 'Artigos da Newsletter (Elyy.init)',
    description: 'Publicações técnicas sobre Clean Architecture, DDD, Python, Linux e sistemas de agentes.',
    anchor: '#artigos',
  },
  {
    id: 'howIWork',
    label: 'Como Eu Faço (How I Work)',
    description: 'Pilares de arquitetura limpa, TDD, code review rigoroso e padrões de engenharia.',
    anchor: '#how-i-work',
  },
  {
    id: 'wishlist',
    label: 'Minha Wishlist',
    description: 'Catálogo de livros técnicos, periféricos, setups e itens colecionáveis com paginação.',
    anchor: '#wishlist',
  },
  {
    id: 'contacts',
    label: 'Contato & Canais',
    description: 'Canais diretos para parcerias, oportunidades profissionais e discussões de arquitetura.',
    anchor: '#contato',
  },
];
