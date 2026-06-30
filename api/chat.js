// Vercel serverless function: POST /api/chat
// Keeps the Anthropic API key server-side only. The frontend never talks
// to Claude directly.

import { getChatResponse, lookupResources } from '../lib/chatHandler.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { messages } = req.body ?? {}
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: '"messages" must be a non-empty array.' })
      return
    }

    const result = await getChatResponse(messages)
    const matchedResources = lookupResources(result.resourceIds)

    res.status(200).json({
      reply: result.reply,
      followUp: result.followUp,
      resources: matchedResources,
    })
  } catch (error) {
    console.error('chat handler error:', error)
    res.status(500).json({ error: error.message || 'Something went wrong. Please try again.' })
  }
}
