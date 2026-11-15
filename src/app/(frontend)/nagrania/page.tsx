import type { Metadata } from 'next'
import Link from 'next/link'

import { VideosGrid } from '@/components/sections/videos-grid'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getActiveVideos, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Nagrania — Sześć Strun',
  description: 'Filmy i nagrania z kanału YouTube Sześć Strun — Jacek Krakowski.',
  path: '/nagrania',
})

export default async function VideosPage() {
  const [videos, settings] = await Promise.all([getActiveVideos(), getSiteSettings()])

  return (
    <>
      <section className="border-b border-border py-16 md:py-20">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Nagrania</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
              Galeria filmów
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Wybrane materiały wideo. Oficjalny kanał:{' '}
              {settings.youtubeUrl ? (
                <Link
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  YouTube
                </Link>
              ) : (
                'YouTube'
              )}
              .
            </p>
          </Reveal>
        </Container>
      </section>
      <VideosGrid videos={videos} showLink={false} />
    </>
  )
}
