import type { CloudBackend } from './backend'
import { createDemoBackend } from './demoBackend'
import { createGoBackend } from './goBackend'

const demo = process.env.NEXT_PUBLIC_FINFE_DEMO_MODE === 'true'

/** Demo storage must be selected explicitly; accounts use the Finfe API. */
export const backendMode: CloudBackend['mode'] = demo ? 'demo' : 'go'

let instance: CloudBackend | null = null

/**
 * The backend is created on first use in the browser, never during server rendering:
 * account sessions are held in HttpOnly cookies and demo data stays in this browser.
 */
export function getBackend(): CloudBackend {
  if (typeof window === 'undefined') throw new Error('The cloud backend is only available in the browser')
  if (!instance) {
    if (demo) instance = createDemoBackend()
    else instance = createGoBackend('')
  }
  return instance
}

export * from './backend'
