import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { SectionHeading } from '@/components/ui/section-heading'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { Media, Post } from '@/payload-types'

const categoryLabels: Record<string, string> = {
  aktualnosci: 'Aktualności',
  ogloszenia: 'Ogłoszenia',
  warsztaty: 'Warsztaty',
  wydarzenia: 'Wydarzenia',
}

export function PostsGrid({
  posts,
  showLink = true,
  title = 'Aktualności',
}: {
  posts: Post[]
  showLink?: boolean
  title?: string
}) {
  return (
    <section className="border-b border-border py-20 md:py-28">
      <Container>
        {showLink ? (
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Blog"
                title={title}
                description="Ogłoszenia, wydarzenia i informacje ze świata Sześciu Strun."
              />
              <Link
                href="/aktualnosci"
                className="text-sm uppercase tracking-wide text-accent hover:underline"
              >
                Wszystkie wpisy
              </Link>
            </div>
          </Reveal>
        ) : null}

        {posts.length === 0 ? (
          <p className="text-muted">Brak opublikowanych wpisów.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const image = post.featuredImage as Media | number | null | undefined
              const imageUrl = getMediaUrl(image)

              return (
                <Reveal key={post.id} delay={index * 0.05}>
                  <article className="group flex h-full flex-col overflow-hidden border border-border bg-background-secondary transition-colors hover:border-accent/40">
                    {imageUrl ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={getMediaAlt(image, post.title)}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted">
                        <span className="text-accent">
                          {categoryLabels[post.category] || post.category}
                        </span>
                        {post.publishedAt ? (
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('pl-PL')}
                          </time>
                        ) : null}
                      </div>
                      <h3 className="text-xl font-semibold uppercase tracking-wide text-foreground">
                        <Link href={`/aktualnosci/${post.slug}`} className="hover:text-accent">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                      <Link
                        href={`/aktualnosci/${post.slug}`}
                        className="mt-5 text-sm uppercase tracking-wide text-accent hover:underline"
                      >
                        Czytaj dalej
                      </Link>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        )}
      </Container>
    </section>
  )
}
