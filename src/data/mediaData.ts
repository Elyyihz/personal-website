import type { ConsumedMedia } from '@/types/media';

/**
 * Default media consumption dataset featuring the injected reading 'The Man in the High Castle'.
 */
export const defaultConsumedMedia: ConsumedMedia = {
  reading: {
    id: 'reading-current',
    title: 'The Man in the High Castle',
    author: 'Philip K. Dick',
    category: 'Ficção Científica & História Alternativa',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1450379461i/2165.jpg',
    referenceUrl:
      'https://www.amazon.com.br/s?k=The+Man+in+the+High+Castle+Philip+K.+Dick',
    status: 'Lendo Atualmente',
  },
  watching: {
    id: 'watching-current',
    title: 'Ficção Científica & Animação',
    subtitle: 'Séries, Lore & Documentários Tech',
    coverUrl:
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&auto=format&fit=crop&q=80',
    category: 'Séries & Mídia',
  },
};
