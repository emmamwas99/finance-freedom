#!/usr/bin/env node
/** Start the local API before Next, so account screens never open against a missing server. */
import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const backendRoot = path.resolve(root, '../finfe-backend')
const webEnv = path.join(root, '.env.local')
const localSettings = existsSync(webEnv) ? readFileSync(webEnv, 'utf8') : ''
const setting = (name) => localSettings.match(new RegExp(`^${name}=(.*)$`, 'm'))?.[1]?.replace(/^['"]|['"]$/g, '')
const configuredURL = process.env.FINFE_API_URL ?? setting('FINFE_API_URL') ?? process.env.NEXT_PUBLIC_FINFE_API_URL ?? setting('NEXT_PUBLIC_FINFE_API_URL')

if (!configuredURL) {
  console.error('Set FINFE_API_URL in .env.local before starting Finfe.')
  process.exit(1)
}

const apiURL = new URL(configuredURL)
const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? setting('NEXT_PUBLIC_SITE_URL') ?? 'http://localhost:3000'
const localAPI = ['localhost', '127.0.0.1', '[::1]'].includes(apiURL.hostname)
let backend
let web

function stop(signal = 'SIGTERM') {
  for (const child of [web, backend]) {
    if (!child?.pid) continue
    try { process.kill(-child.pid, signal) }
    catch { child.kill(signal) }
  }
}

process.on('SIGINT', () => { stop('SIGINT'); process.exit(130) })
process.on('SIGTERM', () => { stop(); process.exit(143) })

async function ready() {
  try {
    const response = await fetch(new URL('/ready', apiURL), { signal: AbortSignal.timeout(1500) })
    return response.ok && (await response.json()).status === 'ready'
  } catch { return false }
}

async function webRunning() {
  try {
    const response = await fetch(new URL('/login', siteURL), { signal: AbortSignal.timeout(1500) })
    return response.ok && (await response.text()).includes('Finfe')
  } catch { return false }
}

if (localAPI && !(await ready())) {
  if (!existsSync(path.join(backendRoot, 'scripts/dev.sh'))) {
    console.error('Local API is unavailable and ../finfe-backend/scripts/dev.sh was not found.')
    process.exit(1)
  }
  console.log('Starting the Finfe API...')
  backend = spawn('bash', ['scripts/dev.sh'], { cwd: backendRoot, stdio: 'inherit', detached: true })
  backend.on('error', (error) => console.error('Could not start the Finfe API:', error.message))
  const deadline = Date.now() + 45_000
  while (Date.now() < deadline && !(await ready())) {
    if (backend.exitCode !== null) break
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (!(await ready())) {
    console.error('Finfe API did not become ready. Check its MongoDB connection and settings in ../finfe-backend/.env.local.')
    stop()
    process.exit(1)
  }
}

if (await webRunning()) {
  console.log(`Finfe API is ready. The web app is already running at ${siteURL}.`)
  if (backend) await new Promise((resolve) => backend.once('exit', resolve))
  process.exit(backend?.exitCode ?? 0)
}

console.log('Finfe API is ready. Starting the web app...')
web = spawn(path.join(root, 'node_modules/.bin/next'), ['dev'], { cwd: root, stdio: 'inherit', detached: true })
web.on('error', (error) => { console.error('Could not start Next.js:', error.message); stop(); process.exit(1) })
web.on('exit', (code) => { stop(); process.exit(code ?? 1) })
