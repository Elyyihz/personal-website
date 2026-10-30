import React from 'react';

/**
 * Props definition for the reusable section title component.
 */
interface SectionHeadingProps {
  /** Main section title text */
  title: string;

  /** Optional short pill eyebrow badge text */
  badgeText?: string;

  /** Inline SVG icon representing the section theme */
  icon?: React.ReactNode;

  /** Optional right-aligned secondary accessory (e.g. counter badge or link) */
  accessory?: React.ReactNode;
}

/**
 * Standardized section title header with icon integration and optional accessory.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  badgeText,
  icon,
  accessory,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-accent/10 border border-brand-accent/25">
            {badgeText}
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-heading flex items-center gap-3 tracking-tight">
          {icon && <span className="text-brand-accent">{icon}</span>}
          <span>{title}</span>
        </h2>
      </div>
      {accessory && <div>{accessory}</div>}
    </div>
  );
};
