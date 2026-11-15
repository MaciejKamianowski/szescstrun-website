import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)

const root = path.resolve(import.meta.dirname, '../..')
const testDbName = `szescstrun_migrate_spec_${process.pid}`

async function psql(database: string, sql: string) {
  const { stdout, stderr } = await execFileAsync(
    'docker',
    ['compose', 'exec', '-T', 'postgres', 'psql', '-U', 'szescstrun', '-d', database, '-v', 'ON_ERROR_STOP=1', '-c', sql],
    { cwd: root, timeout: 30_000 },
  )
  return `${stdout}${stderr}`
}

describe('Payload migrations', () => {
  afterAll(async () => {
    try {
      await psql('postgres', `DROP DATABASE IF EXISTS "${testDbName}"`)
    } catch {
      // best-effort cleanup
    }
  })

  it(
    'applies initial schema on empty database and is idempotent',
    async () => {
      await psql('postgres', `DROP DATABASE IF EXISTS "${testDbName}"`)
      await psql('postgres', `CREATE DATABASE "${testDbName}"`)

      const connectionString = `postgresql://szescstrun:szescstrun@127.0.0.1:5432/${testDbName}`
      const env = {
        ...process.env,
        DATABASE_URL: connectionString,
        PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'migrate-spec-secret',
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
        NODE_ENV: 'production',
        PAYLOAD_MIGRATING: 'true',
      }

      const first = await execFileAsync('sh', ['./scripts/run-migrations.sh'], {
        cwd: root,
        env,
        timeout: 120_000,
      })
      const firstOut = `${first.stdout}${first.stderr}`
      expect(firstOut).toMatch(/Migrated:\s+20261115_123647_initial/)
      expect(firstOut).toMatch(/Migrated:\s+20261115_125220_add_site_logos/)

      const tables = await psql(
        testDbName,
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`,
      )
      for (const table of ['site_settings', 'lesson_offers', 'pricing_plans', 'users', 'media', 'posts']) {
        expect(tables).toContain(table)
      }

      const columns = await psql(
        testDbName,
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name IN ('site_logo_id','footer_logo_id','favicon_id') ORDER BY column_name;`,
      )
      expect(columns).toContain('site_logo_id')
      expect(columns).toContain('footer_logo_id')
      expect(columns).toContain('favicon_id')

      const mediaColumns = await psql(
        testDbName,
        `SELECT column_name FROM information_schema.columns WHERE table_name = 'media' AND column_name IN ('prefix','_objectkey') ORDER BY column_name;`,
      )
      expect(mediaColumns).toContain('prefix')
      expect(mediaColumns).toContain('_objectkey')

      // Preserve a probe row across idempotent remigrate
      await psql(
        testDbName,
        `INSERT INTO media (alt, prefix) VALUES ('probe-keep', 'media') RETURNING id;`,
      )

      const second = await execFileAsync('sh', ['./scripts/run-migrations.sh'], {
        cwd: root,
        env,
        timeout: 120_000,
      })
      const secondOut = `${second.stdout}${second.stderr}`
      expect(secondOut).toMatch(/Done\./)
      expect(secondOut).not.toMatch(/Migrating: 20261115_123647_initial/)
      expect(secondOut).not.toMatch(/Migrating: 20261115_144144_add_media_r2_storage_fields/)

      const probe = await psql(testDbName, `SELECT alt FROM media WHERE alt = 'probe-keep';`)
      expect(probe).toContain('probe-keep')
    },
    180_000,
  )
})
