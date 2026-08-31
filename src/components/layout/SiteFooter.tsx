/**
 * SCRUM-31 - Site footer.
 *
 * Rendered by the root layout on every route (AC-1). Carries the clinic
 * contact block, the same nine navigation links as the header, the legal links
 * and the copyright line.
 *
 * Server component: no state, no effects. All data comes from
 * `src/content/site`, and every phone / email / WhatsApp href is built by the
 * pure helpers in `src/lib/links` so there is exactly one wa.me construction
 * site in the codebase.
 */

import Link from 'next/link';

import {
  clinicContact,
  emailHref,
  legalLinks,
  navLinks,
  phoneHref,
  siteMeta,
  whatsappUrl,
} from '../../content/site';
import { Container } from './Container';

const FOOTER_LINK_CLASSES =
  'inline-flex min-h-11 items-center rounded-lg text-sm text-ink-600 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-testid="site-footer"
      className="w-full min-w-0 border-t border-hairline bg-surface-muted"
    >
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <p className="text-base font-semibold tracking-tight text-brand-700">
              {siteMeta.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{siteMeta.tagline}</p>

            <address className="mt-4 not-italic text-sm leading-relaxed text-ink-600">
              {clinicContact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <nav aria-label="Footer navigation" className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900">
              Explore
            </h2>
            <ul className="mt-3 flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href} className="min-w-0">
                  <Link
                    data-testid="nav-link"
                    href={link.href}
                    className={FOOTER_LINK_CLASSES}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900">
              Contact
            </h2>
            <ul className="mt-3 flex flex-col">
              <li className="min-w-0">
                <a
                  data-testid="footer-phone-link"
                  href={phoneHref}
                  className={FOOTER_LINK_CLASSES}
                >
                  {clinicContact.phoneE164}
                </a>
              </li>
              <li className="min-w-0">
                <a
                  data-testid="footer-email-link"
                  href={emailHref}
                  className={`${FOOTER_LINK_CLASSES} break-all`}
                >
                  {clinicContact.email}
                </a>
              </li>
              <li className="min-w-0">
                <a
                  data-testid="footer-whatsapp-link"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={FOOTER_LINK_CLASSES}
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900">
              Opening hours
            </h2>
            <ul className="mt-3 flex flex-col gap-1 text-sm leading-relaxed text-ink-600">
              {clinicContact.hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-600">
            &copy; {currentYear} {clinicContact.legalName}. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-4">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  data-testid="legal-link"
                  href={link.href}
                  className={FOOTER_LINK_CLASSES}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
