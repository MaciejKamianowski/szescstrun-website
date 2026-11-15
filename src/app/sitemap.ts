import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { SITEMAP_STATIC_PATHS } from '@/lib/sitemap-routes'
import { getServerUrl, isLocalhostUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerUrl()

  if (process.env.NODE_ENV === 'production' && isLocalhostUrl(base)) {
    throw new Error('Refusing to emit production sitemap with localhost base URL')
  }

  const payload = await getPayloadClient()

  const posts = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    // Enforce public access rules — drafts must never appear in the sitemap.
    overrideAccess: false,
  })

  const staticRoutes: MetadataRoute.Sitemap = SITEMAP_STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/aktualnosci' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.docs.map((post) => ({
    url: `${base}/aktualnosci/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...postRoutes]
}
