/**
 * Item specification for personal interests and affinities.
 */
export interface InterestItem {
  id: string;
  name: string;
  iconKey: 'plant' | 'gamepad' | 'bone' | 'hexagon' | 'wand' | 'coffee';
  category: string;
}

/**
 * Curated list of personal interests rendered in the 'O Que Eu Gosto' section.
 */
export const interestsData: InterestItem[] = [
  {
    id: 'interest-1',
    name: 'Stardew Valley',
    iconKey: 'plant',
    category: 'Cozy Gaming',
  },
  {
    id: 'interest-2',
    name: 'Pokémon',
    iconKey: 'gamepad',
    category: 'Gaming & Lore',
  },
  {
    id: 'interest-3',
    name: 'Paleontologia / Paleo Pines',
    iconKey: 'bone',
    category: 'Ciência & Dinossauros',
  },
  {
    id: 'interest-4',
    name: 'Engenharia Biomimética',
    iconKey: 'hexagon',
    category: 'Bioengenharia',
  },
  {
    id: 'interest-5',
    name: 'Ella Enchanted',
    iconKey: 'wand',
    category: 'Fantasia & Clássicos',
  },
  {
    id: 'interest-6',
    name: 'Cafés Especiais',
    iconKey: 'coffee',
    category: 'Sensorial & Barismo',
  },
];
