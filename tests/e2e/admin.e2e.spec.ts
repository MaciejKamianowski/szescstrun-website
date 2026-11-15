import { expect, test } from '@playwright/test'

import { login } from '../helpers/login'
import { seedTestUser } from '../helpers/seedUser'

test.describe('Panel administracyjny', () => {
  test('logowanie, wpis i cena są widoczne publicznie', async ({ page }) => {
    const { email, password, payload } = await seedTestUser({
      email: 'e2e-admin@test.local',
      password: 'E2EPassword123!',
    })

    await login(page, email, password)
    await expect(page).toHaveURL(/\/admin/)

    const unique = Date.now()
    const postTitle = `E2E ogłoszenie ${unique}`
    const priceName = `E2E lekcja ${unique}`

    const post = await payload.create({
      collection: 'posts',
      draft: false,
      data: {
        title: postTitle,
        slug: `e2e-ogloszenie-${unique}`,
        excerpt: 'Wpis utworzony w teście E2E.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Treść E2E.', version: 1 }],
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
        category: 'ogloszenia',
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
      context: { disableRevalidate: true },
    })

    const plan = await payload.create({
      collection: 'pricing-plans',
      data: {
        name: priceName,
        slug: `e2e-lekcja-${unique}`,
        description: 'Oferta testowa E2E',
        type: 'single',
        durationMinutes: 45,
        priceAmount: 9900,
        currency: 'PLN',
        active: true,
        displayOrder: 99,
      },
      context: { disableRevalidate: true },
    })

    await page.goto('/aktualnosci')
    await expect(page.getByRole('heading', { name: postTitle })).toBeVisible()

    await page.goto('/cennik')
    await expect(page.getByRole('heading', { name: priceName })).toBeVisible()
    await expect(page.getByText(/99[,.]00/).first()).toBeVisible()

    await payload.delete({ collection: 'posts', id: post.id, context: { disableRevalidate: true } })
    await payload.delete({
      collection: 'pricing-plans',
      id: plan.id,
      context: { disableRevalidate: true },
    })
  })
})
