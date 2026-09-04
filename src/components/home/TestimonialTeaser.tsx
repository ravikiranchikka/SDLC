import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { PlaceholderBadge } from '@/components/ui/PlaceholderBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { TestimonialTeaserContent } from '@/types/content';

export interface TestimonialTeaserProps {
  /** Testimonial teaser copy and quotes supplied by `src/app/page.tsx`. */
  content: TestimonialTeaserContent;
}

/**
 * Home page testimonial teaser.
 *
 * A responsive quote grid - one column on mobile, three from `lg` - closing
 * with a link through to the Success Stories page (AC-2: no fixed widths, so no
 * horizontal overflow at 360px).
 *
 * AC-5: the quotes are illustrative placeholders until signed patient consent
 * is received; the section still renders and the outstanding slot is flagged by
 * {@link PlaceholderBadge} instead of breaking the build.
 *
 * Server Component: presentational only, receives its content as props.
 */
export function TestimonialTeaser({ content }: TestimonialTeaserProps) {
  return (
    <section
      aria-labelledby="testimonial-teaser-heading"
      className="section"
      data-testid="testimonial-teaser"
    >
      <Container className="flex flex-col gap-8">
        <SectionHeading heading={content.heading} id="testimonial-teaser-heading">
          <PlaceholderBadge slotId={content.slotId} />
        </SectionHeading>

        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {content.testimonials.map((testimonial) => (
            <li className="h-full" key={testimonial.id}>
              <figure className="card m-0">
                <svg
                  aria-hidden="true"
                  className="shrink-0 text-[color:var(--brand-600)]"
                  fill="currentColor"
                  focusable="false"
                  height="22"
                  viewBox="0 0 24 24"
                  width="22"
                >
                  <path d="M7.5 6A4.5 4.5 0 0 0 3 10.5V18h7.5v-7.5H6.75A.75.75 0 0 1 6 9.75 1.5 1.5 0 0 1 7.5 8.25V6Zm10.5 0a4.5 4.5 0 0 0-4.5 4.5V18H21v-7.5h-3.75a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 1 1.5-1.5V6Z" />
                </svg>

                <blockquote className="m-0">
                  <p className="m-0 break-words text-base text-[color:var(--ink-900)]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>

                <figcaption className="mt-auto break-words pt-2 text-sm text-[color:var(--ink-600)]">
                  <span className="block font-semibold text-[color:var(--ink-900)]">
                    {testimonial.author}
                  </span>
                  <span className="block">{testimonial.treatment}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="flex">
          <Button cta={content.cta} />
        </div>
      </Container>
    </section>
  );
}
