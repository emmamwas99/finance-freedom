import { LegalLayout } from '@/components/marketing/legal-layout'
import { BRAND } from '@/config/site'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'

const page = PAGES.privacy
export const metadata = buildMetadata(page)

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" path={page.path} description={page.description} updated={page.updated}>
      <p>
        This policy explains what personal data {BRAND.company} (“we”) processes when you use {BRAND.name}, in line with Kenya’s Data Protection Act, 2019. [Insert your ODPC registration number once registered.]
      </p>
      <section>
        <h2>What we store</h2>
        <p>
          Your vault backup is encrypted on your device with a key made from your password. When the Go backend is enabled, we also store a readable copy of your income, expenses, loans, goals and plans in PostgreSQL so we can calculate server reports. We do not receive your password. In Supabase mode, financial records are stored only in the encrypted vault. The local demo keeps records in your browser.
        </p>
      </section>
      <section>
        <h2>Free tools and calculators</h2>
        <p>
          The calculators and the financial health check run entirely in your browser and work without an account. Your last inputs are saved in your browser’s local storage so they’re there when you return. They are never sent to us. You can clear them with “Reset to example” or by clearing your browser’s site data.
        </p>
      </section>
      <section>
        <h2>Data we do process</h2>
        <ul>
          <li><b>Account data:</b> your email address and the date you joined.</li>
          <li><b>Financial records in Go mode:</b> categories, transactions, budgets, loans, goals and plans used for reports.</li>
          <li><b>Subscription and payment data:</b> plan, status, amounts, dates and Paystack references. Card and M-Pesa details are handled by Paystack. We do not see your full card number or M-Pesa PIN.</li>
          <li><b>Technical data:</b> basic logs (such as IP address and device type) kept for security and to fix problems.</li>
        </ul>
      </section>
      <section>
        <h2>Why we process it</h2>
        <ul>
          <li>To provide the Service and your account (contract).</li>
          <li>To take payments and keep records required by law, such as tax records (legal obligation).</li>
          <li>To keep the Service secure and prevent abuse (legitimate interest).</li>
          <li>To send important account emails. We only send marketing emails with your consent, and you can opt out at any time.</li>
        </ul>
      </section>
      <section>
        <h2>Who we share it with</h2>
        <ul>
          <li>Our PostgreSQL hosting provider when Go mode is enabled; it stores readable finance records and encrypted vault backups.</li>
          <li>Supabase when Supabase mode is configured; it stores encrypted vault data.</li>
          <li>Paystack (payment processing).</li>
          <li>Authorities, only when the law requires it.</li>
        </ul>
        <p>Some providers store data outside Kenya. Where they do, we use providers with appropriate safeguards, as the Act requires. [Confirm your providers’ data locations.]</p>
      </section>
      <section>
        <h2>How long we keep it</h2>
        <p>Your account, vault and report data are kept until you delete your account. Payment records may be retained where required by law.</p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          You may ask to access, correct or delete your personal data, or object to how it is processed. Contact <a className="text-primary underline" href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>. You can also complain to the Office of the Data Protection Commissioner (ODPC).
        </p>
      </section>
    </LegalLayout>
  )
}
