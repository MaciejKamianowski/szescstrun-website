import type { Metadata } from 'next'

import { DEFAULT_OG_IMAGE_PATH, SEO_DEFAULTS, firstNonEmpty } from '@/lib/seo-defaults'
import { absoluteUrl, getServerUrl } from '@/lib/utils'

type BuildMetadataInput = {
  title?: string | null
  description?: string | null
  path?: string
  image?: string | null
  noIndex?: boolean
  ogType?: 'website' | 'article'
}

function resolveOgImage(image?: string | null): string {
  const candidate = firstNonEmpty(image, DEFAULT_OG_IMAGE_PATH) || DEFAULT_OG_IMAGE_PATH
  if (candidate.startsWith('http://') || candidate.startsWith('https://')) {
    return candidate
  }
  return absoluteUrl(candidate.startsWith('/') ? candidate : `/${candidate}`)
}

/**
 * Builds page metadata with self-referencing canonical, Open Graph and Twitter cards.
 * Empty CMS strings fall back to sensible defaults — never emit blank title/description.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  noIndex = false,
  ogType = 'website',
}: BuildMetadataInput): Metadata {
  const siteName = 'Sześć Strun'
  const url = absoluteUrl(path)
  const metaTitle = firstNonEmpty(title, SEO_DEFAULTS.home.title) || SEO_DEFAULTS.home.title
  const metaDescription =
    firstNonEmpty(description, SEO_DEFAULTS.home.description) || SEO_DEFAULTS.home.description
  const ogImage = resolveOgImage(image)

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      locale: 'pl_PL',
      url,
      siteName,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: ogImage,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
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

export function getMetadataBase(): URL {
  return new URL(`${getServerUrl()}/`)
}

export { absoluteUrl, DEFAULT_OG_IMAGE_PATH, SEO_DEFAULTS, firstNonEmpty }
