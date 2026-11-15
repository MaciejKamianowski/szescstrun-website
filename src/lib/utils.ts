import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPricePLN(amountInGrosze: number): string {
  const value = amountInGrosze / 100
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value)
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

/** Canonical production origin used for sitemap, robots, metadata, and OG URLs. */
export const PRODUCTION_SITE_URL = 'https://www.szescstrun.pl'

function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/$/, '')
}

export function isLocalhostUrl(value: string): boolean {
  try {
    const host = new URL(value).hostname
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1'
  } catch {
    return /localhost|127\.0\.0\.1/i.test(value)
  }
}

function resolveConfiguredSiteUrl(): string | undefined {
  // Prefer SERVER_URL at runtime (not inlined by Next) over NEXT_PUBLIC_* (build-time).
  const raw =
    process.env.SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '')

  const normalized = normalizeSiteUrl(raw)
  return normalized || undefined
}

/**
 * Public site origin for SEO and absolute links.
 * In production never returns localhost — falls back to {@link PRODUCTION_SITE_URL}.
 * Apex `szescstrun.pl` is normalized to the www HTTPS canonical.
 */
export function getServerUrl(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const configured = resolveConfiguredSiteUrl()

  if (isProduction) {
    if (!configured || isLocalhostUrl(configured)) {
      return PRODUCTION_SITE_URL
    }

    try {
      const parsed = new URL(configured)
      if (parsed.hostname === 'szescstrun.pl' || parsed.hostname === 'www.szescstrun.pl') {
        return PRODUCTION_SITE_URL
      }
      parsed.protocol = 'https:'
      return normalizeSiteUrl(parsed.origin)
    } catch {
      return PRODUCTION_SITE_URL
    }
  }

  return configured || 'http://localhost:3000'
}
