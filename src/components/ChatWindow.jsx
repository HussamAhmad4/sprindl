import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'

const STARTER_PROMPTS = [
  "I lost my job and I'm worried about paying rent.",
  'I need help affording groceries for my family.',
  "I'm a senior and need help paying my electric bill.",
  'I just had a baby and need help with health coverage.',
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
