/**
 * SCRUM-31 - Stub page body.
 *
 * Every one of the nine navigation destinations must resolve to a real route
 * inside the shared shell, otherwise the "all nine site links are reachable"
 * check in AC-2 and the "no route 404s" check in AC-1 cannot pass while later
 * stories are still being built.
 *
 * This component renders the documented placeholder copy for a route (looked
 * up from `src/content/site`) plus the two standing calls-to-action, so a
 * visitor who lands on an unfinished page still has a one-tap inquiry path.
 * The slot is created with the `placeholder` factory, which means the rendered
 * section carries `data-content-status="placeholder"` exactly like the Home
 * sections do (AC-5).
 *
 * Server component: no state, no effects, no literal marketing copy.
 */

import type { ReactNode } from 'react';

import { placeholder } from '../../lib/content';
import {
  consultationCta,
  getPlaceholderPage,
  whatsappCta,
} from '../../content/site';
import type { ContentSlot, PlaceholderPageContent } from '../../types/content';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Owner of every stub route's copy. Mirrors the `client` owner used by the
 * Home content module and the rows in docs/content-tracker.md.
 */
const STUB_CONTENT_OWNER = 'Clinic marketing lead (client)';

const STUB_CONTENT_NOTE =
  'Stub route: awaiting approved client content, delivered by a later story.';

export interface PlaceholderPageProps {
  /**
   * The route this page serves, e.g. `/about`. Used to look up the documented
   * placeholder title and body, and to build the content slot id.
   */
  readonly route: string;
  /**
   * Optional extra content rendered below the placeholder body, used by routes
   * that already have something real to show (for example the verified clinic
   * contact details, or the WhatsApp fallback on the consultation page).
   */
  readonly children?: ReactNode;
}

/**
 * Render the shared stub body for a not-yet-built route.
 *
 * @example
 * <PlaceholderPage route="/about" />
 */
export function PlaceholderPage({ route, children }: PlaceholderPageProps) {
  const content: PlaceholderPageContent = getPlaceholderPage(route);

  const slot: ContentSlot<PlaceholderPageContent> = placeholder(
    `page.${route}`,
    STUB_CONTENT_OWNER,
    content,
    STUB_CONTENT_NOTE,
  );

  const headingId = 'placeholder-page-heading';

  return (
    <Section
      slot={slot}
      testId="placeholder-page"
      labelledBy={headingId}
      containerClassName="flex flex-col gap-8"
    >
      <SectionHeading
        level={1}
        heading={content.title}
        subheading={content.body}
        headingId={headingId}
      />

      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          href={consultationCta.href}
          variant={consultationCta.variant}
          isExternal={consultationCta.isExternal}
          testId="placeholder-page-primary-cta"
          className="w-full sm:w-auto"
        >
          {consultationCta.label}
        </Button>

        <Button
          href={whatsappCta.href}
          variant={whatsappCta.variant}
          isExternal={whatsappCta.isExternal}
          testId="placeholder-page-secondary-cta"
          className="w-full sm:w-auto"
        >
          {whatsappCta.label}
        </Button>
      </div>

      {children === undefined || children === null ? null : (
        <div className="w-full min-w-0">{children}</div>
      )}
    </Section>
  );
}
