import React, { useState, useMemo } from 'react';
import { ICON_REGISTRY, type RegisteredIcon } from '@/components/icons/registry';
import { SearchIcon } from '@/components/icons/SearchIcon';

/**
 * Props specification for the IconPicker component.
 */
export interface IconPickerProps {
  /** Identifier of the currently selected icon in registry */
  selectedIcon: string;

  /** Callback invoked when the user selects an icon */
  onSelectIcon: (iconId: string) => void;

  /** Optional descriptive label above the picker */
  label?: string;
}

/**
 * Icon Picker UI component consuming a local registry of inline SVGs using currentColor.
 * Provides real-time icon search, category filtering, and visual selection.
 * Strictly free of emojis.
 */
export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
  label = 'Selecionar Ícone',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'tech', label: 'Tech' },
    { id: 'media', label: 'Mídia' },
    { id: 'actions', label: 'Ações' },
    { id: 'general', label: 'Geral' },
  ];

  /**
   * Filters the icon registry based on user search query and active category tab.
   */
  const filteredIcons = useMemo(() => {
    return Object.values(ICON_REGISTRY).filter((icon: RegisteredIcon) => {
      const matchesCategory =
        selectedCategory === 'all' || icon.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!searchQuery.trim()) {
        return true;
      }

      const query = searchQuery.toLowerCase().trim();
      return (
        icon.id.toLowerCase().includes(query) ||
        icon.name.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Search and Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-textMuted">
            <SearchIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ícone por nome..."
            className="w-full pl-9 pr-3 py-1.5 bg-brand-deep rounded-lg border border-brand-accent/20 focus:border-brand-accent text-brand-text placeholder-brand-textMuted/50 text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-deep text-brand-textMuted hover:text-brand-accent border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Selectable SVG Icons */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2.5 bg-brand-deep rounded-xl border border-brand-accent/15 max-h-44 overflow-y-auto">
        {filteredIcons.map((icon: RegisteredIcon) => {
          const IconComponent = icon.component;
          const isSelected = selectedIcon === icon.id;

          return (
            <button
              key={icon.id}
              type="button"
              onClick={() => onSelectIcon(icon.id)}
              title={icon.name}
              className={`group flex flex-col items-center justify-center p-2 rounded-lg transition-all border ${
                isSelected
                  ? 'bg-brand-accent/15 border-brand-accent text-brand-accent shadow-glow-cyan'
                  : 'bg-brand-surface border-white/5 text-brand-textMuted hover:text-brand-accent hover:border-brand-accent/40 hover:bg-brand-surfaceHover'
              }`}
            >
              <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-[9px] mt-1 truncate max-w-full font-mono text-center">
                {icon.id}
              </span>
            </button>
          );
        })}

        {filteredIcons.length === 0 && (
          <div className="col-span-full py-4 text-center text-xs text-brand-textMuted">
            Nenhum ícone encontrado.
          </div>
        )}
      </div>
    </div>
  );
};
