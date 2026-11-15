import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings } from '@/lib/queries'
import { SITEMAP_STATIC_PATHS } from '@/lib/sitemap-routes'
import { absoluteUrl, getServerUrl, isLocalhostUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerUrl()

  if (process.env.NODE_ENV === 'production' && isLocalhostUrl(base)) {
    throw new Error('Refusing to emit production sitemap with localhost base URL')
  }

  const [payload, settings] = await Promise.all([getPayloadClient(), getSiteSettings()])

  const posts = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    // Enforce public access rules — drafts must never appear in the sitemap.
    overrideAccess: false,
  })

  const settingsUpdatedAt = settings.updatedAt ? new Date(settings.updatedAt) : undefined

  const staticRoutes: MetadataRoute.Sitemap = SITEMAP_STATIC_PATHS.map((path) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: absoluteUrl(path || '/'),
    }
    // Prefer a real CMS timestamp; do not invent "now" for unchanged static pages.
    if (settingsUpdatedAt) {
      entry.lastModified = settingsUpdatedAt
    }
    return entry
  })

  const postRoutes: MetadataRoute.Sitemap = posts.docs
    .filter((post) => Boolean(post.slug))
    .map((post) => {
      const entry: MetadataRoute.Sitemap[number] = {
        url: absoluteUrl(`/aktualnosci/${post.slug}`),
      }
      if (post.updatedAt) {
        entry.lastModified = new Date(post.updatedAt)
      } else if (post.publishedAt) {
        entry.lastModified = new Date(post.publishedAt)
      }
      return entry
    })

  const urls = [...staticRoutes, ...postRoutes]
  const seen = new Set<string>()
  return urls.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
