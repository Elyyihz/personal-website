import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG Magic Wand / Fantasy stars icon.
 *
 * @param props - Custom SVG attributes and styling classes.
 * @returns An inline SVG element inheriting Tailwind currentColor.
 */
export const WandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ariaLabel = 'Magic', ...props }) => {
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
      <path d="m21 21-4.3-4.3" />
      <path d="m14 10 3.3-3.3a2 2 0 1 0-2.8-2.8L11.2 7" />
      <path d="m10 14-3.3 3.3a2 2 0 1 1-2.8-2.8L7.2 11.2" />
      <path d="m7 7 2 2" />
      <path d="m15 15 2 2" />
    </svg>
  );
};
