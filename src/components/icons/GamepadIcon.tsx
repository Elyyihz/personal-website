import React from 'react';
import type { IconProps } from '@/types/icon';

/**
 * Inline SVG Gamepad controller icon.
 *
 * @param props - Custom SVG attributes and styling classes.
 * @returns An inline SVG element inheriting Tailwind currentColor.
 */
export const GamepadIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', ariaLabel = 'Gamepad', ...props }) => {
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
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 12h4" />
      <path d="M8 10v4" />
      <path d="M15 13h.01" />
      <path d="M18 11h.01" />
    </svg>
  );
};
