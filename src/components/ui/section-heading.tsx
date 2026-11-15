import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {description ? (
        <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {description}
        </div>
      ) : null}
    </div>
  )
}
