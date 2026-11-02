import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG White Flag icon representing peaceful respite and Cozy Mode trigger.
 * Inherits Tailwind currentColor for seamless styling.
 */
export const WhiteFlagIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  ariaLabel = 'Bandeira Branca',
  ...props
}) => {
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
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
};
