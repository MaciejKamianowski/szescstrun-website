import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { connection } from 'next/server'
import { getPayload } from 'payload'
import { cache } from 'react'

/**
 * Payload / Postgres access is request-bound.
 *
 * `await connection()` opts the calling route out of static prerendering so
 * `next build` and Docker image builds do not need Railway private-network DB
 * (postgres.railway.internal is unavailable during `docker build`).
 */
export const getPayloadClient = cache(async () => {
  await connection()
  return getPayload({ config: configPromise })
})

export async function getDraftModeEnabled(): Promise<boolean> {
  const draft = await draftMode()
  return draft.isEnabled
}
