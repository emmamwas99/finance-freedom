import { expect, test } from '@playwright/test'

test('home page is server-rendered with one h1, structured data and working navigation', async ({ page, request }) => {
  // the raw HTML (no JavaScript) already contains the content and metadata
  const html = await (await request.get('/')).text()
  expect(html).toContain('<h1')
  expect(html).toContain('application/ld+json')
  expect(html).toContain('rel="canonical"')

  await page.goto('/')
  await expect(page.locator('h1')).toHaveCount(1)
  await page.getByRole('link', { name: 'Free money calculators' }).or(page.getByRole('contentinfo').getByRole('link', { name: 'Budget calculator' })).first().click()
  await expect(page).toHaveURL(/\/calculators/)
})

test('budget calculator updates as you type', async ({ page }) => {
  await page.goto('/calculators/budget')
  const result = page.getByRole('region', { name: 'Your budget' })
  await expect(result).toContainText('KSh 44,500') // 85,000 − 40,500 default payments
  await page.getByLabel('Monthly take-home pay').fill('100000')
  await expect(result).toContainText('KSh 59,500')
})

test('debt payoff calculator shows a debt-free date and flags an unpayable loan', async ({ page }) => {
  await page.goto('/calculators/debt-payoff')
  const result = page.getByRole('region', { name: 'Your debt-free date' })
  await expect(result).toContainText('Debt-free in')
  await expect(result).toContainText(/That’s \w+ \d{4}/)
  await page.getByLabel('Loan 1 name').fill('Stuck loan')
  await page.getByLabel('Monthly payment').first().fill('1000') // below KSh 2,400 monthly interest
  await expect(result).toContainText('Raise the payment on Stuck loan')
  // the extra payment and rolled-over payments still rescue it…
  await expect(result).toContainText('Debt-free in')
  // …but with no extra and no roll-over the balance never clears
  await page.getByLabel('Extra you could pay each month').fill('0')
  await page.getByLabel(/move its monthly payment to the next loan/).uncheck()
  await expect(result).toContainText('Never at this rate')
})

test('financial health check scores habits', async ({ page }) => {
  await page.goto('/financial-health')
  const result = page.getByRole('region', { name: 'Your financial health result' })
  await expect(result).toContainText('/100')
  await page.getByRole('form', { name: 'Financial health check inputs' }).getByText('Every expense', { exact: true }).click()
  await page.getByLabel('New borrowing per month').fill('0')
  await expect(result).toContainText('No new loans')
})

test('old and alternative URLs redirect permanently; unknown URLs are real 404s', async ({ page, request }) => {
  const r = await request.get('/budget-calculator', { maxRedirects: 0 })
  expect(r.status()).toBe(301)
  expect(r.headers().location).toContain('/calculators/budget')
  const res = await page.goto('/no-such-page')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'We couldn’t find that page' })).toBeVisible()
})

test('guides render with quick answer, FAQ and breadcrumbs', async ({ page }) => {
  await page.goto('/guides/how-to-make-a-monthly-budget')
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Quick answer' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Frequently asked questions' })).toBeVisible()
})

test('free tools remember a returning visitor’s numbers, on this device only, with reset', async ({ page }) => {
  await page.goto('/calculators/savings')
  const result = page.getByRole('region', { name: 'Your savings' })
  await expect(result).toContainText('KSh 397,181')
  await page.getByLabel('Monthly deposit').fill('10000')
  await expect(result).not.toContainText('KSh 397,181')
  await page.reload()
  await expect(page.getByLabel('Monthly deposit')).toHaveValue('10000')
  await expect(page.getByText('saved in this browser only')).toBeVisible()
  await page.getByRole('button', { name: 'Reset to example' }).click()
  await expect(page.getByLabel('Monthly deposit')).toHaveValue('5000')
  await expect(result).toContainText('KSh 397,181')
})

test('education hub links every topic to a hub page, articles and tools', async ({ page }) => {
  await page.goto('/learn')
  for (const topic of ['Budgeting', 'Expenses', 'Debt management', 'Saving', 'Financial independence']) {
    await expect(page.getByRole('navigation', { name: 'Topics' }).getByRole('link', { name: topic })).toBeVisible()
  }
  await page.getByRole('link', { name: /Debt management/ }).first().click()
  await expect(page.locator('#debt')).toBeInViewport()
})
