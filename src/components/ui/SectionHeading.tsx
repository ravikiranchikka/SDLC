/**
 * SCRUM-31 - Section heading block.
 *
 * The single typography treatment for an eyebrow / heading / subheading trio,
 * used by every Home section and by the stub routes so headings stay
 * consistent and the document outline stays predictable.
 *
 * The heading level is explicit (`level`) rather than inferred, so a page can
 * keep exactly one `h1` while its sections use `h2`.
 *
 * `badge` is a render slot: sections pass `<PlaceholderBadge ... />` into it
 * when their content is still awaiting client approval (AC-5). Keeping it as a
 * slot means this component owns typography only and has no knowledge of the
 * content-status model.
 */

import type { ReactNode } from 'react';

/** Semantic heading level rendered for the main heading. */
export type SectionHeadingLevel = 1 | 2 | 3;

/** Horizontal alignment of the block. */
export type SectionHeadingAlign = 'left' | 'center';

/** Colour treatment - `inverse` is used on the dark CTA band. */
export type SectionHeadingTone = 'default' | 'inverse';

const HEADING_CLASSES: Readonly<Record<SectionHeadingLevel, string>> = {
  1: 'text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl',
  2: 'text-2xl font-semibold tracking-tight sm:text-3xl',
  3: 'text-xl font-semibold tracking-tight sm:text-2xl',
};

const TONE_CLASSES: Readonly<
  Record<SectionHeadingTone, { heading: string; eyebrow: string; subheading: string }>
> = {
  default: {
    heading: 'text-ink-900',
    eyebrow: 'text-brand-700',
    subheading: 'text-ink-600',
  },
  inverse: {
    heading: 'text-white',
    eyebrow: 'text-brand-100',
    subheading: 'text-brand-50',
  },
};

const ALIGN_CLASSES: Readonly<Record<SectionHeadingAlign, string>> = {
  left: 'text-left',
  center: 'mx-auto text-center',
};

export interface SectionHeadingProps {
  /** Main heading copy. Always supplied from a content module. */
  readonly heading: string;
  /** Small label rendered above the heading. */
  readonly eyebrow?: string;
  /** Supporting sentence rendered below the heading. */
  readonly subheading?: string;
  /** Semantic level for the heading element. Defaults to `2`. */
  readonly level?: SectionHeadingLevel;
  /** Horizontal alignment. Defaults to `left`. */
  readonly align?: SectionHeadingAlign;
  /** Colour treatment. Defaults to `default`. */
  readonly tone?: SectionHeadingTone;
  /** DOM id for the heading, so a section can reference it via aria-labelledby. */
  readonly headingId?: string;
  /** Optional render slot for a content-status marker. */
  readonly badge?: ReactNode;
  /** Extra utility classes appended to the wrapper. */
  readonly className?: string;
}

/**
 * Render the shared eyebrow / heading / subheading typography block.
 *
 * @example
 * <SectionHeading
 *   eyebrow="What we do"
 *   heading="Care that fits around your day"
 *   headingId="services-heading"
 * />
 */
export function SectionHeading({
  heading,
  eyebrow,
  subheading,
  level = 2,
  align = 'left',
  tone = 'default',
  headingId,
  badge,
  className,
}: SectionHeadingProps) {
  const toneClasses = TONE_CLASSES[tone];

  const wrapperClasses = [
    'flex w-full min-w-0 max-w-2xl flex-col gap-3',
    ALIGN_CLASSES[align],
    typeof className === 'string' ? className : '',
  ]
    .filter((value) => value.length > 0)
    .join(' ');

  const headingClasses = `${HEADING_CLASSES[level]} ${toneClasses.heading}`;

  const headingElement =
    level === 1 ? (
      <h1 id={headingId} className={headingClasses}>
        {heading}
      </h1>
    ) : level === 2 ? (
      <h2 id={headingId} className={headingClasses}>
        {heading}
      </h2>
    ) : (
      <h3 id={headingId} className={headingClasses}>
        {heading}
      </h3>
    );

  return (
    <div className={wrapperClasses}>
      {typeof eyebrow === 'string' && eyebrow.length > 0 ? (
        <p
          className={`text-sm font-semibold uppercase tracking-wide ${toneClasses.eyebrow}`}
        >
          {eyebrow}
        </p>
      ) : null}

      {headingElement}

      {typeof subheading === 'string' && subheading.length > 0 ? (
        <p className={`text-base leading-relaxed ${toneClasses.subheading}`}>
          {subheading}
        </p>
      ) : null}

      {badge === undefined || badge === null ? null : (
        <div
          className={
            align === 'center' ? 'flex justify-center' : 'flex justify-start'
          }
        >
          {badge}
        </div>
      )}
    </div>
  );
}
