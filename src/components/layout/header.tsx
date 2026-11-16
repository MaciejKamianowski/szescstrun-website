'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { SiteLogo } from '@/components/brand/site-logo'
import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import type { BrandLogo } from '@/lib/branding'
import type { ResolvedLink } from '@/lib/site-content'
import { cn } from '@/lib/utils'

function isCurrent(pathname: string, item: ResolvedLink): boolean {
  if (item.external) return false
  if (item.href === '/') return pathname === '/'
  const path = item.href.split('?')[0] || item.href
  return pathname === path || pathname.startsWith(`${path}/`)
}

function NavAnchor({
  item,
  className,
  onNavigate,
}: {
  item: ResolvedLink
  className: string
  onNavigate?: () => void
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        onClick={onNavigate}
      >
        {item.label}
      </a>
    )
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  )
}

export function Header({
  items,
  cta,
  logo,
}: {
  items: ResolvedLink[]
  cta: ResolvedLink | null
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
          className="max-w-[min(52vw,200px)] shrink-0 md:max-w-[220px] xl:max-w-[260px]"
        />

        <nav className="hidden min-w-0 items-center gap-x-2.5 2xl:gap-x-5 xl:flex" aria-label="Główne menu">
          {items.map((item) => (
            <NavAnchor
              key={item.id}
              item={item}
              className={cn(
                'whitespace-nowrap text-[11px] uppercase tracking-[0.12em] transition-colors 2xl:text-sm 2xl:tracking-wide',
                isCurrent(pathname, item) ? 'text-accent' : 'text-muted hover:text-foreground',
              )}
            />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {cta ? (
            <NavAnchor
              item={cta}
              className={cn(buttonVariants({ size: 'sm' }), 'hidden xl:inline-flex')}
            />
          ) : null}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent xl:hidden"
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
          'border-t border-border bg-background xl:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {items.map((item) => (
            <NavAnchor
              key={item.id}
              item={item}
              onNavigate={closeMenu}
              className={cn(
                'rounded-md px-3 py-3 text-sm uppercase tracking-wide transition-colors',
                isCurrent(pathname, item)
                  ? 'bg-background-secondary text-accent'
                  : 'text-muted hover:text-foreground',
              )}
            />
          ))}
          {cta ? (
            <NavAnchor
              item={cta}
              onNavigate={closeMenu}
              className={cn(buttonVariants(), 'mt-3 w-full')}
            />
          ) : null}
        </Container>
      </div>
    </header>
  )
}
