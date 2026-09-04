/**
 * Shared content types for the marketing site.
 *
 * This module is the single source of truth for every content-related shape.
 * It is a PURE TYPE LAYER: it must not import anything and must not export any
 * runtime values (only types / interfaces / literal unions). Every other module
 * may safely import from `@/types/content`.
 */

/** Approval state of a content slot as tracked in docs/content-tracker.md. */
export type ContentStatus = 'approved' | 'draft' | 'placeholder';

/**
 * A single tracked content slot. The machine-readable registry lives in
 * `src/lib/content-status.ts` and MUST stay in sync with docs/content-tracker.md.
 */
export interface ContentSlot {
  /** Stable dot-notation identifier, e.g. `home.hero`. */
  id: string;
  /** Human readable section name, e.g. `Home / Hero`. */
  section: string;
  /** Short label shown in the placeholder flag UI. */
  label: string;
  /** Person or party responsible for supplying the approved content. */
  owner: string;
  /** Current approval state. */
  status: ContentStatus;
  /** ISO-8601 date (YYYY-MM-DD) the approved content is due, or null if unscheduled. */
  dueDate: string | null;
  /** Free-form notes: what exactly is missing and what is being shown instead. */
  notes: string;
}

/** An image rendered through next/image. Width/height are required to avoid CLS. */
export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Visual treatment of a call-to-action. */
export type CtaVariant = 'primary' | 'secondary' | 'ghost';

/** A call-to-action link. External links are rendered as safe anchors. */
export interface CtaLink {
  label: string;
  href: string;
  variant: CtaVariant;
  /** True when the href leaves the site (e.g. wa.me, tel:, mailto:). */
  external: boolean;
  /** Optional stable hook for end-to-end tests. */
  testId?: string;
}

/** Above-the-fold hero content for the Home page. */
export interface HeroContent {
  slotId: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  image: ImageAsset;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  trustPoints: readonly string[];
}

/** A single service card in the Home page services teaser. */
export interface ServiceTeaserItem {
  id: string;
  title: string;
  summary: string;
  href: string;
}

/** Home page services teaser section. */
export interface ServicesTeaserContent {
  slotId: string;
  heading: string;
  intro: string;
  items: readonly ServiceTeaserItem[];
  cta: CtaLink;
}

/** A single differentiator / value proposition. */
export interface ValueProp {
  id: string;
  title: string;
  description: string;
}

/** Home page "why choose us" section. */
export interface WhyChooseUsContent {
  slotId: string;
  heading: string;
  intro: string;
  points: readonly ValueProp[];
  image: ImageAsset;
}

/** A single patient testimonial. */
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  treatment: string;
}

/** Home page testimonial teaser section. */
export interface TestimonialTeaserContent {
  slotId: string;
  heading: string;
  testimonials: readonly Testimonial[];
  cta: CtaLink;
}

/** Closing conversion band repeating the consultation and WhatsApp CTAs. */
export interface CtaBandContent {
  slotId: string;
  heading: string;
  body: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

/** Complete Home page content payload. */
export interface HomeContent {
  hero: HeroContent;
  services: ServicesTeaserContent;
  whyChooseUs: WhyChooseUsContent;
  testimonials: TestimonialTeaserContent;
  ctaBand: CtaBandContent;
}

/** A navigation destination used by the header, mobile menu and footer. */
export interface NavItem {
  label: string;
  href: string;
  description: string;
}
