import { Resend } from 'resend'

type ContactEmailPayload = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL_TO
  const from = process.env.EMAIL_FROM

  if (!apiKey || !to || !from) {
    return {
      ok: false,
      error:
        'Wysyłka e-mail nie jest skonfigurowana. Ustaw RESEND_API_KEY, CONTACT_EMAIL_TO oraz EMAIL_FROM.',
    }
  }

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
    return { ok: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.' }
  }

  return { ok: true }
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

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })

  if (!response.ok) return false
  const data = (await response.json()) as { success?: boolean }
  return Boolean(data.success)
}
