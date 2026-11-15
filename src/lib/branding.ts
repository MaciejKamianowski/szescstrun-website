import type { Media, SiteSetting } from '@/payload-types'
import { getMediaUrl } from '@/lib/media'

export const LOGO_ALT = 'Sześć Strun — Zacznij grać świadomie'

/** Domyślny logotyp z katalogu public (oryginał bez zmian). */
export const DEFAULT_SITE_LOGO = {
  src: '/images/szesc-strun-logo.jpeg',
  width: 1516,
  height: 650,
} as const

export const DEFAULT_FAVICON = '/icons/favicon-32.png'
export const DEFAULT_APPLE_ICON = '/icons/apple-touch-icon.png'
export const DEFAULT_ICON_192 = '/icons/icon-192.png'
export const DEFAULT_ICON_512 = '/icons/icon-512.png'

export type BrandLogo = {
  src: string
  width: number
  height: number
  alt: string
}

function fromMedia(media: Media | number | null | undefined, fallbackAlt: string): BrandLogo | null {
  if (!media || typeof media === 'number') return null
  const src = getMediaUrl(media)
  if (!src) return null

  return {
    src,
    width: media.width || DEFAULT_SITE_LOGO.width,
    height: media.height || DEFAULT_SITE_LOGO.height,
    alt: media.alt || fallbackAlt,
  }
}

export function resolveSiteLogo(settings?: SiteSetting | null): BrandLogo {
  const fromCms = fromMedia(settings?.siteLogo as Media | number | null | undefined, LOGO_ALT)
  if (fromCms) return fromCms

  return {
    ...DEFAULT_SITE_LOGO,
    alt: LOGO_ALT,
  }
}

export function resolveFooterLogo(settings?: SiteSetting | null): BrandLogo {
  const fromCms = fromMedia(settings?.footerLogo as Media | number | null | undefined, LOGO_ALT)
  if (fromCms) return fromCms
  return resolveSiteLogo(settings)
}

export function resolveFaviconUrl(settings?: SiteSetting | null): string {
  const fromCms = getMediaUrl(settings?.favicon as Media | number | null | undefined)
  return fromCms || DEFAULT_FAVICON
}
