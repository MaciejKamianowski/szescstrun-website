import Image from 'next/image'
import Link from 'next/link'

import type { BrandLogo } from '@/lib/branding'
import { cn } from '@/lib/utils'

type SiteLogoProps = {
  logo: BrandLogo
  className?: string
  /** Wariant wielkości: header (responsywny) lub footer. */
  size?: 'header' | 'footer'
  priority?: boolean
  linked?: boolean
  onNavigate?: () => void
  /** Jasny panel pod logo z teksturowanym tłem JPEG. */
  surface?: boolean
}

const sizeClass = {
  header: 'h-[52px] md:h-[60px] lg:h-[68px]',
  footer: 'h-[64px] md:h-[72px]',
} as const

export function SiteLogo({
  logo,
  className,
  size = 'header',
  priority = false,
  linked = false,
  onNavigate,
  surface = true,
}: SiteLogoProps) {
  const framed = (
    <span
      className={cn(
        'inline-flex max-w-full shrink-0 items-center justify-center overflow-hidden',
        surface &&
          'rounded-md border border-border/70 bg-[#ececec] p-1.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      <span
        className={cn('relative block w-auto max-w-full', sizeClass[size])}
        style={{ aspectRatio: `${logo.width} / ${logo.height}` }}
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          priority={priority}
          sizes={
            size === 'header'
              ? '(min-width: 1024px) 160px, (min-width: 768px) 140px, 121px'
              : '(min-width: 768px) 168px, 149px'
          }
          className="h-full w-full object-contain"
        />
      </span>
    </span>
  )

  if (!linked) return framed

  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={logo.alt}
      className="inline-flex max-w-full shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {framed}
    </Link>
  )
}
