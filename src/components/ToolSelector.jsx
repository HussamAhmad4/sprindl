const TOOLS = [
  {
    id: 'deals',
    icon: '🛍️',
    title: 'Deal Finder',
    subtitle: 'Laptops, software & gear',
    description: 'Tell Navi what you need and your budget. Get specific model recommendations with student discounts and live price links.',
    accent: '#818cf8',
    glow: 'rgba(129,140,248,0.18)',
  },
  {
    id: 'campus',
    icon: '🎓',
    title: 'Campus Finder',
    subtitle: 'Programs at your school',
    description: 'Find tutoring, scholarships, clubs, career programs, food pantries, and more at your specific campus.',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.18)',
  },
  {
    id: 'resources',
    icon: '🧭',
    title: 'Resource Guide',
    subtitle: 'Benefits & financial aid',
    description: 'Navigate FAFSA, student loan help, SNAP, healthcare, mental health, and 25+ more programs for students.',
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.18)',
  },
]

export default function ToolSelector({ onSelect }) {
  return (
    <div className="tool-selector">
      <div className="tool-selector__hero">
        <div className="hero-badge">Student Command Center</div>
        <h1 className="hero-title">
          What are you<br />
          <span className="hero-title--gradient">looking for today?</span>
        </h1>
        <p className="hero-sub">
          AI-powered tools built for students — find deals, campus programs, and financial resources in seconds.
        </p>
      </div>
      <div className="tool-grid">
        {TOOLS.map((tool, i) => (
          <button
            key={tool.id}
            className="tool-card"
            style={{ '--card-accent': tool.accent, '--card-glow': tool.glow, animationDelay: `${i * 0.08}s` }}
            onClick={() => onSelect(tool.id)}
          >
            <span className="tool-card__icon">{tool.icon}</span>
            <div className="tool-card__body">
              <h2 className="tool-card__title">{tool.title}</h2>
              <p className="tool-card__sub">{tool.subtitle}</p>
              <p className="tool-card__desc">{tool.description}</p>
            </div>
            <span className="tool-card__arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
