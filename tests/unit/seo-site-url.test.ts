import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import robots from '../../src/app/robots'
import { buildMetadata } from '../../src/lib/seo'
import { SEO_DEFAULTS } from '../../src/lib/seo-defaults'
import { SITEMAP_STATIC_PATHS } from '../../src/lib/sitemap-routes'
import {
  buildBlogPostingJsonLd,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
} from '../../src/lib/structured-data'
import {
  PRODUCTION_SITE_URL,
  absoluteUrl,
  getServerUrl,
  isLocalhostUrl,
} from '../../src/lib/utils'
import type { SiteSetting } from '../../src/payload-types'

const ENV_KEYS = [
  'NODE_ENV',
  'SERVER_URL',
  'NEXT_PUBLIC_SERVER_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
] as const

const PUBLIC_ROUTES = [
  { path: '/', title: SEO_DEFAULTS.home.title, description: SEO_DEFAULTS.home.description },
  { path: '/o-mnie', title: SEO_DEFAULTS.about.title, description: SEO_DEFAULTS.about.description },
  { path: '/oferta', title: SEO_DEFAULTS.offer.title, description: SEO_DEFAULTS.offer.description },
  {
    path: '/cennik',
    title: SEO_DEFAULTS.pricing.title,
    description: SEO_DEFAULTS.pricing.description,
  },
  { path: '/aktualnosci', title: SEO_DEFAULTS.news.title, description: SEO_DEFAULTS.news.description },
  {
    path: '/nagrania',
    title: SEO_DEFAULTS.recordings.title,
    description: SEO_DEFAULTS.recordings.description,
  },
  {
    path: '/kontakt',
    title: SEO_DEFAULTS.contact.title,
    description: SEO_DEFAULTS.contact.description,
  },
  {
    path: '/polityka-prywatnosci',
    title: SEO_DEFAULTS.privacy.title,
    description: SEO_DEFAULTS.privacy.description,
  },
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
    expect(absoluteUrl('/kontakt')).toBe('http://localhost:3000/kontakt')
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

  it('production sitemap static locs never contain localhost or private paths', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    delete process.env.SERVER_URL

    const locs = SITEMAP_STATIC_PATHS.map((path) => absoluteUrl(path || '/'))

    expect(locs.length).toBe(8)
    expect(locs[0]).toBe('https://www.szescstrun.pl/')
    for (const loc of locs) {
      expect(loc.startsWith('https://www.szescstrun.pl')).toBe(true)
      expect(loc).not.toMatch(/localhost|127\.0\.0\.1/i)
      expect(loc).not.toMatch(/^http:\/\//)
      expect(loc).not.toMatch(/railway\.app/i)
    }

    expect(locs.some((loc) => loc.includes('/admin'))).toBe(false)
    expect(locs.some((loc) => /\/api(\/|$)/.test(loc))).toBe(false)
  })

  it('builds self-referencing canonical and Open Graph URLs for every public route', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    delete process.env.SERVER_URL

    for (const route of PUBLIC_ROUTES) {
      const meta = buildMetadata({
        title: route.title,
        description: route.description,
        path: route.path,
      })

      const expected = absoluteUrl(route.path)
      expect(meta.alternates?.canonical).toBe(expected)
      expect(meta.openGraph?.url).toBe(expected)
      expect(meta.title).toBe(route.title)
      expect(meta.description).toBe(route.description)
      expect(String(meta.alternates?.canonical)).not.toMatch(/localhost/i)
      expect(meta.openGraph?.locale).toBe('pl_PL')
      expect(meta.openGraph?.images?.[0]?.url).toMatch(/^https:\/\/www\.szescstrun\.pl\//)
    }
  })

  it('falls back when CMS title/description are empty', () => {
    process.env.NODE_ENV = 'production'
    delete process.env.SERVER_URL
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://www.szescstrun.pl'

    const meta = buildMetadata({
      title: '   ',
      description: '',
      path: '/kontakt',
    })

    expect(meta.title).toBe(SEO_DEFAULTS.home.title)
    expect(meta.description).toBe(SEO_DEFAULTS.home.description)
  })

  it('configures robots.txt with production sitemap and media allow', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    delete process.env.SERVER_URL

    const config = robots()
    expect(config.sitemap).toBe('https://www.szescstrun.pl/sitemap.xml')
    expect(config.host).toBe('www.szescstrun.pl')
    expect(config.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          allow: expect.arrayContaining(['/', '/api/media/']),
          disallow: expect.arrayContaining(['/admin/', '/api/']),
        }),
      ]),
    )
  })

  it('builds consistent structured data without invented local business fields', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://www.szescstrun.pl'
    delete process.env.SERVER_URL

    const settings = {
      siteName: 'Sześć Strun',
      siteDescription: 'Indywidualne lekcje gitary akustycznej.',
      teacherName: 'Jacek Krakowski',
      facebookUrl: 'https://facebook.com/example',
      youtubeUrl: null,
    } as SiteSetting

    const org = buildOrganizationJsonLd(settings)
    const site = buildWebsiteJsonLd(settings)
    const person = buildPersonJsonLd(settings)
    const article = buildBlogPostingJsonLd({
      title: 'Warsztaty',
      description: 'Zaproszenie',
      slug: 'warsztaty',
      authorName: 'Jacek Krakowski',
      datePublished: '2026-01-01',
    })

    expect(org['@type']).toBe('Organization')
    expect(org).not.toHaveProperty('address')
    expect(org).not.toHaveProperty('geo')
    expect(org).not.toHaveProperty('aggregateRating')
    expect(site.publisher).toEqual({ '@id': 'https://www.szescstrun.pl/#organization' })
    expect(person.worksFor).toEqual({ '@id': 'https://www.szescstrun.pl/#organization' })
    expect(person.sameAs).toEqual(['https://facebook.com/example'])
    expect(JSON.stringify([org, site, person, article])).not.toMatch(/localhost/i)
    expect(article.mainEntityOfPage).toBe('https://www.szescstrun.pl/aktualnosci/warsztaty')
  })
})
