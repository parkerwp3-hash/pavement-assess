import { DEFAULT_ASSUMPTIONS } from '../lib/seed.js'
import { BANDS } from '../lib/calc.js'
import { Prov } from '../components/ui.jsx'

function Num({ value, onChange, min = 0, max = 100, step = 0.5, width, label }) {
  return (
    <input className="input input--num" type="number" value={value} min={min} max={max} step={step}
      style={width ? { width } : undefined} aria-label={label}
      onChange={(e) => onChange(Number(e.target.value))} />
  )
}

export default function ModelLab({ assumptions: A, onChange }) {
  const set = (patch) => onChange({ ...A, ...patch })
  const setDeep = (key, patch) => onChange({ ...A, [key]: { ...A[key], ...patch } })

  return (
    <>
      <div className="banner" role="note">
        ⚠ DEMO ASSUMPTIONS — NOT VALIDATED FOR CUSTOMER USE
      </div>

      <div className="grid grid--2" style={{ marginTop: 16 }}>
        <div className="card stack">
          <div className="card-title">Inflation & Repair Growth <Prov k="modeled" /></div>
          <div className="field-row">
            <label>Inflation</label>
            <Num value={A.inflationPct} onChange={(v) => set({ inflationPct: v })} max={20} label="Inflation percent per year" />
            <span>% / yr</span>
          </div>
          <div className="field-row">
            <label>Annual repair growth</label>
            <span>low</span>
            <Num value={A.growthPct.low} onChange={(v) => setDeep('growthPct', { low: v })} max={60} label="Low growth" />
            <span>base</span>
            <Num value={A.growthPct.base} onChange={(v) => setDeep('growthPct', { base: v })} max={60} label="Base growth" />
            <span>high</span>
            <Num value={A.growthPct.high} onChange={(v) => setDeep('growthPct', { high: v })} max={60} label="High growth" />
            <span>% / yr</span>
          </div>
          <div className="formula">{`projected_qty(y)   = quantity × (1 + growth)^y        (low / base / high)
projected_cost(y)  = projected_qty × unit_cost × (1 + inflation)^y
unit_cost          = currentCustomerPrice ÷ quantity   (imported price is never recomputed)`}</div>
          <p className="chart-note">
            Applied only to zones Diamond flagged with a growth profile. Results always render as a range —
            the app never claims a single guaranteed future number, and never draws a future footprint on the map.
          </p>
        </div>

        <div className="card stack">
          <div className="card-title">Condition Band Thresholds <Prov k="modeled" /></div>
          <div className="field-row">
            <label>Structural burden %</label>
            {A.burdenThresholds.map((t, i) => (
              <span className="field-row" key={i}>
                <span>{['Good ≤', 'Fair ≤', 'Poor ≤'][i]}</span>
                <Num value={t} max={80} label={`Burden threshold ${i + 1}`}
                  onChange={(v) => {
                    const next = [...A.burdenThresholds]; next[i] = v; set({ burdenThresholds: next })
                  }} />
              </span>
            ))}
          </div>
          <div className="field-row">
            <label>Crack density LF/kSF</label>
            {A.crackDensityThresholds.map((t, i) => (
              <span className="field-row" key={i}>
                <span>{['Good ≤', 'Fair ≤', 'Poor ≤'][i]}</span>
                <Num value={t} max={200} step={1} label={`Crack threshold ${i + 1}`}
                  onChange={(v) => {
                    const next = [...A.crackDensityThresholds]; next[i] = v; set({ crackDensityThresholds: next })
                  }} />
              </span>
            ))}
          </div>
          <div className="formula">{`burden %       = structural repair SF ÷ total asphalt SF
crack density  = crack fill LF ÷ (asphalt SF ÷ 1,000)
band           = WORSE of the two indices  →  ${BANDS.map((b) => b.short).join(' / ')}
override       = manual, requires a written reason (Site Detail)`}</div>
          <p className="chart-note">
            Structural repair counts full-depth repairs and reconstruction only; mill &amp; overlay is surface
            rehabilitation and is deliberately excluded.
          </p>
        </div>

        <div className="card stack">
          <div className="card-title">Priority Weights <Prov k="modeled" /></div>
          <div className="field-row">
            <label>Severity</label>
            <Num value={A.priorityWeights.severity} onChange={(v) => setDeep('priorityWeights', { severity: v })} label="Severity weight" />
            <label>Risk</label>
            <Num value={A.priorityWeights.risk} onChange={(v) => setDeep('priorityWeights', { risk: v })} label="Risk weight" />
            <label>Urgency</label>
            <Num value={A.priorityWeights.urgency} onChange={(v) => setDeep('priorityWeights', { urgency: v })} label="Urgency weight" />
          </div>
          <div className="formula">{`S = mean severity of the package's zones      (low 35 / moderate 65 / severe 95)
R = min(100, distinct risk tags × 25)
U = max(0, 100 − 25 × years until recommended year)
priority score = (wS·S + wR·R + wU·U) ÷ (wS + wR + wU)     → 0–100`}</div>
        </div>

        <div className="card stack">
          <div className="card-title">Preservation Window <Prov k="modeled" /></div>
          <div className="field-row">
            <label>Max structural burden</label>
            <Num value={A.preservation.maxBurdenPct} onChange={(v) => setDeep('preservation', { maxBurdenPct: v })} label="Max burden for preservation" />
            <span>%</span>
          </div>
          <div className="field-row">
            <label>Min sealcoat-eligible share</label>
            <Num value={A.preservation.minSealcoatSharePct} onChange={(v) => setDeep('preservation', { minSealcoatSharePct: v })} label="Min sealcoat share" />
            <span>% of asphalt SF</span>
          </div>
          <div className="formula">{`preservation candidate = burden ≤ max AND sealcoat-eligible share ≥ min`}</div>
          <p className="chart-note">
            The cheapest square foot is the one preserved before it breaks — this window flags sites still in
            that position.
          </p>
        </div>

        <div className="card stack">
          <div className="card-title">Budget Selection Method <Prov k="modeled" /></div>
          <div className="seg" role="group" aria-label="Budget selection method">
            {[
              ['priority', 'Priority score'],
              ['worst_first', 'Worst condition first'],
              ['efficiency', 'Score per dollar'],
            ].map(([id, label]) => (
              <button key={id} aria-pressed={A.budgetMethod === id} onClick={() => set({ budgetMethod: id })}>
                {label}
              </button>
            ))}
          </div>
          <div className="formula">{`Order packages by the method, then fund greedily in that order,
skipping any package larger than the budget that remains.`}</div>
        </div>

        <div className="card stack">
          <div className="card-title">Reset</div>
          <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Return every assumption on this page to the demo defaults. Site data is unaffected.
          </p>
          <div>
            <button className="btn" onClick={() => onChange(JSON.parse(JSON.stringify(DEFAULT_ASSUMPTIONS)))}>
              Reset assumptions to defaults
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
