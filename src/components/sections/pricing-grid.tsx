import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { cn, formatPricePLN } from '@/lib/utils'
import type { PricingPlan } from '@/payload-types'

export function PricingGrid({
  plans,
  showLink = true,
  compact = false,
}: {
  plans: PricingPlan[]
  showLink?: boolean
  compact?: boolean
}) {
  return (
    <section className={cn('border-b border-border', compact ? 'py-16' : 'py-20 md:py-28')}>
      <Container>
        {showLink ? (
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Cennik"
                title="Lekcje i karnety"
                description="Aktualne ceny i pakiety zarządzane są w CMS. Zakup odbywa się poprzez kontakt z nauczycielem."
              />
              <Link href="/cennik" className="text-sm uppercase tracking-wide text-accent hover:underline">
                Pełny cennik
              </Link>
            </div>
          </Reveal>
        ) : null}

        {plans.length === 0 ? (
          <p className="text-muted">
            Cennik pojawi się tutaj po dodaniu aktywnych ofert cenowych w panelu administracyjnym.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => {
              const price =
                typeof plan.promotionalPriceAmount === 'number'
                  ? plan.promotionalPriceAmount
                  : plan.priceAmount
              const hasPromo =
                typeof plan.promotionalPriceAmount === 'number' &&
                plan.promotionalPriceAmount < plan.priceAmount

              return (
                <Reveal key={plan.id} delay={index * 0.05}>
                  <article
                    className={cn(
                      'flex h-full flex-col border p-7 transition-colors',
                      plan.highlighted
                        ? 'border-accent bg-background-secondary'
                        : 'border-border bg-background hover:border-border/80',
                    )}
                  >
                    {plan.highlighted ? (
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Polecane
                      </p>
                    ) : null}
                    <h3 className="text-xl font-semibold uppercase tracking-wide text-foreground">
                      {plan.name}
                    </h3>
                    <div className="mt-5">
                      <p className="text-3xl font-bold text-foreground">{formatPricePLN(price)}</p>
                      {hasPromo ? (
                        <p className="mt-1 text-sm text-muted line-through">
                          {formatPricePLN(plan.priceAmount)}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-4 space-y-1 text-sm text-muted">
                      {plan.durationMinutes ? <p>Czas lekcji: {plan.durationMinutes} min</p> : null}
                      {plan.lessonCount ? <p>Liczba lekcji: {plan.lessonCount}</p> : null}
                      {plan.validityDays ? <p>Ważność: {plan.validityDays} dni</p> : null}
                    </div>
                    {plan.description ? (
                      <p className="mt-4 text-sm leading-relaxed text-muted">{plan.description}</p>
                    ) : null}
                    {plan.features && plan.features.length > 0 ? (
                      <ul className="mt-5 space-y-2">
                        {plan.features.map((item, featureIndex) => (
                          <li
                            key={`${plan.id}-${featureIndex}`}
                            className="text-sm text-foreground/85 before:mr-2 before:text-accent before:content-['—']"
                          >
                            {item.feature}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {plan.additionalNotes ? (
                      <p className="mt-4 text-xs text-muted">{plan.additionalNotes}</p>
                    ) : null}
                    <div className="mt-auto pt-8">
                      <Link href="/kontakt" className={cn(buttonVariants({ variant: plan.highlighted ? 'default' : 'secondary' }), 'w-full')}>
                        Zapytaj o lekcje
                      </Link>
                    </div>
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
