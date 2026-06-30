import { useState } from 'react'

export default function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState('')

  const submit = () => {
    if (!value.trim() || isLoading) return
    onSend(value)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form
      className="chat-input"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label htmlFor="chat-message" className="sr-only">
        Type your message
      </label>
      <textarea
        id="chat-message"
        rows={1}
        placeholder="Tell Navi what's going on... e.g. “I just lost my job and need help with rent”"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <button type="submit" className="btn btn--primary" disabled={isLoading || !value.trim()}>
        Send
      </button>
    </form>
  )
}
