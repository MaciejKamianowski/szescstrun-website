import type { MetadataRoute } from 'next'

import { getServerUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  const base = getServerUrl()
  const host = base.replace(/^https?:\/\//, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host,
  }
}
