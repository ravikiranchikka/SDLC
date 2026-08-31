/**
 * SCRUM-31 - Services teaser.
 *
 * A responsive card grid summarising the clinic's services and linking through
 * to the individual service routes. One column at 360px, two from `sm` and
 * three from `lg`; the grid never sets a fixed pixel width, so it cannot cause
 * horizontal overflow on the smallest supported viewport (AC-2).
 *
 * Performance (AC-4): every thumbnail is rendered through `next/image` with
 * `loading="lazy"`, intrinsic dimensions from the content module and a `sizes`
 * hint matching the grid breakpoints, so below-the-fold media never competes
 * with the hero for bandwidth.
 *
 * AC-5: when the services slot is still a placeholder the section renders the
 * documented placeholder cards, publishes `data-content-status="placeholder"`
 * via `Section` and shows the review badge - it never throws and never blanks
 * the page. An empty list degrades to the heading alone.
 */

import Image from 'next/image';
import Link from 'next/link';

import type { ContentSlot, ServiceTeaser } from '../../types/content';
import { PlaceholderBadge } from '../ui/PlaceholderBadge';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

/** Id of the section heading, referenced by `aria-labelledby`. */
const SERVICES_HEADING_ID = 'services-teaser-heading';

/**
 * Structural section chrome. These are navigational labels rather than
 * client-supplied marketing copy, and can be overridden per-instance through
 * props if a later story moves them into the content module.
 */
const DEFAULT_EYEBROW = 'What we treat';
const DEFAULT_HEADING = 'Our services';
const DEFAULT_SUBHEADING =
  'Browse the treatments we offer and read what each appointment involves before you book.';

export interface ServicesTeaserSectionProps {
  /** Services content slot from `src/content/home`. */
  readonly slot: ContentSlot<readonly ServiceTeaser[]>;
  /** Optional override for the small label above the heading. */
  readonly eyebrow?: string;
  /** Optional override for the section heading. */
  readonly heading?: string;
  /** Optional override for the supporting sentence. */
  readonly subheading?: string;
}

/**
 * Render the Home page services teaser grid.
 *
 * @example
 * <ServicesTeaserSection slot={homeContent.services} />
 */
export function ServicesTeaserSection({
  slot,
  eyebrow = DEFAULT_EYEBROW,
  heading = DEFAULT_HEADING,
  subheading = DEFAULT_SUBHEADING,
}: ServicesTeaserSectionProps) {
  const services = slot.value;

  return (
    <Section
      slot={slot}
      testId="services-teaser"
      tone="muted"
      labelledBy={SERVICES_HEADING_ID}
      containerClassName="flex flex-col gap-8 md:gap-12"
    >
      <SectionHeading
        level={2}
        eyebrow={eyebrow}
        heading={heading}
        subheading={subheading}
        headingId={SERVICES_HEADING_ID}
        badge={<PlaceholderBadge slot={slot} />}
      />

      {services.length === 0 ? null : (
        <ul className="grid w-full min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.id} className="min-w-0">
              <Link
                data-testid="service-card"
                data-service-id={service.id}
                href={service.href}
                className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition-colors hover:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  width={service.image.width}
                  height={service.image.height}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-44 w-full object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-ink-900">
                    {service.title}
                  </h3>

                  <p className="text-base leading-relaxed text-ink-600">
                    {service.summary}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-brand-700">
                    Learn more
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
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
