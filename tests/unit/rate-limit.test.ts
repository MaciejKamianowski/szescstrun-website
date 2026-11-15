import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { __resetMemoryRateLimitForTests, rateLimit } from '../../src/lib/rate-limit'

describe('rateLimit (in-memory fallback)', () => {
  let previousDatabaseUrl: string | undefined

  beforeEach(() => {
    previousDatabaseUrl = process.env.DATABASE_URL
    delete process.env.DATABASE_URL
    __resetMemoryRateLimitForTests()
  })

  afterEach(() => {
    __resetMemoryRateLimitForTests()
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = previousDatabaseUrl
  })

  it('allows requests under the limit', async () => {
    const first = await rateLimit('test:a', 2, 60_000)
    const second = await rateLimit('test:a', 2, 60_000)

    expect(first.success).toBe(true)
    expect(second.success).toBe(true)
    expect(second.remaining).toBe(0)
  })

  it('blocks requests over the limit', async () => {
    await rateLimit('test:b', 1, 60_000)
    const blocked = await rateLimit('test:b', 1, 60_000)

    expect(blocked.success).toBe(false)
    expect(blocked.remaining).toBe(0)
  })
})
