export const FEATURED_DEALS = [
    // ── Student Tech & Software ───────────────────────────────────────────────
  { label: '🎁 GitHub Student Pack', desc: 'Free developer tools worth $200k+', url: 'https://education.github.com/pack', tag: 'Free' },
  { label: '🎵 Spotify + Hulu', desc: '$5.99/mo for students', url: 'https://www.spotify.com/us/student/', tag: '$5.99/mo' },
  { label: '💻 Adobe CC', desc: '60% off for students', url: 'https://www.adobe.com/creativecloud/buy/students.html', tag: '60% off' },
  { label: '🛒 Amazon Prime', desc: '6-month free trial + 50% off', url: 'https://www.amazon.com/joinstudent', tag: 'Free trial' },
  { label: '📐 Notion', desc: 'Free for students & educators', url: 'https://www.notion.so/product/notion-for-education', tag: 'Free' },
  { label: '🖥️ Microsoft 365', desc: 'Free Office suite with .edu email', url: 'https://www.microsoft.com/en-us/education/students', tag: 'Free' },
  { label: '🔒 NordVPN', desc: 'Up to 67% off student discount', url: 'https://nordvpn.com/student-discount/', tag: '67% off' },
  { label: '📚 Chegg Study', desc: '$9.95/mo for students (vs $19.95)', url: 'https://www.chegg.com/study', tag: '$9.95/mo' },
  { label: '🎨 Canva Pro', desc: 'Free for students & teachers', url: 'https://www.canva.com/education/', tag: 'Free' },
  { label: '🎮 Apple Music', desc: '$5.99/mo student plan', url: 'https://music.apple.com/subscribe', tag: '$5.99/mo' },
  { label: '🖱️ Figma', desc: 'Free for students with .edu email', url: 'https://www.figma.com/education/', tag: 'Free' },
  { label: '🛡️ LastPass', desc: 'Free password manager for students', url: 'https://www.lastpass.com/labs/students', tag: 'Free' },
    // ── CUNY-Specific Opportunities ───────────────────────────────────────────
  { label: '🏫 CUNY ASAP', desc: 'Free tuition, metro card & textbooks', url: 'https://www.cuny.edu/academics/academic-programs/asap/', tag: 'CUNY' },
  { label: '🎓 CUNY Scholarships', desc: 'Search all CUNY scholarship programs', url: 'https://www.cuny.edu/financial-aid/scholarships/', tag: 'CUNY' },
  { label: '💼 CUNY Internships', desc: 'Paid internship portal for CUNY students', url: 'https://www.cuny.edu/current-students/student-affairs/student-services/career-services/', tag: 'CUNY' },
  { label: '📖 CUNY SPS Online', desc: 'Flexible online degrees & certificates', url: 'https://sps.cuny.edu/', tag: 'CUNY' },
    // ── Student Career & Internships ──────────────────────────────────────────
  { label: '💼 Handshake', desc: 'Free student job & internship platform', url: 'https://joinhandshake.com/', tag: 'Free' },
  { label: '🌐 LinkedIn Premium', desc: '6 months free via GitHub Student Pack', url: 'https://education.github.com/pack', tag: 'Free' },
  { label: '📜 Coursera', desc: 'Free courses via CUNY & university access', url: 'https://www.coursera.org/for-universities', tag: 'Free' },
    // ── Opportunities & Money ─────────────────────────────────────────────────
  { label: '🔬 NSF REU', desc: 'Paid summer research for undergrads', url: 'https://www.nsf.gov/crssprgm/reu/', tag: 'Paid' },
  { label: '🗽 NYC SYEP', desc: 'Paid NYC summer jobs for ages 14–24', url: 'https://www.nyc.gov/site/dycd/services/jobs-internships/summer-youth-employment-program-syep.page', tag: 'Paid' },
  { label: '🪜 Ladders for Leaders', desc: 'Paid professional NYC internships', url: 'https://www.nyc.gov/site/dycd/services/jobs-internships/ladders-for-leaders.page', tag: 'Paid' },
  { label: '💻 CodePath', desc: 'Free tech courses + career support', url: 'https://www.codepath.org/', tag: 'Free' },
  { label: '🌈 ColorStack', desc: 'Community + career help for Black & Latinx CS students', url: 'https://www.colorstack.org/', tag: 'Free' },
  { label: '🤖 Break Through Tech AI', desc: 'Free AI/ML program with industry projects', url: 'https://www.breakthroughtech.org/programs/the-ai-program/', tag: 'Free' },
  { label: '🎫 Fair Fares NYC', desc: 'Half-price subway & bus rides', url: 'https://www.nyc.gov/site/fairfares/index.page', tag: 'NYC' },
  { label: '🍎 SNAP for Students', desc: 'Monthly grocery money — many students qualify', url: 'https://www.fns.usda.gov/snap/students', tag: 'Benefits' },
  { label: '📝 FAFSA', desc: 'Unlock federal grants & work-study', url: 'https://studentaid.gov/h/apply-for-aid/fafsa', tag: 'Money' },
  { label: '🗂️ TAP (NY State)', desc: 'Up to $5,665/yr for NY students', url: 'https://www.hesc.ny.gov/find-aid/nys-grants-scholarships/tuition-assistance-program', tag: 'Money' },
  ]

// Rotate the strip daily: a date-seeded shuffle means students see a different
// mix each day without any backend. (Deterministic per day — stable within a visit.)
export function dailyFeatured(pool = FEATURED_DEALS, count = 12, date = new Date()) {
  const seedBase = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  let seed = seedBase
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

