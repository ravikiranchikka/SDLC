/**
 * SCRUM-31 - Closing call-to-action band.
 *
 * The final conversion opportunity on the Home page: it repeats the two hero
 * calls-to-action (online consultation and WhatsApp) on the brand background
 * so a visitor who has scrolled the whole page never has to scroll back up.
 *
 * The CTAs stack at 360px and sit side by side from `sm`; both are rendered
 * through `Button`, which guarantees the >=44px tap target, the visible focus
 * ring and the correct external-link handling for the WhatsApp URL (AC-2).
 *
 * AC-5: the slot's status is published through `Section`, so the band is
 * machine-checkable in exactly the same way as every other section.
 */

import type { ContentSlot, CtaBandContent } from '../../types/content';
import { Button } from '../ui/Button';
import { PlaceholderBadge } from '../ui/PlaceholderBadge';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

/** Id of the band heading, referenced by `aria-labelledby`. */
const CTA_BAND_HEADING_ID = 'cta-band-heading';

export interface CtaBandSectionProps {
  /** Closing call-to-action content slot from `src/content/home`. */
  readonly slot: ContentSlot<CtaBandContent>;
}

/**
 * Render the Home page closing call-to-action band.
 *
 * @example
 * <CtaBandSection slot={homeContent.ctaBand} />
 */
export function CtaBandSection({ slot }: CtaBandSectionProps) {
  const { heading, body, primaryCta, secondaryCta } = slot.value;

  return (
    <Section
      slot={slot}
      testId="cta-band"
      tone="brand"
      labelledBy={CTA_BAND_HEADING_ID}
      containerClassName="flex flex-col items-center gap-8 text-center"
    >
      <SectionHeading
        level={2}
        align="center"
        tone="inverse"
        heading={heading}
        subheading={body}
        headingId={CTA_BAND_HEADING_ID}
        badge={<PlaceholderBadge slot={slot} />}
      />

      <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
        <Button
          href={primaryCta.href}
          variant="secondary"
          isExternal={primaryCta.isExternal}
          testId="cta-band-primary-cta"
        >
          {primaryCta.label}
        </Button>

        <Button
          href={secondaryCta.href}
          variant="secondary"
          isExternal={secondaryCta.isExternal}
          testId="cta-band-secondary-cta"
        >
          {secondaryCta.label}
        </Button>
      </div>
    </Section>
  );
}
