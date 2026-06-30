import { getChatResponse, lookupResources } from '../lib/chatHandler.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }
  try {
    const { messages, mode = 'resources' } = req.body ?? {}
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: '"messages" must be a non-empty array.' }); return
    }
    const result = await getChatResponse(messages, mode)
    res.status(200).json({
      reply: result.reply,
      followUp: result.followUp,
      resources: mode === 'resources' ? lookupResources(result.resourceIds) : [],
      products: result.products || [],
      programs: result.programs || [],
    })
  } catch (error) {
    console.error('chat handler error:', error)
    res.status(500).json({ error: error.message || 'Something went wrong.' })
  }
}
