import { Splash } from '@/features/auth/auth-screens'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Choose a new password')

export default function Page() {
  return <Splash />
}
