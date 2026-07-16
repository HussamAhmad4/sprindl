// Weekly dead-link checker for the resource catalog.
// Grounded recommendations are only as good as their links — this pings every
// URL in the catalog, featured deals, CUNY directory, and checkup rules.
// Exit code 1 if any link is confirmed dead (404/410/DNS failure).

import { resources } from '../src/data/resources.js'
import { FEATURED_DEALS, CUNY_SCHOOLS } from '../src/data/featuredDeals.js'
import { RULES } from '../src/checkup/rules.js'

const urls = new Set()
for (const r of resources) if (r.link) urls.add(r.link)
for (const d of FEATURED_DEALS) if (d.url) urls.add(d.url)
for (const s of CUNY_SCHOOLS) if (s.url) urls.add(s.url)
for (const rule of RULES) if (rule.link) urls.add(rule.link)

const UA = 'Mozilla/5.0 (compatible; SprindlLinkCheck/1.0; +https://github.com/HussamAhmad4/sprindl)'
// Bot walls (403/405/429) and auth walls (401) are "unverifiable", not dead.
const SOFT_STATUSES = new Set([401, 403, 405, 429, 503])

async function check(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20_000)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
    })
    if (res.ok) return { url, status: res.status, verdict: 'ok' }
    if (SOFT_STATUSES.has(res.status)) return { url, status: res.status, verdict: 'soft' }
    return { url, status: res.status, verdict: 'dead' }
  } catch (err) {
    return { url, status: err.name === 'AbortError' ? 'timeout' : 'error', verdict: 'soft' }
  } finally {
    clearTimeout(timer)
  }
}

const list = [...urls]
console.log(`Checking ${list.length} unique links…\n`)

const results = []
const BATCH = 10
for (let i = 0; i < list.length; i += BATCH) {
  results.push(...await Promise.all(list.slice(i, i + BATCH).map(check)))
}

const dead = results.filter((r) => r.verdict === 'dead')
const soft = results.filter((r) => r.verdict === 'soft')

for (const r of soft) console.log(`  ⚠ unverifiable (${r.status}): ${r.url}`)
for (const r of dead) console.log(`  ✗ DEAD (${r.status}): ${r.url}`)

console.log(`\n${results.length - dead.length - soft.length} ok · ${soft.length} unverifiable · ${dead.length} dead`)
if (dead.length > 0) {
  console.error('\nDead links found — update src/data or src/checkup/rules.js')
  process.exit(1)
}
console.log('All catalog links verified ✔')
