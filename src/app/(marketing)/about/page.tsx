import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { CtaBanner } from '@/components/marketing/cta'
import { PageIntro } from '@/components/marketing/page-intro'
import { A, Prose } from '@/components/marketing/prose'
import { JsonLd } from '@/components/seo/json-ld'
import { EDITORIAL, SITE } from '@/config/site'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { webPageSchema } from '@/lib/seo/schema'

const page = PAGES.about
export const metadata = buildMetadata(page)

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'About', path: page.path }]} />
      <div className="mt-6">
        <PageIntro title={`About ${SITE.name}`} lead={`${SITE.name}, ${SITE.nameMeaning}, is a private budget planner built for salaried people in Kenya. It helps you plan every payment before your salary is spent, stop borrowing to get through the month, and see the date you’ll be debt-free.`} />
      </div>
      <Prose className="mt-10">
        <h2 id="why">Why we built it</h2>
        <p>Many people earn a decent salary and still run out before payday. Loans, school fees, family support and a side business all pull on the same pay cheque, and the money is gone before anyone decides where it should go. Generic budgeting apps assume a simple life and a bank feed. Most of us live with Fuliza, SACCO loans, chamas and cash.</p>
        <p>So {SITE.name} starts with one question: <strong>how much is really left this month, after every payment you must make?</strong> Everything else (limits, warnings, the debt-free date, the monthly report card) builds on that answer.</p>
        <h2 id="name">Why “Finfe”?</h2>
        <p>Finfe is short for <strong>financial freedom</strong>: not borrowing to get by, then being debt-free, then having savings that let you choose. The logo is a lowercase “f” whose crossbar is a rising arrow, because the goal is steady progress upwards, one month at a time.</p>
        <h2 id="privacy">How we protect your data</h2>
        <p>Your vault backup is encrypted on your device with a key made from your password. When server reports are enabled, readable finance records are also stored in PostgreSQL. Your password never leaves your device; your recovery key helps open the encrypted vault if you forget it. Read the details in our <A href="/privacy">privacy policy</A>.</p>
        <h2 id="editorial">How we write our guides</h2>
        <p>Our guides and calculators are written by the {EDITORIAL.author.name}. We write in plain language, use Kenyan examples, and show our assumptions and formulas so you can check the maths. {EDITORIAL.reviewPolicy}</p>
        <ul>
          <li>We don’t publish made-up statistics, and we link primary sources such as regulators where a claim depends on them.</li>
          <li>We don’t accept payment to recommend lenders, banks or investment products.</li>
          <li>Our content is general education, not personal financial advice. For decisions about investments, tax or legal matters, speak to a licensed professional.</li>
        </ul>
        <p>Spotted a mistake? Please <A href="/contact">tell us</A> and we’ll fix it.</p>
        <h2 id="company">Who we are</h2>
        <p>{SITE.name} is run by {SITE.company}, a company registered in {SITE.country}. You can reach us at <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p>
      </Prose>
      <div className="mt-14">
        <CtaBanner />
      </div>
      <JsonLd data={webPageSchema({ type: 'AboutPage', title: page.title, description: page.description, path: page.path, updated: page.updated })} />
    </div>
  )
}
