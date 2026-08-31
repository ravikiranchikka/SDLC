/**
 * SCRUM-31 - Home hero.
 *
 * The above-the-fold conversion block (AC-3): a single `h1`, a supporting
 * sentence, the primary "Book Online Consultation" call-to-action routed to
 * `/online-consultation`, and the secondary WhatsApp click-to-chat action.
 *
 * Layout notes:
 *  - mobile-first single column; the media column only appears alongside the
 *    copy from `lg` upwards, so at 360px the two CTAs sit immediately below the
 *    subheading and remain above the fold (AC-2, AC-3);
 *  - the buttons are full width on the narrowest viewport and shrink to their
 *    content from `sm`, keeping the >=44px tap target in both states.
 *
 * Performance (AC-4): the hero image is the Largest Contentful Paint candidate,
 * so it is rendered through `next/image` with `priority` (no lazy loading, and
 * a preload hint) plus explicit intrinsic dimensions and a `sizes` hint so the
 * optimiser serves an appropriately scaled AVIF/WebP variant to mobile.
 *
 * Presentational only - every string and href comes from the content slot.
 */

import Image from 'next/image';

import type { ContentSlot, HeroContent } from '../../types/content';
import { Button } from '../ui/Button';
import { PlaceholderBadge } from '../ui/PlaceholderBadge';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

/** Id of the hero heading, referenced by the section's `aria-labelledby`. */
const HERO_HEADING_ID = 'hero-heading';

export interface HeroSectionProps {
  /** Hero content slot from `src/content/home`. */
  readonly slot: ContentSlot<HeroContent>;
}

/**
 * Render the Home page hero band.
 *
 * @example
 * <HeroSection slot={homeContent.hero} />
 */
export function HeroSection({ slot }: HeroSectionProps) {
  const hero = slot.value;

  return (
    <Section
      slot={slot}
      testId="hero"
      tone="default"
      labelledBy={HERO_HEADING_ID}
      containerClassName="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14"
    >
      <div className="flex w-full min-w-0 flex-col gap-6">
        <SectionHeading
          level={1}
          eyebrow={hero.eyebrow}
          heading={hero.heading}
          subheading={hero.subheading}
          headingId={HERO_HEADING_ID}
          badge={<PlaceholderBadge slot={slot} />}
        />

        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            href={hero.primaryCta.href}
            variant={hero.primaryCta.variant}
            isExternal={hero.primaryCta.isExternal}
            testId="hero-primary-cta"
            className="w-full sm:w-auto"
          >
            {hero.primaryCta.label}
          </Button>

          <Button
            href={hero.secondaryCta.href}
            variant={hero.secondaryCta.variant}
            isExternal={hero.secondaryCta.isExternal}
            testId="hero-secondary-cta"
            className="w-full sm:w-auto"
          >
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>

      <div className="w-full min-w-0">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-auto w-full rounded-2xl border border-hairline object-cover"
        />
      </div>
    </Section>
  );
}
