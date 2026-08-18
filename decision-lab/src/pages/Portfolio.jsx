import { useMemo, useState } from 'react'
import { PORTFOLIO_META } from '../lib/seed.js'
import {
  BANDS,
  allPackages,
  budgetScenario,
  fiveYearInvestment,
  labelize,
  portfolioRollups,
  siteMetrics,
} from '../lib/calc.js'
import { BAND_COLOR, Cols, HBar, SERVICE_COLOR, SegBar } from '../components/charts.jsx'
import { BandChip, KPI, Prov, fmtInt, fmtMoney, fmtPct } from '../components/ui.jsx'

const BUDGET_PRESETS = [25e6, 35e6, 50e6]

export default function Portfolio({ sites, assumptions: A, onOpenSite }) {
  const [budgetChoice, setBudgetChoice] = useState(25e6)
  const [customM, setCustomM] = useState(30)
  const [isCustom, setIsCustom] = useState(false)

  const metrics = useMemo(() => sites.map((s) => ({ site: s, m: siteMetrics(s, A) })), [sites, A])
  const roll = useMemo(() => portfolioRollups(sites, A), [sites, A])
  const packages = useMemo(
    () => allPackages(sites, A).sort((a, b) => b.score - a.score),
    [sites, A],
  )

  const budget = isCustom ? customM * 1e6 : budgetChoice
  const scenario = useMemo(() => budgetScenario(sites, A, budget), [sites, A, budget])

  const totalPaved = metrics.reduce((a, x) => a + x.m.pavedSF, 0)
  const totalInvest = metrics.reduce((a, x) => a + x.m.invest, 0)
  const totalStructural = metrics.reduce((a, x) => a + x.m.structuralSF, 0)
  const totalAsphalt = sites.reduce((a, s) => a + s.asphaltSF, 0)
  const highPrioritySites = metrics.filter((x) => x.m.band >= 2).length
  const preservationSites = metrics.filter((x) => x.m.isPreservation).length
  const fiveYear = fiveYearInvestment(sites, A)
  const assessedPct =
    (totalPaved / (totalPaved + PORTFOLIO_META.estimatedUnassessedPavedSF)) * 100
  const highConfValue = roll.confidenceValue[0]
  const confidencePct = totalInvest ? (highConfValue / totalInvest) * 100 : 0

  const fundedIds = new Set(scenario.funded.map((r) => r.pkg.id))

  // Scenario spend rollups (funded packages only)
  const scenarioByService = (() => {
    const map = new Map()
    for (const row of scenario.funded) {
      for (const z of row.site.repairZones.filter((z) => row.pkg.repairZoneIds.includes(z.id))) {
        map.set(z.service, (map.get(z.service) || 0) + z.currentCustomerPrice)
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  })()
  const scenarioByYear = (() => {
    const map = new Map()
    for (const row of scenario.funded) {
      map.set(row.pkg.recommendedYear, (map.get(row.pkg.recommendedYear) || 0) + row.price)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  })()

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <span className="page-mark" aria-hidden="true">◈</span>
        <div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>My Portfolio</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            Portfolio Overview <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>({sites.length})</span>
          </h1>
        </div>
      </div>

      <div className="grid grid--kpi">
        <KPI label="Sites Assessed" prov="observed" value={sites.length}
          sub={`of ${PORTFOLIO_META.totalSitesInPortfolio} portfolio sites`} />
        <KPI label="Total Paved SF" prov="observed" value={fmtInt(totalPaved)} sub="asphalt + concrete, assessed sites" />
        <KPI label="Current Identified Investment" prov="observed" value={fmtMoney(totalInvest)}
          sub="imported customer pricing" />
        <KPI label="Structural Repair SF" prov="derived" value={fmtInt(totalStructural)}
          sub="full-depth & reconstruction areas" />
        <KPI label="Structural Repair Burden" prov="derived"
          value={fmtPct((totalStructural / Math.max(1, totalAsphalt)) * 100)}
          sub="structural SF ÷ total asphalt SF" />
        <KPI label="High-Priority Sites" prov="modeled" value={highPrioritySites}
          sub="condition band Poor or Critical" />
        <KPI label="Preservation Candidates" prov="modeled" value={preservationSites}
          sub="low burden, high sealcoat share" />
        <KPI label="5-Year Recommended Investment" prov="modeled" value={fmtMoney(fiveYear)}
          sub={`current prices inflated at ${A.inflationPct}%/yr`} />
        <KPI label="Portfolio Assessed" prov="derived" value={fmtPct(assessedPct, 0)}
          sub="by paved SF, incl. unassessed estimate" />
        <KPI label="Confidence Coverage" prov="derived" value={fmtPct(confidencePct, 0)}
          sub="identified $ in high-confidence zones" />
      </div>

      <h2 className="section-title">Condition & Spend</h2>
      <div className="grid grid--charts">
        <div className="card">
          <div className="card-title">Condition Distribution (paved SF) <Prov k="modeled" /></div>
          <SegBar
            segs={BANDS.map((b, i) => ({ label: b.short, value: roll.conditionSF[i], color: BAND_COLOR[i] }))}
            format={fmtInt}
          />
          <p className="chart-note">Band thresholds are editable in the Model Lab.</p>
        </div>
        <div className="card">
          <div className="card-title">Confidence Coverage (identified $) <Prov k="derived" /></div>
          <SegBar
            segs={[
              { label: 'High', value: roll.confidenceValue[0], color: 'var(--good)' },
              { label: 'Moderate', value: roll.confidenceValue[1], color: 'var(--fair)' },
              { label: 'Low', value: roll.confidenceValue[2], color: 'var(--poor)' },
            ]}
            format={fmtMoney}
          />
          <p className="chart-note">Confidence is assigned per zone at assessment time.</p>
        </div>
        <div className="card">
          <div className="card-title">Spend by Service <Prov k="observed" /></div>
          <HBar
            rows={roll.byService.map(([k, v]) => ({ label: labelize(k), value: v, color: SERVICE_COLOR[k] }))}
            format={fmtMoney}
          />
        </div>
        <div className="card">
          <div className="card-title">Spend by Region <Prov k="observed" /></div>
          <HBar rows={roll.byRegion.map(([k, v]) => ({ label: k, value: v }))} format={fmtMoney} />
        </div>
        <div className="card">
          <div className="card-title">Spend by Risk Category <Prov k="observed" /></div>
          <HBar rows={roll.byRisk.map(([k, v]) => ({ label: labelize(k), value: v }))} format={fmtMoney} />
          <p className="chart-note">Attributed to each zone's primary risk tag, so totals sum to the identified investment.</p>
        </div>
        <div className="card">
          <div className="card-title">Spend by Recommended Year <Prov k="observed" /></div>
          <Cols rows={roll.byYear.map(([k, v]) => ({ label: String(k), value: v }))} format={fmtMoney} />
        </div>
      </div>

      <h2 className="section-title">
        Budget Scenario <Prov k="modeled" />
      </h2>
      <div className="card stack">
        <div className="field-row">
          <label>Capital budget:</label>
          <div className="seg" role="group" aria-label="Budget presets">
            {BUDGET_PRESETS.map((b) => (
              <button key={b} aria-pressed={!isCustom && budgetChoice === b}
                onClick={() => { setIsCustom(false); setBudgetChoice(b) }}>
                ${b / 1e6}M
              </button>
            ))}
            <button aria-pressed={isCustom} onClick={() => setIsCustom(true)}>Custom</button>
          </div>
          {isCustom ? (
            <span className="field-row">
              <input className="input input--num" type="number" min="1" max="200" value={customM}
                onChange={(e) => setCustomM(Number(e.target.value) || 0)} aria-label="Custom budget in millions" />
              <label>$M</label>
            </span>
          ) : null}
          <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>
            Selection: {A.budgetMethod === 'priority' ? 'priority-score order' : A.budgetMethod === 'worst_first' ? 'worst condition first' : 'score-per-dollar'} (Model Lab)
          </span>
        </div>

        <div className="grid grid--kpi">
          <KPI label="Packages Funded" prov="modeled" value={`${scenario.funded.length} / ${packages.length}`} />
          <KPI label="Sites Addressed" prov="modeled" value={scenario.sitesAddressed} />
          <KPI label="Paved SF Addressed" prov="modeled" value={fmtInt(scenario.pavedSFAddressed)} />
          <KPI label="High-Priority Funded" prov="modeled" value={scenario.highFunded}
            sub={`${scenario.highRemaining} high-priority remaining`} />
          <KPI label="Identified Need Funded" prov="modeled" value={fmtMoney(scenario.needFunded)} />
          <KPI label="Identified Need Remaining" prov="modeled" value={fmtMoney(scenario.needRemaining)}
            sub="known work left unfunded" />
        </div>

        <div className="grid grid--2">
          <div>
            <div className="card-title">Scenario Spend by Service</div>
            <HBar
              rows={scenarioByService.map(([k, v]) => ({ label: labelize(k), value: v, color: SERVICE_COLOR[k] }))}
              format={fmtMoney}
            />
          </div>
          <div>
            <div className="card-title">Scenario Spend by Year</div>
            <Cols rows={scenarioByYear.map(([k, v]) => ({ label: String(k), value: v }))} format={fmtMoney} />
          </div>
        </div>
        <p className="chart-note">
          Funding order and totals are planning outputs from adjustable assumptions. This scenario does not
          predict a resulting pavement-condition score.
        </p>
      </div>

      <h2 className="section-title">Top-Priority Sites</h2>
      <div className="card tablewrap">
        <table>
          <thead>
            <tr>
              <th>Site</th><th>Region</th><th>Condition</th>
              <th className="num">Burden %</th><th className="num">Crack Density</th>
              <th className="num">Identified Need</th><th className="num">Need / SF</th>
            </tr>
          </thead>
          <tbody>
            {[...metrics].sort((a, b) => b.m.band - a.m.band || b.m.invest - a.m.invest).map(({ site, m }) => (
              <tr key={site.id}>
                <td><button className="rowlink" onClick={() => onOpenSite(site.id)}>{site.name}</button></td>
                <td>{site.region}</td>
                <td><BandChip band={m.band} overridden={m.overridden} /></td>
                <td className="num">{fmtPct(m.burdenPct)}</td>
                <td className="num">{m.crackDensity.toFixed(0)} LF/kSF</td>
                <td className="num">{fmtMoney(m.invest)}</td>
                <td className="num">${m.needPerSF.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Project Packages ({packages.length})</h2>
      <div className="card tablewrap">
        <table>
          <thead>
            <tr>
              <th>Package</th><th>Site</th><th>Name</th><th className="num">Year</th>
              <th className="num">Priority Score</th><th className="num">Current Price</th>
              <th>In ${isCustom ? customM : budget / 1e6}M Scenario</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((row) => (
              <tr key={row.pkg.id}>
                <td><button className="rowlink" onClick={() => onOpenSite(row.site.id)}>{row.pkg.id}</button></td>
                <td>{row.site.name}</td>
                <td style={{ whiteSpace: 'normal' }}>{row.pkg.name}</td>
                <td className="num">{row.pkg.recommendedYear}</td>
                <td className="num">{row.score}</td>
                <td className="num">{fmtMoney(row.price)}</td>
                <td>{fundedIds.has(row.pkg.id)
                  ? <span className="sev sev--low">FUNDED</span>
                  : <span className="sev sev--severe">UNFUNDED</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Sites</h2>
      <div className="grid grid--cards">
        {metrics.map(({ site, m }) => (
          <button key={site.id} className="sitecard" onClick={() => onOpenSite(site.id)}>
            <span className="sitecard-name">{site.name}</span>
            <span className="sitecard-meta">
              {site.id} · {site.region} · {site.facilityType} · {site.climateZone}
            </span>
            <BandChip band={m.band} overridden={m.overridden} />
            <span className="sitecard-stats">
              <span><b>{fmtMoney(m.invest)}</b>identified</span>
              <span><b>{fmtPct(m.burdenPct)}</b>burden</span>
              <span><b>{fmtInt(m.pavedSF)}</b>paved SF</span>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
