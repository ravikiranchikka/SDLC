import type { Metadata } from 'next';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { PlaceholderBadge } from '@/components/ui/PlaceholderBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buildWhatsAppUrl, siteConfig } from '@/lib/site-config';
import type { CtaLink } from '@/types/content';

export const metadata: Metadata = {
  title: 'Online Consultation',
  description: `Book an online consultation with ${siteConfig.name}, or start a conversation on WhatsApp for a quick answer to your question.`,
  alternates: {
    canonical: '/online-consultation',
  },
  openGraph: {
    type: 'website',
    url: '/online-consultation',
    title: `Online Consultation | ${siteConfig.name}`,
    description: `Book an online consultation with ${siteConfig.name}.`,
  },
};

/**
 * WhatsApp click-to-chat call-to-action for visitors who would rather ask a
 * question before booking.
 */
const whatsappCta: CtaLink = {
  label: 'Chat on WhatsApp',
  href: buildWhatsAppUrl(),
  variant: 'secondary',
  external: true,
  testId: 'consultation-cta-whatsapp',
};

/** Telephone call-to-action using the placeholder clinic number. */
const phoneCta: CtaLink = {
  label: `Call ${siteConfig.phoneDisplay}`,
  href: siteConfig.phoneHref,
  variant: 'ghost',
  external: true,
  testId: 'consultation-cta-phone',
};

/** Steps shown to set expectations before the booking flow is delivered. */
const consultationSteps: readonly { id: string; title: string; description: string }[] = [
  {
    id: 'step-1',
    title: '1. Share your concern',
    description:
      'Tell us briefly what you would like help with, how long it has been going on and any treatment you have already tried.',
  },
  {
    id: 'step-2',
    title: '2. Confirm a time',
    description:
      'Our team replies with the next available consultation slots and confirms the one that suits you best.',
  },
  {
    id: 'step-3',
    title: '3. Meet the doctor online',
    description:
      'Join the video consultation from your phone or laptop. You will receive a written summary and next steps afterwards.',
  },
];

/**
 * Online Consultation route.
 *
 * Intentionally a stub for this story: it gives the Home page hero and CTA band
 * primary call-to-action a real destination (AC-3) and demonstrates that the
 * shared shell from `src/app/layout.tsx` - header, `<main id="main-content">`
 * and footer - is applied on more than one route (AC-1). The booking form,
 * scheduling integration and payment flow are follow-up stories.
 *
 * Server Component: no hooks, no browser APIs. The placeholder badge below
 * renders nothing until a slot with this id is registered in
 * `src/lib/content-status.ts` - it never throws on an unknown id (AC-5).
 */
export default function OnlineConsultationPage() {
  return (
    <>
      <section
        aria-labelledby="consultation-heading"
        className="section bg-[color:var(--brand-50)]"
        data-testid="consultation-intro"
      >
        <Container className="flex flex-col gap-6">
          <SectionHeading
            as="h1"
            eyebrow="Online Consultation"
            heading="Speak to our doctors from wherever you are"
            id="consultation-heading"
            intro="Online consultations let you get clinical guidance without travelling to the clinic. While our online booking form is being finalised, you can reach us on WhatsApp or by phone and we will confirm your appointment the same working day."
          >
            <PlaceholderBadge slotId="online-consultation.intro" />
          </SectionHeading>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button className="w-full sm:w-auto" cta={whatsappCta} />
            <Button className="w-full sm:w-auto" cta={phoneCta} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="consultation-steps-heading" className="section">
        <Container className="flex flex-col gap-8">
          <SectionHeading
            heading="How an online consultation works"
            id="consultation-steps-heading"
            intro="Three simple steps from your first message to a written care plan."
          />

          <ol className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {consultationSteps.map((step) => (
              <li className="h-full" key={step.id}>
                <div className="card h-full">
                  <h2 className="m-0 break-words text-lg font-semibold text-[color:var(--brand-700)]">
                    {step.title}
                  </h2>
                  <p className="m-0 break-words text-sm text-[color:var(--ink-600)]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="m-0 max-w-2xl break-words text-sm text-[color:var(--ink-600)]">
            Online consultations are not suitable for emergencies. If you need urgent care, please
            contact your nearest emergency department.
          </p>
        </Container>
      </section>
    </>
  );
}
