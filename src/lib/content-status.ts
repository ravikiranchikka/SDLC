import type { ContentSlot } from '@/types/content';

/**
 * Machine-readable content slot registry.
 *
 * This array is the twin of docs/content-tracker.md. Any change here MUST be
 * mirrored in that document (and vice versa) so the delivery team and the client
 * see the same view of which copy and imagery is still outstanding.
 *
 * AC-5: unapproved content never breaks the build. Sections always render; the
 * `PlaceholderBadge` component simply flags anything that is not yet approved.
 */
export const contentSlots: readonly ContentSlot[] = [
  {
    id: 'global.clinic-identity',
    section: 'Global / Identity',
    label: 'Clinic name, tagline and description',
    owner: 'Client - Clinic Owner',
    status: 'placeholder',
    dueDate: null,
    notes:
      'Using placeholder trading name "Aarogya Clinic", tagline and meta description in src/lib/site-config.ts. Awaiting confirmed brand name, legal entity name and approved boilerplate.',
  },
  {
    id: 'global.contact-details',
    section: 'Global / Contact',
    label: 'Phone, WhatsApp, email and address',
    owner: 'Client - Clinic Manager',
    status: 'placeholder',
    dueDate: null,
    notes:
      'Placeholder phone +91 90000 00000, WhatsApp 919000000000, email hello@example-clinic.com and address in src/lib/site-config.ts. Live WhatsApp business number required before staging sign-off.',
  },
  {
    id: 'home.hero',
    section: 'Home / Hero',
    label: 'Hero headline, subheading, trust points and image',
    owner: 'Client - Marketing',
    status: 'placeholder',
    dueDate: null,
    notes:
      'Placeholder headline and supporting copy in src/content/home.ts. Hero photograph required at public/images/hero-clinic.jpg (1280x960, see docs/frontend-foundation.md).',
  },
  {
    id: 'home.services',
    section: 'Home / Services teaser',
    label: 'Featured service cards',
    owner: 'Client - Clinical Lead',
    status: 'placeholder',
    dueDate: null,
    notes:
      'Six placeholder service summaries in src/content/home.ts. Final service names, ordering and one-line descriptions pending clinical review.',
  },
  {
    id: 'home.why-choose-us',
    section: 'Home / Why choose us',
    label: 'Differentiators and supporting image',
    owner: 'Client - Marketing',
    status: 'placeholder',
    dueDate: null,
    notes:
      'Placeholder value propositions in src/content/home.ts. Supporting image required at public/images/why-choose-us.jpg (960x720). Any claims about experience or patient numbers must be verified before approval.',
  },
  {
    id: 'home.testimonials',
    section: 'Home / Testimonial teaser',
    label: 'Patient testimonials',
    owner: 'Client - Front Desk',
    status: 'placeholder',
    dueDate: null,
    notes:
      'Illustrative testimonials only. Real quotes require signed patient consent and must comply with local advertising rules before status can move to approved.',
  },
  {
    id: 'home.cta-band',
    section: 'Home / Closing CTA band',
    label: 'Closing conversion copy',
    owner: 'Client - Marketing',
    status: 'placeholder',
    dueDate: null,
    notes:
      'Placeholder closing heading and body in src/content/home.ts. Consultation fee and response-time promises must be confirmed before publishing.',
  },
] as const;

/** Label rendered by the placeholder flag UI. */
export const PLACEHOLDER_LABEL = 'Placeholder content';

/**
 * Looks up a content slot by id.
 *
 * Never throws: unknown ids return `undefined` so a missing registry entry can
 * never break the build or a render (AC-5).
 */
export function getSlot(id: string): ContentSlot | undefined {
  if (!id) {
    return undefined;
  }
  return contentSlots.find((slot) => slot.id === id);
}

/**
 * True when the slot exists and its content is not yet approved.
 *
 * Unknown ids return `false` - an unregistered slot is treated as "nothing to
 * flag" rather than an error, keeping the build green (AC-5).
 */
export function isPlaceholder(id: string): boolean {
  const slot = getSlot(id);
  if (!slot) {
    return false;
  }
  return slot.status !== 'approved';
}

/** All slots still awaiting approved client content. */
export function getPlaceholderSlots(): readonly ContentSlot[] {
  return contentSlots.filter((slot) => slot.status !== 'approved');
}
