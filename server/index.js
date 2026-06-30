// Local development API server. Mirrors api/chat.js so you can run the
// full app locally (`npm run dev:all`) without needing the Vercel CLI.
// In production on Vercel, api/chat.js is used instead of this file.

import 'dotenv/config'
import express from 'express'
import { getChatResponse, lookupResources } from '../lib/chatHandler.js'

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body ?? {}
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: '"messages" must be a non-empty array.' })
    }

    const result = await getChatResponse(messages)
    const matchedResources = lookupResources(result.resourceIds)

    res.json({
      reply: result.reply,
      followUp: result.followUp,
      resources: matchedResources,
    })
  } catch (error) {
    console.error('chat handler error:', error)
    res.status(500).json({ error: error.message || 'Something went wrong. Please try again.' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const port = process.env.PORT || 8787
app.listen(port, () => {
  console.log(`Community Resource Navigator API running at http://localhost:${port}`)
})
