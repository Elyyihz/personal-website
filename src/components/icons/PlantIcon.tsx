import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG Plant / Seedling icon for cozy gaming / nature interests.
 *
 * @param props - Custom SVG attributes and styling classes.
 * @returns An inline SVG element inheriting Tailwind currentColor.
 */
export const PlantIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ariaLabel = 'Plant', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      role="img"
      {...props}
    >
      <path d="M12 22c0-4-3-8-8-8" />
      <path d="M12 22c0-4 3-8 8-8" />
      <path d="M12 2v20" />
      <path d="M12 8c4 0 8-3 8-8" />
    </svg>
  );
};
