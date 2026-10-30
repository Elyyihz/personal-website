import type { HobbyItem } from '@/types/hobby';

/**
 * Curated initial list of personal interests rendered in the 'O Que Eu Gosto' section.
 */
export const defaultHobbiesData: HobbyItem[] = [
  {
    id: 'interest-1',
    name: 'Stardew Valley',
    iconSlug: 'plant',
    category: 'Cozy Gaming',
  },
  {
    id: 'interest-2',
    name: 'Pokémon',
    iconSlug: 'gamepad',
    category: 'Gaming & Lore',
  },
  {
    id: 'interest-3',
    name: 'Paleontologia / Paleo Pines',
    iconSlug: 'bone',
    category: 'Ciência & Dinossauros',
  },
  {
    id: 'interest-4',
    name: 'Engenharia Biomimética',
    iconSlug: 'hexagon',
    category: 'Bioengenharia',
  },
  {
    id: 'interest-5',
    name: 'Ella Enchanted',
    iconSlug: 'wand',
    category: 'Fantasia & Clássicos',
  },
  {
    id: 'interest-6',
    name: 'Cafés Especiais',
    iconSlug: 'coffee',
    category: 'Sensorial & Barismo',
  },
];

export const interestsData = defaultHobbiesData;
export type { HobbyItem as InterestItem };
