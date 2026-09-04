import type { Metadata } from 'next';

import { homeContent } from '@/content/home';
import { CtaBand } from '@/components/home/CtaBand';
import { Hero } from '@/components/home/Hero';
import { ServicesTeaser } from '@/components/home/ServicesTeaser';
import { TestimonialTeaser } from '@/components/home/TestimonialTeaser';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: siteConfig.tagline,
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

/**
 * Home route.
 *
 * This is the only module that reads `@/content/home`; every section component
 * is presentational and receives its slice of content as props, keeping the
 * component layer independent of the content layer.
 *
 * Server Component (no hooks, no browser APIs) rendered inside the shared shell
 * defined by `src/app/layout.tsx` - header, `<main id="main-content">` and
 * footer are therefore present on this and every other route (AC-1).
 */
export default function HomePage() {
  return (
    <>
      <Hero content={homeContent.hero} />
      <ServicesTeaser content={homeContent.services} />
      <WhyChooseUs content={homeContent.whyChooseUs} />
      <TestimonialTeaser content={homeContent.testimonials} />
      <CtaBand content={homeContent.ctaBand} />
    </>
  );
}
