import { useEffect, useMemo, useRef, useState } from 'react'
import {
  issueCounts,
  labelize,
  packagePrice,
  pciTone,
  siteSummary,
  zoneInCategory,
} from '../lib/calc.js'
import MapView, { SERVICE_COLOR } from '../components/MapView.jsx'
import ZoneForm from '../components/ZoneForm.jsx'
import { ZoneThumb } from '../components/PropertyCard.jsx'
import { nextZoneId } from '../lib/options.js'
import { KPI, Sev, fmtDate, fmtInt, fmtMoney, fmtMoneyFull } from '../components/ui.jsx'

const ALL_SERVICES = ['asphalt', 'concrete', 'sealcoat', 'striping', 'drainage']

function ZonePanel({ site, zone, onClose, onEdit, onDelete }) {
  const pkg = site.projectPackages.find((p) => p.repairZoneIds.includes(zone.id))
  const unitCost = zone.quantity ? zone.currentCustomerPrice / zone.quantity : 0

  return (
    <div className="card zonepanel stack" aria-label={`Repair zone ${zone.id} details`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: 16 }}>{zone.id} · {labelize(zone.distressType)}</h3>
        <span className="field-row">
          <button className="btn btn--sm" onClick={onEdit}>Edit</button>
          <button className="btn btn--sm btn--danger" onClick={onDelete}>Delete</button>
          <button className="btn btn--sm" onClick={onClose}>Close</button>
        </span>
      </div>

      <dl className="kv">
        <dt>Severity</dt><dd><Sev s={zone.severity} /></dd>
        <dt>Service</dt><dd>{labelize(zone.service)}</dd>
        <dt>Recommended treatment</dt><dd>{labelize(zone.treatment)}</dd>
        <dt>Quantity</dt><dd>{fmtInt(zone.quantity)} {zone.unit}</dd>
        <dt>Current price</dt><dd>{fmtMoneyFull(zone.currentCustomerPrice)}</dd>
        <dt>Unit cost</dt><dd>${unitCost.toFixed(2)} / {zone.unit}</dd>
        <dt>Priority</dt><dd>{labelize(zone.priority)}</dd>
        <dt>Confidence</dt><dd>{labelize(zone.confidence)}</dd>
      </dl>
      <p className="chart-note">Price imported from Diamond's costing system — treated as authoritative.</p>

      {zone.riskTags?.length ? (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {zone.riskTags.map((t) => <span className="tagchip" key={t}>{labelize(t)}</span>)}
        </div>
      ) : null}

      {zone.notes ? (
        <p className="chart-note" style={{ whiteSpace: 'normal' }}><b>Notes:</b> {zone.notes}</p>
      ) : null}

      {pkg ? (
        <div>
          <div className="card-title">Linked Project Package</div>
          <dl className="kv">
            <dt>Package</dt><dd>{pkg.id}</dd>
            <dt>Name</dt><dd style={{ textAlign: 'right', whiteSpace: 'normal' }}>{pkg.name}</dd>
            <dt>Recommended year</dt><dd>{pkg.recommendedYear}</dd>
            <dt>Package price</dt><dd>{fmtMoney(packagePrice(pkg, site))}</dd>
          </dl>
          <p className="chart-note" style={{ whiteSpace: 'normal' }}>
            <b>Approval reason:</b> {pkg.approvalReason}
          </p>
        </div>
      ) : (
        <p className="chart-note">Not assigned to a project package yet.</p>
      )}
    </div>
  )
}

const DEEP_STRUCTURAL_DISPLAY = new Set([
  'full_depth_repair',
  'expanded_full_depth_repair',
  'reconstruction',
  'slab_replacement',
])

/** Worst severity in a set of zones → display band. Empty set reads Good. */
function worstBand(zones) {
  if (zones.some((z) => z.severity === 'severe')) return { label: 'Poor', cssVar: 'var(--poor)' }
  if (zones.some((z) => z.severity === 'moderate')) return { label: 'Fair', cssVar: 'var(--fair)' }
  return { label: 'Good', cssVar: 'var(--good)' }
}

/**
 * "At a Glance" — the executive header. Everything shown is a restatement of
 * data already on the site; the View links scroll, they do not navigate.
 */
