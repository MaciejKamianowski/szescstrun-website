import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { cn } from '@/lib/utils'
import type { SiteSetting } from '@/payload-types'

export function AboutPreview({ settings }: { settings: SiteSetting }) {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <Reveal>
          <SectionHeading
            eyebrow="O nauczycielu"
            title={settings.teacherName || 'Jacek Krakowski'}
            description="Indywidualne podejście, spokojna praca nad brzmieniem i techniką oraz nauka dopasowana do Twojego tempa."
          />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-base leading-relaxed text-muted md:text-lg">
            Sześć Strun to przestrzeń do nauki gry na gitarze akustycznej — od pierwszych akordów po
            bardziej świadomą pracę nad stylem i repertuarem. Szczegółowe informacje o doświadczeniu
            i metodzie nauczania znajdziesz na stronie nauczyciela.
          </p>
          <Link href="/o-mnie" className={cn(buttonVariants({ variant: 'secondary' }), 'mt-8')}>
            Poznaj Jacka
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}
