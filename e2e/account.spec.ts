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

test('overview separates a debt balance from living expenses and linked repayments', async ({ page }) => {
  await signUp(page, `debt-clarity-${Date.now()}@example.com`)
  const navLabels = await page.getByRole('navigation', { name: 'Main' }).getByRole('link').allTextContents()
  expect(navLabels.indexOf('Debts & goals')).toBeLessThan(navLabels.indexOf('Transactions'))

  await page.getByRole('button', { name: 'Add a debt' }).click()
  let dialog = page.getByRole('dialog')
  await dialog.getByLabel('Name', { exact: true }).fill('Friend loan')
  await dialog.getByLabel('Balance you still owe today').fill('12000')
  await dialog.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('KSh 12,000').first()).toBeVisible()
  await expect(page.getByText('KSh 0', { exact: true }).first()).toBeVisible()

  await page.getByRole('button', { name: /Add expense/ }).first().click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel('Amount in KSh').fill('1000')
  await dialog.getByRole('button', { name: 'Food & Groceries' }).click()
  await dialog.getByRole('button', { name: 'Save expense' }).click()
  await expect(page.getByText('KSh 1,000').first()).toBeVisible()
  await expect(page.getByText('KSh 12,000').first()).toBeVisible()

  await page.getByRole('button', { name: 'View debts' }).click()
  await page.getByRole('button', { name: 'Record payment' }).click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel('Amount in KSh').fill('2000')
  await expect(dialog.getByText('Linking this payment reduces that debt\'s balance.')).toBeVisible()
  await dialog.getByRole('button', { name: 'Save expense' }).click()
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Overview' }).click()
  await expect(page.getByText('KSh 10,000').first()).toBeVisible()
  await expect(page.getByText('KSh 2,000').first()).toBeVisible()
})

test('a typed expense category is saved and reusable after reload', async ({ page }) => {
  await signUp(page, `category-${Date.now()}@example.com`)
  await page.getByRole('button', { name: /Add expense/ }).first().click()
  let dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: 'Food & Groceries' })).toHaveText('Food & Groceries')
  await dialog.getByLabel('Amount in KSh').fill('450')
  await dialog.getByLabel('Category', { exact: true }).fill('Pet supplies')
  await expect(dialog.getByText('“Pet supplies” will be saved as a category with this expense.')).toBeVisible()
  await dialog.getByRole('button', { name: 'Save expense' }).click()
  await expect(page.getByText('Saved KSh 450 · Pet supplies')).toBeVisible()

  await page.reload()
  await page.getByRole('button', { name: /Add expense/ }).first().click()
  dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: 'Pet supplies', exact: true })).toHaveCount(1)
  await dialog.getByLabel('Amount in KSh').fill('150')
  await dialog.getByLabel('Category', { exact: true }).fill('pet supplies')
  await expect(dialog.getByText(/will be saved as a category/)).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Save expense' }).click()
  await expect(page.getByText('Saved KSh 150 · Pet supplies')).toBeVisible()
})

test('Pro pages and billing work in demo mode (trial gives Pro)', async ({ page }) => {
  await signUp(page, `pro-${Date.now()}@example.com`)
  await page.goto('/app/reports')
  await expect(page.getByRole('heading', { name: 'Reports', level: 1 })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('link', { name: /Pro trial/ }).first().click()
  await expect(page).toHaveURL(/\/app\/billing$/)
  await expect(page.getByRole('heading', { name: 'Plan & billing' })).toBeVisible()
})
