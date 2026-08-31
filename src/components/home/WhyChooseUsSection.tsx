/**
 * SCRUM-31 - Why choose us.
 *
 * Value-proposition grid: one column at 360px, two from `sm` and four from
 * `lg`. Each item pairs a short reassurance statement with an inline SVG icon.
 *
 * Performance (AC-4): the icons are inline SVG drawn with `currentColor`, so
 * they add no network requests, no icon-font payload and no layout shift.
 *
 * AC-5: the section renders whatever the slot holds - approved copy or the
 * documented placeholder set - and publishes the slot status through
 * `Section`, so unapproved content is visible without breaking the build.
 */

import type { ReactNode } from 'react';

import type { ContentSlot, ValueProp } from '../../types/content';
import { PlaceholderBadge } from '../ui/PlaceholderBadge';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

/** The icon keys allowed by the shared `ValueProp` type. */
type ValuePropIcon = ValueProp['icon'];

/** Id of the section heading, referenced by `aria-labelledby`. */
const WHY_HEADING_ID = 'why-choose-us-heading';

/**
 * Structural section chrome - navigational labels rather than client-supplied
 * marketing copy. Overridable per-instance through props.
 */
const DEFAULT_EYEBROW = 'Why patients choose us';
const DEFAULT_HEADING = 'Care built around your day';
const DEFAULT_SUBHEADING =
  'Clear pricing, qualified clinicians and an inquiry path that never takes more than one tap.';

/**
 * Icon geometry keyed by the `ValueProp.icon` union. Every path is stroked with
 * `currentColor` so the icon inherits the surrounding text colour.
 */
const ICON_PATHS: Readonly<Record<ValuePropIcon, ReactNode>> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.7 3.7 5.7 3.7 9s-1.3 6.3-3.7 9c-2.4-2.7-3.7-5.7-3.7-9S9.6 5.7 12 3z" />
    </>
  ),
  heart: <path d="M12 20s-7-4.3-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.7-7 9-7 9z" />,
};

export interface WhyChooseUsSectionProps {
  /** Value-proposition content slot from `src/content/home`. */
  readonly slot: ContentSlot<readonly ValueProp[]>;
  /** Optional override for the small label above the heading. */
  readonly eyebrow?: string;
  /** Optional override for the section heading. */
  readonly heading?: string;
  /** Optional override for the supporting sentence. */
  readonly subheading?: string;
}

/**
 * Render the Home page value-proposition grid.
 *
 * @example
 * <WhyChooseUsSection slot={homeContent.whyChooseUs} />
 */
export function WhyChooseUsSection({
  slot,
  eyebrow = DEFAULT_EYEBROW,
  heading = DEFAULT_HEADING,
  subheading = DEFAULT_SUBHEADING,
}: WhyChooseUsSectionProps) {
  const valueProps = slot.value;

  return (
    <Section
      slot={slot}
      testId="why-choose-us"
      tone="default"
      labelledBy={WHY_HEADING_ID}
      containerClassName="flex flex-col gap-8 md:gap-12"
    >
      <SectionHeading
        level={2}
        eyebrow={eyebrow}
        heading={heading}
        subheading={subheading}
        headingId={WHY_HEADING_ID}
        badge={<PlaceholderBadge slot={slot} />}
      />

      {valueProps.length === 0 ? null : (
        <ul className="grid w-full min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((valueProp) => (
            <li
              key={valueProp.id}
              data-testid="value-prop"
              data-value-prop-id={valueProp.id}
              className="flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-hairline bg-surface-muted p-5"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICON_PATHS[valueProp.icon]}
                </svg>
              </span>

              <h3 className="text-lg font-semibold tracking-tight text-ink-900">
                {valueProp.title}
              </h3>

              <p className="text-base leading-relaxed text-ink-600">{valueProp.body}</p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
