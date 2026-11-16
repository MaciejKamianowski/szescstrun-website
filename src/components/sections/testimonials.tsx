import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import type { Testimonial } from '@/payload-types'

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Opinie"
            title="Głosy uczniów"
            description="Opinie osób, które uczą się gry na gitarze."
            className="mb-12"
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <blockquote className="h-full border border-border bg-background-secondary p-7">
                <p className="text-base leading-relaxed text-foreground/90">&ldquo;{item.content}&rdquo;</p>
                <footer className="mt-5 text-sm uppercase tracking-wide text-muted">
                  — {item.authorName}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
