import type { Metadata } from 'next'

import { getServerUrl } from '@/lib/utils'

type BuildMetadataInput = {
  title?: string | null
  description?: string | null
  path?: string
  image?: string | null
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const siteName = 'Sześć Strun'
  const url = `${getServerUrl()}${path}`
  const metaTitle = title || 'Sześć Strun — lekcje gitary akustycznej'
  const metaDescription =
    description ||
    'Indywidualne lekcje gry na gitarze akustycznej z Jackiem Krakowskim.'

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      url,
      siteName,
      title: metaTitle,
      description: metaDescription,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: metaTitle,
      description: metaDescription,
      ...(image ? { images: [image] } : {}),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  }
}
