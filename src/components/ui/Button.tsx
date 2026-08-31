/**
 * SCRUM-31 - Button primitive.
 *
 * Every call-to-action in this story is a navigation action, so `Button`
 * renders a link rather than a `<button>`:
 *  - internal routes render `next/link` for client-side navigation;
 *  - external destinations (WhatsApp click-to-chat, `tel:`, `mailto:`) render
 *    a plain anchor with `target="_blank"` and `rel="noopener noreferrer"`.
 *
 * The base classes guarantee a >=44px tap target (`min-h-11`) and a visible
 * keyboard focus ring, which is what makes the hero CTAs usable on a 360px
 * viewport (AC-2, AC-3).
 *
 * Presentational only: it imports types and pure helpers, never `src/app`.
 * The optional `onClick` handler exists so the mobile menu can close itself
 * when a CTA is followed; server components simply omit it.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { isExternalHref } from '../../lib/links';

/** Visual weight of the call-to-action. */
export type ButtonVariant = 'primary' | 'secondary';

/** Classes shared by both variants - tap target, shape and focus ring. */
const BUTTON_BASE =
  'inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-5 text-center text-sm font-semibold leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:text-base';

/** Variant-specific colour treatment, built only from theme tokens. */
const VARIANT_CLASSES: Readonly<Record<ButtonVariant, string>> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-white text-brand-700 ring-1 ring-brand-600 hover:bg-brand-50',
};

export interface ButtonProps {
  /** Destination of the call-to-action. */
  readonly href: string;
  /** Visible label (and any inline icon) for the control. */
  readonly children: ReactNode;
  /** Visual weight. Defaults to `primary`. */
  readonly variant?: ButtonVariant;
  /**
   * Force external-link handling. When omitted the decision is made by
   * `isExternalHref`, so `https://wa.me/...`, `tel:` and `mailto:` hrefs are
   * handled correctly without every caller having to remember the flag.
   */
  readonly isExternal?: boolean;
  /** Optional click handler, used by the mobile menu to close itself. */
  readonly onClick?: () => void;
  /** Extra utility classes appended after the variant classes. */
  readonly className?: string;
  /** Optional `data-testid` forwarded to the rendered element. */
  readonly testId?: string;
  /** Accessible name override when the visible label is not descriptive enough. */
  readonly ariaLabel?: string;
}

/**
 * Render a styled call-to-action link.
 *
 * @example
 * <Button href="/online-consultation" variant="primary" testId="hero-primary-cta">
 *   Book Online Consultation
 * </Button>
 */
export function Button({
  href,
  children,
  variant = 'primary',
  isExternal,
  onClick,
  className,
  testId,
  ariaLabel,
}: ButtonProps) {
  const treatAsExternal: boolean =
    typeof isExternal === 'boolean' ? isExternal : isExternalHref(href);

  const classes =
    typeof className === 'string' && className.length > 0
      ? `${BUTTON_BASE} ${VARIANT_CLASSES[variant]} ${className}`
      : `${BUTTON_BASE} ${VARIANT_CLASSES[variant]}`;

  if (treatAsExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        aria-label={ariaLabel}
        data-testid={testId}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      data-testid={testId}
      className={classes}
    >
      {children}
    </Link>
  );
}
