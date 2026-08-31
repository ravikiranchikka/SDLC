/**
 * SCRUM-31 - Home page content.
 *
 * Data module only: plain objects typed by `src/types/content`, assembled with
 * the pure helpers in `src/lib/content`. No React, no JSX, no next/* imports,
 * so this module is safe to import from server components, client components
 * and Node-based unit tests alike.
 *
 * Every section is wrapped in a `ContentSlot`. Sections whose copy or media is
 * still awaiting client sign-off use `placeholder(...)`, which keeps the build
 * green while flagging the gap in the DOM (`data-content-status`) and in
 * docs/content-tracker.md (AC-5).
 */

import { approved, placeholder } from '../lib/content';
import type {
  CtaBandContent,
  HeroContent,
  HomeContent,
  ServiceTeaser,
  Testimonial,
  ValueProp,
} from '../types/content';
import { consultationCta, siteMeta, whatsappCta } from './site';

/**
 * Owners of the outstanding content. Kept as constants so the tracker doc and
 * the unit tests can compare against a single spelling.
 */
export const contentOwners = {
  client: 'Clinic marketing lead (client)',
  copywriter: 'Agency copywriter',
  photographer: 'Agency photographer',
} as const;

/**
 * Directory for stand-in artwork. These are lightweight local SVGs so a
 * missing file degrades to alt text instead of breaking the build; the exact
 * filenames a maintainer must add under `public/` are listed in
 * docs/performance-and-assets.md.
 */
const PLACEHOLDER_IMAGE_DIR = '/images/placeholders';

const heroContent: HeroContent = {
  eyebrow: siteMeta.tagline,
  heading: 'Consult an experienced doctor without leaving home',
  subheading:
    'Book a secure online consultation, or message the clinic on WhatsApp and the front desk will help you find the right appointment.',
  image: {
    src: `${PLACEHOLDER_IMAGE_DIR}/hero.svg`,
    alt: 'Placeholder illustration of a doctor speaking with a patient during an online consultation',
    width: 1200,
    height: 900,
  },
  primaryCta: consultationCta,
  secondaryCta: whatsappCta,
};

const serviceTeasers: readonly ServiceTeaser[] = [
  {
    id: 'home.services.online-consultation',
    title: 'Online consultation',
    summary:
      'Placeholder: a scheduled video or phone consultation with a clinic doctor, including a written summary afterwards.',
    href: '/online-consultation',
    image: {
      src: `${PLACEHOLDER_IMAGE_DIR}/service-online-consultation.svg`,
      alt: 'Placeholder illustration representing an online consultation',
      width: 640,
      height: 480,
    },
  },
  {
    id: 'home.services.in-clinic-care',
    title: 'In-clinic care',
    summary:
      'Placeholder: examination, diagnosis and treatment at the clinic, with appointments confirmed before you travel.',
    href: '/services',
    image: {
      src: `${PLACEHOLDER_IMAGE_DIR}/service-in-clinic-care.svg`,
      alt: 'Placeholder illustration representing in-clinic care',
      width: 640,
      height: 480,
    },
  },
  {
    id: 'home.services.follow-up-support',
    title: 'Follow-up support',
    summary:
      'Placeholder: review appointments and ongoing guidance so a treatment plan is followed through, not just started.',
    href: '/services',
    image: {
      src: `${PLACEHOLDER_IMAGE_DIR}/service-follow-up-support.svg`,
      alt: 'Placeholder illustration representing follow-up support',
      width: 640,
      height: 480,
    },
  },
];

const valueProps: readonly ValueProp[] = [
  {
    id: 'home.why.same-day',
    title: 'Same-day appointments',
    body: 'Placeholder: appointment availability and typical waiting times are to be confirmed by the clinic.',
    icon: 'clock',
  },
  {
    id: 'home.why.qualified-doctors',
    title: 'Qualified, registered doctors',
    body: 'Placeholder: doctor names, registration numbers and specialisations are pending client sign-off.',
    icon: 'shield',
  },
  {
    id: 'home.why.consult-anywhere',
    title: 'Consult from anywhere',
    body: 'Placeholder: online consultations for patients who cannot travel to the clinic, including from overseas.',
    icon: 'globe',
  },
  {
    id: 'home.why.patient-first',
    title: 'Patient-first care',
    body: 'Placeholder: the clinic care philosophy statement is being drafted with the client.',
    icon: 'heart',
  },
];

const testimonials: readonly Testimonial[] = [
  {
    id: 'home.testimonials.one',
    quote:
      'Placeholder testimonial: patient stories are held back until written consent has been received and reviewed.',
    author: 'Patient name pending',
    context: 'Consent pending',
  },
  {
    id: 'home.testimonials.two',
    quote:
      'Placeholder testimonial: the second approved quote will replace this stand-in without any layout change.',
    author: 'Patient name pending',
    context: 'Consent pending',
  },
];

const ctaBandContent: CtaBandContent = {
  heading: 'Ready to speak to a doctor?',
  body: 'Book an online consultation at a time that suits you, or start a WhatsApp conversation with the clinic front desk.',
  primaryCta: consultationCta,
  secondaryCta: whatsappCta,
};

/**
 * The five Home page sections.
 *
 * Slot ids are stable and must match the rows in docs/content-tracker.md.
 */
export const homeContent: HomeContent = {
  hero: approved('home.hero', contentOwners.copywriter, heroContent),
  services: placeholder(
    'home.services',
    contentOwners.client,
    serviceTeasers,
    'Awaiting the confirmed service list, descriptions and photography from the clinic.',
  ),
  whyChooseUs: placeholder(
    'home.whyChooseUs',
    contentOwners.client,
    valueProps,
    'Awaiting confirmed differentiators, doctor credentials and appointment availability.',
  ),
  testimonials: placeholder(
    'home.testimonials',
    contentOwners.client,
    testimonials,
    'Awaiting patient testimonials with signed publication consent.',
  ),
  ctaBand: approved('home.ctaBand', contentOwners.copywriter, ctaBandContent),
};

/** Heading copy for the non-hero Home sections, kept out of the components. */
export const homeSectionHeadings = {
  services: {
    eyebrow: 'What we do',
    heading: 'Care that fits around your day',
    subheading:
      'Placeholder: a short introduction to the clinic service range, pending client copy.',
  },
  whyChooseUs: {
    eyebrow: 'Why patients choose us',
    heading: 'Straightforward care, clearly explained',
    subheading:
      'Placeholder: the clinic value proposition summary, pending client copy.',
  },
  testimonials: {
    eyebrow: 'In their words',
    heading: 'What our patients say',
    subheading:
      'Placeholder: quotes are published only once written patient consent is on file.',
  },
} as const;

/** Link from the testimonial teaser through to the full Testimonials page. */
export const testimonialsIndexHref = '/testimonials';

/** Link from the services teaser through to the full Services page. */
export const servicesIndexHref = '/services';
