'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { contactFormSchema, type ContactFormValues } from '@/validations/contact'

export function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      privacyAccepted: false,
      website: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    setSuccess(false)

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const data = (await response.json()) as { ok?: boolean; error?: string }

    if (!response.ok || !data.ok) {
      setServerError(data.error || 'Nie udało się wysłać wiadomości.')
      return
    }

    setSuccess(true)
    reset()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Nie wypełniaj</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Imię</Label>
          <Input id="name" autoComplete="name" {...register('name')} />
          {errors.name ? <p className="text-sm text-red-400">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email ? <p className="text-sm text-red-400">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon (opcjonalnie)</Label>
          <Input id="phone" type="tel" autoComplete="tel" {...register('phone')} />
          {errors.phone ? <p className="text-sm text-red-400">{errors.phone.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Temat</Label>
          <Input id="subject" {...register('subject')} />
          {errors.subject ? <p className="text-sm text-red-400">{errors.subject.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Wiadomość</Label>
        <Textarea id="message" rows={6} {...register('message')} />
        {errors.message ? <p className="text-sm text-red-400">{errors.message.message}</p> : null}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="privacyAccepted"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border bg-background accent-accent"
          {...register('privacyAccepted')}
        />
        <Label htmlFor="privacyAccepted" className="normal-case tracking-normal">
          Potwierdzam zapoznanie się z{' '}
          <Link href="/polityka-prywatnosci" className="text-accent hover:underline">
            polityką prywatności
          </Link>
          .
        </Label>
      </div>
      {errors.privacyAccepted ? (
        <p className="text-sm text-red-400">{errors.privacyAccepted.message}</p>
      ) : null}

      {serverError ? (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
          {serverError}
        </p>
      ) : null}

      {success ? (
        <p className="border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent" role="status">
          Wiadomość została wysłana. Odpowiemy tak szybko, jak to możliwe.
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="min-w-44">
        {isSubmitting ? 'Wysyłanie…' : 'Wyślij wiadomość'}
      </Button>
    </form>
  )
}
