import { useState } from 'react'
import { CloseIcon, PlusIcon } from '../components/Icons.jsx'
import { createId } from '../lib/storage.js'
import { digitsOnly, formatSqFt, toSquareFeet } from '../lib/format.js'

function blankSection() {
  return { id: createId(), name: '', sqft: '' }
}

export default function NewPropertyFlow({ onCancel, onSave }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [sections, setSections] = useState(() => [blankSection()])

  const totalSqFt = sections.reduce((sum, s) => sum + toSquareFeet(s.sqft), 0)
  const canSave = name.trim().length > 0

  function updateSection(id, patch) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    )
  }

  function addSection() {
    setSections((prev) => [...prev, blankSection()])
  }

  function removeSection(id) {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSave) return

    // Drop rows the inspector added but never filled in.
    const cleaned = sections
      .filter((s) => s.name.trim() || toSquareFeet(s.sqft) > 0)
      .map((s, index) => ({
        id: s.id,
        name: s.name.trim() || `Section ${index + 1}`,
        sqft: toSquareFeet(s.sqft),
      }))

    onSave({
      id: createId(),
      name: name.trim(),
      address: address.trim(),
      sections: cleaned,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="flow" role="dialog" aria-modal="true" aria-label="New property">
      <header className="flow-header">
        <button
          type="button"
          className="icon-btn"
          onClick={onCancel}
          aria-label="Cancel"
        >
          <CloseIcon />
        </button>
        <h2 className="flow-title">New property</h2>
      </header>

      <form className="flow-form" onSubmit={handleSubmit}>
        <div className="flow-body">
          <div className="flow-block">
            <h3 className="flow-section-heading">Property</h3>

            <label className="field">
              <span className="field-label">Name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Northgate Commons"
                autoComplete="off"
                autoCapitalize="words"
                enterKeyHint="next"
              />
            </label>

            <label className="field">
              <span className="field-label">Address</span>
              <textarea
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={'1420 Northgate Blvd\nColumbus, OH 43220'}
                autoComplete="off"
                autoCapitalize="words"
                rows={3}
              />
            </label>
          </div>

          <div className="flow-block">
            <h3 className="flow-section-heading">Lot sections</h3>

            {sections.map((section, index) => (
              <div className="section-card" key={section.id}>
                <div className="section-card-head">
                  <span className="section-card-index">
                    Section {index + 1}
                  </span>
                  {sections.length > 1 ? (
                    <button
                      type="button"
                      className="btn btn--danger-text"
                      onClick={() => removeSection(section.id)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <label className="field">
                  <span className="field-label">Section name</span>
                  <input
                    className="input"
                    value={section.name}
                    onChange={(e) =>
                      updateSection(section.id, { name: e.target.value })
                    }
                    placeholder={index === 0 ? 'Main lot' : 'Rear drive lane'}
                    autoComplete="off"
                    autoCapitalize="words"
                  />
                </label>

                <label className="field">
                  <span className="field-label">Approximate area</span>
                  <div className="input-suffix">
                    <input
                      className="input"
                      value={section.sqft}
                      onChange={(e) =>
                        updateSection(section.id, {
                          sqft: digitsOnly(e.target.value),
                        })
                      }
                      placeholder="42000"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                    />
                    <span className="input-suffix-unit">sq ft</span>
                  </div>
                </label>
              </div>
            ))}

            <button
              type="button"
              className="btn btn--ghost"
              onClick={addSection}
            >
              <PlusIcon />
              Add section
            </button>

            <div className="total-line">
              <span>Total area</span>
              <span className="total-line-value">{formatSqFt(totalSqFt)}</span>
            </div>
          </div>
        </div>

        <div className="action-bar">
          <button type="submit" className="btn" disabled={!canSave}>
            Save property
          </button>
        </div>
      </form>
    </div>
  )
}
