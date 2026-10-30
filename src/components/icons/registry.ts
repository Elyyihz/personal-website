import React from 'react';
import type { IconProps } from '@/types/icon';
import {
  CodeIcon,
  FolderGitIcon,
  SparklesIcon,
  BookOpenIcon,
  HeadphonesIcon,
  SpotifyIcon,
  TvIcon,
  PlayIcon,
  HeartIcon,
  MapPinIcon,
  CoffeeIcon,
  PlantIcon,
  GamepadIcon,
  BoneIcon,
  HexagonIcon,
  WandIcon,
  SearchIcon,
  FilterIcon,
  ExternalLinkIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  GiftIcon,
  ActivityIcon,
} from './index';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CloseIcon,
  CheckIcon,
  LockIcon,
  RefreshIcon,
} from './ActionIcons';

/**
 * Registry item specification defining registered icon metadata.
 */
export interface RegisteredIcon {
  id: string;
  name: string;
  category: 'general' | 'tech' | 'media' | 'actions' | 'social';
  component: React.FC<IconProps>;
}

/**
 * Local registry of inline SVG icons using currentColor.
 * Consumed by the IconPicker component and dynamic UI components.
 */
export const ICON_REGISTRY: Record<string, RegisteredIcon> = {
  code: {
    id: 'code',
    name: 'Code',
    category: 'tech',
    component: CodeIcon,
  },
  'folder-git': {
    id: 'folder-git',
    name: 'Git Repository',
    category: 'tech',
    component: FolderGitIcon,
  },
  sparkles: {
    id: 'sparkles',
    name: 'Sparkles',
    category: 'general',
    component: SparklesIcon,
  },
  'book-open': {
    id: 'book-open',
    name: 'Book',
    category: 'media',
    component: BookOpenIcon,
  },
  headphones: {
    id: 'headphones',
    name: 'Headphones',
    category: 'media',
    component: HeadphonesIcon,
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    category: 'media',
    component: SpotifyIcon,
  },
  tv: {
    id: 'tv',
    name: 'TV / Display',
    category: 'media',
    component: TvIcon,
  },
  play: {
    id: 'play',
    name: 'Play',
    category: 'media',
    component: PlayIcon,
  },
  heart: {
    id: 'heart',
    name: 'Heart',
    category: 'general',
    component: HeartIcon,
  },
  'map-pin': {
    id: 'map-pin',
    name: 'Map Pin',
    category: 'general',
    component: MapPinIcon,
  },
  coffee: {
    id: 'coffee',
    name: 'Coffee',
    category: 'general',
    component: CoffeeIcon,
  },
  plant: {
    id: 'plant',
    name: 'Plant',
    category: 'general',
    component: PlantIcon,
  },
  gamepad: {
    id: 'gamepad',
    name: 'Gamepad',
    category: 'tech',
    component: GamepadIcon,
  },
  bone: {
    id: 'bone',
    name: 'Bone / Fossil',
    category: 'general',
    component: BoneIcon,
  },
  hexagon: {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'tech',
    component: HexagonIcon,
  },
  wand: {
    id: 'wand',
    name: 'Magic Wand',
    category: 'general',
    component: WandIcon,
  },
  activity: {
    id: 'activity',
    name: 'Activity / Pulse',
    category: 'tech',
    component: ActivityIcon,
  },
  gift: {
    id: 'gift',
    name: 'Gift / Wishlist',
    category: 'general',
    component: GiftIcon,
  },
  search: {
    id: 'search',
    name: 'Search',
    category: 'actions',
    component: SearchIcon,
  },
  filter: {
    id: 'filter',
    name: 'Filter',
    category: 'actions',
    component: FilterIcon,
  },
  'external-link': {
    id: 'external-link',
    name: 'External Link',
    category: 'actions',
    component: ExternalLinkIcon,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    category: 'social',
    component: GithubIcon,
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    component: LinkedinIcon,
  },
  mail: {
    id: 'mail',
    name: 'Mail',
    category: 'social',
    component: MailIcon,
  },
  lock: {
    id: 'lock',
    name: 'Lock / Security',
    category: 'actions',
    component: LockIcon,
  },
  plus: {
    id: 'plus',
    name: 'Plus / Add',
    category: 'actions',
    component: PlusIcon,
  },
  edit: {
    id: 'edit',
    name: 'Edit',
    category: 'actions',
    component: EditIcon,
  },
  trash: {
    id: 'trash',
    name: 'Trash / Delete',
    category: 'actions',
    component: TrashIcon,
  },
  close: {
    id: 'close',
    name: 'Close / Dismiss',
    category: 'actions',
    component: CloseIcon,
  },
  check: {
    id: 'check',
    name: 'Checkmark',
    category: 'actions',
    component: CheckIcon,
  },
  refresh: {
    id: 'refresh',
    name: 'Refresh / Reset',
    category: 'actions',
    component: RefreshIcon,
  },
};

/**
 * Resolves an inline SVG icon component from the local registry by ID.
 * Returns CodeIcon as fallback when ID is not found.
 *
 * @param iconId - Unique icon identifier string.
 * @returns React functional component rendering inline SVG.
 */
export const getRegisteredIcon = (iconId?: string): React.FC<IconProps> => {
  if (!iconId || !ICON_REGISTRY[iconId]) {
    return CodeIcon;
  }
  return ICON_REGISTRY[iconId].component;
};
