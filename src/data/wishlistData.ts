import type { WishlistItem } from '@/types/wishlist';
import { booksData } from './booksData';

/**
 * Static wishlist items for technology and peripherals category.
 */
export const techWishlistData: WishlistItem[] = [
  {
    id: 'tech-1',
    title: 'Keycaps PBT Cyan/Blue',
    subtitle: 'Perfil XDA para Teclado Mecânico',
    category: 'Tech',
    url: 'https://www.amazon.com.br/s?k=keycaps+pbt+cyan+blue',
    tag: 'Hardware',
  },
  {
    id: 'tech-2',
    title: 'Gift Card Steam R$100',
    subtitle: 'Para exploração de novos títulos indies e cozy',
    category: 'Tech',
    url: 'https://store.steampowered.com/digitalgiftcards/',
    tag: 'Gaming',
  },
  {
    id: 'tech-3',
    title: 'Monitor Arm com Gestão de Cabos',
    subtitle: 'Suporte articulado a gás padrão VESA',
    category: 'Tech',
    url: 'https://www.amazon.com.br/s?k=suporte+articulado+monitor+a+gas',
    tag: 'Workspace',
  },
  {
    id: 'tech-4',
    title: 'Desk Mat Minimalista Slate/Cyan',
    subtitle: 'Mousepad estendido 900x400mm borda costurada',
    category: 'Tech',
    url: 'https://www.amazon.com.br/s?k=deskmat+slate',
    tag: 'Setup',
  },
];

/**
 * Static wishlist items for lifestyle, hobbies, and geek collectibles category.
 */
export const lifestyleWishlistData: WishlistItem[] = [
  {
    id: 'lifestyle-1',
    title: 'Pelúcia Clodsire / Eevee',
    subtitle: 'Pokémon Center Oficial',
    category: 'Lifestyle & Geek',
    url: 'https://www.amazon.com.br/s?k=pelucia+pokemon+clodsire+eevee',
    tag: 'Colecionável',
  },
  {
    id: 'lifestyle-2',
    title: 'Cafeteira Prensa Francesa de Vidro Duplo',
    subtitle: 'Preparo manual de cafés especiais e infusões',
    category: 'Lifestyle & Geek',
    url: 'https://www.amazon.com.br/s?k=prensa+francesa+vidro+duplo',
    tag: 'Café',
  },
  {
    id: 'lifestyle-3',
    title: 'Moedor de Café Manual com Rebarbas de Cerâmica',
    subtitle: 'Regulagem micrométrica para métodos filtrados',
    category: 'Lifestyle & Geek',
    url: 'https://www.amazon.com.br/s?k=moedor+manual+cafe+ceramica',
    tag: 'Café',
  },
  {
    id: 'lifestyle-4',
    title: 'Miniatura Fóssil Dinossauro / Réplica Paleontológica',
    subtitle: 'Modelo anatômico detalhado para decoração técnica',
    category: 'Lifestyle & Geek',
    url: 'https://www.amazon.com.br/s?k=replica+fossil+paleontologia',
    tag: 'Decoração',
  },
];

/**
 * Aggregated wishlist dataset containing books, tech, and lifestyle items.
 */
export const allWishlistData: WishlistItem[] = [
  ...booksData,
  ...techWishlistData,
  ...lifestyleWishlistData,
];
