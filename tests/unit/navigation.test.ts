import { describe, expect, it } from 'vitest';

import { NAVIGATION_ITEM_COUNT, isActivePath, primaryNavigation } from '@/lib/navigation';

/**
 * Documented navigation contract for SCRUM-31 (AC-2).
 *
 * The mobile menu must expose exactly these nine destinations, in this order.
 * Any change here must be mirrored in tests/e2e/home.spec.ts and in
 * docs/frontend-foundation.md.
 */
const EXPECTED_NAVIGATION: readonly { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Online Consultation', href: '/online-consultation' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
];

describe('primaryNavigation', () => {
  it('exposes exactly nine items', () => {
    expect(primaryNavigation).toHaveLength(9);
  });

  it('keeps NAVIGATION_ITEM_COUNT in sync with the array length', () => {
    expect(NAVIGATION_ITEM_COUNT).toBe(9);
    expect(NAVIGATION_ITEM_COUNT).toBe(primaryNavigation.length);
  });

  it('matches the documented labels and hrefs in order', () => {
    const actual = primaryNavigation.map((item) => ({ label: item.label, href: item.href }));

    expect(actual).toEqual(EXPECTED_NAVIGATION);
  });

  it('uses unique, root-relative hrefs', () => {
    const hrefs = primaryNavigation.map((item) => item.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);

    for (const href of hrefs) {
      expect(href.startsWith('/')).toBe(true);
      expect(href.startsWith('//')).toBe(false);
      expect(href).not.toMatch(/\s/);
    }
  });

  it('gives every item a non-empty label and description for the mobile menu', () => {
    for (const item of primaryNavigation) {
      expect(item.label.trim().length).toBeGreaterThan(0);
      expect(item.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('includes the Online Consultation destination used by the hero primary CTA', () => {
    const consultation = primaryNavigation.find((item) => item.href === '/online-consultation');

    expect(consultation).toBeDefined();
    expect(consultation?.label).toBe('Online Consultation');
  });
});

describe('isActivePath', () => {
  it('treats the home route as active only on an exact match', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/about', '/')).toBe(false);
    expect(isActivePath('/online-consultation', '/')).toBe(false);
  });

  it('marks an exact non-home match as active', () => {
    expect(isActivePath('/services', '/services')).toBe(true);
    expect(isActivePath('/online-consultation', '/online-consultation')).toBe(true);
  });

  it('marks nested routes as active for their section', () => {
    expect(isActivePath('/services/skin-care', '/services')).toBe(true);
    expect(isActivePath('/blog/first-post', '/blog')).toBe(true);
  });

  it('does not mark unrelated routes as active', () => {
    expect(isActivePath('/blog', '/faqs')).toBe(false);
    expect(isActivePath('/contact', '/gallery')).toBe(false);
  });

  it('returns a boolean for every navigation item on any pathname', () => {
    for (const item of primaryNavigation) {
      expect(typeof isActivePath('/', item.href)).toBe('boolean');
      expect(typeof isActivePath('/services/skin-care', item.href)).toBe('boolean');
    }
  });

  it('marks at most one navigation item as active for a given pathname', () => {
    const activeCount = primaryNavigation.filter((item) =>
      isActivePath('/online-consultation', item.href),
    ).length;

    expect(activeCount).toBe(1);
  });
});
