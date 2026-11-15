import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <Container className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">404</p>
        <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
          Nie znaleziono strony
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Adres, którego szukasz, nie istnieje albo został przeniesiony.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={cn(buttonVariants())}>
            Strona główna
          </Link>
          <Link href="/kontakt" className={cn(buttonVariants({ variant: 'secondary' }))}>
            Kontakt
          </Link>
        </div>
      </Container>
    </section>
  )
}
