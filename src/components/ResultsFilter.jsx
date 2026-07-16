const SORT_OPTIONS = [
  { value: 'default', label: 'Best match' },
  { value: 'price-asc', label: 'Lowest price' },
  { value: 'price-desc', label: 'Highest price' },
  { value: 'name', label: 'A – Z' },
]

export default function ResultsFilter({ sort, onChange, count }) {
  return (
    <div className="results-filter">
      <span className="results-filter__count">{count} result{count !== 1 ? 's' : ''}</span>
      <div className="results-filter__controls">
        <span className="results-filter__label">Sort:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`filter-chip ${sort === opt.value ? 'filter-chip--active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
