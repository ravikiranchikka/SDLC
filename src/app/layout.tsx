/**
 * SCRUM-31 - Root layout.
 *
 * The single application shell: skip link, sticky header, `<main>` landmark
 * and footer. Because every route in `src/app` nests inside this layout, the
 * shared header/navigation/footer render on every route by construction
 * (AC-1).
 *
 * Composition only - no business logic and no literal marketing copy; all
 * strings come from `src/content/site`.
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { siteMeta } from '../content/site';
import './globals.css';

/**
 * Self-hosted Inter, exposed as the `--font-inter` custom property that
 * `globals.css` feeds into the `--font-sans` theme token. `display: swap`
 * keeps text visible during webfont load, which protects the Lighthouse
 * mobile performance budget (AC-4).
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.baseUrl),
  title: {
    default: `${siteMeta.name} - ${siteMeta.tagline}`,
    template: `%s | ${siteMeta.name}`,
  },
  description: siteMeta.description,
  applicationName: siteMeta.name,
  openGraph: {
    type: 'website',
    siteName: siteMeta.name,
    title: `${siteMeta.name} - ${siteMeta.tagline}`,
    description: siteMeta.description,
    url: siteMeta.baseUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1f66b0',
};

export interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-surface text-ink-900">
        <a
          data-testid="skip-link"
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg focus:bg-brand-600 focus:px-5 focus:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Skip to main content
        </a>

        <SiteHeader />

        <main id="main-content" className="w-full min-w-0 flex-1">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
