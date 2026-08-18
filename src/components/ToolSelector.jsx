import { useMemo, useRef, useState } from 'react'
import { FEATURED_DEALS, dailyFeatured } from '../data/featuredDeals.js'

const TOOLS = [
  { mode: 'deals', icon: '🛍️', label: 'Deal Finder', desc: 'Student discounts on tech, software & subscriptions', accent: '#14418f', glow: 'rgba(20,65,143,0.12)', badge: null },
  { mode: 'campus', icon: '🎓', label: 'CSI Campus Guide', desc: 'Tutoring, scholarships, SEEK, ASAP, the food pantry & every CUNY program — as they apply at CSI', accent: '#8a1e41', glow: 'rgba(138,30,65,0.10)', badge: 'CSI' },
  { mode: 'opportunities', icon: '🚀', label: 'Student Opportunities', desc: 'Paid internships, scholarships, research programs & fellowships', accent: '#0e7490', glow: 'rgba(14,116,144,0.10)', badge: null },
  { mode: 'resources', icon: '🧭', label: 'Resource Guide', desc: 'FAFSA, SNAP, Medicaid, mental health, legal aid — 40+ verified programs', accent: '#0f766e', glow: 'rgba(15,118,110,0.10)', badge: null },
]

const CSI_QUICK_LINKS = [
  { icon: '🎓', label: 'CUNYfirst', url: 'https://home.cunyfirst.cuny.edu/' },
  { icon: '📖', label: 'Brightspace', url: 'https://brightspace.cuny.edu/' },
  { icon: '💰', label: 'Financial Aid', url: 'https://www.csi.cuny.edu/admissions/paying-college/financial-aid' },
  { icon: '📚', label: 'Tutoring', url: 'https://www.csi.cuny.edu/students/tutoring' },
  { icon: '🏛️', label: 'Library', url: 'https://www.library.csi.cuny.edu/' },
  { icon: '🖥️', label: 'Tech Help Desk', url: 'https://www.csi.cuny.edu/students/technology-help-desk' },
  { icon: '🧭', label: 'Academic Advisement', url: 'https://www.csi.cuny.edu/students/academic-advisement' },
  { icon: '💼', label: 'Career Center', url: 'https://www.csi.cuny.edu/campus-life/student-services/center-career-and-professional-development' },
  { icon: '💚', label: 'Counseling', url: 'https://www.csi.cuny.edu/students/counseling-center' },
  { icon: '🗂️', label: 'Registrar', url: 'https://www.csi.cuny.edu/students/registrar' },
  { icon: '🩺', label: 'Health & Wellness', url: 'https://www.csi.cuny.edu/campus-life/student-services/health-and-wellness-services' },
  { icon: '♿', label: 'Accessibility Services', url: 'https://www.csi.cuny.edu/campus-life/office-accessibility-services' },
  { icon: '🎖️', label: 'Veterans Support', url: 'https://www.csi.cuny.edu/admissions/applying-csi/veterans' },
  { icon: '🎉', label: 'Student Involvement', url: 'https://www.csi.cuny.edu/campus-life/student-involvement' },
  { icon: '🐬', label: 'CSI Athletics', url: 'https://csidolphins.com/' },
  { icon: '🔎', label: 'CUNY Class Search', url: 'https://globalsearch.cuny.edu/CFGlobalSearchTool/search.jsp' },
]

const ROTATING_WORDS = ['scholarships', 'FAFSA & TAP help', 'paid internships', 'student discounts', 'campus programs']

