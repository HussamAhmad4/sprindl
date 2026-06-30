export default function ResourceCard({ resource }) {
  return (
    <article className="resource-card">
      <div className="resource-card__header">
        <span className="resource-card__category">{resource.category}</span>
        <h3>{resource.name}</h3>
      </div>
      <p className="resource-card__desc">{resource.shortDescription}</p>
      <p className="resource-card__who">
        <strong>Who it's for:</strong> {resource.whoItsFor}
      </p>
      <div className="resource-card__actions">
        <a href={resource.link} target="_blank" rel="noreferrer" className="btn btn--primary btn--small">
          Learn more / Apply
        </a>
        {resource.phone && (
          <a href={`tel:${resource.phone.replace(/[^\d+]/g, '')}`} className="resource-card__phone">
            Call {resource.phone}
          </a>
        )}
      </div>
    </article>
  )
}
