import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'

const points = [
  {
    title: 'Indywidualne tempo',
    text: 'Program zajęć dopasowujemy do Twojego poziomu, celów i dostępnego czasu na ćwiczenia.',
  },
  {
    title: 'Praca nad brzmieniem',
    text: 'Uczymy się nie tylko chwytów, ale także słuchania, rytmu i świadomego prowadzenia dźwięku.',
  },
  {
    title: 'Repertuar z sensem',
    text: 'Ćwiczenia łączymy z utworami, które naprawdę chcesz grać — od podstaw po bardziej złożone aranżacje.',
  },
]

export function WhySection() {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Metoda"
            title="Dlaczego warto"
            description="Spokojna, konkretna nauka bez niezweryfikowanych obietnic — z naciskiem na regularność i zrozumienie instrumentu."
            className="mb-12"
          />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {points.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.06}>
              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-lg font-semibold uppercase tracking-wide text-foreground">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
