import { PlanPage } from '@/features/plan/plan-page'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Monthly plan')

export default function Page() {
  return <PlanPage />
}
