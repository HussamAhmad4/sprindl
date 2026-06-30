import { resources } from '../src/data/resources.js'
import { buildSystemPrompt } from './systemPrompt.js'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const DEFAULT_MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 1024

/**
 * Calls the Claude API with the conversation so far and returns a
 * structured { reply, resourceIds, followUp } object.
 *
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 */
export async function getChatResponse(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'Missing ANTHROPIC_API_KEY. Add it to your .env file (see .env.example) or your hosting provider’s environment variables.'
    )
  }

  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL
  const systemPrompt = buildSystemPrompt(resources)

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`Claude API error (${response.status}): ${errorText || response.statusText}`)
  }

  const data = await response.json()
  const textBlock = Array.isArray(data.content) ? data.content.find((b) => b.type === 'text') : null
  const rawText = textBlock?.text?.trim() || ''

  return parseModelOutput(rawText)
}

function parseModelOutput(rawText) {
  const cleaned = rawText
    .replace(/^```(json)?/i, '')
    .replace(/```$/, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    return {
      reply: typeof parsed.reply === 'string' ? parsed.reply : rawText,
      resourceIds: Array.isArray(parsed.resourceIds) ? parsed.resourceIds : [],
      followUp: typeof parsed.followUp === 'string' ? parsed.followUp : null,
    }
  } catch {
    // The model didn't return valid JSON — fall back to showing the raw
    // text so the conversation doesn't just break.
    return { reply: rawText || "Sorry, I had trouble responding. Could you try asking that again?", resourceIds: [], followUp: null }
  }
}

/** Looks up full resource records for a list of catalog ids, in order. */
export function lookupResources(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return []
  const byId = new Map(resources.map((r) => [r.id, r]))
  return ids.map((id) => byId.get(id)).filter(Boolean)
}
