/**
 * SCRUM-31 - Section wrapper.
 *
 * Every page section is rendered through this component so that:
 *  - vertical rhythm (`py-12 md:py-20`) and gutters are applied in exactly one
 *    place, and no section can introduce a fixed width that would cause
 *    horizontal scrolling at 360px (AC-2);
 *  - the content-status of the section's slot is published into the DOM as
 *    `data-content-status` / `data-content-id`, which makes "this section is
 *    still showing documented placeholder copy" machine-checkable (AC-5);
 *  - the agreed `data-testid` hooks stay stable for the Playwright suites.
 *
 * Presentational only - it never inspects the slot's `value`, so it works for
 * any content shape.
 */

import type { ReactNode } from 'react';

import type { ContentSlot } from '../../types/content';
import { Container } from '../layout/Container';

/** Background treatment for a section band. */
export type SectionTone = 'default' | 'muted' | 'brand';

const TONE_CLASSES: Readonly<Record<SectionTone, string>> = {
  default: 'bg-surface text-ink-900',
  muted: 'bg-surface-muted text-ink-900',
  brand: 'bg-brand-600 text-white',
};

/** Shared vertical rhythm for every section band. */
const SECTION_BASE = 'w-full min-w-0 py-12 md:py-20';

export interface SectionProps {
  /**
   * The content slot backing this section. Its `id` and `status` are exposed
   * on the section element; the value itself is rendered by `children`.
   */
  readonly slot: ContentSlot<unknown>;
  /** Stable test hook, e.g. `hero`, `services-teaser`, `cta-band`. */
  readonly testId: string;
  /** Section body. */
  readonly children: ReactNode;
  /** Background treatment. Defaults to `default`. */
  readonly tone?: SectionTone;
  /** DOM id, used for in-page anchors. */
  readonly id?: string;
  /** Id of the heading that names this section, for `aria-labelledby`. */
  readonly labelledBy?: string;
  /** Accessible name when there is no visible heading to reference. */
  readonly ariaLabel?: string;
  /** Extra utility classes appended to the outer `<section>`. */
  readonly className?: string;
  /** Extra utility classes appended to the inner container. */
  readonly containerClassName?: string;
}

/**
 * Render a page section band with shared rhythm and content-status metadata.
 *
 * @example
 * <Section slot={homeContent.services} testId="services-teaser" tone="muted">
 *   ...
 * </Section>
 */
export function Section({
  slot,
  testId,
  children,
  tone = 'default',
  id,
  labelledBy,
  ariaLabel,
  className,
  containerClassName,
}: SectionProps) {
  const sectionClasses = [
    SECTION_BASE,
    TONE_CLASSES[tone],
    typeof className === 'string' ? className : '',
  ]
    .filter((value) => value.length > 0)
    .join(' ');

  return (
    <section
      id={id}
      data-testid={testId}
      data-content-id={slot.id}
      data-content-status={slot.status}
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      className={sectionClasses}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
