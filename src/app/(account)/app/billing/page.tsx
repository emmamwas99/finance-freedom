import { BillingPage } from '@/features/billing/billing-page'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Plan & billing')

export default function Page() {
  return <BillingPage />
}
