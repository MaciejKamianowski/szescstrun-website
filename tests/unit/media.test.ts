import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  getMediaAlt,
  getMediaImageSrc,
  getMediaUrl,
  resolveGalleryImages,
  resolveRenderableMedia,
} from '../../src/lib/media'
import type { Media, Post } from '../../src/payload-types'

const ENV_KEYS = ['NODE_ENV', 'SERVER_URL', 'NEXT_PUBLIC_SERVER_URL'] as const

const WEBP_FILE = '462c7d01-ee21-4d61-9e1e-1336613c2709.webp'
const PRODUCTION_PROXY = `https://www.szescstrun.pl/api/media/file/${WEBP_FILE}`

function media(overrides: Partial<Media> & Pick<Media, 'url' | 'alt'>): Media {
  return {
    id: 2,
    filename: WEBP_FILE,
    mimeType: 'image/webp',
    filesize: 64524,
    width: 2048,
    height: 1153,
    updatedAt: '2026-11-16T09:32:08.562Z',
    createdAt: '2026-11-16T09:32:08.560Z',
    ...overrides,
  }
}

describe('media URLs for published posts', () => {
  const original: Record<string, string | undefined> = {}

  beforeEach(() => {
    for (const key of ENV_KEYS) original[key] = process.env[key]
    process.env.NODE_ENV = 'production'
    delete process.env.SERVER_URL
    delete process.env.NEXT_PUBLIC_SERVER_URL
  })

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (original[key] === undefined) delete process.env[key]
      else process.env[key] = original[key]
    }
  })

  it('resolves the stored production media document to a local image path', () => {
    const doc = media({
      alt: 'dzwieki-na-gryfie',
      url: PRODUCTION_PROXY,
      filename: WEBP_FILE,
      mimeType: 'image/webp',
    })

    expect(getMediaImageSrc(doc)).toBe(`/api/media/file/${WEBP_FILE}`)
    expect(getMediaUrl(doc)).toBe(PRODUCTION_PROXY)
    expect(getMediaImageSrc(doc)).not.toMatch(/localhost/)
    expect(getMediaUrl(doc)).not.toMatch(/localhost/)
  })

  it('keeps relative Payload media URLs as paths for next/image', () => {
    const doc = media({
      alt: 'miniatura',
      url: `/api/media/file/${WEBP_FILE}`,
      mimeType: 'image/webp',
    })

    expect(getMediaImageSrc(doc)).toBe(`/api/media/file/${WEBP_FILE}`)
    expect(getMediaUrl(doc)).toBe(PRODUCTION_PROXY)
  })

  it('keeps absolute CDN URLs absolute', () => {
    const cdn = 'https://pub-abc.r2.dev/media/hero.webp'
    const doc = media({ alt: 'cdn', url: cdn, filename: 'hero.webp', mimeType: 'image/webp' })

    expect(getMediaImageSrc(doc)).toBe(cdn)
    expect(getMediaUrl(doc)).toBe(cdn)
  })

  it('supports WebP, JPEG and PNG filenames', () => {
    for (const filename of ['photo.webp', 'photo.jpeg', 'photo.png']) {
      const doc = media({
        alt: filename,
        url: `https://www.szescstrun.pl/api/media/file/${filename}`,
        filename,
        mimeType: filename.endsWith('png')
          ? 'image/png'
          : filename.endsWith('webp')
            ? 'image/webp'
            : 'image/jpeg',
      })

      expect(getMediaImageSrc(doc)).toBe(`/api/media/file/${filename}`)
    }
  })

  it('rewrites localhost media URLs onto the production origin', () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    const doc = media({
      alt: 'lokalny',
      url: 'http://localhost:3000/api/media/file/photo.jpeg',
      filename: 'photo.jpeg',
      mimeType: 'image/jpeg',
    })

    expect(getMediaImageSrc(doc)).toBe('/api/media/file/photo.jpeg')
    expect(getMediaUrl(doc)).toBe('https://www.szescstrun.pl/api/media/file/photo.jpeg')
    expect(getMediaUrl(doc)).not.toMatch(/localhost/)
  })

  it('preserves alt text and skips missing relations', () => {
    const doc = media({ alt: 'dzwieki-na-gryfie', url: PRODUCTION_PROXY })

    expect(getMediaAlt(doc, 'Test')).toBe('dzwieki-na-gryfie')
    expect(getMediaAlt(null, 'Test')).toBe('Test')
    expect(getMediaAlt(2, 'Test')).toBe('Test')
    expect(getMediaImageSrc(null)).toBeNull()
    expect(getMediaImageSrc(2)).toBeNull()
    expect(resolveRenderableMedia(null, 'Test')).toBeNull()
    expect(resolveRenderableMedia(doc, 'Test')).toEqual({
      src: `/api/media/file/${WEBP_FILE}`,
      alt: 'dzwieki-na-gryfie',
    })
  })

  it('renders gallery media for a published post and drops unresolved images', () => {
    const galleryImage = media({
      alt: 'dzwieki-na-gryfie',
      url: PRODUCTION_PROXY,
      mimeType: 'image/webp',
    })
    const gallery: Post['gallery'] = [
      { image: galleryImage, id: 'row-1' },
      { image: 99, id: 'missing' },
      {
        image: media({
          alt: '',
          url: '/api/media/file/cover.png',
          filename: 'cover.png',
          mimeType: 'image/png',
        }),
        id: 'row-2',
      },
    ]

    expect(resolveGalleryImages(gallery, 'Test')).toEqual([
      {
        src: `/api/media/file/${WEBP_FILE}`,
        alt: 'dzwieki-na-gryfie',
      },
      {
        src: '/api/media/file/cover.png',
        alt: 'Test — zdjęcie 3',
      },
    ])
    expect(resolveGalleryImages(null, 'Test')).toEqual([])
    expect(resolveGalleryImages([{ image: 5 }], 'Test')).toEqual([])
  })
})
