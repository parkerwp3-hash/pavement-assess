/**
 * Native-SVG/HTML chart primitives.
 *
 * Values are directly labeled (no value is color-alone), series identity is
 * always carried by an adjacent text label, and every fill keeps a 2px gap
 * from its neighbor. Palette is the validated categorical set in styles.css.
 */

export const SERVICE_COLOR = {
  asphalt: 'var(--cat-asphalt)',
  concrete: 'var(--cat-concrete)',
  sealcoat: 'var(--cat-sealcoat)',
  striping: 'var(--cat-striping)',
  drainage: 'var(--cat-drainage)',
}

export const BAND_COLOR = ['var(--good)', 'var(--fair)', 'var(--poor)', 'var(--critical)']

/** Horizontal bars with left labels and right value labels. */
export function HBar({ rows, format, color, onRowClick }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <div>
      {rows.map((r) => (
        <div
          className="hbar-row"
          key={r.label}
          title={`${r.label}: ${format(r.value)}`}
          onClick={onRowClick ? () => onRowClick(r) : undefined}
          style={onRowClick ? { cursor: 'pointer' } : undefined}
        >
          <span className="hbar-label">{r.label}</span>
          <span className="hbar-track">
            <span
              className="hbar-fill"
              style={{ width: `${(r.value / max) * 100}%`, background: r.color || color || 'var(--accent)' }}
            />
          </span>
          <span className="hbar-value">{format(r.value)}</span>
        </div>
      ))}
    </div>
  )
}

/** One 100% stacked bar with 2px gaps and a legend that carries the values. */
export function SegBar({ segs, format }) {
  const total = Math.max(1, segs.reduce((a, s) => a + s.value, 0))
  const visible = segs.filter((s) => s.value > 0)
  return (
    <div>
      <div style={{ display: 'flex', gap: 2, height: 18, borderRadius: 4, overflow: 'hidden' }}>
        {visible.map((s) => (
          <span
            key={s.label}
            title={`${s.label}: ${format(s.value)}`}
            style={{ flex: `${s.value} 0 0`, background: s.color, minWidth: 3 }}
          />
        ))}
      </div>
      <div className="legend">
        {segs.map((s) => (
          <span className="legend-key" key={s.label}>
            <span className="legend-swatch" style={{ background: s.color }} />
            {s.label} · <b style={{ fontVariantNumeric: 'tabular-nums' }}>{format(s.value)}</b>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Small column chart for spend-by-year. */
export function Cols({ rows, format }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  const W = 300
  const H = 130
  const pad = 4
  const bw = Math.min(64, (W - pad * 2) / rows.length - 10)
  return (
    <svg viewBox={`0 0 ${W} ${H + 34}`} style={{ width: '100%', maxWidth: 420, display: 'block' }} role="img"
      aria-label={rows.map((r) => `${r.label}: ${format(r.value)}`).join(', ')}>
      {rows.map((r, i) => {
        const h = (r.value / max) * (H - 24)
        const x = pad + (i + 0.5) * ((W - pad * 2) / rows.length) - bw / 2
        return (
          <g key={r.label}>
            <title>{`${r.label}: ${format(r.value)}`}</title>
            <rect x={x} y={H - h} width={bw} height={h} rx={3} fill="var(--accent)" />
            <text x={x + bw / 2} y={H - h - 6} textAnchor="middle" fontSize="11" fontWeight="600"
              fill="var(--ink)" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {format(r.value)}
            </text>
            <text x={x + bw / 2} y={H + 16} textAnchor="middle" fontSize="11" fill="var(--ink-2)">
              {r.label}
            </text>
          </g>
        )
      })}
      <line x1="0" y1={H} x2={W} y2={H} stroke="var(--line)" strokeWidth="1" />
    </svg>
  )
}
