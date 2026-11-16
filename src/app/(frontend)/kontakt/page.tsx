import type { Metadata } from 'next'

import { ContactForm } from '@/components/forms/contact-form'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { getSiteSettings } from '@/lib/queries'
import { SEO_DEFAULTS, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: SEO_DEFAULTS.contact.title,
  description: SEO_DEFAULTS.contact.description,
  path: '/kontakt',
})

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Kontakt</p>
          <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
            Umów lekcję
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted md:text-lg">
            Napisz kilka słów o sobie i poziomie zaawansowania. Odpowiedź przyjdzie na podany adres
            e-mail.
          </p>

          <dl className="mt-10 space-y-4 text-sm">
            {settings.teacherName ? (
              <div>
                <dt className="uppercase tracking-wide text-muted">Nauczyciel</dt>
                <dd className="mt-1 text-foreground">{settings.teacherName}</dd>
              </div>
            ) : null}
            {settings.contactEmail ? (
              <div>
                <dt className="uppercase tracking-wide text-muted">E-mail</dt>
                <dd className="mt-1">
                  <a href={`mailto:${settings.contactEmail}`} className="text-accent hover:underline">
                    {settings.contactEmail}
                  </a>
                </dd>
              </div>
            ) : null}
            {settings.contactPhone ? (
              <div>
                <dt className="uppercase tracking-wide text-muted">Telefon</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
                    className="text-accent hover:underline"
                  >
                    {settings.contactPhone}
                  </a>
                </dd>
              </div>
            ) : null}
            {settings.locationCity ? (
              <div>
                <dt className="uppercase tracking-wide text-muted">Miasto</dt>
                <dd className="mt-1 text-foreground">{settings.locationCity}</dd>
              </div>
            ) : null}
            {settings.lessonsOnline || settings.lessonsInPerson ? (
              <div>
                <dt className="uppercase tracking-wide text-muted">Forma zajęć</dt>
                <dd className="mt-1 text-foreground">
                  {[settings.lessonsOnline ? 'online' : null, settings.lessonsInPerson ? 'stacjonarnie' : null]
                    .filter(Boolean)
                    .join(' / ')}
                </dd>
              </div>
            ) : null}
          </dl>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-border bg-background-secondary p-6 md:p-8">
            <ContactForm />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
