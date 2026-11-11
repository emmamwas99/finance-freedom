import { SettingsPage } from '@/features/settings/settings-page'
import { privateMetadata } from '@/lib/seo/metadata'

export const metadata = privateMetadata('Settings')

export default function Page() {
  return <SettingsPage />
}
