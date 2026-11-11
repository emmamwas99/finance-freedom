import type { CloudBackend } from './backend'
import { createDemoBackend } from './demoBackend'
import { createSupabaseBackend } from './supabaseBackend'
import { createGoBackend } from './goBackend'

// Literal `process.env.NEXT_PUBLIC_*` reads so Next inlines them into the client bundle.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const goURL = process.env.NEXT_PUBLIC_FINFE_API_URL

/** True when a real Supabase project is configured; otherwise the app runs in demo mode. */
export const backendMode: CloudBackend['mode'] = goURL ? 'go' : url && anon ? 'supabase' : 'demo'

let instance: CloudBackend | null = null

/**
 * The backend is created on first use in the browser, never during server rendering:
 * the Supabase client keeps its session in localStorage and the demo backend lives there entirely.
 */
export function getBackend(): CloudBackend {
  if (typeof window === 'undefined') throw new Error('The cloud backend is only available in the browser')
  instance ??= goURL ? createGoBackend(goURL) : url && anon ? createSupabaseBackend(url, anon) : createDemoBackend()
  return instance
}

export * from './backend'
