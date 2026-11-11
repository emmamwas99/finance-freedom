import { ActivityPage } from '@/features/transactions/transactions-page'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Transactions')

export default function Page() {
  return <ActivityPage />
}
