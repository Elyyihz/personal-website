import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import {
  HeartIcon,
  PlantIcon,
  GamepadIcon,
  BoneIcon,
  HexagonIcon,
  WandIcon,
  CoffeeIcon,
} from '@/components/icons';
import { interestsData, type InterestItem } from '@/data/interestsData';

/**
 * Interests section ("O que eu gosto") displaying affinities, games, literature, and hobbies.
 */
export const InterestsSection: React.FC = () => {
  /**
   * Helper mapping icon keys to corresponding SVG icons.
   *
   * @param key - The unique icon identifier for the interest item.
   * @returns Inline SVG element.
   */
  const renderInterestIcon = (key: InterestItem['iconKey']) => {
    switch (key) {
      case 'plant':
        return <PlantIcon className="w-5 h-5" />;
      case 'gamepad':
        return <GamepadIcon className="w-5 h-5" />;
      case 'bone':
        return <BoneIcon className="w-5 h-5" />;
      case 'hexagon':
        return <HexagonIcon className="w-5 h-5" />;
      case 'wand':
        return <WandIcon className="w-5 h-5" />;
      case 'coffee':
        return <CoffeeIcon className="w-5 h-5" />;
      default:
        return <HeartIcon className="w-5 h-5" />;
    }
  };

  return (
    <section id="gostos" className="scroll-mt-28 py-12">
      <SectionHeading
        title="O Que Eu Gosto"
        badgeText="Afinidades & Hobbies"
        icon={<HeartIcon className="w-7 h-7" />}
      />

      <div className="flex flex-wrap gap-3.5">
        {interestsData.map((interest) => (
          <div
            key={interest.id}
            className="group px-5 py-3 rounded-xl bg-brand-surface border border-brand-accent/20 hover:border-brand-accent hover:bg-brand-surfaceHover text-brand-text hover:text-brand-accent transition-all duration-200 cursor-default flex items-center gap-3 shadow-sm hover:scale-[1.02]"
          >
            <span className="text-brand-primary group-hover:text-brand-accent transition-colors">
              {renderInterestIcon(interest.iconKey)}
            </span>
            <div>
              <span className="font-semibold text-sm text-brand-heading block leading-snug">
                {interest.name}
              </span>
              <span className="text-[11px] text-brand-textMuted group-hover:text-brand-accent/80 transition-colors">
                {interest.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
