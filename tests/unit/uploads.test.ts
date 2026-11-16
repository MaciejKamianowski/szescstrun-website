import { describe, expect, it } from 'vitest'

import { validateDownloadUpload, validateImageUpload } from '../../src/lib/uploads'

describe('przesyłanie zdjęć', () => {
  it('przyjmuje JPG, JPEG, PNG i WebP', () => {
    expect(validateImageUpload({ mimetype: 'image/jpeg', size: 1024, name: 'foto.jpg' })).toBeNull()
    expect(validateImageUpload({ mimetype: 'image/jpg', size: 1024, name: 'foto.jpg' })).toBeNull()
    expect(validateImageUpload({ mimetype: 'image/png', size: 2048, name: 'foto.png' })).toBeNull()
    expect(validateImageUpload({ mimetype: 'image/webp', size: 4096, name: 'foto.webp' })).toBeNull()
  })

  it('odrzuca HEIC i zbyt duży plik czytelnym komunikatem', () => {
    expect(validateImageUpload({ mimetype: 'image/heic', size: 1024, name: 'IMG.HEIC' })).toMatch(/HEIC/)
    expect(validateImageUpload({ mimetype: 'image/jpeg', size: 13 * 1024 * 1024, name: 'duze.jpg' })).toMatch(
      /12 MB/,
    )
    expect(validateImageUpload({ mimetype: 'application/pdf', size: 1024, name: 'cennik.pdf' })).toMatch(
      /JPG/,
    )
  })
})

describe('materiały do pobrania', () => {
  it('przyjmuje PDF i odrzuca nieznany format', () => {
    expect(validateDownloadUpload({ mimetype: 'application/pdf', size: 1024, name: 'cwiczenia.pdf' })).toBeNull()
    expect(validateDownloadUpload({ mimetype: 'application/x-msdownload', size: 1024, name: 'plik.exe' })).toMatch(
      /Niedozwolony format/,
    )
  })
})
