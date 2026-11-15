import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '../../src/payload.config'

describe('API Payload', () => {
  beforeAll(async () => {
    await getPayload({ config })
  })

  it('inicjalizuje Payload i zwraca ustawienia strony', async () => {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    expect(settings).toBeDefined()
    expect(settings.siteName).toBeTruthy()
  })
})
