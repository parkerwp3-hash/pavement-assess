import { siteSummary } from '../lib/calc.js'
import { KPI, fmtInt, fmtMoney } from '../components/ui.jsx'

export default function Portfolio({ sites, onOpenSite }) {
  const rows = sites.map((site) => ({ site, m: siteSummary(site) }))
  const totalPaved = rows.reduce((a, r) => a + r.m.pavedSF, 0)
  const totalInvest = rows.reduce((a, r) => a + r.m.invest, 0)

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
        {rows.map(({ site, m }) => (
          <button key={site.id} className="sitecard" onClick={() => onOpenSite(site.id)}>
            <span className="sitecard-name">{site.name}</span>
            <span className="sitecard-meta">
              {site.id} · {site.region} · {site.facilityType} · {site.climateZone}
            </span>
            <span className="sitecard-stats">
              <span><b>{fmtMoney(m.invest)}</b>identified</span>
              <span><b>{m.zoneCount}</b>repair zones</span>
              <span><b>{fmtInt(m.pavedSF)}</b>paved SF</span>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
