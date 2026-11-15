import type { Metadata } from 'next'
import Link from 'next/link'

import { OffersGrid } from '@/components/sections/offers-grid'
import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getActiveLessonOffers } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Oferta lekcji — Sześć Strun',
  description:
    'Indywidualne lekcje gitary akustycznej: nauka od podstaw, rozwój techniki i praca nad repertuarem.',
  path: '/oferta',
})

export default async function OfferPage() {
  const offers = await getActiveLessonOffers()

  return (
    <>
      <section className="border-b border-border py-16 md:py-20">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Oferta</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
              Lekcje gitary akustycznej
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Sprawdź rodzaje zajęć i wybierz kierunek, który najbardziej Ci odpowiada. Szczegóły
              oferty są edytowalne w panelu CMS.
            </p>
          </Reveal>
        </Container>
      </section>
      <OffersGrid offers={offers} showLink={false} />
      <section className="py-16">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start gap-4 border border-border bg-background-secondary p-8 md:flex-row md:items-center md:justify-between">
              <p className="text-lg uppercase tracking-wide text-foreground">
                Chcesz dopasować plan nauki?
              </p>
              <Link href="/kontakt" className={cn(buttonVariants())}>
                Napisz wiadomość
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
