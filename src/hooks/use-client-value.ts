'use client'

import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * A value that only exists in the browser (today's date, the current month…). The server and
 * the hydration pass render `serverValue`; the real value appears right after. This avoids
 * hydration mismatches on statically generated pages built on a different day.
 * `read` must return a primitive (or a stable reference) so React can compare snapshots.
 */
export function useClientValue<T extends string | number | boolean | null>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(noop, read, () => serverValue)
}
