import type { Metadata } from 'next'

import { PricingGrid } from '@/components/sections/pricing-grid'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getActivePricingPlans } from '@/lib/queries'
import { SEO_DEFAULTS, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: SEO_DEFAULTS.pricing.title,
  description: SEO_DEFAULTS.pricing.description,
  path: '/cennik',
})

export default async function PricingPage() {
  const plans = await getActivePricingPlans()

  return (
    <>
      <section className="border-b border-border py-16 md:py-20">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Cennik</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
              Lekcje i karnety
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Poniżej znajdziesz aktywne oferty cenowe. Zakup i rezerwacja odbywają się poprzez
              kontakt — bez płatności online.
            </p>
          </Reveal>
        </Container>
      </section>
      <PricingGrid plans={plans} showLink={false} />
    </>
  )
}
