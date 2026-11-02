import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { UserIcon, MapPinIcon, ActivityIcon, HexagonIcon, CoffeeIcon, HeartIcon } from '@/components/icons';
import { getRegisteredIcon } from '@/components/icons/registry';
import { useData } from '@/context/DataContext';

/**
 * About Me section presenting biographical background, architectural philosophy,
 * core personal traits, and dynamically integrated personal affinities and hobbies.
 */
export const AboutMeSection: React.FC = () => {
  const { profile, hobbies } = useData();

  /**
   * Helper mapping trait keys to corresponding inline SVG icons.
   *
   * @param iconKey - Distinct key string assigned to each profile trait.
   * @returns Inline SVG element.
   */
  const renderTraitIcon = (iconKey?: string) => {
    switch (iconKey) {
      case 'location':
        return <MapPinIcon className="w-4 h-4 text-brand-primary" />;
      case 'focus':
        return <ActivityIcon className="w-4 h-4 text-brand-accent" />;
      case 'mbti':
        return <HexagonIcon className="w-4 h-4 text-brand-accent" />;
      case 'coffee':
        return <CoffeeIcon className="w-4 h-4 text-brand-primary" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-brand-accent" />;
    }
  };

  return (
    <section id="sobre" className="scroll-mt-24 py-4 md:py-6 space-y-8">
      <div>
        <SectionHeading
          title="Sobre mim"
          badgeText="Trajetória & Filosofia"
          icon={<UserIcon className="w-7 h-7" />}
        />

        <div className="bg-brand-surface rounded-2xl p-8 border border-brand-accent/20 hover:border-brand-accent/45 transition-colors shadow-xl">
          <p className="text-brand-text text-lg leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>

          {/* Traits & Personal Attributes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-brand-accent/15">
            {profile.traits.map((trait) => (
              <div key={trait.label} className="space-y-1.5">
                <span className="block text-xs font-semibold text-brand-textMuted uppercase tracking-wider">
                  {trait.label}
                </span>
                <div className="flex items-center gap-2 text-brand-heading font-medium text-base">
                  {renderTraitIcon(trait.iconKey)}
                  <span>{trait.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integrated Gostos, Afinidades & Interesses Sub-Section */}
      <div id="gostos" className="scroll-mt-24 pt-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-accent">
            <HeartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-heading">Gostos, Afinidades &amp; Interesses</h3>
            <p className="text-xs text-brand-textMuted">
              Tecnologias favoritas, jogos, universos de ficção e hobbies que inspiram meu dia a dia.
            </p>
          </div>
        </div>

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
      </div>
    </section>
  );
};
