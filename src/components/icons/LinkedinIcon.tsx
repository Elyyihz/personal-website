import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG LinkedIn brand logo utilizing currentColor.
 *
 * @param props - Custom SVG attributes and styling classes.
 * @returns An inline SVG element inheriting Tailwind currentColor.
 */
export const LinkedinIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ariaLabel = 'LinkedIn', ...props }) => {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
};
