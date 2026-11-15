import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sendMock = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: sendMock,
    },
  })),
}))

import { POST } from '../../src/app/(frontend)/api/contact/route'
import { __resetMemoryRateLimitForTests } from '../../src/lib/rate-limit'

function contactRequest(body: Record<string, unknown>, ip = '203.0.113.10') {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  })
}

const validBody = {
  name: 'Jan Nowak',
  email: 'jan@example.com',
  phone: '',
  subject: 'Umówienie lekcji',
  message: 'Proszę o kontakt w sprawie lekcji online.',
  privacyAccepted: true,
  website: '',
}

describe('POST /api/contact (mocked Resend)', () => {
  const envKeys = [
    'DATABASE_URL',
    'RESEND_API_KEY',
    'CONTACT_EMAIL_TO',
    'EMAIL_FROM',
    'TURNSTILE_SECRET_KEY',
  ] as const
  const originalEnv: Record<string, string | undefined> = {}

  beforeEach(() => {
    sendMock.mockReset()
    __resetMemoryRateLimitForTests()
    for (const key of envKeys) {
      originalEnv[key] = process.env[key]
    }
    delete process.env.DATABASE_URL
    process.env.RESEND_API_KEY = 're_test_key'
    process.env.CONTACT_EMAIL_TO = 'jacek@example.com'
    process.env.EMAIL_FROM = 'Sześć Strun <formularz@mail.szescstrun.pl>'
    delete process.env.TURNSTILE_SECRET_KEY
  })

  afterEach(() => {
    for (const key of envKeys) {
      if (originalEnv[key] === undefined) delete process.env[key]
      else process.env[key] = originalEnv[key]
    }
    __resetMemoryRateLimitForTests()
  })

  it('accepts a valid submission and calls Resend with Reply-To', async () => {
    sendMock.mockResolvedValue({ data: { id: 'email_int_1' }, error: null })

    const response = await POST(contactRequest(validBody))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ ok: true })
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['jacek@example.com'],
        replyTo: 'jan@example.com',
        from: 'Sześć Strun <formularz@mail.szescstrun.pl>',
      }),
    )
  })

  it('rejects invalid payloads with field errors', async () => {
    const response = await POST(
      contactRequest({
        ...validBody,
        email: 'not-an-email',
        message: 'short',
      }),
    )
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('Formularz zawiera błędy.')
    expect(json.fieldErrors).toBeDefined()
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('silently accepts honeypot submissions without sending mail', async () => {
    const response = await POST(
      contactRequest({
        ...validBody,
        website: 'http://spam.example',
      }),
    )
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ ok: true })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns a generic 503 when Resend is not configured', async () => {
    delete process.env.RESEND_API_KEY

    const response = await POST(contactRequest(validBody, '203.0.113.20'))
    const json = await response.json()

    expect(response.status).toBe(503)
    expect(json.error).toBe('Nie udało się wysłać wiadomości. Spróbuj ponownie później.')
    expect(JSON.stringify(json)).not.toMatch(/RESEND|API_KEY|jacek@|re_/i)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('rate-limits repeated submissions from the same IP', async () => {
    sendMock.mockResolvedValue({ data: { id: 'email_rl' }, error: null })

    const ip = '198.51.100.42'
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(contactRequest(validBody, ip))
      expect(ok.status).toBe(200)
    }

    const blocked = await POST(contactRequest(validBody, ip))
    const json = await blocked.json()

    expect(blocked.status).toBe(429)
    expect(json.error).toMatch(/Zbyt wiele prób/)
  })
})
