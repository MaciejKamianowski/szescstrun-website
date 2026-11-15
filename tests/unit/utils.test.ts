import { describe, expect, it } from 'vitest'

import { formatPricePLN, slugify } from '../../src/lib/utils'
import { extractYouTubeVideoId, isValidYouTubeUrl } from '../../src/lib/youtube'
import { contactFormSchema } from '../../src/validations/contact'

describe('slugify', () => {
  it('tworzy slug z polskich znaków', () => {
    expect(slugify('Sześć Strun — lekcja')).toBe('szesc-strun-lekcja')
  })
})

describe('formatPricePLN', () => {
  it('formatuje grosze do PLN', () => {
    expect(formatPricePLN(12000)).toMatch(/120[,.]00/)
  })
})

describe('youtube', () => {
  it('wyodrębnia ID z różnych adresów', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    )
    expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(isValidYouTubeUrl('https://example.com')).toBe(false)
  })
})

describe('contactFormSchema', () => {
  it('wymaga polityki prywatności', () => {
    const result = contactFormSchema.safeParse({
      name: 'Anna',
      email: 'anna@example.com',
      subject: 'Lekcja',
      message: 'Chciałabym umówić lekcję gitary.',
      privacyAccepted: false,
      website: '',
    })
    expect(result.success).toBe(false)
  })

  it('akceptuje poprawne dane', () => {
    const result = contactFormSchema.safeParse({
      name: 'Anna',
      email: 'anna@example.com',
      subject: 'Lekcja',
      message: 'Chciałabym umówić lekcję gitary.',
      privacyAccepted: true,
      website: '',
    })
    expect(result.success).toBe(true)
  })
})
