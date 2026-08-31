'use client';

/**
 * SCRUM-31 - Mobile navigation panel.
 *
 * Stateless disclosure panel: the open/closed state lives in SiteHeader and is
 * passed in. The panel renders ALL nine site links plus the two calls-to-action,
 * which is the single navigation path below the `md` breakpoint (AC-2).
 *
 * Accessibility:
 *  - rendered only when open, so the links are not reachable by keyboard or
 *    assistive technology while the menu is closed;
 *  - `role="dialog"` + `aria-modal` + a labelled close control;
 *  - Escape closes the panel and the background scroll is locked while open;
 *  - focus moves to the close button on open.
 */

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { consultationCta, whatsappCta } from '../../content/site';
import { isActiveRoute } from '../../lib/links';
import type { NavLink } from '../../types/content';
import { Button } from '../ui/Button';

export interface MobileMenuProps {
  /** Whether the panel is currently open. Owned by SiteHeader. */
  readonly isOpen: boolean;
  /** Close the panel - called by Escape, the overlay, the close button and links. */
  readonly onClose: () => void;
  /** The nine site links, in display order, from `src/content/site`. */
  readonly links: readonly NavLink[];
  /** Current pathname, used to mark the active link with `aria-current`. */
  readonly pathname: string;
}

const MOBILE_LINK_BASE =
  'flex min-h-12 w-full min-w-0 items-center rounded-lg px-3 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600';

const MOBILE_LINK_ACTIVE = 'bg-brand-50 text-brand-700';

const MOBILE_LINK_IDLE = 'text-ink-900 hover:bg-brand-50 hover:text-brand-700';

export function MobileMenu({ isOpen, onClose, links, pathname }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Escape closes the panel.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lock background scrolling while the panel is open.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="mobile-menu"
      data-testid="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      className="fixed inset-0 z-50 md:hidden"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/40"
      />

      <div className="relative ml-auto flex h-full w-full min-w-0 max-w-sm flex-col overflow-y-auto bg-surface shadow-xl">
        <div className="flex min-h-16 items-center justify-between gap-3 border-b border-hairline px-4 py-3">
          <span className="text-sm font-semibold uppercase tracking-wide text-ink-600">
            Menu
          </span>

          <button
            type="button"
            ref={closeButtonRef}
            data-testid="mobile-menu-close"
            onClick={onClose}
            aria-label="Close main menu"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-hairline text-ink-900 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
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
          </button>
        </div>

        <nav aria-label="Main navigation" className="min-w-0 flex-1 px-4 py-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = isActiveRoute(pathname, link.href);

              return (
                <li key={link.href} className="min-w-0">
                  <Link
                    data-testid="nav-link"
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={`${MOBILE_LINK_BASE} ${isActive ? MOBILE_LINK_ACTIVE : MOBILE_LINK_IDLE}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 border-t border-hairline px-4 py-4">
          <Button
            href={consultationCta.href}
            variant={consultationCta.variant}
            isExternal={consultationCta.isExternal}
            onClick={onClose}
            testId="mobile-menu-consultation-cta"
            className="w-full"
          >
            {consultationCta.label}
          </Button>

          <Button
            href={whatsappCta.href}
            variant={whatsappCta.variant}
            isExternal={whatsappCta.isExternal}
            onClick={onClose}
            testId="mobile-menu-whatsapp-cta"
            className="w-full"
          >
            {whatsappCta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
