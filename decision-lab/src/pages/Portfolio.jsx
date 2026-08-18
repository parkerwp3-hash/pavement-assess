import PropertyCard from '../components/PropertyCard.jsx'
import { siteSummary } from '../lib/calc.js'
import { KPI, fmtInt, fmtMoney } from '../components/ui.jsx'

export default function Portfolio({ sites, onOpenSite, onUpdateSite }) {
  const rows = sites.map((site) => ({ site, m: siteSummary(site) }))
  const totalPaved = rows.reduce((a, r) => a + r.m.pavedSF, 0)
  const totalInvest = rows.reduce((a, r) => a + r.m.invest, 0)

  // Starred sites first, then by identified need — the walk-in ordering.
  const ordered = [...sites].sort(
    (a, b) =>
      Number(Boolean(b.starred)) - Number(Boolean(a.starred)) ||
      siteSummary(b).invest - siteSummary(a).invest,
  )

  function toggleStar(id) {
    const site = sites.find((s) => s.id === id)
    if (site) onUpdateSite({ ...site, starred: !site.starred })
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <span className="page-mark" aria-hidden="true">◈</span>
        <div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>My Portfolio</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            All Sites <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>({sites.length})</span>
          </h1>
        </div>
      </div>

      <div className="grid grid--kpi">
        <KPI label="Sites" value={sites.length} sub="assessed" />
        <KPI label="Total Paved SF" value={fmtInt(totalPaved)} sub="asphalt + concrete" />
        <KPI label="Identified Investment" value={fmtMoney(totalInvest)} sub="imported customer pricing" />
      </div>

      <h2 className="section-title">Sites</h2>
      <div className="grid grid--cards">
        {ordered.map((site) => (
          <PropertyCard key={site.id} site={site} onOpen={onOpenSite} onToggleStar={toggleStar} />
        ))}
      </div>
    </>
  )
}
