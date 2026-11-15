import { expect, test } from '@playwright/test'

test.describe('Frontend publiczny', () => {
  test('strona główna ładuje się poprawnie', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Sześć Strun' }).first()).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('nawigacja do cennika i aktualności', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Główne menu' }).getByRole('link', { name: 'Cennik' }).click()
    await expect(page).toHaveURL(/\/cennik/)
    await expect(page.getByRole('heading', { level: 1, name: /Lekcje i karnety/i })).toBeVisible()

    await page.getByRole('navigation', { name: 'Główne menu' }).getByRole('link', { name: 'Aktualności' }).click()
    await expect(page).toHaveURL(/\/aktualnosci/)
  })

  test('menu mobilne działa', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Otwórz menu' }).click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
    await page.locator('#mobile-menu').getByRole('link', { name: 'Kontakt' }).click()
    await expect(page).toHaveURL(/\/kontakt/)
  })

  test('formularz kontaktowy waliduje pola', async ({ page }) => {
    await page.goto('/kontakt')
    await page.getByRole('button', { name: 'Wyślij wiadomość' }).click()
    await expect(page.getByText(/Podaj imię|Musisz potwierdzić/i).first()).toBeVisible()
  })
})
