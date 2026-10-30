import React from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { UserIcon, MapPinIcon, ActivityIcon, HexagonIcon, CoffeeIcon } from '@/components/icons';
import { profileData } from '@/data/profileData';

/**
 * About Me section presenting biographical background, architectural philosophy, and core personal traits.
 */
export const AboutMeSection: React.FC = () => {
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
    <section id="sobre" className="scroll-mt-28 py-12">
      <SectionHeading
        title="Sobre mim"
        badgeText="Trajetória & Filosofia"
        icon={<UserIcon className="w-7 h-7" />}
      />

      <div className="bg-brand-surface rounded-2xl p-8 border border-brand-accent/20 hover:border-brand-accent/45 transition-colors shadow-xl">
        <p className="text-brand-text text-lg leading-relaxed">
          {profileData.bio}
        </p>

        {/* Traits & Personal Attributes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-brand-accent/15">
          {profileData.traits.map((trait) => (
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
    </section>
  );
};
