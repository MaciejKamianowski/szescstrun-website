import Image from 'next/image'
import Link from 'next/link'
import { existsSync } from 'fs'
import path from 'path'

import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getMediaImageSrc } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { Media, SiteSetting } from '@/payload-types'

const LOCAL_HERO_WIDTH = 2048
const LOCAL_HERO_HEIGHT = 1365

function resolveHeroImage(settings: SiteSetting): {
  src: string
  alt: string
  width: number
  height: number
  useNextImage: boolean
} {
  const cmsPhoto = settings.teacherPhoto as Media | number | null | undefined
  const cmsUrl = getMediaImageSrc(cmsPhoto)

  if (cmsUrl && typeof cmsPhoto === 'object' && cmsPhoto) {
    return {
      src: cmsUrl,
      alt:
        cmsPhoto.alt ||
        `${settings.teacherName || 'Jacek Krakowski'} — nauczyciel gitary`,
      width: cmsPhoto.width || LOCAL_HERO_WIDTH,
      height: cmsPhoto.height || LOCAL_HERO_HEIGHT,
      useNextImage: true,
    }
  }

  const publicJpg = path.join(process.cwd(), 'public/images/jacek-krakowski.jpg')
  const publicJpeg = path.join(process.cwd(), 'public/images/jacek-krakowski.jpeg')
  const alt = `${settings.teacherName || 'Jacek Krakowski'} gra na gitarze akustycznej`

  if (existsSync(publicJpg)) {
    return {
      src: '/images/jacek-krakowski.jpg',
      alt,
      width: LOCAL_HERO_WIDTH,
      height: LOCAL_HERO_HEIGHT,
      useNextImage: true,
    }
  }

  if (existsSync(publicJpeg)) {
    return {
      src: '/images/jacek-krakowski.jpeg',
      alt,
      width: LOCAL_HERO_WIDTH,
      height: LOCAL_HERO_HEIGHT,
      useNextImage: true,
    }
  }

  return {
    src: '',
    alt: '',
    width: LOCAL_HERO_WIDTH,
    height: LOCAL_HERO_HEIGHT,
    useNextImage: false,
  }
}

export function Hero({ settings }: { settings: SiteSetting }) {
  const heading =
    settings.heroHeading || 'SZEŚĆ STRUN.\nNIESKOŃCZONE MOŻLIWOŚCI.'
  const description =
    settings.heroDescription ||
    'Odkryj świat gitary akustycznej i rozwijaj swoje umiejętności podczas indywidualnych lekcji.'
  const cta = settings.heroCTA || 'Umów lekcję'
  const image = resolveHeroImage(settings)
  const lines = heading.split('\n')

  return (
    <section className="relative border-b border-border">
      <Container className="grid items-center gap-10 py-10 md:py-14 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-2 lg:gap-16 lg:py-16">
        <Reveal className="relative z-10 max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Lekcje gitary akustycznej
          </p>
          <h1 className="text-[2.1rem] font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontakt" className={buttonVariants({ size: 'lg' })}>
              {cta}
            </Link>
            <Link
              href="/oferta"
              className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
            >
              Poznaj ofertę
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative flex w-full items-center justify-center">
          {image.useNextImage ? (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              sizes="(max-width: 1024px) 100vw, min(50vw, 640px)"
              className="h-auto max-h-[min(70vh,560px)] w-auto max-w-full object-contain grayscale contrast-110 lg:max-h-[min(75vh,640px)]"
            />
          ) : (
            <div className="flex aspect-[3/2] w-full max-w-xl items-end bg-[radial-gradient(circle_at_60%_30%,#2a2a2a,transparent_55%),linear-gradient(180deg,#191919,#111111)] p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">Zdjęcie nauczyciela</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                  Zdjęcie pojawi się tutaj wkrótce.
                </p>
              </div>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  )
}
