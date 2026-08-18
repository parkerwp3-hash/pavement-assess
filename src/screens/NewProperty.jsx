import { useState } from 'react'
import Screen from '../components/Screen.jsx'

let localSectionKey = 0
function blankSection() {
  localSectionKey += 1
  return { key: localSectionKey, name: '', sqft: '' }
}

export default function NewProperty({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [sections, setSections] = useState(() => [blankSection()])

  function updateSection(key, patch) {
    setSections((current) =>
      current.map((section) =>
        section.key === key ? { ...section, ...patch } : section,
      ),
    )
  }

  function removeSection(key) {
    setSections((current) => current.filter((section) => section.key !== key))
  }

  const namedSections = sections.filter((section) => section.name.trim() !== '')
  const canSave = name.trim() !== '' && namedSections.length > 0

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSave) return
    onSave({ name, address, sections: namedSections })
  }

  return (
    <Screen title="New property" subtitle="Site details and lot sections" full>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Property name</span>
          <input
            className="field-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Northgate Shopping Center"
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="next"
          />
        </label>

        <label className="field">
          <span className="field-label">Address</span>
          <input
            className="field-input"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="1400 Commerce Dr"
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="next"
          />
        </label>

        <p className="eyebrow">Lot sections</p>
        <p className="section-intro">
          Break the site into the areas you will walk separately — main lot, rear
          drive lane, loading dock.
        </p>

        {sections.map((section, index) => (
          <div className="section-row" key={section.key}>
            <div className="section-row-header">
              <span className="section-row-label">Section {index + 1}</span>
              {sections.length > 1 && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => removeSection(section.key)}
                >
                  Remove
                </button>
              )}
            </div>

            <label className="field">
              <span className="field-label">Name</span>
              <input
                className="field-input"
                value={section.name}
                onChange={(event) =>
                  updateSection(section.key, { name: event.target.value })
                }
                placeholder="Main lot"
                autoComplete="off"
                autoCapitalize="words"
              />
            </label>

            <label className="field">
              <span className="field-label">Approx. area</span>
              <span className="input-suffix">
                <input
                  className="field-input"
                  value={section.sqft}
                  onChange={(event) =>
                    updateSection(section.key, {
                      sqft: event.target.value.replace(/[^0-9]/g, ''),
                    })
                  }
                  placeholder="45000"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
                <span className="input-suffix-unit">sq ft</span>
              </span>
            </label>
          </div>
        ))}

        <button
          type="button"
          className="button button--secondary add-section"
          onClick={() => setSections((current) => [...current, blankSection()])}
        >
          Add section
        </button>

        <div className="action-bar">
          <button type="submit" className="button" disabled={!canSave}>
            Save property
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </Screen>
  )
}
