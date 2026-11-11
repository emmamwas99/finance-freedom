import { LegalLayout } from '@/components/marketing/legal-layout'
import { BRAND } from '@/config/site'
import { money } from '@/lib/format'
import { PRICES, TRIAL_DAYS } from '@/lib/plans'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'

const page = PAGES.terms
export const metadata = buildMetadata(page)

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" path={page.path} description={page.description} updated={page.updated}>
      <p>
        These terms are an agreement between you and {BRAND.company} (“we”), which operates {BRAND.name} (the “Service”).
      </p>
      <section>
        <h2>1. The Service</h2>
        <p>{BRAND.name} is a personal budgeting tool. It does not give financial, tax or legal advice, and it is not a bank or lender. Decisions about your money are your own.</p>
      </section>
      <section>
        <h2>2. Your account</h2>
        <ul>
          <li>You must be 18 or older and give a valid email address.</li>
          <li>Your data is encrypted with your password. You are responsible for keeping your password and recovery key safe. If you lose both, we cannot recover your data.</li>
          <li>Do not share your account or try to access another person’s account.</li>
        </ul>
      </section>
      <section>
        <h2>3. Plans and payment</h2>
        <ul>
          <li>The Free plan costs nothing. Pro costs {money(PRICES.monthly.amount)} per month or {money(PRICES.yearly.amount)} per year, including any applicable taxes, unless shown otherwise at checkout.</li>
          <li>New accounts get a {TRIAL_DAYS}-day Pro trial. No payment details are required for the trial.</li>
          <li>Payments are processed by Paystack. M-Pesa payments cover a single period and do not renew automatically. Card payments may renew automatically until you cancel.</li>
          <li>You can cancel at any time. Pro stays active until the end of the period you paid for. Except where the law requires, payments are not refundable for partly used periods. [Adjust to your refund policy.]</li>
          <li>We may change prices with at least 30 days’ notice. Changes apply from your next period.</li>
        </ul>
      </section>
      <section>
        <h2>4. Acceptable use</h2>
        <p>Do not misuse the Service, attempt to break its security, or use it for anything unlawful.</p>
      </section>
      <section>
        <h2>5. Availability and liability</h2>
        <p>
          We work to keep the Service available and your data safe, but it is provided “as is”. To the extent the law allows, we are not liable for indirect losses, or for losses from decisions you make using the Service. Our total liability is limited to what you paid us in the last 12 months.
        </p>
      </section>
      <section>
        <h2>6. Ending your account</h2>
        <p>You can delete your account at any time in Settings, which permanently deletes your encrypted data. We may suspend accounts that break these terms.</p>
      </section>
      <section>
        <h2>7. Law</h2>
        <p>These terms are governed by the laws of Kenya, and disputes will be handled by the courts of Kenya.</p>
      </section>
      <section>
        <h2>8. Contact</h2>
        <p>
          {BRAND.company}, [physical address], <a className="text-primary underline" href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>
        </p>
      </section>
    </LegalLayout>
  )
}