function AtAGlance({ site, invest, onToggleStar, onJumpToMap, onViewCategory, onReviewProgram }) {
  const tone = pciTone(site.pci)
  const issues = issueCounts(site)
  const z = site.repairZones

  const condRows = [
    { label: 'Function', band: worstBand(z.filter((x) => x.riskTags?.some((t) => ['operational_continuity', 'asset_preservation'].includes(t)))) },
    { label: 'Liability', band: worstBand(z.filter((x) => x.riskTags?.some((t) => ['liability', 'safety'].includes(t)))) },
    { label: 'Aesthetics', band: worstBand(z.filter((x) => ['striping', 'sealcoat'].includes(x.service))) },
    { label: 'Structure', band: worstBand(z.filter((x) => DEEP_STRUCTURAL_DISPLAY.has(x.treatment))) },
  ]

  const highRisk = z.filter(
    (x) => x.severity === 'severe' && x.riskTags?.some((t) => ['liability', 'safety', 'accessibility'].includes(t)),
  ).length

  return (
    <section className="glance" aria-label="At a glance">
      <div className="glance-head">
        <div>
          <div className="glance-title">
            <button type="button" className={site.starred ? 'glance-star on' : 'glance-star'}
              aria-pressed={Boolean(site.starred)}
              aria-label={site.starred ? 'Remove priority star' : 'Mark as priority'}
              onClick={onToggleStar}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3z" />
              </svg>
            </button>
            <div>
              <h1>{site.name}</h1>
              <p className="glance-sub">
                {site.facilityType} · {site.trafficClass} traffic · assessed {fmtDate(site.assessmentDate)}
              </p>
              <div className="glance-chips">
                <span className="glance-chip">{site.id}</span>
                <span className="glance-chip">{site.region}</span>
                <span className="glance-chip">{site.climateZone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glance-pci">
          <div className="pci-gauge" style={{ '--pci': `${site.pci ?? 0}%`, '--pci-color': tone.cssVar }}>
            <div className="pci-inner">
              {site.pci != null ? (<><strong>{site.pci}</strong><span>/100</span></>) : (<strong>—</strong>)}
            </div>
          </div>
          <div>
            <div className="small-label">PCI Score</div>
            <div className="condition" style={{ color: tone.cssVar }}>{tone.label}</div>
          </div>
        </div>

        <div className="cond-list">
          {condRows.map((row) => (
            <div className="cond-row" key={row.label}>
              <span className="cond-dot" style={{ background: row.band.cssVar }} />
              {row.label}
              <b style={{ color: row.band.cssVar }}>{row.band.label}</b>
            </div>
          ))}
        </div>

        <button type="button" className="glance-thumb" onClick={onJumpToMap}
          aria-label="Jump to the site map">
          {site.mapImage ? <img src={site.mapImage} alt="" /> : <ZoneThumb site={site} />}
        </button>
      </div>

      <div className="glance-dates">
        <div className="glance-date">
          <div className="metric-label">Last Assessment</div>
          <div className="glance-num">{fmtDate(site.assessmentDate)}</div>
        </div>
        <div className="glance-date">
          <div className="metric-label">Next Assessment</div>
          <div className="glance-num">{fmtDate(site.nextAssessment)}</div>
        </div>
        <div className="glance-date">
          <div className="metric-label">Last Service</div>
          <div className="glance-num">{fmtDate(site.lastService)}</div>
        </div>
        <div className="glance-date">
          <div className="metric-label">Next Service Due</div>
          <div className="glance-num">{fmtDate(site.nextDue)}</div>
        </div>
      </div>

      <div className="glance-issues">
        {highRisk > 0 ? (
          <div className="glance-tile glance-tile--risk">
            <div className="metric-label">High Risk</div>
            <div className="glance-num">{highRisk}</div>
            <button type="button" className="rowlink" onClick={() => onViewCategory('liability')}>
              View
            </button>
          </div>
        ) : null}
        {issues.map((issue) => (
          <div className="glance-tile" key={issue.key}>
            <div className="metric-label">{issue.label}</div>
            <div className="glance-num" style={issue.count === 0 ? { color: 'var(--txt-3)' } : undefined}>
              {issue.count}
            </div>
            {issue.count > 0 ? (
              <button type="button" className="rowlink" onClick={() => onViewCategory(issue.key)}>
                View
              </button>
            ) : null}
          </div>
        ))}
        <div className="glance-spend">
          <div className="metric-label">Recommended Spend (Next 12 Months)</div>
          <div className="glance-num">{fmtMoney(invest)}</div>
          <button type="button" className="btn btn--sm btn--primary" onClick={onReviewProgram}>
            Review Program
          </button>
        </div>
      </div>
    </section>
  )
}

export default function SiteDetail({ site, onBack, onUpdateSite }) {
  const [selectedZone, setSelectedZone] = useState(null)
  const [layers, setLayers] = useState(() => new Set(ALL_SERVICES))
  const [drawing, setDrawing] = useState(false)
  const [draft, setDraft] = useState([])
  // {mode:'create', geometry} | {mode:'edit', zone}
  const [zoneForm, setZoneForm] = useState(null)
  const [flashCategory, setFlashCategory] = useState(null)
  const fileRef = useRef(null)
  const mapRef = useRef(null)
  const zonesRef = useRef(null)

  const m = useMemo(() => siteSummary(site), [site])
  const zone = site.repairZones.find((z) => z.id === selectedZone) || null

  function toggleLayer(svc) {
    setLayers((prev) => {
      const next = new Set(prev)
      if (next.has(svc)) next.delete(svc)
      else next.add(svc)
      return next
    })
  }

  function startDrawing() {
    setDrawing(true)
    setDraft([])
    setSelectedZone(null)
  }

  function cancelDrawing() {
    setDrawing(false)
    setDraft([])
  }

  function closeDraft() {
    if (draft.length < 3) return
    setDrawing(false)
    setZoneForm({ mode: 'create', geometry: draft })
    setDraft([])
  }

  // Enter closes the polygon, Escape cancels, while drawing.
  useEffect(() => {
    if (!drawing) return undefined
    function onKey(e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        closeDraft()
      } else if (e.key === 'Escape') {
        cancelDrawing()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /** Membership lives on packages; a zone joins at most one. */
  function withPackageAssignment(packages, zoneId, packageId) {
    return packages.map((p) => {
      const without = p.repairZoneIds.filter((id) => id !== zoneId)
      return p.id === packageId
        ? { ...p, repairZoneIds: [...without, zoneId] }
        : { ...p, repairZoneIds: without }
    })
  }

  function saveZoneForm(fields) {
    const { packageId, ...zoneFields } = fields
    if (zoneForm.mode === 'create') {
      const id = nextZoneId(site)
      const newZone = { id, ...zoneFields, geometry: zoneForm.geometry }
      onUpdateSite({
        ...site,
        repairZones: [...site.repairZones, newZone],
        projectPackages: withPackageAssignment(site.projectPackages, id, packageId),
      })
      setSelectedZone(id)
    } else {
      const id = zoneForm.zone.id
      onUpdateSite({
        ...site,
        repairZones: site.repairZones.map((z) => (z.id === id ? { ...z, ...zoneFields } : z)),
        projectPackages: withPackageAssignment(site.projectPackages, id, packageId),
      })
    }
    setZoneForm(null)
  }

  function deleteZone(z) {
    if (!window.confirm(`Delete ${z.id} (${labelize(z.distressType)})? This cannot be undone.`)) return
    onUpdateSite({
      ...site,
      repairZones: site.repairZones.filter((x) => x.id !== z.id),
      projectPackages: site.projectPackages.map((p) => ({
        ...p,
        repairZoneIds: p.repairZoneIds.filter((id) => id !== z.id),
      })),
    })
    setSelectedZone(null)
  }

  function scrollToRef(ref) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ref.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  function viewCategory(key) {
    setFlashCategory(key)
    scrollToRef(zonesRef)
    window.setTimeout(() => setFlashCategory(null), 2400)
  }

  function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      window.alert('Please choose a PNG or JPEG image.')
      return
    }
    if (file.size > 1.5 * 1024 * 1024) {
      window.alert('That image is over 1.5MB. Storage for this prototype is limited — please use a smaller image.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onUpdateSite({ ...site, mapImage: reader.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <>
      <div className="field-row" style={{ marginBottom: 12 }}>
        <button className="btn" onClick={onBack}>← Portfolio</button>
      </div>

      <AtAGlance
        site={site}
        invest={m.invest}
        onToggleStar={() => onUpdateSite({ ...site, starred: !site.starred })}
        onJumpToMap={() => scrollToRef(mapRef)}
        onViewCategory={viewCategory}
        onReviewProgram={() => scrollToRef(zonesRef)}
      />

      <div className="grid grid--kpi" style={{ marginTop: 16 }}>
        <KPI label="PCI Score"
          value={site.pci != null
            ? <span style={{ color: pciTone(site.pci).cssVar }}>{site.pci}</span>
            : '—'}
          sub={site.pci != null ? `${pciTone(site.pci).label} condition · imported score` : 'not yet scored'} />
        <KPI label="Identified Investment" value={fmtMoney(m.invest)} sub="current customer pricing" />
        <KPI label="Paved SF" value={fmtInt(m.pavedSF)}
          sub={`${fmtInt(site.asphaltSF)} asphalt · ${fmtInt(site.concreteSF)} concrete`} />
        <KPI label="Repair Zones" value={m.zoneCount} sub={`${m.packageCount} project packages`} />
      </div>

      <div className="detail-cols" style={{ marginTop: 16 }}>
        <div className="stack">
          <div className="mapwrap" ref={mapRef}>
            <MapView site={site} layers={layers} selectedId={selectedZone} onSelect={setSelectedZone}
              drawing={drawing} draft={draft}
              onDraftPoint={(pt) => setDraft((prev) => [...prev, pt])}
              onDraftClose={closeDraft} />
            {drawing ? (
              <div className="draw-bar" role="status">
                <b>Drawing zone</b> · {draft.length} point{draft.length === 1 ? '' : 's'} — click to add;
                click the first point or press Enter to close (3+ points)
                <span className="field-row" style={{ marginLeft: 'auto' }}>
                  <button className="btn btn--sm" disabled={draft.length === 0}
                    onClick={() => setDraft((prev) => prev.slice(0, -1))}>
                    Undo point
                  </button>
                  <button className="btn btn--sm btn--primary" disabled={draft.length < 3} onClick={closeDraft}>
                    Close polygon
                  </button>
                  <button className="btn btn--sm" onClick={cancelDrawing}>Cancel</button>
                </span>
              </div>
            ) : null}
            <div className="map-toolbar">
              {ALL_SERVICES.map((svc) => (
                <button key={svc} className="layer-toggle" aria-pressed={layers.has(svc)}
                  onClick={() => toggleLayer(svc)}>
                  <span className="legend-swatch" style={{ background: SERVICE_COLOR[svc] }} />
                  {labelize(svc)}
                </button>
              ))}
              <span style={{ marginLeft: 'auto' }} className="field-row">
                <button className="btn btn--sm btn--primary" onClick={startDrawing} disabled={drawing}>
                  + Add repair zone
                </button>
                <button className="btn btn--sm" onClick={() => fileRef.current?.click()}>
                  {site.mapImage ? 'Replace map image' : 'Upload map image'}
                </button>
                {site.mapImage ? (
                  <button className="btn btn--sm" onClick={() => onUpdateSite({ ...site, mapImage: null })}>
                    Remove image
                  </button>
                ) : null}
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={handleUpload} />
              </span>
            </div>
          </div>

          <div className="card" ref={zonesRef}>
            <div className="card-title">Repair Zones ({site.repairZones.length})</div>
            <div className="tablewrap">
              <table>
                <thead>
                  <tr>
                    <th>Zone</th><th>Distress</th><th>Severity</th><th>Treatment</th>
                    <th className="num">Qty</th><th className="num">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {site.repairZones.map((z) => (
                    <tr key={z.id}
                      className={flashCategory && zoneInCategory(z, flashCategory) ? 'flash' : undefined}
                      style={z.id === selectedZone ? { background: 'var(--accent-soft)' } : undefined}>
                      <td><button className="rowlink" onClick={() => setSelectedZone(z.id)}>{z.id}</button></td>
                      <td>{labelize(z.distressType)}</td>
                      <td><Sev s={z.severity} /></td>
                      <td>{labelize(z.treatment)}</td>
                      <td className="num">{fmtInt(z.quantity)} {z.unit}</td>
                      <td className="num">{fmtMoney(z.currentCustomerPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Project Packages ({site.projectPackages.length})</div>
            <div className="tablewrap">
              <table>
                <thead>
                  <tr>
                    <th>Package</th><th>Name</th><th className="num">Year</th>
                    <th className="num">Price</th><th>Zones</th>
                  </tr>
                </thead>
                <tbody>
                  {site.projectPackages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td>{pkg.id}</td>
                      <td style={{ whiteSpace: 'normal' }}>{pkg.name}</td>
                      <td className="num">{pkg.recommendedYear}</td>
                      <td className="num">{fmtMoney(packagePrice(pkg, site))}</td>
                      <td>
                        {pkg.repairZoneIds.map((id) => (
                          <button key={id} className="rowlink" style={{ marginRight: 6 }}
                            onClick={() => setSelectedZone(id)}>
                            {id}
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          {zone ? (
            <ZonePanel site={site} zone={zone} onClose={() => setSelectedZone(null)}
              onEdit={() => setZoneForm({ mode: 'edit', zone })}
              onDelete={() => deleteZone(zone)} />
          ) : (
            <div className="card" style={{ color: 'var(--ink-3)' }}>
              Select a repair zone on the map or in the table to see its record — or draw a new one
              with “Add repair zone.”
            </div>
          )}
        </div>
      </div>

      {zoneForm ? (
        <ZoneForm
          mode={zoneForm.mode}
          zone={zoneForm.mode === 'edit' ? zoneForm.zone : null}
          site={site}
          packageId={
            zoneForm.mode === 'edit'
              ? site.projectPackages.find((p) => p.repairZoneIds.includes(zoneForm.zone.id))?.id ?? ''
              : ''
          }
          onSave={saveZoneForm}
          onCancel={() => setZoneForm(null)}
        />
      ) : null}
    </>
  )
}
