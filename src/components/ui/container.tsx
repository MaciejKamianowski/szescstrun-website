import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('mx-auto w-full max-w-[80rem] px-5 md:px-8', className)}>{children}</div>
}
