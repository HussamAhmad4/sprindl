import { useEffect, useRef, useState } from 'react'
import { DEPARTMENTS, DEPARTMENT_MODE_PREFIX } from '../data/departments.js'
import { useChat } from '../hooks/useChat.js'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import ChatInput from './ChatInput.jsx'

function DeptChat({ dept, onBack }) {
  const welcome = `Hi! I'm the ${dept.name} Helper — an AI assistant, not CSI staff. I can explain how things work and point you to the right people. I can't see your records or accounts. What do you need help with?`
  const { messages, isLoading, error, sendMessage } = useChat(DEPARTMENT_MODE_PREFIX + dept.id, welcome)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="community-chat">
      <div className="community-chat__header">
        <button type="button" className="btn btn--icon" onClick={onBack} aria-label="Back to departments">←</button>
        <span className="community-chat__dept-icon" aria-hidden="true">{dept.icon}</span>
        <div className="community-chat__titles">
          <strong>{dept.name}</strong>
          <span className="ai-badge">AI assistant · not CSI staff</span>
        </div>
      </div>

      <div className="community-contact">
        {dept.location && <span>📍 {dept.location}</span>}
        {dept.phone && <a href={`tel:${dept.phone.replace(/[^0-9+]/g, '')}`}>📞 {dept.phone}</a>}
        {dept.email && <a href={`mailto:${dept.email}`}>✉️ {dept.email}</a>}
        <a href={dept.url} target="_blank" rel="noreferrer">🔗 Official page ↗</a>
      </div>

      <div className="community-chat__messages" ref={scrollRef}>
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
      </div>

      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        mode={DEPARTMENT_MODE_PREFIX + dept.id}
        placeholder={`Ask the ${dept.name} Helper anything…`}
      />
    </div>
  )
}

export default function CommunityChat() {
  const [open, setOpen] = useState(false)
  const [dept, setDept] = useState(null)

  return (
    <>
      <button
        type="button"
        className="community-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close community chat' : 'Open community chat — talk to a CSI department helper'}
        aria-expanded={open}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="community-panel" role="dialog" aria-label="CSI Community Chat">
          {dept ? (
            <DeptChat key={dept.id} dept={dept} onBack={() => setDept(null)} />
          ) : (
            <div className="community-picker">
              <div className="community-picker__head">
                <strong>CSI Community Chat</strong>
                <p>Pick a department to chat with its AI helper. These are AI assistants — not CSI staff — and every chat links you to the real office.</p>
              </div>
              <div className="community-picker__list">
                {DEPARTMENTS.map((d) => (
                  <button key={d.id} type="button" className="dept-chip" onClick={() => setDept(d)}>
                    <span className="dept-chip__icon" aria-hidden="true">{d.icon}</span>
                    <span className="dept-chip__text">
                      <strong>{d.name}</strong>
                      <span>{d.tagline}</span>
                    </span>
                    <span className="dept-chip__arrow" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
