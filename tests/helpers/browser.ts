/** Minimal browser globals for running the in-browser demo backend under Node. */
export function installBrowserGlobals() {
  const store = new Map<string, string>()
  const localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size
    },
  }
  Object.assign(globalThis, { localStorage, window: globalThis })
  Object.defineProperty(globalThis, 'location', { value: { pathname: '/app', origin: 'http://localhost' }, configurable: true })
  return { store }
}
