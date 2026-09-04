'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { Container, cx } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { isActivePath, primaryNavigation } from '@/lib/navigation';
import { buildWhatsAppUrl, siteConfig } from '@/lib/site-config';
import type { CtaLink } from '@/types/content';

/** Consultation CTA repeated inside the menu. Not one of the nine nav links. */
const consultationCta: CtaLink = {
  label: 'Book Online Consultation',
  href: '/online-consultation',
  variant: 'primary',
  external: false,
  testId: 'mobile-menu-consultation-cta',
};

/** WhatsApp click-to-chat CTA. Not one of the nine nav links. */
const whatsappCta: CtaLink = {
  label: 'Chat on WhatsApp',
  href: buildWhatsAppUrl(),
  variant: 'secondary',
  external: true,
  testId: 'mobile-menu-whatsapp-cta',
};

export interface MobileMenuProps {
  /** Called when the menu should close (Escape, navigation or CTA activation). */
  onClose: () => void;
}

/**
 * Mobile navigation panel.
 *
 * Rendered by {@link Header} only while the menu is open, so mounting is the
 * signal to lock body scroll and start listening for Escape. Exposes all nine
 * primary navigation links (AC-2) plus the consultation and WhatsApp CTAs; only
 * the navigation links carry `data-testid="mobile-nav-link"`.
 */
export function MobileMenu({ onClose }: MobileMenuProps) {
  const pathname = usePathname() ?? '/';
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div
      aria-label="Site menu"
      aria-modal="true"
      className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-64px)] w-full overflow-y-auto border-b border-[color:var(--brand-100)] bg-[color:var(--surface)] shadow-lg md:hidden"
      data-testid="mobile-menu"
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      tabIndex={-1}
    >
      <Container className="flex flex-col gap-6 py-6">
        <nav aria-label="Mobile">
          <ul className="flex list-none flex-col gap-1 p-0">
            {primaryNavigation.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'block break-words rounded-lg px-3 py-3 no-underline',
                      active
                        ? 'bg-[color:var(--brand-50)] text-[color:var(--brand-700)]'
                        : 'text-[color:var(--ink-900)]',
                    )}
                    data-testid="mobile-nav-link"
                    href={item.href}
                    onClick={onClose}
                  >
                    <span className="block text-base font-semibold leading-tight">{item.label}</span>
                    <span className="mt-0.5 block text-sm text-[color:var(--ink-600)]">
                      {item.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 border-t border-[color:var(--brand-100)] pt-6">
          <Button cta={consultationCta} fullWidth onClick={onClose} />
          <Button cta={whatsappCta} fullWidth onClick={onClose} />
          <a
            className="break-words px-1 text-sm text-[color:var(--ink-600)] no-underline"
            href={siteConfig.phoneHref}
            onClick={onClose}
          >
            Call us on {siteConfig.phoneDisplay}
          </a>
        </div>
      </Container>
    </div>
  );
}
