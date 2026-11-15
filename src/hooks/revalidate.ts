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
    revalidateTag(tag)
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
