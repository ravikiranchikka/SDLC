import type { NavItem } from '@/types/content';

/**
 * The nine primary site destinations.
 *
 * Order and hrefs are contractual: AC-2 requires all nine links to be reachable
 * from the mobile menu, and tests/unit/navigation.test.ts asserts the exact list.
 * Routes not yet implemented are documented as follow-up work in
 * docs/frontend-foundation.md; the links stay in the navigation regardless.
 */
export const primaryNavigation: readonly NavItem[] = [
  {
    label: 'Home',
    href: '/',
    description: 'Clinic overview, services and consultation options.',
  },
  {
    label: 'About Us',
    href: '/about',
    description: 'Our doctors, philosophy of care and clinic story.',
  },
  {
    label: 'Services',
    href: '/services',
    description: 'Treatments and care programmes we offer.',
  },
  {
    label: 'Online Consultation',
    href: '/online-consultation',
    description: 'Book a video or phone consultation with our doctors.',
  },
  {
    label: 'Success Stories',
    href: '/success-stories',
    description: 'Patient outcomes and testimonials.',
  },
  {
    label: 'Gallery',
    href: '/gallery',
    description: 'Photographs of the clinic, team and facilities.',
  },
  {
    label: 'Blog',
    href: '/blog',
    description: 'Health articles and clinic updates.',
  },
  {
    label: 'FAQs',
    href: '/faqs',
    description: 'Answers to common questions about consultations and treatment.',
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Clinic address, timings and enquiry details.',
  },
] as const;

/** Expected number of primary navigation links (AC-2). */
export const NAVIGATION_ITEM_COUNT = 9;

/**
 * Determines whether a navigation href represents the currently active route.
 *
 * The home route ('/') matches only on an exact path; every other route matches
 * the exact path or any nested path beneath it (e.g. '/blog/post-1' -> '/blog').
 *
 * @param pathname Current pathname, typically from `usePathname()`.
 * @param href Navigation destination to test.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (!pathname || !href) {
    return false;
  }

  const normalisedPathname = normalise(pathname);
  const normalisedHref = normalise(href);

  if (normalisedHref === '/') {
    return normalisedPathname === '/';
  }

  return (
    normalisedPathname === normalisedHref || normalisedPathname.startsWith(`${normalisedHref}/`)
  );
}

/** Strips query/hash fragments and any trailing slash (keeping the root '/'). */
function normalise(value: string): string {
  const withoutQuery = value.split(/[?#]/)[0] ?? value;
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}
