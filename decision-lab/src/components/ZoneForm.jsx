import { useState } from 'react'
import { labelize } from '../lib/calc.js'
import {
  CONFIDENCE_OPTIONS,
  DISTRESS_OPTIONS,
  PRIORITY_OPTIONS,
  RISK_TAG_OPTIONS,
  SERVICE_OPTIONS,
  SEVERITY_OPTIONS,
  TREATMENT_OPTIONS,
  UNIT_OPTIONS,
} from '../lib/options.js'

function Select({ label, value, onChange, options, allowEmpty }) {
  return (
    <label style={{ display: 'block' }}>
      <span className="kpi-label" style={{ marginBottom: 4 }}>{label}</span>
      <select className="input" style={{ width: '100%' }} value={value}
        onChange={(e) => onChange(e.target.value)}>
        {allowEmpty ? <option value="">— none —</option> : null}
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? labelize(o)}</option>
        ))}
      </select>
    </label>
  )
}

/**
 * Create/edit form for a repair zone. The sketch located the zone; every
 * number in here is typed in from Diamond's existing assessment — nothing is
 * measured from image pixels.
 */
export default function ZoneForm({ mode, zone, site, packageId, onSave, onCancel }) {
  const [f, setF] = useState(() => ({
    distressType: zone?.distressType || 'alligator_cracking',
    severity: zone?.severity || 'moderate',
    service: zone?.service || 'asphalt',
    treatment: zone?.treatment || 'full_depth_repair',
    quantity: zone?.quantity ?? '',
    unit: zone?.unit || 'SF',
    currentCustomerPrice: zone?.currentCustomerPrice ?? '',
    priority: zone?.priority || 'medium',
    confidence: zone?.confidence || 'moderate',
    riskTags: zone?.riskTags || [],
    notes: zone?.notes || '',
    packageId: packageId ?? '',
  }))
  const set = (k) => (v) => setF((prev) => ({ ...prev, [k]: v }))

  const qty = Number(f.quantity)
  const price = Number(f.currentCustomerPrice)
  const valid = Number.isFinite(qty) && qty > 0 && Number.isFinite(price) && price >= 0

  function toggleTag(tag) {
    setF((prev) => ({
      ...prev,
      riskTags: prev.riskTags.includes(tag)
        ? prev.riskTags.filter((t) => t !== tag)
        : [...prev.riskTags, tag],
    }))
  }

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true"
      aria-label={mode === 'create' ? 'New repair zone' : `Edit ${zone.id}`}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal" style={{ width: 'min(560px, 100%)' }}>
        <h2>{mode === 'create' ? 'New Repair Zone' : `Edit ${zone.id}`}</h2>
        <p style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
          The sketch locates the zone on the map — it is not a measurement. Enter the quantity and
          price from Diamond's existing assessment and costing system.
        </p>

        <div className="grid grid--2" style={{ gap: 12 }}>
          <Select label="Distress type" value={f.distressType} onChange={set('distressType')} options={DISTRESS_OPTIONS} />
          <Select label="Severity" value={f.severity} onChange={set('severity')} options={SEVERITY_OPTIONS} />
          <Select label="Service" value={f.service} onChange={set('service')} options={SERVICE_OPTIONS} />
          <Select label="Recommended treatment" value={f.treatment} onChange={set('treatment')} options={TREATMENT_OPTIONS} />
          <label style={{ display: 'block' }}>
            <span className="kpi-label" style={{ marginBottom: 4 }}>Measured quantity</span>
            <span style={{ display: 'flex', gap: 8 }}>
              <input className="input" style={{ flex: 1 }} type="number" min="0" step="1"
                value={f.quantity} onChange={(e) => set('quantity')(e.target.value)}
                placeholder="from assessment" aria-label="Measured quantity" />
              <select className="input" value={f.unit} onChange={(e) => set('unit')(e.target.value)}
                aria-label="Unit" style={{ width: 76 }}>
                {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </span>
          </label>
          <label style={{ display: 'block' }}>
            <span className="kpi-label" style={{ marginBottom: 4 }}>Current customer price ($)</span>
            <input className="input" style={{ width: '100%' }} type="number" min="0" step="1"
              value={f.currentCustomerPrice} onChange={(e) => set('currentCustomerPrice')(e.target.value)}
              placeholder="from costing system" aria-label="Current customer price" />
          </label>
          <Select label="Priority" value={f.priority} onChange={set('priority')} options={PRIORITY_OPTIONS} />
          <Select label="Confidence" value={f.confidence} onChange={set('confidence')} options={CONFIDENCE_OPTIONS} />
        </div>

        <div>
          <span className="kpi-label" style={{ marginBottom: 6 }}>Risk tags</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {RISK_TAG_OPTIONS.map((tag) => (
              <button key={tag} type="button" className="layer-toggle"
                aria-pressed={f.riskTags.includes(tag)} onClick={() => toggleTag(tag)}>
                {labelize(tag)}
              </button>
            ))}
          </div>
        </div>

        <Select label="Project package" value={f.packageId} onChange={set('packageId')} allowEmpty
          options={site.projectPackages.map((p) => ({ value: p.id, label: `${p.id} · ${p.name}` }))} />

        <label style={{ display: 'block' }}>
          <span className="kpi-label" style={{ marginBottom: 4 }}>Notes</span>
          <textarea className="input" value={f.notes} onChange={(e) => set('notes')(e.target.value)}
            placeholder="Field observations, access constraints, photos reference…" />
        </label>

        <div className="field-row">
          <button className="btn btn--primary" disabled={!valid}
            onClick={() => onSave({
              ...f,
              quantity: qty,
              currentCustomerPrice: price,
              notes: f.notes.trim(),
            })}>
            {mode === 'create' ? 'Create zone' : 'Save changes'}
          </button>
          <button className="btn" onClick={onCancel}>Cancel</button>
          {!valid ? (
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              Quantity and price are required.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
