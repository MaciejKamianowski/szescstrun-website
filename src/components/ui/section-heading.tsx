import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as = 'h2',
  className,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  className?: string
}) {
  const HeadingTag = as

  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      ) : null}
      <HeadingTag className="text-3xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
        {title}
      </HeadingTag>
      {description ? (
        <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {description}
        </div>
      ) : null}
    </div>
  )
}
