import { buildWhatsAppUrl } from '@/lib/site-config';
import type { HomeContent } from '@/types/content';

/**
 * Home page content payload.
 *
 * Every section carries the `slotId` of its entry in `src/lib/content-status.ts`
 * (and therefore docs/content-tracker.md). All copy below is DOCUMENTED
 * PLACEHOLDER CONTENT: it renders normally so the build never fails while the
 * approved client copy is outstanding (AC-5), and each section is visibly
 * flagged by `PlaceholderBadge` until its slot status becomes `approved`.
 *
 * Image `src` values point at files that must exist under `public/images/`.
 * `public/` is outside this story's allowed paths, so the exact required
 * filenames and dimensions are listed in docs/frontend-foundation.md for the
 * maintainer who owns that directory. Widths and heights are always explicit so
 * next/image can reserve space and avoid cumulative layout shift (AC-4).
 *
 * This module is read by exactly one consumer: `src/app/page.tsx`.
 */
export const homeContent: HomeContent = {
  hero: {
    slotId: 'home.hero',
    eyebrow: 'Online and in-clinic care',
    heading: 'Expert consultations, without the waiting room',
    subheading:
      'Speak to an experienced doctor from wherever you are. Book a scheduled online consultation or send us a message on WhatsApp and our care team will guide you to the right next step.',
    image: {
      src: '/images/hero-clinic.jpg',
      alt: 'A doctor speaking with a patient in a bright, modern consultation room',
      width: 1280,
      height: 960,
    },
    primaryCta: {
      label: 'Book Online Consultation',
      href: '/online-consultation',
      variant: 'primary',
      external: false,
      testId: 'hero-cta-primary',
    },
    secondaryCta: {
      label: 'Chat on WhatsApp',
      href: buildWhatsAppUrl(),
      variant: 'secondary',
      external: true,
      testId: 'hero-cta-whatsapp',
    },
    trustPoints: [
      'Same-week appointment slots',
      'Qualified, registered practitioners',
      'Private and confidential by design',
    ],
  },

  services: {
    slotId: 'home.services',
    heading: 'How we can help',
    intro:
      'A short overview of the care programmes we offer. Each service is delivered by a named clinician and can begin with an online consultation.',
    items: [
      {
        id: 'general-consultation',
        title: 'General consultation',
        summary:
          'A structured review of your symptoms and history, with a clear plan and written summary after the call.',
        href: '/services',
      },
      {
        id: 'follow-up-care',
        title: 'Follow-up care',
        summary:
          'Ongoing reviews for patients already under our care, including prescription and dosage adjustments.',
        href: '/services',
      },
      {
        id: 'lifestyle-nutrition',
        title: 'Lifestyle and nutrition',
        summary:
          'Practical, sustainable guidance on diet, sleep and activity, tailored to your day-to-day routine.',
        href: '/services',
      },
      {
        id: 'chronic-condition-support',
        title: 'Chronic condition support',
        summary:
          'Long-term monitoring and coaching for conditions that need regular clinical oversight.',
        href: '/services',
      },
      {
        id: 'second-opinion',
        title: 'Second opinion',
        summary:
          'An independent review of an existing diagnosis or treatment plan, with your reports read in advance.',
        href: '/services',
      },
      {
        id: 'family-health-checks',
        title: 'Family health checks',
        summary:
          'Preventive reviews for the whole family, scheduled together to save you repeat visits.',
        href: '/services',
      },
    ],
    cta: {
      label: 'View all services',
      href: '/services',
      variant: 'ghost',
      external: false,
      testId: 'services-teaser-cta',
    },
  },

  whyChooseUs: {
    slotId: 'home.why-choose-us',
    heading: 'Why patients choose us',
    intro:
      'We keep the process simple: an easy way to reach us, unhurried consultations, and a plan you can actually follow.',
    points: [
      {
        id: 'reach-us-in-one-tap',
        title: 'Reach us in one tap',
        description:
          'Book online or start a WhatsApp conversation from any page. No forms to hunt for and no phone queues.',
      },
      {
        id: 'unhurried-consultations',
        title: 'Unhurried consultations',
        description:
          'Appointments are scheduled with enough time to talk through your history, concerns and options.',
      },
      {
        id: 'clear-written-plans',
        title: 'Clear written plans',
        description:
          'After every consultation you receive a written summary covering advice, prescriptions and next steps.',
      },
      {
        id: 'continuity-of-care',
        title: 'Continuity of care',
        description:
          'Wherever possible you see the same clinician, so you never have to repeat your story from scratch.',
      },
    ],
    image: {
      src: '/images/why-choose-us.jpg',
      alt: 'Clinic care team reviewing a patient plan together at a reception desk',
      width: 960,
      height: 720,
    },
  },

  testimonials: {
    slotId: 'home.testimonials',
    heading: 'What our patients say',
    testimonials: [
      {
        id: 'testimonial-1',
        quote:
          'The online consultation was straightforward and I never felt rushed. I had a written plan in my inbox the same evening.',
        author: 'A. Sharma',
        treatment: 'Online consultation',
      },
      {
        id: 'testimonial-2',
        quote:
          'I sent a WhatsApp message on a Sunday and had an appointment confirmed for Tuesday morning. Genuinely easy.',
        author: 'R. Menon',
        treatment: 'Follow-up care',
      },
      {
        id: 'testimonial-3',
        quote:
          'The advice on diet and routine was realistic rather than idealistic, which is why I have been able to stick to it.',
        author: 'S. Iyer',
        treatment: 'Lifestyle and nutrition',
      },
    ],
    cta: {
      label: 'Read success stories',
      href: '/success-stories',
      variant: 'ghost',
      external: false,
      testId: 'testimonial-teaser-cta',
    },
  },

  ctaBand: {
    slotId: 'home.cta-band',
    heading: 'Ready to speak to a doctor?',
    body: 'Choose a consultation slot that suits you, or message our care team on WhatsApp and we will help you find the right appointment.',
    primaryCta: {
      label: 'Book Online Consultation',
      href: '/online-consultation',
      variant: 'primary',
      external: false,
      testId: 'cta-band-primary',
    },
    secondaryCta: {
      label: 'Chat on WhatsApp',
      href: buildWhatsAppUrl(),
      variant: 'secondary',
      external: true,
      testId: 'cta-band-whatsapp',
    },
  },
};
