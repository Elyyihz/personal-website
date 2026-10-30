import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG TV / Monitor icon for Watching section.
 *
 * @param props - Custom SVG attributes and styling classes.
 * @returns An inline SVG element inheriting Tailwind currentColor.
 */
export const TvIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ariaLabel = 'Watching', ...props }) => {
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
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
};
