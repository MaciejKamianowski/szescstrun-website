import { describe, expect, it } from 'vitest'

import {
  buildPublicMediaUrl,
  getPublicMediaHostname,
  resolveObjectStorageConfig,
} from '../../src/lib/storage'

describe('resolveObjectStorageConfig', () => {
  it('is disabled without credentials', () => {
    const config = resolveObjectStorageConfig({})
    expect(config.enabled).toBe(false)
    expect(config.publicReadMode).toBe('disabled')
  })

  it('prefers R2_* over S3_* and uses CDN when R2_PUBLIC_URL is set', () => {
    const config = resolveObjectStorageConfig({
      R2_BUCKET: 'szescstrun-media',
      R2_ACCESS_KEY_ID: 'key',
      R2_SECRET_ACCESS_KEY: 'secret',
      R2_ENDPOINT: 'https://abc123.r2.cloudflarestorage.com',
      R2_PUBLIC_URL: 'https://pub-abc.r2.dev',
      S3_BUCKET: 'ignored',
    })

    expect(config.enabled).toBe(true)
    expect(config.bucket).toBe('szescstrun-media')
    expect(config.region).toBe('auto')
    expect(config.forcePathStyle).toBe(true)
    expect(config.publicReadMode).toBe('cdn')
    expect(config.publicBaseUrl).toBe('https://pub-abc.r2.dev')
    expect(getPublicMediaHostname(config)).toBe('pub-abc.r2.dev')
  })

  it('falls back to Payload proxy when public URL is missing', () => {
    const config = resolveObjectStorageConfig({
      R2_BUCKET: 'szescstrun-media',
      R2_ACCESS_KEY_ID: 'key',
      R2_SECRET_ACCESS_KEY: 'secret',
      R2_ENDPOINT: 'https://abc123.r2.cloudflarestorage.com',
    })

    expect(config.enabled).toBe(true)
    expect(config.publicReadMode).toBe('proxy')
    expect(config.configMessage).toMatch(/R2_PUBLIC_URL/)
    expect(
      buildPublicMediaUrl(config, 'photo.webp', 'media', 'https://szescstrun.pl'),
    ).toBe('https://szescstrun.pl/api/media/file/photo.webp')
  })

  it('rejects API endpoint used as public media URL', () => {
    expect(() =>
      resolveObjectStorageConfig({
        R2_BUCKET: 'szescstrun-media',
        R2_ACCESS_KEY_ID: 'key',
        R2_SECRET_ACCESS_KEY: 'secret',
        R2_ENDPOINT: 'https://abc123.r2.cloudflarestorage.com',
        R2_PUBLIC_URL: 'https://abc123.r2.cloudflarestorage.com/szescstrun-media',
      }),
    ).toThrow(/not the S3 API endpoint/)
  })

  it('builds CDN URLs with media prefix', () => {
    const config = resolveObjectStorageConfig({
      R2_BUCKET: 'szescstrun-media',
      R2_ACCESS_KEY_ID: 'key',
      R2_SECRET_ACCESS_KEY: 'secret',
      R2_ENDPOINT: 'https://abc123.r2.cloudflarestorage.com',
      R2_PUBLIC_URL: 'https://media.example.com/',
    })

    expect(buildPublicMediaUrl(config, 'hero.webp')).toBe(
      'https://media.example.com/media/hero.webp',
    )
    expect(
      buildPublicMediaUrl(config, 'cwiczenia.pdf', 'downloads', 'https://szescstrun.pl', 'downloads'),
    ).toBe('https://media.example.com/downloads/cwiczenia.pdf')
  })
})
