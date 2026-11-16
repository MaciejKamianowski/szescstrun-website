import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostsGrid } from '@/components/sections/posts-grid'
import { RichText } from '@/components/rich-text'
import { JsonLd } from '@/components/seo/json-ld'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getMediaUrl, resolveGalleryImages, resolveRenderableMedia } from '@/lib/media'
import { getPostBySlug, getRelatedPosts, getSiteSettings } from '@/lib/queries'
import { buildMetadata, firstNonEmpty } from '@/lib/seo'
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
} from '@/lib/structured-data'
import type { Media } from '@/payload-types'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post || post._status !== 'published') {
    return buildMetadata({
      title: 'Wpis niedostępny — Sześć Strun',
      path: `/aktualnosci/${slug}`,
      noIndex: true,
    })
  }

  const image = getMediaUrl(post.featuredImage as Media | number | null | undefined)

  return buildMetadata({
    title: firstNonEmpty(post.seoTitle, `${post.title} — Sześć Strun`),
    description: firstNonEmpty(post.seoDescription, post.excerpt),
    path: `/aktualnosci/${post.slug}`,
    image,
    ogType: 'article',
  })
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const [related, settings] = await Promise.all([getRelatedPosts(post), getSiteSettings()])
  const featured = post.featuredImage as Media | number | null | undefined
  const imageUrl = getMediaUrl(featured)
  const featuredImage = resolveRenderableMedia(featured, post.title)
  const galleryImages = resolveGalleryImages(post.gallery, post.title)

  return (
    <>
      <JsonLd
        data={[
          buildBlogPostingJsonLd({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            imageUrl,
            authorName: settings.teacherName || 'Jacek Krakowski',
          }),
          buildBreadcrumbJsonLd([
            { name: 'Strona główna', path: '/' },
            { name: 'Aktualności', path: '/aktualnosci' },
            { name: post.title, path: `/aktualnosci/${post.slug}` },
          ]),
        ]}
      />

      <article className="border-b border-border py-16 md:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <Link
              href="/aktualnosci"
              className="text-xs uppercase tracking-[0.18em] text-accent hover:underline"
            >
              ← Aktualności
            </Link>
            <h1 className="mt-6 text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
              {post.publishedAt ? (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('pl-PL')}
                </time>
              ) : null}
              {post.pinned ? <span className="text-accent">Przypięte</span> : null}
            </div>
          </Reveal>

          {featuredImage ? (
            <Reveal delay={0.05} className="relative mt-10 aspect-[16/9] overflow-hidden">
              <Image
                src={featuredImage.src}
                alt={featuredImage.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </Reveal>
          ) : null}

          <Reveal delay={0.08} className="mt-10">
            <RichText data={post.content} />
          </Reveal>

          {galleryImages.length > 0 ? (
            <Reveal delay={0.1} className="mt-12 grid gap-4 sm:grid-cols-2">
              {galleryImages.map((item, index) => (
                <div key={`${post.id}-gallery-${index}`} className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </Reveal>
          ) : null}
        </Container>
      </article>

      {related.length > 0 ? <PostsGrid posts={related} showLink title="Powiązane wpisy" /> : null}
    </>
  )
}
