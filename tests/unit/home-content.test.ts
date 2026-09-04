import { describe, expect, it } from 'vitest';

import { homeContent } from '@/content/home';
import {
  contentSlots,
  getPlaceholderSlots,
  getSlot,
  isPlaceholder,
} from '@/lib/content-status';
import { buildWhatsAppUrl, siteConfig } from '@/lib/site-config';
import type { CtaLink, ImageAsset } from '@/types/content';

/** Every Home page section object, paired with a readable name for failures. */
const SECTIONS: readonly { name: string; slotId: string }[] = [
  { name: 'hero', slotId: homeContent.hero.slotId },
  { name: 'services', slotId: homeContent.services.slotId },
  { name: 'whyChooseUs', slotId: homeContent.whyChooseUs.slotId },
  { name: 'testimonials', slotId: homeContent.testimonials.slotId },
  { name: 'ctaBand', slotId: homeContent.ctaBand.slotId },
];

/** Images rendered through next/image on the Home page. */
const IMAGES: readonly { name: string; image: ImageAsset }[] = [
  { name: 'hero', image: homeContent.hero.image },
  { name: 'whyChooseUs', image: homeContent.whyChooseUs.image },
];

function expectWhatsAppCta(cta: CtaLink): void {
  expect(cta.external).toBe(true);
  expect(cta.href.startsWith(`https://wa.me/${siteConfig.whatsappNumber}`)).toBe(true);

  const url = new URL(cta.href);

  expect(url.protocol).toBe('https:');
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe(`/${siteConfig.whatsappNumber}`);
  expect((url.searchParams.get('text') ?? '').trim().length).toBeGreaterThan(0);
}

