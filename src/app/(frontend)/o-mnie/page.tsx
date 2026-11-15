import type { Metadata } from 'next'

import { RichText } from '@/components/rich-text'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { JsonLd } from '@/components/seo/json-ld'
import { getApprovedTestimonials, getSiteSettings } from '@/lib/queries'
import { SEO_DEFAULTS, buildMetadata } from '@/lib/seo'
import {
  buildOrganizationJsonLd,
  buildPersonJsonLd,
} from '@/lib/structured-data'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: SEO_DEFAULTS.about.title,
    description: SEO_DEFAULTS.about.description,
    path: '/o-mnie',
  })
}

export default async function AboutPage() {
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    getApprovedTestimonials(),
  ])

  return (
    <>
      <JsonLd data={[buildOrganizationJsonLd(settings), buildPersonJsonLd(settings)]} />
      <section className="border-b border-border py-16 md:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="O mnie"
              title={settings.teacherName || 'Jacek Krakowski'}
              description="Nauczyciel gry na gitarze akustycznej. Szczegółową biografię możesz uzupełnić w ustawieniach CMS."
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            {settings.teacherBiography ? (
              <RichText data={settings.teacherBiography} />
            ) : (
              <div className="space-y-4 text-base leading-relaxed text-muted">
                <p>
                  Nazywam się Jacek Krakowski i prowadzę indywidualne lekcje gry na gitarze
                  akustycznej pod marką Sześć Strun.
                </p>
                <p>
                  Podczas zajęć stawiam na spokojną, konkretną pracę: technikę, brzmienie, rytm oraz
                  repertuar dopasowany do Twoich celów. Pełniejszy opis doświadczenia i metody
                  nauczania pojawi się tutaj po uzupełnieniu treści w panelu administracyjnym.
                </p>
              </div>
            )}
          </Reveal>
        </Container>
      </section>
      <TestimonialsSection testimonials={testimonials} />
    </>
  )
}
