import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

export const getPayloadClient = cache(async () => {
  return getPayload({ config: configPromise })
})

export async function getDraftModeEnabled(): Promise<boolean> {
  const draft = await draftMode()
  return draft.isEnabled
}
