import { useCallback, useEffect, useRef, useState } from 'react'
import { profileSummary } from '../checkup/profile.js'
import { getDemoResponse } from '../demo/demoResponder.js'

const WELCOME = {
  resources: "Hey, I'm Sprindl! I help students find benefits, financial aid, food assistance, health coverage, and more. What's going on?",
  deals: "Hey! I'm Sprindl, your student deal finder \u{1F6CD}\u{FE0F} Tell me what you're looking for \u2014 like \"I need a laptop for college under $700\" \u2014 and I'll find you the best options with student discounts.",
  campus: "Hey! I'm Sprindl, your CSI campus guide \u{1F393} Ask me about tutoring, scholarships, SEEK, ASAP, TAP, Excelsior, clubs, career programs, the food pantry \u2014 anything at the College of Staten Island.",
  cuny: "Hey! I'm Sprindl, your CUNY guide \u{1F3EB} Ask me about ASAP, SEEK, TAP, Excelsior, Single Stop, the food pantry \u2014 anything CUNY offers CSI students.",
  opportunities: "Hey! I'm Sprindl \u{1F680} I help students find paid internships, research programs, fellowships, and scholarships. Tell me your year and major and I'll point you somewhere real.",
}

let idCounter = 0
const nextId = () => `msg-${Date.now()}-${idCounter++}`
const makeWelcome = (mode, welcomeText) => ({
  id: 'welcome',
  role: 'assistant',
  content: welcomeText || WELCOME[mode] || WELCOME.resources,
  resources: [],
  products: [],
  programs: [],
})

export function useChat(mode = 'resources', welcomeText = null) {
  const [messages, setMessages] = useState([makeWelcome(mode, welcomeText)])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const historyRef = useRef([])
  // Demo mode kicks in when VITE_DEMO_MODE=true or the AI backend is unreachable
  const demoRef = useRef(import.meta.env.VITE_DEMO_MODE === 'true')

  useEffect(() => {
    historyRef.current = []
    setMessages([makeWelcome(mode, welcomeText)])
    setError(null)
  }, [mode, welcomeText])

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    setError(null)
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', content: trimmed }])
    historyRef.current = [...historyRef.current, { role: 'user', content: trimmed }]
    setIsLoading(true)

    const answerWithDemo = async () => {
      demoRef.current = true
      await new Promise((r) => setTimeout(r, 500))
      const data = getDemoResponse(trimmed, mode)
      historyRef.current = [...historyRef.current, { role: 'assistant', content: data.reply }]
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: data.reply, ...data, demo: true }])
    }

    if (demoRef.current) {
      try { await answerWithDemo() } finally { setIsLoading(false) }
      return
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyRef.current, mode, profile: profileSummary() || undefined }),
      })
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // No backend (e.g. GitHub Pages): fall back to demo mode
        await answerWithDemo()
        return
      }
      const data = await res.json()
      if (res.status >= 500) {
        // Backend is up but the AI call failed (missing/invalid API key, etc.)
        await answerWithDemo()
        return
      }
      if (!res.ok) throw new Error(data?.error || 'Something went wrong.')
      historyRef.current = [...historyRef.current, { role: 'assistant', content: data.reply }]
      setMessages((prev) => [...prev, {
        id: nextId(), role: 'assistant', content: data.reply,
        resources: data.resources || [], products: data.products || [],
        programs: data.programs || [], followUp: data.followUp || null,
      }])
    } catch (err) {
      if (err instanceof TypeError) {
        // Network failure reaching /api/chat: fall back to demo mode
        await answerWithDemo()
        return
      }
      // Roll back the failed user turn so a retry doesn't send it twice
      historyRef.current = historyRef.current.slice(0, -1)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, mode])

  const reset = useCallback(() => {
    historyRef.current = []
    setMessages([makeWelcome(mode, welcomeText)])
    setError(null)
  }, [mode, welcomeText])

  return { messages, isLoading, error, sendMessage, reset }
}
