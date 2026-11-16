'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/youtube'
import type { Video } from '@/payload-types'

function VideoCard({ video }: { video: Video }) {
  const [consent, setConsent] = useState(false)
  const videoId = video.youtubeVideoId

  if (!videoId) return null

  return (
    <article className="overflow-hidden border border-border bg-background-secondary">
      <div className="relative aspect-video bg-black">
        {consent ? (
          <iframe
            src={`${getYouTubeEmbedUrl(videoId)}?autoplay=1`}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0"
            onClick={() => setConsent(true)}
            aria-label={`Odtwórz: ${video.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getYouTubeThumbnailUrl(videoId)}
              alt=""
              className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/35">
              <span className="rounded-full bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-wide text-background">
                Odtwórz
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold uppercase tracking-wide text-foreground">{video.title}</h3>
        {video.description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">{video.description}</p>
        ) : null}
        {!consent ? (
          <p className="mt-3 text-xs text-muted">
            Odtwarzanie ładuje treść z YouTube (youtube-nocookie.com). Kliknij dopiero gdy akceptujesz
            to połączenie.
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function VideosGrid({
  videos,
  showLink = true,
  eyebrow = 'Nagrania',
  title = 'Posłuchaj i zobacz',
  description = 'Filmy z oficjalnego kanału YouTube.',
  buttonLabel = 'Wszystkie nagrania',
  buttonHref = '/nagrania',
  buttonExternal = false,
  emptyMessage = 'Pierwsze nagrania już wkrótce.',
}: {
  videos: Video[]
  showLink?: boolean
  eyebrow?: string
  title?: string
  description?: string
  buttonLabel?: string
  buttonHref?: string
  buttonExternal?: boolean
  emptyMessage?: string
}) {
  const buttonClass = 'text-sm uppercase tracking-wide text-accent hover:underline'

  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container>
        {showLink ? (
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading eyebrow={eyebrow} title={title} description={description} />
              {buttonExternal ? (
                <a href={buttonHref} className={buttonClass} target="_blank" rel="noopener noreferrer">
                  {buttonLabel}
                </a>
              ) : (
                <Link href={buttonHref} className={buttonClass}>
                  {buttonLabel}
                </Link>
              )}
            </div>
          </Reveal>
        ) : null}

        {videos.length === 0 ? (
          <p className="text-muted">{emptyMessage}</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {videos.map((video, index) => (
              <Reveal key={video.id} delay={index * 0.05}>
                <VideoCard video={video} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
