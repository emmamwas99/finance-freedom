import { SignupPage } from '@/features/auth/auth-screens'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Create your account')

export default function Page() {
  return <SignupPage />
}
