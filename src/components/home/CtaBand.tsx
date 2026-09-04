import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { PlaceholderBadge } from '@/components/ui/PlaceholderBadge';
import type { CtaBandContent } from '@/types/content';

export interface CtaBandProps {
  /** Closing conversion copy and calls-to-action supplied by `src/app/page.tsx`. */
  content: CtaBandContent;
}

/**
 * Full-width closing conversion band.
 *
 * Repeats the two Home page conversion paths from the hero (AC-3): the primary
 * "Book Online Consultation" CTA routing to /online-consultation and the
 * secondary WhatsApp click-to-chat CTA, so a visitor who has scrolled the whole
 * page never has to scroll back up to reach an inquiry path.
 *
 * AC-2: buttons stack full width on mobile and only sit side by side from `sm`,
 * with no fixed pixel widths.
 *
 * Server Component: presentational only, receives its content as props.
 */
export function CtaBand({ content }: CtaBandProps) {
  return (
    <section
      aria-labelledby="cta-band-heading"
      className="section bg-[color:var(--brand-600)]"
      data-testid="cta-band"
    >
      <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-3">
          <PlaceholderBadge slotId={content.slotId} />

          <h2
            className="m-0 break-words text-2xl text-white sm:text-3xl"
            id="cta-band-heading"
          >
            {content.heading}
          </h2>

          <p className="m-0 break-words text-base text-[color:var(--brand-100)]">{content.body}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:shrink-0">
          <Button
            className="w-full bg-white text-[color:var(--brand-700)] hover:bg-[color:var(--brand-50)] sm:w-auto"
            cta={content.primaryCta}
          />
          <Button
            className="w-full border-white bg-transparent text-white hover:bg-[color:var(--brand-700)] sm:w-auto"
            cta={content.secondaryCta}
          />
        </div>
      </Container>
    </section>
  );
}
