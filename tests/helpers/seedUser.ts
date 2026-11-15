import { getPayload } from 'payload'
import config from '../../src/payload.config'

export async function seedTestUser(overrides?: {
  email?: string
  password?: string
  role?: 'admin' | 'editor'
}) {
  const payload = await getPayload({ config })
  const email = overrides?.email || 'admin@test.local'
  const password = overrides?.password || 'TestPassword123!'
  const role = overrides?.role || 'admin'

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs[0]) {
    return { payload, user: existing.docs[0], email, password }
  }

  const user = await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      name: 'Test Admin',
      role,
      active: true,
    },
  })

  return { payload, user, email, password }
}
