export default function CampusProgramCard({ program }) {
  return (
    <article className="campus-card">
      <div className="campus-card__header">
        <h3 className="campus-card__name">{program.name}</h3>
        {program.department && (
          <span className="campus-card__dept">{program.department}</span>
        )}
      </div>
      <p className="campus-card__desc">{program.description}</p>
      {program.howToAccess && (
        <p className="campus-card__how">
          <strong>How to access:</strong> {program.howToAccess}
        </p>
      )}
      <div className="campus-card__actions">
        {program.directLink && (
          <a href={program.directLink} target="_blank" rel="noreferrer" className="btn btn--primary btn--small">
            Visit page
          </a>
        )}
        {program.searchLink && (
          <a href={program.searchLink} target="_blank" rel="noreferrer" className="btn btn--ghost btn--small">
            Search Google
          </a>
        )}
      </div>
    </article>
  )
}
