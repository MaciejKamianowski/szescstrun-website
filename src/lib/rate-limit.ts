import pg from 'pg'

type Bucket = {
  count: number
  resetAt: number
}

type RateLimitResult = { success: boolean; remaining: number }

const memoryBuckets = new Map<string, Bucket>()

let pool: pg.Pool | null = null
let tableReady = false
let tableReadyPromise: Promise<void> | null = null

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const current = memoryBuckets.get(key)

  if (!current || current.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0 }
  }

  current.count += 1
  memoryBuckets.set(key, current)
  return { success: true, remaining: limit - current.count }
}

function getPool(): pg.Pool | null {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  if (!pool) {
    pool = new pg.Pool({
      connectionString,
      max: 2,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 3_000,
    })
  }

  return pool
}

async function ensureTable(client: pg.Pool): Promise<void> {
  if (tableReady) return

  if (!tableReadyPromise) {
    tableReadyPromise = client
      .query(`
        CREATE TABLE IF NOT EXISTS contact_rate_limits (
          key text PRIMARY KEY,
          count integer NOT NULL DEFAULT 0,
          reset_at timestamptz NOT NULL
        )
      `)
      .then(() => {
        tableReady = true
      })
      .catch((error) => {
        tableReadyPromise = null
        throw error
      })
  }

  await tableReadyPromise
}

async function postgresRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult | null> {
  const client = getPool()
  if (!client) return null

  try {
    await ensureTable(client)

    const result = await client.query<{ count: number }>(
      `
        INSERT INTO contact_rate_limits (key, count, reset_at)
        VALUES ($1, 1, NOW() + ($2::text || ' milliseconds')::interval)
        ON CONFLICT (key) DO UPDATE
        SET
          count = CASE
            WHEN contact_rate_limits.reset_at <= NOW() THEN 1
            ELSE contact_rate_limits.count + 1
          END,
          reset_at = CASE
            WHEN contact_rate_limits.reset_at <= NOW() THEN
              NOW() + ($2::text || ' milliseconds')::interval
            ELSE contact_rate_limits.reset_at
          END
        RETURNING count
      `,
      [key, String(windowMs)],
    )

    const count = result.rows[0]?.count ?? 1
    if (count > limit) {
      return { success: false, remaining: 0 }
    }

    return { success: true, remaining: Math.max(0, limit - count) }
  } catch {
    // Never log connection strings or query payloads with IPs in detail.
    console.error('[contact] Durable rate limit unavailable; using in-process fallback')
    return null
  }
}

/**
 * Rate limit shared across Railway instances via Postgres when DATABASE_URL is set.
 * Falls back to in-process memory for local/dev or when the DB is unreachable.
 */
export async function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): Promise<RateLimitResult> {
  const durable = await postgresRateLimit(key, limit, windowMs)
  if (durable) return durable
  return memoryRateLimit(key, limit, windowMs)
}

/** Test helper — clears in-memory buckets between unit tests. */
export function __resetMemoryRateLimitForTests(): void {
  memoryBuckets.clear()
}
