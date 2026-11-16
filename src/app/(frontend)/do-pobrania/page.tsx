import type { Metadata } from 'next'

import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getActiveDownloads, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { toAbsolutePublicUrl } from '@/lib/media'
import { resolveDownloadsPage, type SiteContentSettings } from '@/lib/site-content'
import { formatBytes } from '@/lib/uploads'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const page = resolveDownloadsPage(settings as typeof settings & SiteContentSettings)

  return buildMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: '/do-pobrania',
  })
}

export default async function DownloadsPage() {
  const [settings, files] = await Promise.all([getSiteSettings(), getActiveDownloads()])
  const page = resolveDownloadsPage(settings as typeof settings & SiteContentSettings)

  return (
    <section className="border-b border-border py-16 md:py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{page.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
            {page.title}
          </h1>
          {page.description ? (
            <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">{page.description}</p>
          ) : null}
        </Reveal>

        {files.length === 0 ? (
          page.emptyMessage ? (
            <Reveal delay={0.08}>
              <p className="mt-12 text-base leading-relaxed text-muted">{page.emptyMessage}</p>
            </Reveal>
          ) : null
        ) : (
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {files.map((file) => {
              const href = file.url ? toAbsolutePublicUrl(file.url) : null
              const size = typeof file.filesize === 'number' ? formatBytes(file.filesize) : null

              return (
                <li key={file.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold uppercase tracking-wide text-foreground">{file.title}</h2>
                    {file.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted">{file.description}</p>
                    ) : null}
                    {size ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">{size}</p> : null}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-accent px-5 text-xs font-semibold uppercase tracking-wide text-background transition-colors hover:bg-accent/90"
                      download
                    >
                      Pobierz
                    </a>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </Container>
    </section>
  )
}
