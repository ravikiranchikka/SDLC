import type { NavItem } from '@/types/content';

/**
 * Clinic identity, contact details and outbound channel configuration.
 *
 * IMPORTANT: every value below marked as a placeholder is tracked in
 * docs/content-tracker.md and mirrored in `src/lib/content-status.ts`.
 * When the approved client details arrive, update this file, the tracker
 * document and the slot status in the registry together.
 */
export const siteConfig = {
  /** Placeholder trading name - slot `global.clinic-identity` (docs/content-tracker.md). */
  name: 'Aarogya Clinic',
  /** Placeholder registered name - slot `global.clinic-identity` (docs/content-tracker.md). */
  legalName: 'Aarogya Clinic Private Limited',
  /** Placeholder tagline - slot `global.clinic-identity` (docs/content-tracker.md). */
  tagline: 'Personalised care, online and in clinic',
  /** Placeholder meta description - slot `global.clinic-identity` (docs/content-tracker.md). */
  description:
    'Aarogya Clinic offers personalised consultations with experienced doctors. Book an online consultation or chat with our care team on WhatsApp.',
  /** Staging origin used for metadataBase and canonical URLs until the production domain is confirmed. */
  url: 'https://staging.example-clinic.com',
  /** Placeholder phone number - slot `global.contact-details` (docs/content-tracker.md). */
  phoneDisplay: '+91 90000 00000',
  /** Placeholder phone number - slot `global.contact-details` (docs/content-tracker.md). */
  phoneHref: 'tel:+919000000000',
  /** Placeholder mailbox - slot `global.contact-details` (docs/content-tracker.md). */
  email: 'hello@example-clinic.com',
  /** Placeholder address - slot `global.contact-details` (docs/content-tracker.md). */
  addressLines: [
    'Aarogya Clinic',
    '1st Floor, 12 Wellness Avenue',
    'Hyderabad, Telangana 500081',
    'India',
  ] as readonly string[],
  /**
   * WhatsApp business number in E.164 form WITHOUT the leading '+' as required
   * by wa.me. Placeholder - slot `global.contact-details` (docs/content-tracker.md).
   */
  whatsappNumber: '919000000000',
  /** Prefilled click-to-chat message - slot `global.contact-details` (docs/content-tracker.md). */
  whatsappDefaultMessage:
    'Hello, I would like to know more about booking a consultation at Aarogya Clinic.',
} as const;

/**
 * Builds a wa.me click-to-chat URL for the configured WhatsApp business number.
 *
 * @param message Optional message to prefill; falls back to the configured default.
 * @returns A fully encoded https://wa.me/<number>?text=<message> URL.
 */
export function buildWhatsAppUrl(message?: string): string {
  const text = message ?? siteConfig.whatsappDefaultMessage;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** Footer legal links. Destination routes are delivered in a follow-up story. */
export const legalLinks: readonly NavItem[] = [
  {
    label: 'Privacy Policy',
    href: '/privacy',
    description: 'How we collect, store and use your personal and health information.',
  },
  {
    label: 'Terms',
    href: '/terms',
    description: 'The terms that apply when you use this website and our services.',
  },
  {
    label: 'Disclaimer',
    href: '/disclaimer',
    description: 'Website content is general information and not a substitute for medical advice.',
  },
] as const;
