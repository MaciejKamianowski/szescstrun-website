import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { buildMetadata } from '../../src/lib/seo'
import { SITEMAP_STATIC_PATHS } from '../../src/lib/sitemap-routes'
import {
  PRODUCTION_SITE_URL,
  getServerUrl,
  isLocalhostUrl,
} from '../../src/lib/utils'

const ENV_KEYS = [
  'NODE_ENV',
  'SERVER_URL',
  'NEXT_PUBLIC_SERVER_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
] as const

describe('getServerUrl / production SEO base', () => {
  const original: Record<string, string | undefined> = {}

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      original[key] = process.env[key]
    }
  })

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (original[key] === undefined) delete process.env[key]
      else process.env[key] = original[key]
    }
  })

  it('allows localhost in development', () => {
    process.env.NODE_ENV = 'development'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    delete process.env.SERVER_URL

    expect(getServerUrl()).toBe('http://localhost:3000')
  })

  it('never returns localhost in production even when NEXT_PUBLIC_SERVER_URL is localhost', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    delete process.env.SERVER_URL

    const url = getServerUrl()
    expect(url).toBe(PRODUCTION_SITE_URL)
    expect(isLocalhostUrl(url)).toBe(false)
    expect(url).toMatch(/^https:\/\/www\.szescstrun\.pl$/)
  })

  it('normalizes apex szescstrun.pl to www HTTPS in production', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://szescstrun.pl'
    delete process.env.SERVER_URL

    expect(getServerUrl()).toBe(PRODUCTION_SITE_URL)
  })

  it('prefers runtime SERVER_URL over build-time NEXT_PUBLIC_SERVER_URL', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    process.env.SERVER_URL = 'https://www.szescstrun.pl'

    expect(getServerUrl()).toBe(PRODUCTION_SITE_URL)
  })

  it('production sitemap static locs never contain localhost', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    delete process.env.SERVER_URL

    const base = getServerUrl()
    const locs = SITEMAP_STATIC_PATHS.map((path) => `${base}${path}`)

    expect(locs.length).toBeGreaterThan(0)
    for (const loc of locs) {
      expect(loc.startsWith('https://www.szescstrun.pl')).toBe(true)
      expect(loc).not.toMatch(/localhost|127\.0\.0\.1/i)
      expect(loc).not.toMatch(/^http:\/\//)
    }

    expect(locs.some((loc) => loc.includes('/admin'))).toBe(false)
    expect(locs.some((loc) => loc.includes('/api'))).toBe(false)
  })

  it('buildMetadata uses production canonical and Open Graph URL', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    delete process.env.SERVER_URL

    const meta = buildMetadata({
      title: 'Kontakt',
      description: 'Formularz kontaktowy',
      path: '/kontakt',
    })

    expect(meta.alternates?.canonical).toBe('https://www.szescstrun.pl/kontakt')
    expect(meta.openGraph?.url).toBe('https://www.szescstrun.pl/kontakt')
    expect(String(meta.alternates?.canonical)).not.toMatch(/localhost/i)
  })
})
