import { useState } from 'react'
import Header from '../components/Header.jsx'
import { blankDraft, blankSection, draftToProperty } from '../lib/properties.js'

export default function NewProperty({ onSave, onCancel }) {
  const [draft, setDraft] = useState(blankDraft)

  const canSave = draft.name.trim() !== ''

  function setField(key, value) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function setSection(id, key, value) {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }))
  }

  function addSection() {
    setDraft((d) => ({ ...d, sections: [...d.sections, blankSection()] }))
  }

  function removeSection(id) {
    setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSave) return
    onSave(draftToProperty(draft))
  }

  return (
    <div className="screen screen--plain">
      <Header
        eyebrow="New property"
        title="Details"
        action={
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        }
      />

      <form className="container" onSubmit={handleSubmit}>
        <div className="form-top">
          <label className="field">
            <span className="field__label">Property name</span>
            <input
              className="field__input"
              value={draft.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Northgate Commons"
              autoComplete="off"
              autoCapitalize="words"
            />
          </label>

          <label className="field">
            <span className="field__label">Address</span>
            <input
              className="field__input"
              value={draft.address}
              onChange={(e) => setField('address', e.target.value)}
              placeholder="1400 Commerce Dr, Springfield"
              autoComplete="off"
              autoCapitalize="words"
            />
          </label>
        </div>

        <h2 className="subhead">Lot sections</h2>

        {draft.sections.map((section, index) => (
          <div className="section-card" key={section.id}>
            <div className="section-card__head">
              <span className="section-card__index">Section {index + 1}</span>
              {draft.sections.length > 1 ? (
                <button
                  type="button"
                  className="btn btn--quiet"
                  aria-label={`Remove section ${index + 1}`}
                  onClick={() => removeSection(section.id)}
                >
                  Remove
                </button>
              ) : null}
            </div>

            <label className="field">
              <span className="field__label">Section name</span>
              <input
                className="field__input"
                value={section.name}
                onChange={(e) => setSection(section.id, 'name', e.target.value)}
                placeholder="Main lot"
                autoComplete="off"
                autoCapitalize="words"
              />
            </label>

            <label className="field field--last">
              <span className="field__label">Approx. square footage</span>
              <input
                className="field__input"
                value={section.squareFeet}
                onChange={(e) =>
                  setSection(section.id, 'squareFeet', e.target.value)
                }
                placeholder="24000"
                inputMode="numeric"
                autoComplete="off"
              />
              <span className="field__hint">
                Estimate is fine — refine it on site.
              </span>
            </label>
          </div>
        ))}

        <button type="button" className="btn btn--block" onClick={addSection}>
          Add section
        </button>

        <div className="actionbar">
          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={!canSave}
          >
            Save property
          </button>
        </div>
      </form>
    </div>
  )
}
