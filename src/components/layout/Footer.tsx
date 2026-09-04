import Link from 'next/link';

import { Container, cx } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { primaryNavigation } from '@/lib/navigation';
import { buildWhatsAppUrl, legalLinks, siteConfig } from '@/lib/site-config';
import type { CtaLink } from '@/types/content';

/** Footer WhatsApp click-to-chat call-to-action. */
const footerWhatsAppCta: CtaLink = {
  label: 'Chat on WhatsApp',
  href: buildWhatsAppUrl(),
  variant: 'secondary',
  external: true,
  testId: 'footer-cta-whatsapp',
};

export interface FooterProps {
  /** Extra classes merged onto the `<footer>` element. */
  className?: string;
}

/**
 * Global footer rendered on every route (AC-1).
 *
 * Server Component: contact details, the nine site links and the legal links
 * are all static data from `@/lib/site-config` and `@/lib/navigation`. Contact
 * values are placeholders tracked under slot `global.contact-details` in
 * docs/content-tracker.md until the client supplies approved details.
 */
export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cx(
        'mt-auto w-full border-t border-[color:var(--brand-100)] bg-[color:var(--brand-50)]',
        className,
      )}
      data-testid="site-footer"
    >
      <Container className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <span className="text-lg font-bold text-[color:var(--brand-700)]">{siteConfig.name}</span>
          <p className="m-0 break-words text-sm text-[color:var(--ink-600)]">{siteConfig.tagline}</p>
          <address className="not-italic text-sm leading-6 text-[color:var(--ink-600)]">
            {siteConfig.addressLines.map((line) => (
              <span className="block break-words" key={line}>
                {line}
              </span>
            ))}
          </address>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <h2 className="m-0 text-sm font-semibold uppercase tracking-wide">Explore</h2>
          <ul className="flex list-none flex-col gap-2 p-0">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="break-words text-sm text-[color:var(--ink-600)] no-underline hover:text-[color:var(--brand-700)] hover:underline"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-sm font-semibold uppercase tracking-wide">Contact</h2>
          <ul className="flex list-none flex-col gap-2 p-0 text-sm text-[color:var(--ink-600)]">
            <li>
              <a
                className="break-words no-underline hover:text-[color:var(--brand-700)] hover:underline"
                href={siteConfig.phoneHref}
              >
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                className="break-words no-underline hover:text-[color:var(--brand-700)] hover:underline"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </a>
            </li>
          </ul>
          <Button className="px-4 py-2 text-sm" cta={footerWhatsAppCta} />
        </div>

        <nav aria-label="Legal" className="flex flex-col gap-3">
          <h2 className="m-0 text-sm font-semibold uppercase tracking-wide">Legal</h2>
          <ul className="flex list-none flex-col gap-2 p-0">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="break-words text-sm text-[color:var(--ink-600)] no-underline hover:text-[color:var(--brand-700)] hover:underline"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-[color:var(--brand-100)]">
        <Container className="flex flex-col gap-2 py-6 text-xs text-[color:var(--ink-600)] sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 break-words">
            &copy; {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="m-0 break-words">
            Information on this site is general in nature and is not a substitute for individual
            medical advice.
          </p>
        </Container>
      </div>
    </footer>
  );
}
