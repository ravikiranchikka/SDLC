/**
 * SCRUM-31 - Shared content types.
 *
 * Single source of truth for every shape used by the content layer, the
 * presentational components and the test suites. This module contains types
 * and interfaces ONLY - no runtime code and no imports from other app modules.
 */

/**
 * Approval state of a piece of client-supplied content.
 *
 * `approved`    - signed off by the client, safe to ship.
 * `placeholder` - stand-in copy or media; the build must still succeed (AC-5)
 *                 and the slot must be visible in the content tracker.
 */
export type ContentStatus = 'approved' | 'placeholder';

/**
 * Wrapper around any piece of client-supplied content.
 *
 * Every marketing string, list or image that originates with the client is
 * wrapped in a ContentSlot so that missing content is a structural fact the
 * build, the DOM (`data-content-status`) and the tracker can all read.
 */
export interface ContentSlot<T> {
  /** Stable identifier, e.g. `home.hero`. Must match the content tracker row. */
  readonly id: string;
  /** Person or role accountable for supplying the approved content. */
  readonly owner: string;
  /** Whether the value below is approved client content or a stand-in. */
  readonly status: ContentStatus;
  /** Optional human note - what is missing, or what was assumed. */
  readonly note?: string;
  /** The content itself. Always present, even when `status` is `placeholder`. */
  readonly value: T;
}

/** A navigation destination. */
export interface NavLink {
  readonly label: string;
  /** Internal route (`/about`) or absolute URL when `isExternal` is true. */
  readonly href: string;
  /** True when the href points off-site and must open in a new tab. */
  readonly isExternal?: boolean;
}

/** A call-to-action link with a visual weighting. */
export interface CtaLink extends NavLink {
  readonly variant: 'primary' | 'secondary';
}

/** An image rendered through `next/image`; width/height prevent layout shift. */
export interface ImageAsset {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

/** A single card in the Home page services teaser grid. */
export interface ServiceTeaser {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly href: string;
  readonly image: ImageAsset;
}

/** A patient testimonial excerpt. */
export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly author: string;
  /** Short context line, e.g. treatment received or city. */
  readonly context: string;
}

/** Supported inline icon keys for the why-choose-us grid. */
export type ValuePropIcon = 'clock' | 'shield' | 'globe' | 'heart';

/** A single reason-to-choose-us entry. */
export interface ValueProp {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly icon: ValuePropIcon;
}

/** Above-the-fold hero content (AC-3). */
export interface HeroContent {
  readonly eyebrow: string;
  readonly heading: string;
  readonly subheading: string;
  readonly image: ImageAsset;
  /** Routes to the Online Consultation page. */
  readonly primaryCta: CtaLink;
  /** Routes to the WhatsApp click-to-chat URL. */
  readonly secondaryCta: CtaLink;
}

/** Closing conversion band repeating the two calls-to-action. */
export interface CtaBandContent {
  readonly heading: string;
  readonly body: string;
  readonly primaryCta: CtaLink;
  readonly secondaryCta: CtaLink;
}

/** The five Home page sections, each wrapped in its own content slot. */
export interface HomeContent {
  readonly hero: ContentSlot<HeroContent>;
  readonly services: ContentSlot<readonly ServiceTeaser[]>;
  readonly whyChooseUs: ContentSlot<readonly ValueProp[]>;
  readonly testimonials: ContentSlot<readonly Testimonial[]>;
  readonly ctaBand: ContentSlot<CtaBandContent>;
}

/** Clinic contact details rendered in the footer and on the Contact route. */
export interface ClinicContact {
  readonly legalName: string;
  readonly addressLines: readonly string[];
  /** Primary phone number in E.164 form, e.g. `+911234567890`. */
  readonly phoneE164: string;
  /** WhatsApp number in E.164 form; used to build the wa.me URL. */
  readonly whatsappE164: string;
  readonly email: string;
  /** Opening hours, one human-readable line per entry. */
  readonly hours: readonly string[];
}

/** Site-wide identity and metadata. */
export interface SiteMeta {
  readonly name: string;
  readonly shortName: string;
  readonly tagline: string;
  readonly description: string;
  /** Absolute base URL of the production site, no trailing slash. */
  readonly baseUrl: string;
}

/** Copy used by the stub routes that are not yet built out. */
export interface PlaceholderPageContent {
  readonly title: string;
  readonly body: string;
}
