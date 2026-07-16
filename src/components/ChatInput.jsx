import { useRef, useState } from 'react'

const PLACEHOLDERS = {
  deals: 'e.g. "I need a laptop for college under $700"',
  campus: 'e.g. "I go to CSI CUNY — are there tutoring programs?"',
  cuny: 'e.g. "I go to Hunter — how do I apply for SEEK?"',
  opportunities: 'e.g. "junior CS major looking for paid summer internships"',
  resources: 'e.g. "I need help affording groceries this week"',
}

export default function ChatInput({ onSend, isLoading, mode }) {
  const [value, setValue] = useState('')
  const taRef = useRef(null)

  const autoGrow = () => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`
  }

  const submit = () => {
    if (!value.trim() || isLoading) return
    onSend(value)
    setValue('')
    if (taRef.current) taRef.current.style.height = 'auto'
  }

  return (
    <form className="chat-input" onSubmit={(e) => { e.preventDefault(); submit() }}>
      <label htmlFor="chat-message" className="sr-only">Type your message</label>
      <textarea
        id="chat-message" rows={1} ref={taRef}
        placeholder={PLACEHOLDERS[mode] || PLACEHOLDERS.resources}
        value={value}
        onChange={(e) => { setValue(e.target.value); autoGrow() }}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        disabled={isLoading}
      />
      <button type="submit" className="btn btn--primary" disabled={isLoading || !value.trim()}>
        Send <span aria-hidden="true">↗</span>
      </button>
    </form>
  )
}
