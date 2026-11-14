import { expect, test, type Page } from '@playwright/test'

const PASSWORD = 'Correct-horse-42'

async function signUp(page: Page, email: string) {
  await page.goto('/signup')
  await page.getByLabel('First name').fill('Wanjiku')
  await page.getByLabel('Monthly salary (KSh)').fill('85000')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByLabel('Confirm password').fill(PASSWORD)
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Create account' }).click()
  // recovery key is shown once
  await expect(page.getByTestId('recovery-code')).toHaveText(/^[A-Z2-9]{4}(-[A-Z2-9]{4}){7}$/, { timeout: 30_000 })
  await page.getByRole('checkbox', { name: /saved my recovery key/ }).check()
  await page.getByRole('button', { name: 'Continue to my dashboard' }).click()
  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Wanjiku')
}

test('private routes send signed-out visitors to log in, and are noindex', async ({ page, request }) => {
  const res = await request.get('/app/plan')
  expect(res.headers()['x-robots-tag']).toContain('noindex')
  await page.goto('/app/plan')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
})

test('sign up → add an expense → lock → unlock → reload: session stays unlocked', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`
  await signUp(page, email)

  // add an expense from the dialog
  await page.getByRole('button', { name: /Add expense/ }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Amount in KSh').fill('1250')
  await dialog.getByRole('button', { name: /Food & Groceries/ }).click()
  await dialog.getByLabel('Note (optional)').fill('Naivas')
  await dialog.getByRole('button', { name: 'Save expense' }).click()
  await expect(page.getByText('Saved KSh 1,250 · Food & Groceries')).toBeVisible()

  // it shows on the transactions page
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Transactions' }).click()
  await expect(page).toHaveURL(/\/app\/transactions$/)
  await expect(page.getByText('Naivas').first()).toBeVisible()

  // nothing readable is stored in the browser
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }))
  expect(stored).not.toContain('Naivas')
  expect(stored).not.toContain('Wanjiku')

  // lock, then unlock with the password
  await page.getByRole('button', { name: 'Lock' }).first().click()
  await expect(page.getByRole('heading', { name: 'Unlock' })).toBeVisible()
  await page.getByLabel('Password', { exact: true }).fill('wrong password')
  await page.getByRole('button', { name: 'Unlock' }).click()
  await expect(page.getByText('Wrong password.')).toBeVisible({ timeout: 30_000 })
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByRole('button', { name: 'Unlock' }).click()
  await expect(page.getByText('Naivas').first()).toBeVisible({ timeout: 30_000 })

  // a full reload restores the session key without storing the password
  await page.reload()
  await expect(page.getByText('Naivas').first()).toBeVisible({ timeout: 30_000 })

  // an explicit lock clears the remembered key, including across reloads
  await page.getByRole('button', { name: 'Lock' }).first().click()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Unlock' })).toBeVisible()
})

test('monthly plan: add a payment and see what is left after payments', async ({ page }) => {
  await signUp(page, `plan-${Date.now()}@example.com`)
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Monthly plan' }).click()
  await expect(page).toHaveURL(/\/app\/plan$/)
  await expect(page.getByText(/left/i).first()).toBeVisible()
})

test('Pro pages and billing work in demo mode (trial gives Pro)', async ({ page }) => {
  await signUp(page, `pro-${Date.now()}@example.com`)
  await page.goto('/app/reports')
  await expect(page.getByRole('heading', { name: 'Reports', level: 1 })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('link', { name: /Pro trial/ }).first().click()
  await expect(page).toHaveURL(/\/app\/billing$/)
  await expect(page.getByRole('heading', { name: 'Plan & billing' })).toBeVisible()
})
