import { DEPARTMENTS } from '../data/departments.js'

const FAFSA_SCHOOL_CODE = '002698'

const MORE_SERVICES = [
  { icon: '🖥️', label: 'Technology Help Desk', url: 'https://www.csi.cuny.edu/students/technology-help-desk' },
  { icon: '🏛️', label: 'Library (718-982-4128)', url: 'https://www.library.csi.cuny.edu/' },
  { icon: '🧭', label: 'Academic Advisement', url: 'https://www.csi.cuny.edu/students/academic-advisement' },
  { icon: '🩺', label: 'Health & Wellness Services', url: 'https://www.csi.cuny.edu/campus-life/student-services/health-and-wellness-services' },
  { icon: '♿', label: 'Accessibility Services', url: 'https://www.csi.cuny.edu/campus-life/office-accessibility-services' },
  { icon: '🎖️', label: 'Veterans Support', url: 'https://www.csi.cuny.edu/admissions/applying-csi/veterans' },
  { icon: '🎉', label: 'Student Involvement', url: 'https://www.csi.cuny.edu/campus-life/student-involvement' },
  { icon: '✍️', label: 'Writing Across the Curriculum', url: 'https://www.csi.cuny.edu/students/writing-across-curriculum' },
]

export default function ContactsDirectory({ onBack, onOpenChat }) {
  return (
    <div className="contacts">
      <button type="button" className="checkup__back" onClick={onBack}>← Back to home</button>
      <h1 className="contacts__title">CSI Help &amp; Contacts</h1>
      <p className="contacts__sub">
        Real emails, phone numbers, and office locations at the College of Staten Island —
        so you always know exactly which door to knock on. Verified against csi.cuny.edu.
      </p>

      <div className="fafsa-callout">
        <span className="fafsa-callout__code">FAFSA Code: {FAFSA_SCHOOL_CODE}</span>
        <span className="fafsa-callout__text">
          Use this <strong>federal school code</strong> when filing your FAFSA at{' '}
          <a href="https://studentaid.gov/h/apply-for-aid/fafsa" target="_blank" rel="noreferrer">studentaid.gov</a>{' '}
          so your aid reaches CSI. Questions? Contact Financial Aid below.
        </span>
      </div>

      <div className="contacts__grid">
        {DEPARTMENTS.map((d) => (
          <div key={d.id} className="contact-card">
            <div className="contact-card__head">
              <span aria-hidden="true">{d.icon}</span>
              <h3>{d.name}</h3>
            </div>
            <p className="contact-card__tagline">{d.tagline}</p>
            {d.location && <p className="contact-card__row">📍 <span>{d.location}</span></p>}
            {d.phone && <p className="contact-card__row">📞 <a href={`tel:${d.phone.replace(/[^0-9+]/g, '')}`}>{d.phone}</a></p>}
            {d.email && <p className="contact-card__row">✉️ <a href={`mailto:${d.email}`}>{d.email}</a></p>}
            {d.hours && <p className="contact-card__row">🕘 <span>{d.hours}</span></p>}
            <div className="contact-card__actions">
              <a href={d.url} target="_blank" rel="noreferrer" className="btn btn--small btn--ghost">Official page ↗</a>
              {onOpenChat && (
                <button type="button" className="btn btn--small btn--ghost" onClick={() => onOpenChat(d.id)}>
                  Ask the AI helper
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="contacts__more-title">More campus services</h2>
      <div className="csi-links__grid">
        {MORE_SERVICES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="csi-link-chip">
            <span aria-hidden="true">{s.icon}</span>{s.label}
          </a>
        ))}
      </div>
    </div>
  )
}
