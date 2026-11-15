import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { getServerUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerUrl()
  const payload = await getPayloadClient()

  const posts = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/o-mnie',
    '/oferta',
    '/cennik',
    '/aktualnosci',
    '/nagrania',
    '/kontakt',
    '/polityka-prywatnosci',
  ].map((path) => ({
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
