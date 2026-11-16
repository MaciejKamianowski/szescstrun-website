import type { Media, Post } from '@/payload-types'
import { getServerUrl } from '@/lib/utils'

const SITE_HOSTS = new Set(['www.szescstrun.pl', 'szescstrun.pl', 'localhost', '127.0.0.1'])

export type RenderableMedia = {
  src: string
  alt: string
}

function parseHttpUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function isPayloadMediaPath(pathname: string): boolean {
  return pathname.startsWith('/api/media/')
}

function isSiteHostname(hostname: string): boolean {
  const host = hostname.toLowerCase()
  if (SITE_HOSTS.has(host)) return true

  try {
    return new URL(getServerUrl()).hostname.toLowerCase() === host
  } catch {
    return false
  }
}

/**
 * Same-origin and Payload proxy URLs must be paths for `next/image`.
 * An absolute `https://www.szescstrun.pl/api/media/file/...` is treated as a
 * remote image and rejected with 400 because the site host is not in
 * `images.remotePatterns`. External CDN URLs stay absolute.
 */
export function toNextImageSrc(url: string): string {
  if (url.startsWith('/') && !url.startsWith('//')) return url

  const parsed = parseHttpUrl(url)
  if (!parsed) return url

  if (isPayloadMediaPath(parsed.pathname) || isSiteHostname(parsed.hostname)) {
    return `${parsed.pathname}${parsed.search}`
  }

  return url
}

/** Absolute public URL for metadata, JSON-LD and other non-image-optimizer uses. */
export function toAbsolutePublicUrl(url: string): string {
  if (url.startsWith('/') && !url.startsWith('//')) {
    return `${getServerUrl()}${url}`
  }

  const parsed = parseHttpUrl(url)
  if (!parsed) return url

  if (isPayloadMediaPath(parsed.pathname) || isSiteHostname(parsed.hostname)) {
    return `${getServerUrl()}${parsed.pathname}${parsed.search}`
  }

  return url
}

export function getMediaUrl(media: Media | number | null | undefined): string | null {
  if (!media || typeof media === 'number' || !media.url) return null
  return toAbsolutePublicUrl(media.url)
}

/** Source safe to pass to `next/image`. Null when the relation is missing. */
export function getMediaImageSrc(media: Media | number | null | undefined): string | null {
  if (!media || typeof media === 'number' || !media.url) return null
  return toNextImageSrc(media.url)
}

export function getMediaAlt(media: Media | number | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}

export function resolveRenderableMedia(
  media: Media | number | null | undefined,
  fallbackAlt = '',
): RenderableMedia | null {
  const src = getMediaImageSrc(media)
  if (!src) return null
  return {
    src,
    alt: getMediaAlt(media, fallbackAlt),
  }
}

export function resolveGalleryImages(
  gallery: Post['gallery'],
  fallbackTitle: string,
): RenderableMedia[] {
  if (!gallery?.length) return []

  return gallery.flatMap((item, index) => {
    const image = resolveRenderableMedia(item.image, `${fallbackTitle} — zdjęcie ${index + 1}`)
    return image ? [image] : []
  })
}
