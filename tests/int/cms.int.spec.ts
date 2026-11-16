import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '../../src/payload.config'
import { seedTestUser } from '../helpers/seedUser'

describe('CMS — dostęp i treści', () => {
  beforeAll(async () => {
    await seedTestUser()
  })

  it('nie pozwala utworzyć użytkownika bez uwierzytelnienia', async () => {
    const payload = await getPayload({ config })

    await expect(
      payload.create({
        collection: 'users',
        data: {
          email: 'hacker@test.local',
          password: 'Hack123!',
          name: 'Hacker',
          role: 'admin',
          active: true,
        },
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('generuje slug i waliduje cennik', async () => {
    const { payload } = await seedTestUser()

    const plan = await payload.create({
      collection: 'pricing-plans',
      data: {
        name: 'Lekcja testowa 60 minut',
        slug: 'lekcja-testowa-60-minut',
        priceAmount: 15000,
        currency: 'PLN',
        type: 'single',
        durationMinutes: 60,
        active: true,
        displayOrder: 1,
      },
      context: { disableRevalidate: true },
    })

    expect(plan.slug).toBe('lekcja-testowa-60-minut')
    expect(plan.priceAmount).toBe(15000)

    await payload.delete({
      collection: 'pricing-plans',
      id: plan.id,
      context: { disableRevalidate: true },
    })
  })

  it('publikuje wpis i ukrywa szkic', async () => {
    const { payload, user } = await seedTestUser()

    const draft = await payload.create({
      collection: 'posts',
      draft: true,
      data: {
        title: 'Szkic testowy',
        slug: `szkic-testowy-${Date.now()}`,
        excerpt: 'To jest szkic testowy do weryfikacji dostępu.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Treść szkicu.', version: 1 }],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        category: 'aktualnosci',
        _status: 'draft',
        author: user.id,
      },
      context: { disableRevalidate: true },
    })

    const publicDraft = await payload.find({
      collection: 'posts',
      where: { slug: { equals: draft.slug } },
      overrideAccess: false,
      draft: false,
    })
    expect(publicDraft.docs).toHaveLength(0)

    const published = await payload.update({
      collection: 'posts',
      id: draft.id,
      data: {
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
      context: { disableRevalidate: true },
    })

    expect(published._status).toBe('published')

    const publicPublished = await payload.find({
      collection: 'posts',
      where: {
        and: [{ slug: { equals: draft.slug } }, { _status: { equals: 'published' } }],
      },
      overrideAccess: false,
    })
    expect(publicPublished.docs).toHaveLength(1)

    await payload.delete({
      collection: 'posts',
      id: draft.id,
      context: { disableRevalidate: true },
    })
  })

  it('pozwala administratorowi zmienić menu i odmawia gościowi', async () => {
    const { payload, user } = await seedTestUser()
    const before = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: true,
    })

    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        data: {
          navigation: [
            { label: 'Niedozwolone', linkType: 'internal', internalPath: '/kontakt', active: true },
          ],
        },
        overrideAccess: false,
        context: { disableRevalidate: true },
      }),
    ).rejects.toThrow()

    const updated = await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        navigation: [
          { label: 'Kontakt test', linkType: 'internal', internalPath: '/kontakt', active: true },
          { label: 'Ukryte', linkType: 'internal', internalPath: '/cennik', active: false },
        ],
      },
      user,
      overrideAccess: false,
      context: { disableRevalidate: true },
    })

    expect(updated.navigation?.map((item) => item.label)).toEqual(['Kontakt test', 'Ukryte'])
    expect(updated.navigation?.find((item) => item.label === 'Ukryte')?.active).toBe(false)

    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        navigation: before.navigation ?? [],
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  })
})
