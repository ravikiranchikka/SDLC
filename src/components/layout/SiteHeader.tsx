'use client';

/**
 * SCRUM-31 - Site header.
 *
 * Sticky, responsive header rendered by the root layout on every route, so the
 * shared navigation is present site-wide by construction (AC-1).
 *
 * Responsive contract (AC-2):
 *  - below `md` the desktop list is hidden and the only path to the nine site
 *    links is the mobile menu opened by `mobile-menu-toggle`;
 *  - at `md` and above the toggle is hidden and the nine links render inline,
 *    wrapping rather than overflowing so no horizontal scrollbar appears.
 *
 * This is one of only two client components in the story: it owns the
 * `isMenuOpen` disclosure state and passes it down to a stateless MobileMenu.
 * All copy and link data comes from `src/content/site` - never hard-coded here.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import { consultationCta, navLinks, siteMeta } from '../../content/site';
import { isActiveRoute } from '../../lib/links';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';

/** Shared classes for a desktop navigation anchor. */
const NAV_LINK_BASE =
  'inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:px-3';

const NAV_LINK_ACTIVE = 'bg-brand-50 text-brand-700';

const NAV_LINK_IDLE = 'text-ink-600 hover:bg-brand-50 hover:text-brand-700';

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((previous) => !previous);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 w-full min-w-0 border-b border-hairline bg-surface"
    >
      <Container className="flex min-h-16 w-full items-center justify-between gap-3 py-3">
        <Link
          href="/"
          aria-label={`${siteMeta.name} - home`}
          className="inline-flex min-h-11 min-w-0 flex-col justify-center rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span className="truncate text-base font-semibold tracking-tight text-brand-700 sm:text-lg">
            {siteMeta.shortName}
          </span>
          <span className="hidden truncate text-xs text-ink-600 sm:block">
            {siteMeta.tagline}
          </span>
        </Link>

        <nav
          data-testid="desktop-nav"
          aria-label="Main navigation"
          className="hidden min-w-0 md:flex md:flex-1 md:justify-end"
        >
          <ul className="flex min-w-0 flex-wrap items-center justify-end gap-x-1 gap-y-1">
            {navLinks.map((link) => {
              const isActive = isActiveRoute(pathname, link.href);

              return (
                <li key={link.href} className="min-w-0">
                  <Link
                    data-testid="nav-link"
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            href={consultationCta.href}
            variant={consultationCta.variant}
            isExternal={consultationCta.isExternal}
            testId="header-consultation-cta"
            className="hidden lg:inline-flex"
          >
            {consultationCta.label}
          </Button>

          <button
            type="button"
            data-testid="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-hairline text-ink-900 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 md:hidden"
          >
            {isMenuOpen ? (
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        links={navLinks}
        pathname={pathname}
      />
    </header>
  );
}
