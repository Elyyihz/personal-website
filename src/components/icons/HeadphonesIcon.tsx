import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG Headphones icon for Currently Consuming section.
 *
 * @param props - Custom SVG attributes and styling classes.
 * @returns An inline SVG element inheriting Tailwind currentColor.
 */
export const HeadphonesIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ariaLabel = 'Headphones', ...props }) => {
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
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
};
