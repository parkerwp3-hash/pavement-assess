/** Small shared pieces: provenance chips, KPI tiles, band chips, formatters. */

import { BANDS } from '../lib/calc.js'

export const fmtInt = (n) => Math.round(n).toLocaleString('en-US')

export const fmtMoney = (n) => {
  const v = Math.abs(n)
  if (v >= 1e6) return `$${(n / 1e6).toFixed(v >= 1e7 ? 1 : 2)}M`
  if (v >= 1e3) return `$${Math.round(n / 1e3).toLocaleString('en-US')}K`
  return `$${Math.round(n).toLocaleString('en-US')}`
}

export const fmtMoneyFull = (n) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const fmtPct = (n, d = 1) => `${n.toFixed(d)}%`

export const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** OBSERVED / DERIVED / MODELED chip. Every metric carries one. */
export function Prov({ k }) {
  return <span className={`prov prov--${k}`}>{k.toUpperCase()}</span>
}

export function BandChip({ band, overridden }) {
  const b = BANDS[band]
  return (
    <span className={`band-chip band-chip--${b.tone}`}>
      {b.label}
      {overridden ? ' · overridden' : ''}
    </span>
  )
}

export function Sev({ s }) {
  return <span className={`sev sev--${s}`}>{s.toUpperCase()}</span>
}

export function KPI({ label, value, sub, prov }) {
  return (
    <div className="card kpi">
      <span className="kpi-label">
        {label} {prov ? <Prov k={prov} /> : null}
      </span>
      <span className="kpi-value">{value}</span>
      {sub ? <span className="kpi-sub">{sub}</span> : null}
    </div>
  )
}
