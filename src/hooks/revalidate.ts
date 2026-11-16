import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

function runRevalidation(paths: string[], tags: string[]) {
  for (const path of paths) {
    revalidatePath(path)
  }
  for (const tag of tags) {
    // Next.js 16: second arg required. expire:0 = immediate (CMS content updates).
    revalidateTag(tag, { expire: 0 })
  }
}

export const revalidateCollection =
  (paths: string[], tags: string[] = []): CollectionAfterChangeHook =>
  ({ doc, req: { context, payload } }) => {
    if (context?.disableRevalidate) return doc

    try {
      runRevalidation(paths, tags)
      if (doc && typeof doc === 'object' && 'slug' in doc && typeof doc.slug === 'string') {
        if (paths.includes('/aktualnosci')) {
          revalidatePath(`/aktualnosci/${doc.slug}`)
        }
      }
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Błąd rewalidacji cache' })
    }

    return doc
  }

export const revalidateCollectionDelete =
  (paths: string[], tags: string[] = []): CollectionAfterDeleteHook =>
  ({ doc, req: { context, payload } }) => {
    if (context?.disableRevalidate) return doc

    try {
      runRevalidation(paths, tags)
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Błąd rewalidacji cache po usunięciu' })
    }

    return doc
  }

export const revalidateGlobal =
  (paths: string[], tags: string[] = []): GlobalAfterChangeHook =>
  ({ doc, req: { context, payload } }) => {
    if (context?.disableRevalidate) return doc

    try {
      runRevalidation(paths, tags)
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Błąd rewalidacji ustawień' })
    }

    return doc
  }

/** Settings affect the shared header and footer, so refresh the whole layout. */
export const revalidateSiteSettings: GlobalAfterChangeHook = (args) => {
  const doc = revalidateGlobal(
    ['/', '/o-mnie', '/kontakt', '/oferta', '/nagrania', '/do-pobrania', '/cennik'],
    ['settings'],
  )(args)

  if (args.req.context?.disableRevalidate) return doc

  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    args.req.payload.logger.error({ err: error, msg: 'Błąd rewalidacji układu strony' })
  }

  return doc
}
