/**
 * SCRUM-31 - Site-wide content.
 *
 * Data module only: plain objects typed by `src/types/content`. No React, no
 * JSX, no next/* imports, so it is safe to import from server components,
 * client components and Node-based unit tests alike.
 *
 * `navLinks` is the ONLY navigation source. The header, mobile menu, footer
 * and the e2e suites all read from it, which is what guarantees AC-2's "all
 * nine site links are reachable from that menu".
 */

import { buildMailtoHref, buildTelHref, buildWhatsAppUrl } from '../lib/links';
import type {
  ClinicContact,
  CtaLink,
  NavLink,
  PlaceholderPageContent,
  SiteMeta,
} from '../types/content';

/** Site identity and default metadata. */
export const siteMeta: SiteMeta = {
  name: 'Aarogya Care Clinic',
  shortName: 'Aarogya Care',
  tagline: 'Expert care, online and in clinic',
  description:
    'Aarogya Care Clinic offers online consultations and in-clinic treatment with experienced doctors. Book a consultation in a single tap.',
  baseUrl: 'https://www.aarogyacareclinic.example',
};

/**
 * The nine site links, in fixed display order.
 *
 * Do not reorder or extend without updating tests/unit/siteNavigation.test.ts
 * and tests/e2e/shell.spec.ts - the count of nine is an acceptance criterion.
 */
export const navLinks: readonly NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Online Consultation', href: '/online-consultation' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

/** Secondary legal links rendered in the footer only. */
export const legalLinks: readonly NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
];

/** Route of the primary conversion destination, referenced by every CTA. */
export const consultationRoute = '/online-consultation';

/**
 * Clinic contact details.
 *
 * TODO(SCRUM-31): awaiting client confirmation - tracked as slot
 * `site.clinicContact` in docs/content-tracker.md. Values below are safe,
 * clearly non-production stand-ins so the shell renders and builds.
 */
export const clinicContact: ClinicContact = {
  legalName: 'Aarogya Care Clinic Pvt. Ltd.',
  addressLines: [
    'Placeholder: 1st Floor, Clinic Building',
    'Placeholder: Road Name, Area',
    'Placeholder: City 500001',
  ],
  phoneE164: '+911234567890',
  whatsappE164: '+911234567890',
  email: 'hello@aarogyacareclinic.example',
  hours: [
    'Monday to Friday: 9:00 am - 7:00 pm',
    'Saturday: 9:00 am - 2:00 pm',
    'Sunday: Closed',
  ],
};

/** Pre-filled message used for every WhatsApp click-to-chat entry point. */
export const whatsappMessage =
  `Hello ${siteMeta.shortName}, I would like to book a consultation.`;

/** Canonical WhatsApp click-to-chat URL (AC-3). */
export const whatsappUrl: string = buildWhatsAppUrl(
  clinicContact.whatsappE164,
  whatsappMessage,
);

/** Canonical `tel:` href for the clinic phone number. */
export const phoneHref: string = buildTelHref(clinicContact.phoneE164);

/** Canonical `mailto:` href for the clinic inbox. */
export const emailHref: string = buildMailtoHref(clinicContact.email);

/** Primary call-to-action: routes to the Online Consultation page. */
export const consultationCta: CtaLink = {
  label: 'Book Online Consultation',
  href: consultationRoute,
  variant: 'primary',
};

/** Secondary call-to-action: opens WhatsApp click-to-chat in a new tab. */
export const whatsappCta: CtaLink = {
  label: 'Chat on WhatsApp',
  href: whatsappUrl,
  isExternal: true,
  variant: 'secondary',
};

/**
 * Copy for the stub routes that later stories will build out. Keyed by route
 * so `PlaceholderPage` can look up a title and body without hard-coded strings
 * in the route files.
 */
export const placeholderPages: Readonly<Record<string, PlaceholderPageContent>> = {
  '/about': {
    title: 'About the clinic',
    body: 'Placeholder: the clinic story, doctor profiles and credentials are being finalised with the client. This page is live so navigation never dead-ends.',
  },
  '/services': {
    title: 'Our services',
    body: 'Placeholder: the full treatment list with descriptions and indicative timelines is pending client sign-off.',
  },
  '/online-consultation': {
    title: 'Online consultation',
    body: 'Placeholder: the booking flow, fees and appointment slots are pending. In the meantime you can reach the clinic directly on WhatsApp.',
  },
  '/testimonials': {
    title: 'Patient testimonials',
    body: 'Placeholder: patient stories are pending written consent before publication.',
  },
  '/gallery': {
    title: 'Clinic gallery',
    body: 'Placeholder: clinic photography is scheduled and will replace this page once delivered.',
  },
  '/blog': {
    title: 'Health articles',
    body: 'Placeholder: the first set of articles is being drafted for clinical review.',
  },
  '/faq': {
    title: 'Frequently asked questions',
    body: 'Placeholder: the question set is being compiled from the clinic front desk.',
  },
  '/contact': {
    title: 'Contact the clinic',
    body: 'Placeholder: the enquiry form arrives in a later story. The verified clinic contact details below already work.',
  },
};

/** Look up stub copy for a route, with a safe fallback so no route can 404. */
export function getPlaceholderPage(route: string): PlaceholderPageContent {
  const match = placeholderPages[route];

  if (match !== undefined) {
    return match;
  }

  return {
    title: 'Coming soon',
    body: 'Placeholder: this page is being prepared. Please use the navigation above or contact the clinic directly.',
  };
}
