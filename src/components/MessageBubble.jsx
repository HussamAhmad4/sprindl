import ResourceCard from './ResourceCard.jsx'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message ${isUser ? 'message--user' : 'message--assistant'}`}>
      {!isUser && <div className="message__avatar" aria-hidden="true">N</div>}
      <div className="message__content">
        <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--assistant'}`}>{message.content}</div>

        {!isUser && message.followUp && <div className="follow-up">{message.followUp}</div>}

        {!isUser && message.resources?.length > 0 && (
          <div className="resource-grid">
            {message.resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
