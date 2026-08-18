/**
 * Site map: a procedural mock aerial with repair-zone polygons over it.
 *
 * Zone geometry is normalized 0–1 to the site extent, so it renders over the
 * generated aerial and over an uploaded photo alike without transformation.
 * The aerial is deliberately schematic — an invented plan drawing, not
 * something pretending to be satellite imagery of a real place.
 */

import { labelize } from '../lib/calc.js'
import { SERVICE_COLOR } from './charts.jsx'
import { fmtInt, fmtMoney } from './ui.jsx'

const W = 1000
const H = 600

const SEV_TONE = {
  severe: { stroke: '#a12b31', fill: 'rgba(161, 43, 49, 0.35)' },
  moderate: { stroke: '#ad5a1c', fill: 'rgba(173, 90, 28, 0.33)' },
  low: { stroke: '#256b45', fill: 'rgba(37, 107, 69, 0.28)' },
}

/** Deterministic per-site variation without Math.random. */
function tonePair(seedTone) {
  const paved = ['#c9cdc9', '#c5c9c7', '#cbcfc9', '#c3c7c5', '#cdd1cd', '#c7cbc7', '#cfd3cd', '#c1c5c3'][seedTone % 8]
  const grass = ['#a7b795', '#a3b391', '#abbb99', '#9fb08e', '#a9b997', '#a5b593', '#adbd9b', '#9dae8c'][seedTone % 8]
  return { paved, grass }
}

function Docks({ side, building }) {
  const [bx, by, bw, bh] = building
  const tick = []
  const n = 9
  for (let i = 1; i < n; i++) {
    if (side === 'south' || side === 'both') {
      const x = (bx + (bw * i) / n) * W
      tick.push(<rect key={`s${i}`} x={x - 5} y={(by + bh) * H} width={10} height={16} fill="#7d838c" />)
    }
    if (side === 'north' || side === 'both') {
      const x = (bx + (bw * i) / n) * W
      tick.push(<rect key={`n${i}`} x={x - 5} y={by * H - 16} width={10} height={16} fill="#7d838c" />)
    }
    if (side === 'east') {
      const y = (by + (bh * i) / n) * H
      tick.push(<rect key={`e${i}`} x={(bx + bw) * W} y={y - 5} width={16} height={10} fill="#7d838c" />)
    }
  }
  return tick
}

function Aerial({ site }) {
  const { building, docks, green, seedTone } = site.layout
  const { paved, grass } = tonePair(seedTone)
  const [bx, by, bw, bh] = building
  const m = green * W * 0.5 + 14

  return (
    <g aria-hidden="true">
      <rect width={W} height={H} fill={grass} />
      <rect x={m} y={m} width={W - m * 2} height={H - m * 2} fill={paved} />
      {/* aisle dashes */}
      <g stroke="#ffffff" strokeWidth="3" strokeDasharray="24 18" opacity="0.75">
        <path d={`M${m + 20} ${H / 2} H${W - m - 20}`} />
        <path d={`M${W / 2} ${m + 20} V${H - m - 20}`} />
      </g>
      {/* faint stall striping in one corner */}
      <g stroke="#ffffff" strokeWidth="1.6" opacity="0.5">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${m + 30 + i * 22} ${H - m - 74} v54`} />
        ))}
      </g>
      {/* building + roofline + docks */}
      <rect x={bx * W} y={by * H} width={bw * W} height={bh * H} fill="#8f959e" />
      <rect x={bx * W + 8} y={by * H + 8} width={bw * W - 16} height={bh * H - 16} fill="#9aa0a8" />
      <Docks side={docks} building={building} />
      <text x={(bx + bw / 2) * W} y={(by + bh / 2) * H + 5} textAnchor="middle" fontSize="15"
        fontWeight="600" fill="#5d636c" letterSpacing="2">
        BUILDING
      </text>
      {/* trailer parking blocks along an edge */}
      <g fill="#b3b8b3">
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={W - m - 26} y={m + 26 + i * 44} width={14} height={30} rx={2} />
        ))}
      </g>
    </g>
  )
}

export default function MapView({ site, layers, selectedId, onSelect }) {
  const zones = site.repairZones.filter((z) => layers.has(z.service))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Mock aerial of ${site.name} with ${zones.length} repair zones shown`}>
      {site.mapImage ? (
        <image href={site.mapImage} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" />
      ) : (
        <Aerial site={site} />
      )}
      <text x={W - 12} y={H - 10} textAnchor="end" fontSize="12" fontWeight="700" fill="#5d636c" opacity="0.85">
        {site.mapImage ? 'UPLOADED IMAGE' : 'MOCK AERIAL — GENERATED'}
      </text>

      {zones.map((z) => {
        const tone = SEV_TONE[z.severity] || SEV_TONE.moderate
        const on = z.id === selectedId
        const pts = z.geometry.map(([x, y]) => `${x * W},${y * H}`).join(' ')
        const cx = (z.geometry.reduce((a, p) => a + p[0], 0) / z.geometry.length) * W
        const cy = (z.geometry.reduce((a, p) => a + p[1], 0) / z.geometry.length) * H
        return (
          <g
            key={z.id}
            className="map-zone"
            role="button"
            tabIndex={0}
            aria-label={`${z.id}: ${labelize(z.distressType)}, ${z.severity} severity, ${fmtInt(z.quantity)} ${z.unit}, ${fmtMoney(z.currentCustomerPrice)}`}
            onClick={() => onSelect(on ? null : z.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(on ? null : z.id)
              }
            }}
          >
            <title>{`${z.id} · ${labelize(z.distressType)} · ${z.severity} · ${fmtMoney(z.currentCustomerPrice)}`}</title>
            <polygon points={pts} fill={tone.fill} stroke={on ? '#232a33' : tone.stroke} strokeWidth={on ? 5 : 3} />
            {/* service tick in the zone corner so service reads without color */}
            <circle cx={z.geometry[0][0] * W + 12} cy={z.geometry[0][1] * H + 12} r="7"
              fill={SERVICE_COLOR[z.service] || 'var(--accent)'} stroke="#ffffff" strokeWidth="2" />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="15" fontWeight="700" fill="#232a33"
              stroke="#ffffff" strokeWidth="3" paintOrder="stroke">
              {z.id}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
