import { NextResponse } from 'next/server'

import { sendContactEmail, verifyTurnstile } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { contactFormSchema } from '@/validations/contact'

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const limited = rateLimit(`contact:${ip}`, 5, 60_000)
    if (!limited.success) {
      return NextResponse.json(
        { error: 'Zbyt wiele prób. Spróbuj ponownie za chwilę.' },
        { status: 429 },
      )
    }

    const json = await request.json()
    const parsed = contactFormSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Formularz zawiera błędy.',
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: true })
    }

    const turnstileOk = await verifyTurnstile(parsed.data.turnstileToken, ip)
    if (!turnstileOk) {
      return NextResponse.json(
        { error: 'Weryfikacja antyspamowa nie powiodła się.' },
        { status: 400 },
      )
    }

    const result = await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      subject: parsed.data.subject,
      message: parsed.data.message,
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.' },
      { status: 500 },
    )
  }
}
