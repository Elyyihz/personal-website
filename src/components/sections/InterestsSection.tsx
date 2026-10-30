import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { HeartIcon } from '@/components/icons';
import { getRegisteredIcon } from '@/components/icons/registry';
import { useData } from '@/context/DataContext';

/**
 * Interests section ("O que eu gosto") displaying affinities, games, literature, and hobbies.
 * Dynamically rendered from DataContext with local SVG Icon Registry integration.
 */
export const InterestsSection: React.FC = () => {
  const { hobbies } = useData();

  return (
    <section id="gostos" className="scroll-mt-28 py-12">
      <SectionHeading
        title="O Que Eu Gosto"
        badgeText="Afinidades & Hobbies"
        icon={<HeartIcon className="w-7 h-7" />}
      />

      <div className="flex flex-wrap gap-3.5">
        {hobbies.map((interest) => {
          const IconComp = getRegisteredIcon(interest.iconSlug);

          return (
            <div
              key={interest.id}
              className="group px-5 py-3 rounded-xl bg-brand-surface border border-brand-accent/20 hover:border-brand-accent hover:bg-brand-surfaceHover text-brand-text hover:text-brand-accent transition-all duration-200 cursor-default flex items-center gap-3 shadow-sm hover:scale-[1.02]"
            >
              <span className="text-brand-primary group-hover:text-brand-accent transition-colors">
                <IconComp className="w-5 h-5" />
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
          );
        })}
      </div>
    </section>
  );
};
