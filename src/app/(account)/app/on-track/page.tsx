import { ProGate } from '@/features/billing/billing-ui'
import { InsightsPage } from '@/features/insights/on-track-page'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Am I on track?')

export default function Page() {
  return (
    <ProGate title="Am I on track?">
      <InsightsPage />
    </ProGate>
  )
}
