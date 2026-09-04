import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { PlaceholderBadge } from '@/components/ui/PlaceholderBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ServicesTeaserContent } from '@/types/content';

export interface ServicesTeaserProps {
  /** Services teaser copy and cards supplied by `src/app/page.tsx`. */
  content: ServicesTeaserContent;
}

/**
 * Home page services teaser.
 *
 * A responsive card grid: one column on mobile, two from `sm` and three from
 * `lg`, so there is no horizontal overflow at 360px (AC-2). Each card links to
 * the services page; the section closes with a "view all" call-to-action.
 *
 * Server Component: presentational only, receives its content as props. Any
 * unapproved copy is flagged rather than blocking the build (AC-5).
 */
export function ServicesTeaser({ content }: ServicesTeaserProps) {
  return (
    <section
      aria-labelledby="services-teaser-heading"
      className="section"
      data-testid="services-teaser"
    >
      <Container className="flex flex-col gap-8">
        <SectionHeading heading={content.heading} id="services-teaser-heading" intro={content.intro}>
          <PlaceholderBadge slotId={content.slotId} />
        </SectionHeading>

        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
            <li className="h-full" key={item.id}>
              <Link
                className="card no-underline transition-colors hover:border-[color:var(--brand-600)]"
                href={item.href}
              >
                <h3 className="m-0 break-words text-lg font-semibold text-[color:var(--brand-700)]">
                  {item.title}
                </h3>
                <p className="m-0 break-words text-sm text-[color:var(--ink-600)]">{item.summary}</p>
              </Link>
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
