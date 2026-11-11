import { HomePage } from '@/features/overview/overview-page'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Overview')

export default function Page() {
  return <HomePage />
}
