export default function TypingIndicator() {
  return (
    <div className="message message--assistant" aria-live="polite" aria-label="Sprindl is typing">
      <div className="message__avatar" aria-hidden="true">S</div>
      <div className="bubble bubble--assistant bubble--typing">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}
