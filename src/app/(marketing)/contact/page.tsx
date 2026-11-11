import { Mail } from 'lucide-react'
import { Breadcrumbs } from '@/components/marketing/breadcrumbs'
import { PageIntro } from '@/components/marketing/page-intro'
import { A, Prose } from '@/components/marketing/prose'
import { JsonLd } from '@/components/seo/json-ld'
import { SITE } from '@/config/site'
import { buildMetadata } from '@/lib/seo/metadata'
import { PAGES } from '@/lib/seo/pages'
import { webPageSchema } from '@/lib/seo/schema'

const page = PAGES.contact
export const metadata = buildMetadata(page)

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs items={[{ name: 'Contact', path: page.path }]} />
      <div className="mt-6">
        <PageIntro title="Contact us" lead="The fastest way to reach us is by email. We usually reply within one or two working days." />
      </div>
      <a href={`mailto:${SITE.supportEmail}`} className="mt-8 flex items-center gap-4 rounded-2xl border bg-card p-6 transition-colors hover:border-primary/50">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
          <Mail aria-hidden className="size-5" />
        </span>
        <span>
          <span className="block text-[14px] text-muted-foreground">Email</span>
          <span className="block text-lg font-semibold text-navy">{SITE.supportEmail}</span>
        </span>
      </a>
      <Prose className="mt-10">
        <h2 id="before">Before you write</h2>
        <ul>
          <li><strong>Forgot your password?</strong> Use <A href="/forgot">reset password</A> with the recovery key you saved when you signed up. Because your data is encrypted with your password, we can’t reset it or read your data for you.</li>
          <li><strong>A payment question?</strong> Include the payment reference from the billing page in the app (never your M-Pesa PIN or card number).</li>
          <li><strong>Deleting your account?</strong> You can do it yourself any time in Settings → Delete account.</li>
        </ul>
        <p>Please never email us your password, recovery key or other secret codes. We will never ask for them.</p>
      </Prose>
      <JsonLd data={webPageSchema({ type: 'ContactPage', title: page.title, description: page.description, path: page.path, updated: page.updated })} />
    </div>
  )
}
