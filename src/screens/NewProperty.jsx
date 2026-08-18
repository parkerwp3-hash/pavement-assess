import { useState } from 'react'
import { IconPlus } from '../components/Icons.jsx'
import { createId } from '../storage.js'
import { formatSqft, totalSqft } from '../format.js'

const SECTION_PLACEHOLDERS = [
  'Main lot',
  'Rear drive lane',
  'North entrance',
  'Loading dock apron',
]

function blankSection() {
  return { id: createId(), name: '', sqft: '' }
}

/** Keep only digits — sq ft is entered as a whole-number estimate in the field. */
function toDigits(value) {
  return value.replace(/[^\d]/g, '').slice(0, 9)
}

export default function NewProperty({ onCancel, onSave }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [sections, setSections] = useState(() => [blankSection()])

  const namedSections = sections.filter((s) => s.name.trim())
  const canSave = name.trim().length > 0
  const total = totalSqft(sections)

  function updateSection(id, patch) {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, ...patch } : section)),
    )
  }

  function addSection() {
    setSections((prev) => [...prev, blankSection()])
  }

  function removeSection(id) {
    setSections((prev) => (prev.length === 1 ? [blankSection()] : prev.filter((s) => s.id !== id)))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSave) return
    onSave({
      id: createId(),
      name: name.trim(),
      address: address.trim(),
      createdAt: new Date().toISOString(),
      sections: namedSections.map((section) => ({
        id: section.id,
        name: section.name.trim(),
        sqft: section.sqft ? Number(section.sqft) : null,
      })),
    })
  }

  return (
    <form
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-label="New property"
      onSubmit={handleSubmit}
    >
      <div className="sheet__bar">
        <button
          type="button"
          className="sheet__action sheet__action--muted"
          onClick={onCancel}
        >
          Cancel
        </button>
        <h2 className="sheet__title">New property</h2>
        {/* Save lives only in the footer — it is always on screen and in thumb reach. */}
        <span className="sheet__action" aria-hidden="true" />
      </div>

      <div className="sheet__body">
        <div className="field">
          <label className="field__label" htmlFor="property-name">
            Property name
          </label>
          <input
            id="property-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Northgate Commons"
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="next"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="property-address">
            Address
          </label>
          <textarea
            id="property-address"
            className="input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="1400 Commerce Dr, Columbus, OH"
            autoComplete="off"
            rows={2}
          />
        </div>

        <div className="section-head">
          <h3 className="section-head__title">Lot sections</h3>
          <span className="section-head__count">{namedSections.length} named</span>
        </div>

        {sections.map((section, index) => (
          <div className="section-card" key={section.id}>
            <div className="section-card__head">
              <span className="section-card__index">Section {index + 1}</span>
              <button
                type="button"
                className="btn btn--danger-text"
                onClick={() => removeSection(section.id)}
              >
                Remove
              </button>
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`section-name-${section.id}`}>
                Section name
              </label>
              <input
                id={`section-name-${section.id}`}
                className="input"
                value={section.name}
                onChange={(e) => updateSection(section.id, { name: e.target.value })}
                placeholder={
                  SECTION_PLACEHOLDERS[index % SECTION_PLACEHOLDERS.length]
                }
                autoComplete="off"
                autoCapitalize="words"
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`section-sqft-${section.id}`}>
                Approximate area
              </label>
              <div className="input-wrap">
                <input
                  id={`section-sqft-${section.id}`}
                  className="input input--with-suffix"
                  value={section.sqft}
                  onChange={(e) =>
                    updateSection(section.id, { sqft: toDigits(e.target.value) })
                  }
                  placeholder="24000"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
                <span className="input-wrap__suffix">sq ft</span>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn--secondary" onClick={addSection}>
          <IconPlus size={20} />
          Add section
        </button>

        <div className="total-bar">
          <span className="total-bar__label">Total area</span>
          <span className="total-bar__value">
            {total > 0 ? total.toLocaleString('en-US') : '—'}
          </span>
        </div>
        <p className="field__hint">
          Estimates are fine — {formatSqft(total || 0)} across{' '}
          {namedSections.length === 1 ? '1 section' : `${namedSections.length} sections`}.
          Sections without a name are not saved.
        </p>
      </div>

      <div className="sheet__footer">
        <button type="submit" className="btn" disabled={!canSave}>
          Save property
        </button>
      </div>
    </form>
  )
}
