import { LoginPage } from '@/features/auth/auth-screens'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Log in')

export default function Page() {
  return <LoginPage />
}
