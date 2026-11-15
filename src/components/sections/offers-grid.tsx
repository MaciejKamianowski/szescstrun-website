import { BookOpen, Guitar, Music2, Star, Target, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import type { LessonOffer } from '@/payload-types'

const iconMap: Record<string, LucideIcon> = {
  music: Music2,
  guitar: Guitar,
  user: User,
  target: Target,
  book: BookOpen,
  star: Star,
}

export function OffersGrid({
  offers,
  showLink = true,
}: {
  offers: LessonOffer[]
  showLink?: boolean
}) {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container>
        {showLink ? (
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Oferta"
                title="Lekcje dopasowane do Ciebie"
                description="Każdy rodzaj zajęć można edytować w panelu administracyjnym."
              />
              <Link href="/oferta" className="text-sm uppercase tracking-wide text-accent hover:underline">
                Pełna oferta
              </Link>
            </div>
          </Reveal>
        ) : null}

        {offers.length === 0 ? (
          <p className="text-muted">
            Oferta zajęć pojawi się tutaj po dodaniu aktywnych pozycji w CMS.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {offers.map((offer, index) => {
              const Icon = iconMap[offer.icon || 'music'] || Music2
              return (
                <Reveal key={offer.id} delay={index * 0.05}>
                  <article className="h-full border border-border bg-background-secondary p-7 transition-colors hover:border-accent/50">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-accent">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="text-xl font-semibold uppercase tracking-wide text-foreground">
                      {offer.title}
                    </h3>
                    {offer.targetAudience ? (
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
                        {offer.targetAudience}
                      </p>
                    ) : null}
                    <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                      {offer.description}
                    </p>
                    {offer.features && offer.features.length > 0 ? (
                      <ul className="mt-5 space-y-2">
                        {offer.features.map((item, featureIndex) => (
                          <li
                            key={`${offer.id}-${featureIndex}`}
                            className="text-sm text-foreground/85 before:mr-2 before:text-accent before:content-['—']"
                          >
                            {item.feature}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                </Reveal>
              )
            })}
          </div>
        )}
      </Container>
    </section>
  )
}
