import type { SVGProps } from 'react';

/**
 * Standard interface for SVG inline icon components.
 * Strictly guarantees support for Tailwind currentColor inheritance without emoji dependencies.
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * Tailwind class string controlling dimensions, transitions, and text colors.
   * Default fallback is applied by individual icon components when omitted.
   */
  className?: string;

  /**
   * Accessible text label describing the icon purpose for screen readers.
   */
  ariaLabel?: string;
}
