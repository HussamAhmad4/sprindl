import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'

const STARTER_PROMPTS = [
  "I can't afford food this week.",
  "I need help paying for college or managing my loans.",
  "I just turned 26 and lost my health insurance.",
  "I'm stressed and need mental health support.",
  "What student discounts am I missing out on?",
  "I lost my job — what can I do?",
]

export default function ChatWindow({ messages, isLoading, error, onSend }) {
  const scrollRef = useRef(null)
  const showStarters = messages.length === 1

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="chat-window" ref={scrollRef}>
      <div className="chat-window__messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="message message--assistant">
            <div className="message__avatar" aria-hidden="true">!</div>
            <div className="bubble bubble--error">{error}</div>
          </div>
        )}

        {showStarters && !isLoading && (
          <div className="starter-prompts" aria-label="Example questions">
            {STARTER_PROMPTS.map((prompt) => (
              <button key={prompt} type="button" className="starter-chip" onClick={() => onSend(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
