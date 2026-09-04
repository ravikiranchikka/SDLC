import type { ReactNode } from 'react';

import { cx } from '@/components/layout/Container';

/** Heading levels a section heading may render as. */
export type SectionHeadingLevel = 'h1' | 'h2' | 'h3';

export interface SectionHeadingProps {
  /** Small uppercase label rendered above the heading. */
  eyebrow?: string;
  /** The heading text itself. */
  heading: string;
  /** Optional supporting paragraph rendered beneath the heading. */
  intro?: string;
  /** Semantic heading level. Defaults to `h2` (pages own their single `h1`). */
  as?: SectionHeadingLevel;
  /** Optional id applied to the heading element, e.g. for `aria-labelledby`. */
  id?: string;
  /** Horizontal alignment of the block. Defaults to `start`. */
  align?: 'start' | 'center';
  /** Extra classes merged onto the wrapping element. */
  className?: string;
  /**
   * Optional slot rendered directly beneath the eyebrow - typically a
   * `<PlaceholderBadge />` flagging unapproved content (AC-5).
   */
  children?: ReactNode;
}

/**
 * Reusable eyebrow / heading / intro block.
 *
 * Keeps section typography and spacing consistent across the Home page while
 * still allowing each section to choose the correct heading level for document
 * outline purposes. Server Component: no hooks or browser APIs.
 */
export function SectionHeading({
  eyebrow,
  heading,
  intro,
  as = 'h2',
  id,
  align = 'start',
  className,
  children,
}: SectionHeadingProps) {
  const HeadingTag = as;
  const centred = align === 'center';

  const headingSizeClass =
    as === 'h1'
      ? 'text-3xl sm:text-4xl lg:text-5xl'
      : as === 'h2'
        ? 'text-2xl sm:text-3xl'
        : 'text-xl sm:text-2xl';

  return (
    <div
      className={cx(
        'flex w-full max-w-2xl flex-col gap-3',
        centred ? 'mx-auto items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow m-0 break-words">{eyebrow}</p> : null}

      {children}

      <HeadingTag className={cx('m-0 break-words', headingSizeClass)} id={id}>
        {heading}
      </HeadingTag>

      {intro ? (
        <p className="m-0 break-words text-base text-[color:var(--ink-600)] sm:text-lg">{intro}</p>
      ) : null}
    </div>
  );
}
