import { Resend } from 'resend'

type ContactEmailPayload = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export const CONTACT_SEND_ERROR =
  'Nie udało się wysłać wiadomości. Spróbuj ponownie później.'

function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO && process.env.EMAIL_FROM,
  )
}

export async function sendContactEmail(
  payload: ContactEmailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL_TO
  const from = process.env.EMAIL_FROM

  if (!apiKey || !to || !from) {
    // Do not echo env var names or values to the client.
    console.error('[contact] Email is not configured')
    return { ok: false, error: CONTACT_SEND_ERROR }
  }

  try {
    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: payload.email,
      subject: `[Sześć Strun] ${payload.subject}`,
      text: [
        `Imię: ${payload.name}`,
        `E-mail: ${payload.email}`,
        payload.phone ? `Telefon: ${payload.phone}` : null,
        '',
        payload.message,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (error) {
      // Never log API keys, recipient addresses, or message body.
      console.error('[contact] Resend send failed')
      return { ok: false, error: CONTACT_SEND_ERROR }
    }

    return { ok: true }
  } catch {
    console.error('[contact] Resend send threw')
    return { ok: false, error: CONTACT_SEND_ERROR }
  }
}

export async function verifyTurnstile(token?: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const body = new URLSearchParams({
    secret,
    response: token,
  })
  if (ip) body.set('remoteip', ip)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })

    if (!response.ok) return false
    const data = (await response.json()) as { success?: boolean }
    return Boolean(data.success)
  } catch {
    return false
  }
}

export { isEmailConfigured }
