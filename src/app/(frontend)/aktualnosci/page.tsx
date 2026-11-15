import type { Metadata } from 'next'
import Link from 'next/link'

import { PostsGrid } from '@/components/sections/posts-grid'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getPublishedPosts } from '@/lib/queries'
import { SEO_DEFAULTS, buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: SEO_DEFAULTS.news.title,
  description: SEO_DEFAULTS.news.description,
  path: '/aktualnosci',
})

const categories = [
  { value: '', label: 'Wszystkie' },
  { value: 'aktualnosci', label: 'Aktualności' },
  { value: 'ogloszenia', label: 'Ogłoszenia' },
  { value: 'warsztaty', label: 'Warsztaty' },
  { value: 'wydarzenia', label: 'Wydarzenia' },
]

type SearchParams = Promise<{ kategoria?: string; strona?: string }>

export default async function PostsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const category = params.kategoria || undefined
  const page = Math.max(1, Number(params.strona || '1') || 1)
  const result = await getPublishedPosts({ page, limit: 9, category })

  return (
    <>
      <section className="border-b border-border py-16 md:py-20">
        <Container>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Aktualności
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
              Wiadomości i ogłoszenia
            </h1>
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((item) => {
                const href = item.value
                  ? `/aktualnosci?kategoria=${item.value}`
                  : '/aktualnosci'
                const active = (category || '') === item.value
                return (
                  <Link
                    key={item.value || 'all'}
                    href={href}
                    className={cn(
                      'rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition-colors',
                      active
                        ? 'border-accent bg-accent text-background'
                        : 'border-border text-muted hover:border-accent hover:text-accent',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </Reveal>
        </Container>
      </section>

      <PostsGrid posts={result.docs} showLink={false} />

      {result.totalPages > 1 ? (
        <section className="pb-16">
          <Container className="flex items-center justify-center gap-3">
            {page > 1 ? (
              <Link
                href={`/aktualnosci?${new URLSearchParams({
                  ...(category ? { kategoria: category } : {}),
                  strona: String(page - 1),
                }).toString()}`}
                className="text-sm uppercase tracking-wide text-accent hover:underline"
              >
                Poprzednia
              </Link>
            ) : null}
            <span className="text-sm text-muted">
              Strona {result.page} z {result.totalPages}
            </span>
            {page < result.totalPages ? (
              <Link
                href={`/aktualnosci?${new URLSearchParams({
                  ...(category ? { kategoria: category } : {}),
                  strona: String(page + 1),
                }).toString()}`}
                className="text-sm uppercase tracking-wide text-accent hover:underline"
              >
                Następna
              </Link>
            ) : null}
          </Container>
        </section>
      ) : null}
    </>
  )
}