export default function ToolSelector({ onSelect, onCheckup, onContacts }) {
  const [dealFilter, setDealFilter] = useState('All')

  // Daily-rotating featured strip: a different mix of deals & opportunities each day
  const featured = useMemo(() => dailyFeatured(FEATURED_DEALS, 14), [])
  const dealCategories = useMemo(() => ['All', ...new Set(featured.map((d) => d.tag))], [featured])
  const filteredDeals = dealFilter === 'All' ? featured : featured.filter((d) => d.tag === dealFilter)

  // Edge-hover auto-scroll: mouse near the right edge scrolls right, near the left scrolls left
  const scrollRef = useRef(null)
  const rafRef = useRef(null)
  const speedRef = useRef(0)

  const stepScroll = () => {
    const el = scrollRef.current
    if (!el || speedRef.current === 0) { rafRef.current = null; return }
    el.scrollLeft += speedRef.current
    rafRef.current = requestAnimationFrame(stepScroll)
  }

  const handleStripMove = (e) => {
    const el = scrollRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (x > 0.72) speedRef.current = (x - 0.72) * 22
    else if (x < 0.28) speedRef.current = -(0.28 - x) * 22
    else speedRef.current = 0
    if (speedRef.current !== 0 && !rafRef.current) rafRef.current = requestAnimationFrame(stepScroll)
  }

  const handleStripLeave = () => {
    speedRef.current = 0
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

  return (
    <div className="home">
      <div className="home__gradient-bg" aria-hidden="true" />
      <div className="home__wordmark wordmark" aria-label="Sprindl">sprindl<span className="wordmark__dot">.</span></div>
      <div className="home__hero">
        <span className="home__badge">For College of Staten Island Students</span>
        <h1 className="home__title">
          Your CSI shortcut to<br />
          <span className="word-rotator" aria-hidden="true">
            <span className="word-rotator__track">
              {ROTATING_WORDS.map((w) => <span key={w}>{w}</span>)}
              <span>{ROTATING_WORDS[0]}</span>
            </span>
          </span>
          <span className="sr-only">scholarships, FAFSA and TAP help, paid internships, student discounts, and campus programs</span>
        </h1>
        <p className="home__subtitle">One place to find money, campus programs, CUNY benefits, and real CSI office contacts — through plain-English conversation.</p>
      </div>

      <button type="button" className="checkup-banner" onClick={onCheckup}>
        <span className="checkup-banner__icon" aria-hidden="true">💰</span>
        <span className="checkup-banner__text">
          <strong>Benefit Checkup</strong>
          <span>8 quick questions — see how much money you might be leaving on the table</span>
        </span>
        <span className="checkup-banner__cta">Start →</span>
      </button>

      <div className="deal-filter-strip" aria-label="Filter deals">
        {dealCategories.map((cat) => (
          <button key={cat} type="button" className={`deal-filter-btn${dealFilter === cat ? ' deal-filter-btn--active' : ''}`} onClick={() => setDealFilter(cat)}>{cat}</button>
        ))}
      </div>

      <div className="featured-strip" aria-label="Featured deals and opportunities — updated daily">
        <span className="featured-strip__label">⚡ Today's picks</span>
        <div className="featured-strip__viewport" onMouseMove={handleStripMove} onMouseLeave={handleStripLeave}>
          <div className="featured-strip__fade featured-strip__fade--left" aria-hidden="true" />
          <div className="featured-strip__fade featured-strip__fade--right" aria-hidden="true" />
          <div className="featured-strip__scroll" ref={scrollRef}>
            {filteredDeals.map((deal) => (
              <a key={deal.label} href={deal.url} target="_blank" rel="noreferrer" className={`featured-chip${deal.tag === 'CUNY' ? ' featured-chip--cuny' : ''}`} title={deal.desc}>
                {deal.label}<span className="featured-chip__tag">{deal.tag}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="csi-links" aria-label="CSI quick links">
        <span className="csi-links__label">🐬 CSI Quick Links</span>
        <div className="csi-links__grid">
          {CSI_QUICK_LINKS.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="csi-link-chip">
              <span aria-hidden="true">{l.icon}</span>{l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="tool-grid">
        {TOOLS.map((tool, i) => (
          <button key={tool.mode} type="button" className="tool-card" style={{'--card-accent': tool.accent, '--card-glow': tool.glow, '--delay': `${i * 0.08}s`}} onClick={() => onSelect(tool.mode)}>
            {tool.badge && <span className="tool-card__badge">{tool.badge}</span>}
            <span className="tool-card__icon">{tool.icon}</span>
            <h2 className="tool-card__label">{tool.label}</h2>
            <p className="tool-card__desc">{tool.desc}</p>
            <span className="tool-card__cta">Chat now →</span>
          </button>
        ))}
        <button type="button" className="tool-card" style={{'--card-accent': '#365a9b', '--card-glow': 'rgba(54,90,155,0.10)', '--delay': '0.32s'}} onClick={onContacts}>
          <span className="tool-card__badge">Help</span>
          <span className="tool-card__icon">📇</span>
          <h2 className="tool-card__label">Help &amp; Contacts</h2>
          <p className="tool-card__desc">Real CSI office emails, phones &amp; locations — financial aid, FAFSA school code, registrar, counseling &amp; more</p>
          <span className="tool-card__cta">Open directory →</span>
        </button>
      </div>
    </div>
  )
}
