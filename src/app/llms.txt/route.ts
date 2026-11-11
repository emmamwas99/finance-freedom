import { absoluteUrl, SITE } from '@/config/site'
import { PRICES, TRIAL_DAYS } from '@/lib/plans'
import { publicRoutes, type RouteEntry } from '@/lib/seo/routes'

/**
 * /llms.txt: a plain-Markdown map of the site for AI answer engines and agents (llmstxt.org).
 * It states what the product is, in factual terms, and links the most useful pages.
 */
export const dynamic = 'force-static'

const section = (title: string, routes: RouteEntry[]) => [`## ${title}`, '', ...routes.map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`), ''].join('\n')

export function GET() {
  const all = publicRoutes()
  const by = (g: RouteEntry['group']) => all.filter((r) => r.group === g)
  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.name} (${SITE.nameMeaning}) is a budgeting web app for salaried people in ${SITE.country} (amounts in KSh). It plans each month "payments first" (income − planned payments = what's left), tracks expenses against spending limits with early warnings, projects a debt-free date for each loan, and checks ten money habits. The vault backup is encrypted on the user's device; readable finance records are stored for server reports when enabled.`,
    '',
    `Pricing: Free plan; Pro costs KSh ${PRICES.monthly.amount} per month or KSh ${PRICES.yearly.amount} per year, with a ${TRIAL_DAYS}-day free trial. Payment by M-Pesa or card through Paystack. It does not connect to banks or M-Pesa accounts; users record transactions themselves.`,
    '',
    'The guides and calculators below are general education, not personal financial advice. Calculators are estimates based on user-entered numbers and stated assumptions.',
    '',
    section('Product', [...by('core').filter((r) => ['/', '/pricing', '/expense-tracker', '/about'].includes(r.path))]),
    section('Free tools (no account needed)', [...by('core').filter((r) => r.path === '/calculators'), ...by('calculator'), ...by('core').filter((r) => r.path === '/financial-health')]),
    section('Financial education', [...by('core').filter((r) => r.path === '/learn'), ...by('pillar')]),
    section('Guides', by('guide')),
    section('Blog', by('blog')),
    section('Reference', by('core').filter((r) => r.path === '/glossary')),
    '## Optional',
    '',
    `- [Privacy policy](${absoluteUrl('/privacy')})`,
    `- [Terms of service](${absoluteUrl('/terms')})`,
    `- [Contact](${absoluteUrl('/contact')})`,
    '',
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
