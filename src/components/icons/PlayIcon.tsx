import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG Play triangle icon.
 *
 * @param props - Custom SVG attributes and styling classes.
 * @returns An inline SVG element inheriting Tailwind currentColor.
 */
export const PlayIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ariaLabel = 'Play', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-label={ariaLabel}
      role="img"
      {...props}
    >
      <path fill="currentColor" d="M5 3l14 9-14 9V3z" />
    </svg>
  );
};
