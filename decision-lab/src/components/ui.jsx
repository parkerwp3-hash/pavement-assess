/** Small shared pieces: KPI tiles, severity chips, formatters. */

export const fmtInt = (n) => Math.round(n).toLocaleString('en-US')

export const fmtMoney = (n) => {
  const v = Math.abs(n)
  if (v >= 1e6) return `$${(n / 1e6).toFixed(v >= 1e7 ? 1 : 2)}M`
  if (v >= 1e3) return `$${Math.round(n / 1e3).toLocaleString('en-US')}K`
  return `$${Math.round(n).toLocaleString('en-US')}`
}

export const fmtMoneyFull = (n) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function Sev({ s }) {
  return <span className={`sev sev--${s}`}>{s.toUpperCase()}</span>
}

export function KPI({ label, value, sub }) {
  return (
    <div className="card kpi">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
      {sub ? <span className="kpi-sub">{sub}</span> : null}
    </div>
  )
}
