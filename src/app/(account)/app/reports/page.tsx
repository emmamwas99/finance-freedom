import { ProGate } from '@/features/billing/billing-ui'
import { StatsPage } from '@/features/reports/reports-page'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Reports')

export default function Page() {
  return (
    <ProGate title="Reports">
      <StatsPage />
    </ProGate>
  )
}
