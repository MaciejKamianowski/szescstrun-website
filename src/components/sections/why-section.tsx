import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import type { WhySectionContent } from '@/lib/site-content'

export function WhySection({ content }: { content: WhySectionContent }) {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            className="mb-12"
          />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {content.points.map((point, index) => (
            <Reveal key={point.id} delay={index * 0.06}>
              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {point.number}
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
