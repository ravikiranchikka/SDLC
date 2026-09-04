import Link from 'next/link';

import { cx } from '@/components/layout/Container';
import type { CtaLink, CtaVariant } from '@/types/content';

/**
 * Maps a {@link CtaVariant} to the matching component class declared in
 * `src/app/globals.css` (`@layer components`).
 *
 * The Tailwind config lives at the repository root and is out of scope for this
 * story, so brand colours are applied through these CSS classes rather than
 * custom Tailwind colour names.
 */
export function ctaVariantClass(variant: CtaVariant): string {
  switch (variant) {
    case 'primary':
      return 'btn-primary';
    case 'secondary':
      return 'btn-secondary';
    case 'ghost':
    default:
      return 'btn-ghost';
  }
}

export interface ButtonProps {
  /** The call-to-action to render, including label, href, variant and test id. */
  cta: CtaLink;
  /** Additional classes merged after the variant classes. */
  className?: string;
  /** Stretch the control to the full width of its container (mobile layouts). */
  fullWidth?: boolean;
  /**
   * Optional click handler. Only ever supplied by Client Components (for
   * example the mobile menu closing itself on navigation).
   */
  onClick?: () => void;
}

/**
 * Link-styled call-to-action primitive.
 *
 * Internal destinations are rendered with `next/link` so client-side navigation
 * and prefetching apply; external destinations (wa.me, tel:, mailto:) are
 * rendered as plain anchors. Off-site http(s) links additionally open in a new
 * tab with `rel="noopener noreferrer"`.
 */
export function Button({ cta, className, fullWidth = false, onClick }: ButtonProps) {
  const classes = cx('btn', ctaVariantClass(cta.variant), fullWidth ? 'w-full' : undefined, className);

  if (cta.external) {
    const opensNewTab = cta.href.startsWith('http://') || cta.href.startsWith('https://');

    return (
      <a
        className={classes}
        data-testid={cta.testId}
        href={cta.href}
        onClick={onClick}
        rel={opensNewTab ? 'noopener noreferrer' : undefined}
        target={opensNewTab ? '_blank' : undefined}
      >
        {cta.label}
      </a>
    );
  }

  return (
    <Link className={classes} data-testid={cta.testId} href={cta.href} onClick={onClick}>
      {cta.label}
    </Link>
  );
}
