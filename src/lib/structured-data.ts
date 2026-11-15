import { DEFAULT_OG_IMAGE_PATH } from '@/lib/seo-defaults'
import { absoluteUrl, getServerUrl } from '@/lib/utils'
import type { SiteSetting } from '@/payload-types'

type JsonLd = Record<string, unknown>

function socialProfiles(settings: SiteSetting): string[] {
  return [settings.facebookUrl, settings.youtubeUrl]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
}

export function websiteEntityId(base = getServerUrl()): string {
  return `${base}/#website`
}

export function organizationEntityId(base = getServerUrl()): string {
  return `${base}/#organization`
}

export function personEntityId(base = getServerUrl()): string {
  return `${base}/#person`
}

export function buildOrganizationJsonLd(settings: SiteSetting): JsonLd {
  const base = getServerUrl()
  const sameAs = socialProfiles(settings)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationEntityId(base),
    name: settings.siteName?.trim() || 'Sześć Strun',
    url: `${base}/`,
    logo: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function buildWebsiteJsonLd(settings: SiteSetting): JsonLd {
  const base = getServerUrl()
  const description = settings.siteDescription?.trim() || settings.seoDefaultDescription?.trim()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteEntityId(base),
    name: settings.siteName?.trim() || 'Sześć Strun',
    url: `${base}/`,
    inLanguage: 'pl-PL',
    publisher: { '@id': organizationEntityId(base) },
    ...(description ? { description } : {}),
  }
}

export function buildPersonJsonLd(settings: SiteSetting): JsonLd {
  const base = getServerUrl()
  const sameAs = socialProfiles(settings)
  const name = settings.teacherName?.trim() || 'Jacek Krakowski'

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personEntityId(base),
    name,
    url: absoluteUrl('/o-mnie'),
    jobTitle: 'Nauczyciel gry na gitarze akustycznej',
    worksFor: { '@id': organizationEntityId(base) },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function buildBlogPostingJsonLd(input: {
  title: string
  description?: string | null
  slug: string
  datePublished?: string | null
  dateModified?: string | null
  imageUrl?: string | null
  authorName: string
}): JsonLd {
  const pageUrl = absoluteUrl(`/aktualnosci/${input.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${pageUrl}#article`,
    headline: input.title,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    inLanguage: 'pl-PL',
    author: {
      '@type': 'Person',
      '@id': personEntityId(),
      name: input.authorName,
    },
    publisher: { '@id': organizationEntityId() },
    isPartOf: { '@id': websiteEntityId() },
    ...(input.description ? { description: input.description } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  }
}
