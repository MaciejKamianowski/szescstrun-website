import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sendMock = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: sendMock,
    },
  })),
}))

import { CONTACT_SEND_ERROR, sendContactEmail } from '../../src/lib/email'

const payload = {
  name: 'Anna Kowalska',
  email: 'anna@example.com',
  phone: '+48 600 000 000',
  subject: 'Lekcje gitary',
  message: 'Chciałabym umówić pierwszą lekcję w przyszłym tygodniu.',
}

describe('sendContactEmail', () => {
  const envKeys = ['RESEND_API_KEY', 'CONTACT_EMAIL_TO', 'EMAIL_FROM'] as const
  const originalEnv: Record<string, string | undefined> = {}

  beforeEach(() => {
    sendMock.mockReset()
    for (const key of envKeys) {
      originalEnv[key] = process.env[key]
    }
    process.env.RESEND_API_KEY = 're_test_key'
    process.env.CONTACT_EMAIL_TO = 'jacek@example.com'
    process.env.EMAIL_FROM = 'Sześć Strun <formularz@mail.szescstrun.pl>'
  })

  afterEach(() => {
    for (const key of envKeys) {
      if (originalEnv[key] === undefined) delete process.env[key]
      else process.env[key] = originalEnv[key]
    }
  })

  it('sends to CONTACT_EMAIL_TO with Reply-To set to the submitter', async () => {
    sendMock.mockResolvedValue({ data: { id: 'email_1' }, error: null })

    const result = await sendContactEmail(payload)

    expect(result).toEqual({ ok: true })
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Sześć Strun <formularz@mail.szescstrun.pl>',
        to: ['jacek@example.com'],
        replyTo: 'anna@example.com',
        subject: '[Sześć Strun] Lekcje gitary',
      }),
    )
    expect(sendMock.mock.calls[0][0].text).toContain('anna@example.com')
    expect(sendMock.mock.calls[0][0].text).toContain(payload.message)
  })

  it('returns a generic error when env is missing (no secrets in message)', async () => {
    delete process.env.RESEND_API_KEY

    const result = await sendContactEmail(payload)

    expect(result).toEqual({ ok: false, error: CONTACT_SEND_ERROR })
    expect(sendMock).not.toHaveBeenCalled()
    if (!result.ok) {
      expect(result.error).not.toMatch(/RESEND|API|jacek@|re_/i)
    }
  })

  it('returns a generic error when Resend fails', async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: 'Domain not verified', name: 'validation_error' },
    })

    const result = await sendContactEmail(payload)

    expect(result).toEqual({ ok: false, error: CONTACT_SEND_ERROR })
    if (!result.ok) {
      expect(result.error).not.toMatch(/verified|validation|Domain/i)
    }
  })
})
