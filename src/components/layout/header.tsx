'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { SiteLogo } from '@/components/brand/site-logo'
import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import type { BrandLogo } from '@/lib/branding'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Strona główna' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/oferta', label: 'Oferta' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/aktualnosci', label: 'Aktualności' },
  { href: '/nagrania', label: 'Nagrania' },
  { href: '/kontakt', label: 'Kontakt' },
]

export function Header({
  ctaLabel = 'Umów lekcję',
  logo,
}: {
  ctaLabel?: string
  logo: BrandLogo
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <Container className="flex h-[4.75rem] items-center justify-between gap-3 sm:gap-4 md:h-[6rem]">
        <SiteLogo
          logo={logo}
          size="header"
          priority
          linked
          onNavigate={closeMenu}
          className="max-w-[min(58vw,240px)] md:max-w-[300px] lg:max-w-[340px]"
        />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Główne menu">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm uppercase tracking-wide transition-colors',
                  active ? 'text-accent' : 'text-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/kontakt"
            className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        className={cn(
          'border-t border-border bg-background lg:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  'rounded-md px-3 py-3 text-sm uppercase tracking-wide transition-colors',
                  active ? 'bg-background-secondary text-accent' : 'text-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/kontakt"
            onClick={closeMenu}
            className={cn(buttonVariants(), 'mt-3 w-full')}
          >
            {ctaLabel}
          </Link>
        </Container>
      </div>
    </header>
  )
}
