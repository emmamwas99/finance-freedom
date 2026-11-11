import { DemoCheckoutPage } from '@/features/billing/demo-checkout-page'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Demo checkout')

export default function Page() {
  return <DemoCheckoutPage />
}
