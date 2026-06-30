import 'dotenv/config'
import express from 'express'
import { getChatResponse, lookupResources } from '../lib/chatHandler.js'

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode = 'resources' } = req.body ?? {}
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: '"messages" must be a non-empty array.' })
    }
    const result = await getChatResponse(messages, mode)
    res.json({
      reply: result.reply,
      followUp: result.followUp,
      resources: mode === 'resources' ? lookupResources(result.resourceIds) : [],
      products: result.products || [],
      programs: result.programs || [],
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message || 'Something went wrong.' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))
const port = process.env.PORT || 8787
app.listen(port, () => console.log(`API running at http://localhost:${port}`))