describe('home content slots', () => {
  it('registers every section slot id in the content tracker registry', () => {
    for (const section of SECTIONS) {
      expect(getSlot(section.slotId), `missing slot for ${section.name}`).toBeDefined();
    }
  });

  it('uses the documented slot ids', () => {
    expect(SECTIONS.map((section) => section.slotId)).toEqual([
      'home.hero',
      'home.services',
      'home.why-choose-us',
      'home.testimonials',
      'home.cta-band',
    ]);
  });

  it('keeps slot ids unique across the registry', () => {
    const ids = contentSlots.map((slot) => slot.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every registered slot an owner, section and label', () => {
    for (const slot of contentSlots) {
      expect(slot.id.trim().length).toBeGreaterThan(0);
      expect(slot.section.trim().length).toBeGreaterThan(0);
      expect(slot.label.trim().length).toBeGreaterThan(0);
      expect(slot.owner.trim().length).toBeGreaterThan(0);
      expect(['approved', 'draft', 'placeholder']).toContain(slot.status);
    }
  });

  it('reports placeholder slots as a subset of the registry', () => {
    const placeholders = getPlaceholderSlots();

    expect(placeholders.length).toBeLessThanOrEqual(contentSlots.length);

    for (const slot of placeholders) {
      expect(slot.status).not.toBe('approved');
      expect(contentSlots).toContain(slot);
    }
  });

  it('never throws on unknown slot ids so the build cannot break (AC-5)', () => {
    expect(getSlot('does.not.exist')).toBeUndefined();
    expect(isPlaceholder('does.not.exist')).toBe(false);
    expect(isPlaceholder('')).toBe(false);
  });
});

describe('home hero', () => {
  it('routes the primary CTA to the Online Consultation page (AC-3)', () => {
    const cta = homeContent.hero.primaryCta;

    expect(cta.label).toBe('Book Online Consultation');
    expect(cta.href).toBe('/online-consultation');
    expect(cta.variant).toBe('primary');
    expect(cta.external).toBe(false);
    expect(cta.testId).toBe('hero-cta-primary');
  });

  it('routes the secondary CTA to a valid WhatsApp click-to-chat URL (AC-3)', () => {
    const cta = homeContent.hero.secondaryCta;

    expect(cta.variant).toBe('secondary');
    expect(cta.testId).toBe('hero-cta-whatsapp');
    expect(cta.href).toBe(buildWhatsAppUrl());
    expectWhatsAppCta(cta);
  });

  it('provides heading, subheading and trust points copy', () => {
    expect(homeContent.hero.heading.trim().length).toBeGreaterThan(0);
    expect(homeContent.hero.subheading.trim().length).toBeGreaterThan(0);
    expect(homeContent.hero.trustPoints.length).toBeGreaterThan(0);

    for (const point of homeContent.hero.trustPoints) {
      expect(point.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('home images', () => {
  it('gives every image a local source, alt text and explicit dimensions (AC-4)', () => {
    for (const entry of IMAGES) {
      expect(entry.image.src.startsWith('/images/'), `${entry.name} src`).toBe(true);
      expect(entry.image.alt.trim().length, `${entry.name} alt`).toBeGreaterThan(5);
      expect(entry.image.width, `${entry.name} width`).toBeGreaterThan(0);
      expect(entry.image.height, `${entry.name} height`).toBeGreaterThan(0);
    }
  });
});

describe('home sections', () => {
  it('lists services teaser items with unique ids and root-relative hrefs', () => {
    const items = homeContent.services.items;

    expect(items.length).toBeGreaterThan(0);
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);

    for (const item of items) {
      expect(item.title.trim().length).toBeGreaterThan(0);
      expect(item.summary.trim().length).toBeGreaterThan(0);
      expect(item.href.startsWith('/')).toBe(true);
    }

    expect(homeContent.services.cta.href.startsWith('/')).toBe(true);
    expect(homeContent.services.cta.external).toBe(false);
  });

  it('lists why-choose-us points with unique ids', () => {
    const points = homeContent.whyChooseUs.points;

    expect(points.length).toBeGreaterThan(0);
    expect(new Set(points.map((point) => point.id)).size).toBe(points.length);

    for (const point of points) {
      expect(point.title.trim().length).toBeGreaterThan(0);
      expect(point.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('lists testimonials with unique ids and attribution', () => {
    const testimonials = homeContent.testimonials.testimonials;

    expect(testimonials.length).toBeGreaterThan(0);
    expect(new Set(testimonials.map((item) => item.id)).size).toBe(testimonials.length);

    for (const testimonial of testimonials) {
      expect(testimonial.quote.trim().length).toBeGreaterThan(0);
      expect(testimonial.author.trim().length).toBeGreaterThan(0);
      expect(testimonial.treatment.trim().length).toBeGreaterThan(0);
    }

    expect(homeContent.testimonials.cta.href.startsWith('/')).toBe(true);
  });

  it('repeats both conversion paths in the closing CTA band (AC-3)', () => {
    expect(homeContent.ctaBand.heading.trim().length).toBeGreaterThan(0);
    expect(homeContent.ctaBand.body.trim().length).toBeGreaterThan(0);
    expect(homeContent.ctaBand.primaryCta.href).toBe('/online-consultation');
    expect(homeContent.ctaBand.primaryCta.external).toBe(false);
    expectWhatsAppCta(homeContent.ctaBand.secondaryCta);
  });
});

describe('buildWhatsAppUrl', () => {
  it('encodes a custom message into the text query parameter', () => {
    const url = new URL(buildWhatsAppUrl('Hello there & thanks'));

    expect(url.hostname).toBe('wa.me');
    expect(url.searchParams.get('text')).toBe('Hello there & thanks');
  });

  it('falls back to the default message when none is supplied', () => {
    const url = new URL(buildWhatsAppUrl());

    expect(url.searchParams.get('text')).toBe(siteConfig.whatsappDefaultMessage);
  });

  it('uses a digits-only E.164 WhatsApp number', () => {
    expect(siteConfig.whatsappNumber).toMatch(/^\d{8,15}$/);
  });
});
