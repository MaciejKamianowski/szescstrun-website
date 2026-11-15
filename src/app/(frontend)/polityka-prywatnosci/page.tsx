import type { Metadata } from 'next'

import { RichText } from '@/components/rich-text'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getPageBySlug } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('polityka-prywatnosci')
  return buildMetadata({
    title: page?.seoTitle || 'Polityka prywatności — Sześć Strun',
    description:
      page?.seoDescription ||
      'Polityka prywatności serwisu szescstrun.pl. Treść do uzupełnienia przed uruchomieniem produkcyjnym.',
    path: '/polityka-prywatnosci',
  })
}

export default async function PrivacyPage() {
  const page = await getPageBySlug('polityka-prywatnosci')

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Informacje</p>
          <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            {page?.title || 'Polityka prywatności'}
          </h1>
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          {page?.content ? (
            <RichText data={page.content} />
          ) : (
            <div className="space-y-4 text-base leading-relaxed text-muted">
              <p>
                Treść polityki prywatności nie została jeszcze opublikowana. Przed uruchomieniem
                produkcyjnym uzupełnij ją w panelu administracyjnym (kolekcja „Strony
                informacyjne”, slug <code className="text-foreground">polityka-prywatnosci</code>).
              </p>
              <p>
                Formularz kontaktowy wymaga potwierdzenia zapoznania się z tą polityką. Do czasu
                publikacji pełnej treści strona pełni rolę miejsca na oficjalny dokument.
              </p>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  )
}
