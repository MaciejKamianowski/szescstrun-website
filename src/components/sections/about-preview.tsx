import Image from 'next/image'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import type { AboutPreviewContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'

export function AboutPreview({ content }: { content: AboutPreviewContent }) {
  const buttonClass = cn(buttonVariants({ variant: 'secondary' }), 'mt-8')

  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <Reveal>
          <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.lead} />
          {content.image ? (
            <div className="relative mt-8 aspect-[4/3] overflow-hidden">
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-base leading-relaxed text-muted md:text-lg">{content.text}</p>
          {content.buttonExternal ? (
            <a
              href={content.buttonHref}
              className={buttonClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.buttonLabel}
            </a>
          ) : (
            <Link href={content.buttonHref} className={buttonClass}>
              {content.buttonLabel}
            </Link>
          )}
        </Reveal>
      </Container>
    </section>
  )
}
