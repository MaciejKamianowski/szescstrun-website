import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'

export function ContactCta() {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="border border-border bg-background-secondary px-8 py-14 text-center md:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Kontakt</p>
            <h2 className="mt-4 text-3xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              Zacznij grać już dziś.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              Napisz, czego chcesz się nauczyć — odezwiemy się w sprawie terminu i szczegółów lekcji.
            </p>
            <Link href="/kontakt" className={buttonVariants({ size: 'lg' }) + ' mt-8'}>
              Przejdź do formularza
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
