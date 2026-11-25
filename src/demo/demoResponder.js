// Demo mode: answers chat messages in the browser, with no API key or backend.
// It keyword-matches the user's message against Sprindl's own verified catalog,
// so the live demo keeps working when the AI backend is offline.
import { resources } from '../data/resources.js'
import { FEATURED_DEALS } from '../data/featuredDeals.js'
import { departmentForMode } from '../data/departments.js'

export const DEMO_NOTE =
  'Demo mode: the AI chat is offline, so these are keyword matches from Sprindl’s verified resource list.'

const STOPWORDS = new Set([
  'the', 'and', 'for', 'you', 'are', 'with', 'can', 'what', 'how', 'need', 'help', 'want', 'get',
  'any', 'have', 'this', 'that', 'there', 'from', 'about', 'some', 'like', 'find', 'looking', 'im',
  'i’m', "i'm", 'me', 'my', 'is', 'do', 'to', 'of', 'in', 'on', 'a', 'an', 'it', 'or', 'be',
])

// Which catalog category fits each chat mode best
const MODE_CATEGORY = {
  deals: 'Student Discounts',
  campus: 'CUNY Programs',
  cuny: 'CUNY Programs',
  opportunities: 'Student Opportunities',
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
}

function scoreResource(r, words, preferredCategory) {
  const tags = (r.tags || []).join(' ').toLowerCase()
  const name = (r.name || '').toLowerCase()
  const category = (r.category || '').toLowerCase()
  const desc = `${r.shortDescription || ''} ${r.whoItsFor || ''}`.toLowerCase()
  let score = 0
  for (const w of words) {
    if (tags.includes(w)) score += 3
    if (name.includes(w)) score += 2
    if (category.includes(w)) score += 2
    if (desc.includes(w)) score += 1
  }
  if (score > 0 && preferredCategory && r.category === preferredCategory) score += 2
  return score
}

function matchResources(text, mode, limit = 4) {
  const words = tokenize(text)
  const preferred = MODE_CATEGORY[mode]
  const ranked = resources
    .map((r) => ({ r, score: scoreResource(r, words, preferred) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.r)
  if (ranked.length > 0) return { list: ranked.slice(0, limit), matched: true }
  // Nothing matched: show the best starting points for this mode
  return { list: resources.filter((r) => r.category === (preferred || 'Financial Aid')).slice(0, limit), matched: false }
}

function matchDeals(text, limit = 4) {
  const words = tokenize(text)
  return FEATURED_DEALS
    .map((d) => {
      const hay = `${d.label} ${d.desc}`.toLowerCase()
      return { d, score: words.filter((w) => hay.includes(w)).length }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.d)
}

export function getDemoResponse(text, mode = 'resources') {
  const dept = departmentForMode(mode)
  if (dept) {
    return {
      reply: `${dept.name} can help with that. Visit ${dept.location}, call ${dept.phone}, or email ${dept.email}. Hours: ${dept.hours}.`,
      followUp: DEMO_NOTE,
      resources: [],
      products: [],
      programs: [],
    }
  }

  const { list: found, matched } = matchResources(text, mode)
  let reply = matched
    ? 'Here are some options that match what you described. Check each official site for current details.'
    : 'I couldn\u2019t find a close match, so here are good places to start. Try a few words like "food help" or "health insurance."'

  if (mode === 'deals') {
    const deals = matchDeals(text)
    if (deals.length) {
      reply = `Student deals that might help: ${deals.map((d) => `${d.label.replace(/^\S+\s/, '')} (${d.desc})`).join('; ')}.`
    }
  }

  return { reply, followUp: DEMO_NOTE, resources: found, products: [], programs: [] }
}
