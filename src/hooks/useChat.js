import { useCallback, useRef, useState } from 'react'

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey, I'm Navi! I help college students and young adults find resources — things like financial aid, food assistance, health coverage, student discounts, mental health support, and more. What's going on?",
  resources: [],
}

let idCounter = 0
const nextId = () => `msg-${Date.now()}-${idCounter++}`

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const historyRef = useRef([])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      setError(null)
      const userMessage = { id: nextId(), role: 'user', content: trimmed }
      setMessages((prev) => [...prev, userMessage])
      historyRef.current = [...historyRef.current, { role: 'user', content: trimmed }]
      setIsLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyRef.current }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || 'Something went wrong. Please try again.')
        }

        historyRef.current = [
          ...historyRef.current,
          { role: 'assistant', content: data.reply },
        ]

        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            content: data.reply,
            resources: data.resources || [],
            followUp: data.followUp || null,
          },
        ])
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading]
  )

  const reset = useCallback(() => {
    historyRef.current = []
    setMessages([WELCOME_MESSAGE])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, reset }
}
