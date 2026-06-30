function CompassIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.2 8.8 13 13l-4.2 2.2L11 11l4.2-2.2Z" fill="currentColor" />
    </svg>
  )
}

export default function Header({ onReset, hasConversation }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__icon">
          <CompassIcon />
        </span>
        <div>
          <h1>Community Resource Navigator</h1>
          <p>For college students &amp; young adults — find aid, discounts, health, and more.</p>
        </div>
      </div>
      {hasConversation && (
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          New conversation
        </button>
      )}
    </header>
  )
}
