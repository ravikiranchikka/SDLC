'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Container, cx } from '@/components/layout/Container';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Button } from '@/components/ui/Button';
import { isActivePath, primaryNavigation } from '@/lib/navigation';
import { siteConfig } from '@/lib/site-config';
import type { CtaLink } from '@/types/content';

/** Header consultation call-to-action shown from the `md` breakpoint upwards. */
const headerCta: CtaLink = {
  label: 'Book Online Consultation',
  href: '/online-consultation',
  variant: 'primary',
  external: false,
  testId: 'header-cta-primary',
};

export interface HeaderProps {
  /** Extra classes merged onto the `<header>` element. */
  className?: string;
}

/**
 * Sticky global header rendered on every route (AC-1).
 *
 * Below the `md` breakpoint the nine primary links collapse behind the menu
 * toggle and are exposed by {@link MobileMenu} (AC-2). This is one of only two
 * Client Components in the tree: it owns the open/closed menu state and the
 * `aria-expanded` / `aria-controls` wiring.
 */
export function Header({ className }: HeaderProps) {
  const pathname = usePathname() ?? '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Any navigation (including via the browser back button) closes the menu.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  return (
    <header
      className={cx(
        'relative sticky top-0 z-40 w-full border-b border-[color:var(--brand-100)] bg-[color:var(--surface)]',
        className,
      )}
      data-testid="site-header"
    >
      <Container className="flex min-h-[64px] w-full items-center justify-between gap-3 py-3">
        <Link
          aria-label={`${siteConfig.name} - home`}
          className="flex min-h-[44px] flex-col justify-center no-underline"
          href="/"
        >
          <span className="text-base font-bold leading-tight text-[color:var(--brand-700)] sm:text-lg">
            {siteConfig.name}
          </span>
          <span className="hidden text-xs text-[color:var(--ink-600)] sm:block">
            {siteConfig.tagline}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 md:flex"
          data-testid="desktop-nav"
        >
          {primaryNavigation.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'rounded-md px-2 py-2 text-[13px] font-medium no-underline lg:text-sm',
                  active
                    ? 'text-[color:var(--brand-700)] underline underline-offset-4'
                    : 'text-[color:var(--ink-600)] hover:text-[color:var(--brand-700)]',
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Button className="px-4 py-2 text-sm" cta={headerCta} />
        </div>

        <button
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border border-[color:var(--brand-100)] px-3 text-sm font-semibold text-[color:var(--brand-700)] md:hidden"
          data-testid="mobile-menu-toggle"
          onClick={toggleMenu}
          type="button"
        >
          {isMenuOpen ? (
            <svg
              aria-hidden="true"
              fill="none"
              focusable="false"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              fill="none"
              focusable="false"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
          <span>Menu</span>
        </button>
      </Container>

      {isMenuOpen ? <MobileMenu onClose={closeMenu} /> : null}
    </header>
  );
}
