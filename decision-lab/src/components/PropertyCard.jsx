import { issueCounts, pciTone, siteSummary } from '../lib/calc.js'
import { fmtDate, fmtInt, fmtMoney } from './ui.jsx'

const SEV_FILL = {
  severe: 'rgba(161, 43, 49, 0.5)',
  moderate: 'rgba(173, 90, 28, 0.45)',
  low: 'rgba(37, 107, 69, 0.4)',
}

/** Non-interactive minimap: the site's real zones, not a decorative fake. */
function ZoneThumb({ site }) {
  const [bx, by, bw, bh] = site.layout?.building || [0.6, 0.1, 0.3, 0.25]
  return (
    <svg viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true" className="thumb-svg">
      <rect width="100" height="42" fill="#a7b795" />
      <rect x="3" y="2.5" width="94" height="37" fill="#c9cdc9" />
      <rect x={bx * 100} y={by * 42} width={bw * 100} height={bh * 42} fill="#8f959e" />
      {site.repairZones.map((z) => (
        <polygon
          key={z.id}
          points={z.geometry.map(([x, y]) => `${x * 100},${y * 42}`).join(' ')}
          fill={SEV_FILL[z.severity] || SEV_FILL.moderate}
          stroke="#ffffff"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  )
}

export default function PropertyCard({ site, onOpen, onToggleStar }) {
  const m = siteSummary(site)
  const tone = pciTone(site.pci)
  const issues = issueCounts(site)
  const hasBudget = Number.isFinite(site.budget) && site.budget > 0
  const delta = hasBudget ? m.invest - site.budget : 0
  const isOver = delta > 0
  const fillPct = hasBudget ? Math.min((m.invest / site.budget) * 100, 100) : 0

  return (
    <article className="property-card">
      <div className="image-wrap">
        {site.mapImage ? (
          <img src={site.mapImage} alt={`${site.name} site map`} />
        ) : (
          <ZoneThumb site={site} />
        )}
        <button
          type="button"
          className={site.starred ? 'star-button on' : 'star-button'}
          aria-pressed={Boolean(site.starred)}
          aria-label={site.starred ? `Unstar ${site.name}` : `Star ${site.name}`}
          onClick={() => onToggleStar(site.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3z" />
          </svg>
        </button>
      </div>

      <div className="pcard-body">
        <div className="title-row">
          <div>
            <h3 className="pcard-name">{site.name}</h3>
            <p className="pcard-id">{site.id}</p>
            <p className="pcard-addr">
              {site.region} · {site.facilityType} · {site.climateZone}
            </p>
          </div>
        </div>

        <div className="pcard-divider" />

        <div className="summary-grid">
          <div className="pci-block">
            <div
              className="pci-gauge"
              style={{ '--pci': `${site.pci ?? 0}%`, '--pci-color': tone.cssVar }}
            >
              <div className="pci-inner">
                {site.pci != null ? (
                  <>
                    <strong>{site.pci}</strong>
                    <span>/100</span>
                  </>
                ) : (
                  <strong style={{ fontSize: 15, color: 'var(--ink-3)' }}>—</strong>
                )}
              </div>
            </div>
            <div>
              <div className="small-label">PCI Score</div>
              <div className="condition" style={{ color: tone.cssVar }}>{tone.label}</div>
              <div className="pcard-muted">{site.pci != null ? 'Condition' : 'awaiting score'}</div>
            </div>
          </div>

          <div className="metric">
            <span className="metric-label">Est. Remaining Life</span>
            <span className="metric-value">
              {site.remainingLifeYears != null ? `${site.remainingLifeYears} yrs` : '—'}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Last Service</span>
            <span className="metric-value">{fmtDate(site.lastService)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Next Due</span>
            <span className="metric-value">{fmtDate(site.nextDue)}</span>
          </div>
        </div>

        <div className="pcard-divider" />

        {hasBudget ? (
          <div className="budget-row">
            <span className="budget-label">Identified vs Budget</span>
            <span className="budget-number">
              {fmtMoney(m.invest)} <span>/ {fmtMoney(site.budget)}</span>
            </span>
            <div className="budget-bar">
              <div className={isOver ? 'budget-fill over' : 'budget-fill'} style={{ width: `${fillPct}%` }} />
            </div>
            <div className={isOver ? 'budget-delta negative' : 'budget-delta positive'}>
              {isOver ? '+' : ''}
              {fmtMoney(Math.abs(delta))} <span>{isOver ? 'over budget' : 'remaining'}</span>
            </div>
          </div>
        ) : (
          <p className="pcard-muted">No budget set · {fmtMoney(m.invest)} identified</p>
        )}

        <div className="pcard-divider" />

        <div className="issue-row" aria-label="Issue counts derived from repair zones">
          {issues.map((issue) => (
            <div
              key={issue.key}
              className={issue.count > 0 ? 'issue active' : 'issue'}
              style={{ '--issue-color': issue.cssVar }}
            >
              <span className="issue-count">{issue.count}</span>
              <span className="issue-label">{issue.label}</span>
            </div>
          ))}
        </div>

        <div className="pcard-actions">
          <button type="button" className="btn btn--primary" onClick={() => onOpen(site.id)}>
            View Property
          </button>
          <span className="pcard-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {m.zoneCount} zones · {fmtInt(m.pavedSF)} SF
          </span>
        </div>
      </div>
    </article>
  )
}
