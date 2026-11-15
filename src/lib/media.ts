import type { Media } from '@/payload-types'
import { getServerUrl } from '@/lib/utils'

export function getMediaUrl(media: Media | number | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  if (!media.url) return null

  if (media.url.startsWith('http')) return media.url
  return `${getServerUrl()}${media.url}`
}

export function getMediaAlt(media: Media | number | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}
