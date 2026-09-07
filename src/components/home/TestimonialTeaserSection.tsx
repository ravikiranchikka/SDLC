/**
 * SCRUM-31 - Testimonial teaser.
 *
 * A short excerpt of patient testimonials with a link through to the full
 * Testimonials route. One column at 360px and two from `md`; the grid never
 * sets a fixed pixel width, so it cannot cause horizontal overflow on the
 * smallest supported viewport (AC-2).
 *
 * AC-5: quotes are published only once written consent is on file, so the slot
 * normally holds the documented placeholder set. The section renders whatever
 * the slot holds, publishes `data-content-status` via `Section` and shows the
 * review badge - it never throws and never blanks the page. An empty list
 * degrades to the heading alone.
 */

import Link from 'next/link';

import type { ContentSlot, Testimonial } from '../../types/content';
import { PlaceholderBadge } from '../ui/PlaceholderBadge';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

/** Id of the section heading, referenced by `aria-labelledby`. */
const TESTIMONIALS_HEADING_ID = 'testimonial-teaser-heading';

/**
 * Structural section chrome - navigational labels rather than client-supplied
 * marketing copy. Overridable per-instance through props.
 */
const DEFAULT_EYEBROW = 'In their words';
const DEFAULT_HEADING = 'What our patients say';
const DEFAULT_SUBHEADING =
  'A short selection of patient feedback, published only with written consent.';
const DEFAULT_LINK_LABEL = 'Read all testimonials';

export interface TestimonialTeaserSectionProps {
  /** Testimonials content slot from `src/content/home`. */
  readonly slot: ContentSlot<readonly Testimonial[]>;
  /** Optional override for the small label above the heading. */
  readonly eyebrow?: string;
  /** Optional override for the section heading. */
  readonly heading?: string;
  /** Optional override for the supporting sentence. */
  readonly subheading?: string;
  /** Destination of the "read all" link. */
  readonly href?: string;
  /** Visible label of the "read all" link. */
  readonly linkLabel?: string;
}

/**
 * Render the Home page testimonial teaser.
 *
 * @example
 * <TestimonialTeaserSection slot={homeContent.testimonials} />
 */
export function TestimonialTeaserSection({
  slot,
  eyebrow = DEFAULT_EYEBROW,
  heading = DEFAULT_HEADING,
  subheading = DEFAULT_SUBHEADING,
  href = '/testimonials',
  linkLabel = DEFAULT_LINK_LABEL,
}: TestimonialTeaserSectionProps) {
  const testimonials = slot.value;

  return (
    <Section
      slot={slot}
      testId="testimonial-teaser"
      tone="muted"
      labelledBy={TESTIMONIALS_HEADING_ID}
      containerClassName="flex flex-col gap-8 md:gap-12"
    >
      <SectionHeading
        level={2}
        eyebrow={eyebrow}
        heading={heading}
        subheading={subheading}
        headingId={TESTIMONIALS_HEADING_ID}
        badge={<PlaceholderBadge slot={slot} />}
      />

      {testimonials.length === 0 ? null : (
        <ul className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id} className="min-w-0">
              <figure
                data-testid="testimonial-card"
                data-testimonial-id={testimonial.id}
                className="flex h-full min-w-0 flex-col gap-4 rounded-2xl border border-hairline bg-surface p-6"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  className="h-7 w-7 shrink-0 text-brand-500"
                  fill="currentColor"
                >
                  <path d="M9.5 6C6.5 7.6 5 10.2 5 13.8V18h5.6v-5.6H8.2c0-2 .8-3.4 2.5-4.2L9.5 6zm8.4 0c-3 1.6-4.5 4.2-4.5 7.8V18H19v-5.6h-2.4c0-2 .8-3.4 2.5-4.2L17.9 6z" />
                </svg>

                <blockquote className="min-w-0 text-base leading-relaxed text-ink-900">
                  {testimonial.quote}
                </blockquote>

                <figcaption className="mt-auto min-w-0 text-sm text-ink-600">
                  <span className="font-semibold text-ink-900">
                    {testimonial.author}
                  </span>
                  <span className="block">{testimonial.context}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}

      <Link
        data-testid="testimonials-index-link"
        href={href}
        className="inline-flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {linkLabel}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h13" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </Link>
    </Section>
  );
}
