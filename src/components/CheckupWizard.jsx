import { useEffect, useMemo, useState } from 'react'
import { QUESTIONS } from '../checkup/questions.js'
import { RULES } from '../checkup/rules.js'
import { evaluate, fmtUSD } from '../checkup/engine.js'
import { saveProfile } from '../checkup/profile.js'

const SITE_URL = 'https://hussamahmad4.github.io/sprindl/'

function ProgramCard({ rule, onAskNavi }) {
  return (
    <div className="checkup-card">
      <div className="checkup-card__top">
        <div>
          <h3 className="checkup-card__name">{rule.name}</h3>
          <p className="checkup-card__org">{rule.org}</p>
        </div>
        <span className="checkup-card__value">{rule.estimatedValue.display}</span>
      </div>
      <p className="checkup-card__why">{rule.why}</p>
      {rule.missingInfo && (
        <p className="checkup-card__missing">Depends on: {rule.missingInfo.join(', ')}</p>
      )}
      <p className="checkup-card__how">{rule.howToApply}</p>
      <div className="checkup-card__actions">
        <a href={rule.link} target="_blank" rel="noreferrer" className="btn btn--small">Official site ↗</a>
        <button type="button" className="btn btn--small btn--ghost" onClick={() => onAskNavi(rule.name)}>
          Ask Sprindl about this
        </button>
      </div>
    </div>
  )
}

export default function CheckupWizard({ onBack, onAskNavi }) {
  const [answers, setAnswers] = useState({})
  const [step, setStep] = useState(0)
  const [shared, setShared] = useState(false)
  const done = step >= QUESTIONS.length
  const results = useMemo(() => (done ? evaluate(answers, RULES) : null), [done, answers])

  // Remember the profile so chat modes can personalize without re-asking.
  useEffect(() => { if (done) saveProfile(answers) }, [done, answers])

  const restart = () => { setAnswers({}); setStep(0) }

  const shareResults = async () => {
    const { totals } = results
    const text = totals.potentialMax > 0
      ? `I just found ${fmtUSD(totals.eligibleMin)}–${fmtUSD(totals.potentialMax)}/year in student benefits I might be missing 💸 Run your own free checkup:`
      : 'I just ran a free student benefit checkup on Sprindl — see what you might be missing:'
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Sprindl Benefit Checkup', text, url: SITE_URL })
      } else {
        await navigator.clipboard.writeText(`${text} ${SITE_URL}`)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch { /* user dismissed the share sheet */ }
  }

  if (!done) {
    const q = QUESTIONS[step]
    const pick = (value) => {
      setAnswers((a) => ({ ...a, [q.field]: value }))
      setStep((s) => s + 1)
    }
    return (
      <div className="checkup">
        <button type="button" className="checkup__back" onClick={() => (step === 0 ? onBack() : setStep(step - 1))}>
          ← Back
        </button>
        <div className="checkup__progress" role="progressbar" aria-valuenow={step} aria-valuemax={QUESTIONS.length}>
          <div className="checkup__progress-fill" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
        <p className="checkup__count">Question {step + 1} of {QUESTIONS.length}</p>
        <h2 className="checkup__question">{q.question}</h2>
        <div className="checkup__options">
          {q.options.map((o) => (
            <button key={String(o.value)} type="button" className="checkup__option" onClick={() => pick(o.value)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const { eligible, maybe, totals } = results
  const hasMoney = totals.potentialMax > 0

  return (
    <div className="checkup checkup--results">
      <button type="button" className="checkup__back" onClick={onBack}>← Home</button>
      <h2 className="checkup__results-title">Your Benefit Checkup</h2>
      {hasMoney ? (
        <>
          <p className="checkup__total">
            {fmtUSD(totals.eligibleMin)} – {fmtUSD(totals.potentialMax)}
            <span className="checkup__total-period">/year</span>
          </p>
          <p className="checkup__total-caption">estimated benefits you may be leaving on the table</p>
        </>
      ) : (
        <p className="checkup__total-caption">
          Based on your answers we didn't find cash benefits, but check the programs below — and try the chat tools for scholarships and deals.
        </p>
      )}

      {eligible.length > 0 && (
        <>
          <h3 className="checkup__section">Likely eligible ({eligible.length})</h3>
          {eligible.map((r) => <ProgramCard key={r.id} rule={r} onAskNavi={onAskNavi} />)}
        </>
      )}
      {maybe.length > 0 && (
        <>
          <h3 className="checkup__section">Worth checking ({maybe.length})</h3>
          {maybe.map((r) => <ProgramCard key={r.id} rule={r} onAskNavi={onAskNavi} />)}
        </>
      )}

      <p className="checkup__disclaimer">
        These are estimates based on published program criteria — not a guarantee of eligibility.
        Amounts vary by situation. Always verify with the official program before making decisions.
      </p>
      <div className="checkup__footer-actions">
        <button type="button" className="btn btn--primary btn--small" onClick={shareResults}>
          {shared ? 'Link copied ✓' : 'Share results ↗'}
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={restart}>Retake checkup</button>
      </div>
    </div>
  )
}
