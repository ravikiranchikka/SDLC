import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import { PlaceholderBadge } from '@/components/ui/PlaceholderBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { WhyChooseUsContent } from '@/types/content';

export interface WhyChooseUsProps {
  /** Value proposition copy and supporting image supplied by `src/app/page.tsx`. */
  content: WhyChooseUsContent;
}

/**
 * Home page "why choose us" section.
 *
 * AC-2: a single stacked column on mobile that only splits into two columns
 * from `lg`, with no fixed pixel widths, so nothing overflows horizontally at a
 * 360px viewport.
 *
 * AC-4: the supporting image is rendered through `next/image` with explicit
 * intrinsic dimensions (no layout shift) and responsive `sizes`. It is lazily
 * loaded - the default for `next/image` - because it sits below the fold.
 *
 * AC-5: unapproved copy is flagged by {@link PlaceholderBadge} rather than
 * failing the build.
 *
 * Server Component: presentational only, receives its content as props.
 */
export function WhyChooseUs({ content }: WhyChooseUsProps) {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="section bg-[color:var(--brand-50)]"
      data-testid="why-choose-us"
    >
      <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex w-full flex-col gap-6">
          <SectionHeading heading={content.heading} id="why-choose-us-heading" intro={content.intro}>
            <PlaceholderBadge slotId={content.slotId} />
          </SectionHeading>

          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-1">
            {content.points.map((point) => (
              <li className="flex items-start gap-3" key={point.id}>
                <svg
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-[color:var(--brand-600)]"
                  fill="none"
                  focusable="false"
                  height="18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <div className="flex flex-col gap-1">
                  <h3 className="m-0 break-words text-base font-semibold sm:text-lg">
                    {point.title}
                  </h3>
                  <p className="m-0 break-words text-sm text-[color:var(--ink-600)]">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">
          <Image
            alt={content.image.alt}
            className="h-auto w-full rounded-2xl object-cover"
            height={content.image.height}
            sizes="(max-width: 1024px) 100vw, 560px"
            src={content.image.src}
            width={content.image.width}
          />
        </div>
      </Container>
    </section>
  );
}
