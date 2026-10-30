import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG Search magnifying glass icon.
 *
 * @param props - Custom SVG attributes and styling classes.
 * @returns An inline SVG element inheriting Tailwind currentColor.
 */
export const SearchIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ariaLabel = 'Search', ...props }) => {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
};
