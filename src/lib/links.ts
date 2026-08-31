/**
 * SCRUM-31 - Link helpers.
 *
 * Pure, framework-free URL helpers. The only place in the codebase allowed to
 * construct a wa.me click-to-chat URL, so the WhatsApp CTA behaves identically
 * in the header, hero, CTA band and footer (AC-3).
 */

/** Absolute-URL schemes that must open in a new tab. */
const EXTERNAL_PREFIXES: readonly string[] = [
  'http://',
  'https://',
  'mailto:',
  'tel:',
  'sms:',
];

/**
 * Strip every character that is not a digit from an E.164 phone number.
 * `+91 12345 67890` -> `911234567890`.
 */
export function toDigits(phone: string): string {
  return phone.replace(/\D+/g, '');
}

/**
 * Build a WhatsApp click-to-chat URL.
 *
 * @param e164    Phone number in E.164 form, e.g. `+911234567890`.
 * @param message Optional pre-filled message.
 * @returns `https://wa.me/<digits>` with an encoded `?text=` when a non-empty
 *          message is supplied.
 * @throws  When the number contains no digits - a silent broken CTA would be
 *          worse than a loud build-time failure.
 */
export function buildWhatsAppUrl(e164: string, message?: string): string {
  const digits = toDigits(e164);

  if (digits.length === 0) {
    throw new Error('buildWhatsAppUrl: a WhatsApp number with at least one digit is required.');
  }

  const base = `https://wa.me/${digits}`;
  const trimmed = typeof message === 'string' ? message.trim() : '';

  if (trimmed.length === 0) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(trimmed)}`;
}

/** Build a `tel:` href from an E.164 number. */
export function buildTelHref(e164: string): string {
  const digits = toDigits(e164);

  if (digits.length === 0) {
    throw new Error('buildTelHref: a phone number with at least one digit is required.');
  }

  return `tel:+${digits}`;
}

/** Build a `mailto:` href from an email address. */
export function buildMailtoHref(email: string): string {
  const trimmed = email.trim();

  if (trimmed.length === 0) {
    throw new Error('buildMailtoHref: an email address is required.');
  }

  return `mailto:${trimmed}`;
}

/**
 * True when the href leaves the Next.js router (absolute URL, mail, phone or
 * protocol-relative). Such links render as plain anchors with
 * `target="_blank" rel="noopener noreferrer"`.
 */
export function isExternalHref(href: string): boolean {
  const value = href.trim().toLowerCase();

  if (value.startsWith('//')) {
    return true;
  }

  return EXTERNAL_PREFIXES.some((prefix) => value.startsWith(prefix));
}

/**
 * Normalise an internal route for comparison: guarantees a single leading
 * slash and no trailing slash (except for the site root).
 */
export function normaliseRoute(href: string): string {
  if (isExternalHref(href)) {
    return href;
  }

  const withLeadingSlash = href.startsWith('/') ? href : `/${href}`;

  if (withLeadingSlash === '/') {
    return '/';
  }

  return withLeadingSlash.replace(/\/+$/, '');
}

/**
 * True when `pathname` is the given internal route or one of its descendants.
 * Used for `aria-current` on the active navigation link.
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (isExternalHref(href)) {
    return false;
  }

  const route = normaliseRoute(href);
  const current = normaliseRoute(pathname);

  if (route === '/') {
    return current === '/';
  }

  return current === route || current.startsWith(`${route}/`);
}

/** Join the site base URL with an internal route to form an absolute URL. */
export function absoluteUrl(baseUrl: string, href: string): string {
  if (isExternalHref(href)) {
    return href;
  }

  const base = baseUrl.replace(/\/+$/, '');

  return `${base}${normaliseRoute(href)}`;
}
