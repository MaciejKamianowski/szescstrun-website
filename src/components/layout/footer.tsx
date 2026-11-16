import Link from 'next/link'
import { Facebook, Youtube } from 'lucide-react'

import { SiteLogo } from '@/components/brand/site-logo'
import { Container } from '@/components/ui/container'
import { resolveFooterLogo } from '@/lib/branding'
import { resolveFooterNavigation, resolveFooterNote, type SiteContentSettings } from '@/lib/site-content'
import type { SiteSetting } from '@/payload-types'

const legalLink = { href: '/polityka-prywatnosci', label: 'Polityka prywatności' }

export function Footer({ settings }: { settings: SiteSetting }) {
  const year = new Date().getFullYear()
  const logo = resolveFooterLogo(settings)
  const content = settings as SiteSetting & SiteContentSettings
  const footerNav = resolveFooterNavigation(content.navigation)
  const note = resolveFooterNote(content)

  return (
    <footer className="border-t border-border bg-background-secondary">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <SiteLogo logo={logo} size="footer" linked className="max-w-[min(100%,320px)]" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{note}</p>
          <div className="mt-6 flex gap-3">
            {settings.facebookUrl ? (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            ) : null}
            {settings.youtubeUrl ? (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
            Nawigacja
          </p>
          <ul className="mt-4 space-y-2">
            {footerNav.map((item) => (
              <li key={item.id}>
                {item.external ? (
                  <a
                    href={item.href}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href={legalLink.href} className="text-sm text-muted transition-colors hover:text-accent">
                {legalLink.label}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
            Kontakt
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {settings.teacherName ? <li>{settings.teacherName}</li> : null}
            {settings.contactEmail ? (
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="transition-colors hover:text-accent"
                >
                  {settings.contactEmail}
                </a>
              </li>
            ) : null}
            {settings.contactPhone ? (
              <li>
                <a
                  href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
                  className="transition-colors hover:text-accent"
                >
                  {settings.contactPhone}
                </a>
              </li>
            ) : null}
            {settings.locationCity ? <li>{settings.locationCity}</li> : null}
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.siteName || 'Sześć Strun'}
          </p>
          <Link href="/polityka-prywatnosci" className="transition-colors hover:text-accent">
            Polityka prywatności
          </Link>
        </Container>
      </div>
    </footer>
  )
}
