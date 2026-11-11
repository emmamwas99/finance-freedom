import { expect, test } from '@playwright/test'

const PAGES = ['/', '/pricing', '/expense-tracker', '/calculators', '/calculators/debt-payoff', '/calculators/budget', '/financial-health', '/guides/debt-avalanche-vs-snowball', '/blog/sinking-funds-for-school-fees', '/budgeting', '/glossary', '/login', '/signup']

for (const path of PAGES) {
  test(`no horizontal scrolling on ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
}

test('mobile menu opens and navigates', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.locator('#mobile-menu').getByRole('link', { name: 'Learn' }).click()
  await expect(page).toHaveURL(/\/learn$/)
  await expect(page.locator('#mobile-menu')).toHaveCount(0)
})

test('the private app fits a phone screen and the bottom nav works', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  await page.goto('/signup')
  await page.getByLabel('First name').fill('Otieno')
  await page.getByLabel('Email').fill(`mobile-${Date.now()}@example.com`)
  await page.getByLabel('Password', { exact: true }).fill('Correct-horse-42')
  await page.getByLabel('Confirm password').fill('Correct-horse-42')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Create account' }).click()
  await page.getByRole('checkbox', { name: /saved my recovery key/ }).check({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Continue to my dashboard' }).click()
  await expect(page).toHaveURL(/\/app$/)
  const nav = page.getByRole('navigation', { name: 'Main' })
  for (const [label, url] of [['Plan', /\/app\/plan$/], ['Activity', /\/app\/transactions$/], ['Debts', /\/app\/debts$/], ['Reports', /\/app\/reports$/], ['On track', /\/app\/on-track$/], ['Home', /\/app$/]] as const) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(url)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, label).toBeLessThanOrEqual(1)
  }
})
