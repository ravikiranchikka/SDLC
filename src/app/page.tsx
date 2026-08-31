/**
 * SCRUM-31 - Home route.
 *
 * Routing and composition only: the five Home sections are rendered in order
 * and each is handed its own content slot from `src/content/home`. No copy is
 * written here, so a section awaiting client sign-off simply renders its
 * documented placeholder value rather than failing the build (AC-5).
 */

import type { Metadata } from 'next';

import { CtaBandSection } from '../components/home/CtaBandSection';
import { HeroSection } from '../components/home/HeroSection';
import { ServicesTeaserSection } from '../components/home/ServicesTeaserSection';
import { TestimonialTeaserSection } from '../components/home/TestimonialTeaserSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { homeContent } from '../content/home';
import { siteMeta } from '../content/site';

export const metadata: Metadata = {
  title: `${siteMeta.name} - ${siteMeta.tagline}`,
  description: siteMeta.description,
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection slot={homeContent.hero} />
      <ServicesTeaserSection slot={homeContent.services} />
      <WhyChooseUsSection slot={homeContent.whyChooseUs} />
      <TestimonialTeaserSection slot={homeContent.testimonials} />
      <CtaBandSection slot={homeContent.ctaBand} />
    </>
  );
}
