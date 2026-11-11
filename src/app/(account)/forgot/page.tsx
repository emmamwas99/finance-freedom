import { ForgotPage } from '@/features/auth/auth-screens'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Reset your password')

export default function Page() {
  return <ForgotPage />
}
