import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { cn } from '@/lib/utils'

type Props = {
  data: DefaultTypedEditorState | SerializedEditorState | null | undefined
  className?: string
}

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
})

export function RichText({ data, className }: Props) {
  if (!data) return null

  return (
    <div
      className={cn(
        'prose-szesc space-y-4 text-base leading-relaxed text-muted [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-foreground [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_p]:text-muted [&_strong]:text-foreground',
        className,
      )}
    >
      <LexicalRichText data={data as DefaultTypedEditorState} converters={jsxConverters} />
    </div>
  )
}
