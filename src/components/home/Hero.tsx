import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { PlaceholderBadge } from '@/components/ui/PlaceholderBadge';
import type { HeroContent } from '@/types/content';

export interface HeroProps {
  /** Hero copy, imagery and calls-to-action supplied by `src/app/page.tsx`. */
  content: HeroContent;
}

/**
 * Above-the-fold Home page hero.
 *
 * AC-3: the primary "Book Online Consultation" CTA (routing to
 * /online-consultation) and the secondary WhatsApp click-to-chat CTA are both
 * rendered before the imagery in the DOM and sit directly beneath the heading,
 * so they are visible above the fold on every viewport.
 *
 * AC-4: the hero image is served through `next/image` with `priority` (it is the
 * likely LCP element), explicit intrinsic dimensions to avoid layout shift, and
 * responsive `sizes` so mobile devices never download the desktop asset.
 *
 * AC-2: the layout is single-column on mobile and only splits into two columns
 * from `lg`; nothing has a fixed width, so there is no horizontal overflow at
 * 360px.
 *
 * Server Component: presentational only, receives its content as props.
 */
export function Hero({ content }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="section bg-[color:var(--brand-50)]"
      data-testid="hero"
    >
      <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex w-full flex-col items-start gap-5">
          <p className="eyebrow m-0 break-words">{content.eyebrow}</p>

          <PlaceholderBadge slotId={content.slotId} />

          <h1
            className="m-0 break-words text-3xl leading-tight sm:text-4xl lg:text-5xl"
            id="hero-heading"
          >
            {content.heading}
          </h1>

          <p className="m-0 max-w-xl break-words text-base text-[color:var(--ink-600)] sm:text-lg">
            {content.subheading}
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button className="w-full sm:w-auto" cta={content.primaryCta} />
            <Button className="w-full sm:w-auto" cta={content.secondaryCta} />
          </div>

          {content.trustPoints.length > 0 ? (
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm text-[color:var(--ink-600)] sm:flex-row sm:flex-wrap sm:gap-x-6">
              {content.trustPoints.map((point) => (
                <li className="flex items-start gap-2 break-words" key={point}>
                  <svg
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-[color:var(--brand-600)]"
                    fill="none"
                    focusable="false"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="w-full">
          <Image
            alt={content.image.alt}
            className="h-auto w-full rounded-2xl object-cover"
            height={content.image.height}
            priority
            sizes="(max-width: 768px) 100vw, 640px"
            src={content.image.src}
            width={content.image.width}
          />
        </div>
      </Container>
    </section>
  );
}
