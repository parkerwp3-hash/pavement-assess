import { useState } from 'react'
import ChoiceList from '../components/ChoiceList.jsx'
import ChoiceSheet from '../components/ChoiceSheet.jsx'
import { ChevronLeftIcon, CloseIcon, PlusIcon } from '../components/Icons.jsx'
import { createId } from '../lib/storage.js'
import { digitsOnly, formatSqFt, toSquareFeet } from '../lib/format.js'
import {
  CLIMATE_REGIONS,
  FACILITY_TYPES,
  TRAFFIC_CLASSES,
  labelFor,
} from '../lib/taxonomy.js'

const STEPS = [
  'property',
  'facility',
  'traffic',
  'climate',
  'assignment',
  'sections',
]

const TITLES = {
  property: 'Property',
  facility: 'Facility type',
  traffic: 'Traffic class',
  climate: 'Climate region',
  assignment: 'Assignment',
  sections: 'Lot sections',
}

function blankSection(trafficClass = '') {
  return { id: createId(), name: '', sqft: '', trafficClass }
}

export default function NewPropertyFlow({ onCancel, onSave }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [draft, setDraft] = useState({
    name: '',
    address: '',
    facilityType: '',
    trafficClass: '',
    climateRegion: '',
    region: '',
    propertyManager: '',
    businessUnit: '',
  })
  const [sections, setSections] = useState(() => [blankSection()])
  // Section id whose traffic-class picker is open, if any.
  const [pickingFor, setPickingFor] = useState(null)

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1
  const totalSqFt = sections.reduce((sum, s) => sum + toSquareFeet(s.sqft), 0)
  // Only the name is required; everything else can be filled in later rather
  // than blocking an inspector who is already standing on the lot.
  const canAdvance = step === 'property' ? draft.name.trim().length > 0 : true

  function set(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  function updateSection(id, patch) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function back() {
    if (stepIndex === 0) onCancel()
    else setStepIndex((i) => i - 1)
  }

  function next() {
    if (!canAdvance) return
    const target = Math.min(stepIndex + 1, STEPS.length - 1)
    // The first section card exists before the property's traffic class is
    // chosen, so it cannot inherit at creation the way later ones do. Backfill
    // on the way in — an untouched section should still carry the class.
    if (STEPS[target] === 'sections' && draft.trafficClass) {
      setSections((prev) =>
        prev.map((s) =>
          s.trafficClass ? s : { ...s, trafficClass: draft.trafficClass },
        ),
      )
    }
    setStepIndex(target)
  }

  /** Choice steps advance on selection — the tap is the answer. */
  function choose(field, value) {
    set(field, value)
    next()
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!isLast) {
      next()
      return
    }

    // Drop rows the inspector added but never filled in.
    const cleaned = sections
      .filter((s) => s.name.trim() || toSquareFeet(s.sqft) > 0)
      .map((s, index) => ({
        id: s.id,
        name: s.name.trim() || `Section ${index + 1}`,
        sqft: toSquareFeet(s.sqft),
        trafficClass: s.trafficClass,
      }))

    onSave({
      id: createId(),
      ...draft,
      name: draft.name.trim(),
      address: draft.address.trim(),
      region: draft.region.trim(),
      propertyManager: draft.propertyManager.trim(),
      businessUnit: draft.businessUnit.trim(),
      sections: cleaned,
      createdAt: new Date().toISOString(),
    })
  }

  const picking = sections.find((s) => s.id === pickingFor) || null

  return (
    <div className="flow" role="dialog" aria-modal="true" aria-label="New property">
      <header className="flow-header">
        <button
          type="button"
          className="icon-btn"
          onClick={back}
          aria-label={stepIndex === 0 ? 'Cancel' : 'Back'}
        >
          {stepIndex === 0 ? <CloseIcon /> : <ChevronLeftIcon />}
        </button>
        <h2 className="flow-title">{TITLES[step]}</h2>
        <span className="flow-step">
          {stepIndex + 1}/{STEPS.length}
        </span>
      </header>

      <div
        className="progress"
        role="progressbar"
        aria-valuenow={stepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}
      >
        <span
          className="progress-fill"
          style={{ inlineSize: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <form className="flow-form" onSubmit={handleSubmit}>
        {step === 'property' ? (
          <div className="flow-body">
            <label className="field">
              <span className="field-label">Name</span>
              <input
                className="input"
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
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
                value={draft.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder={'1420 Northgate Blvd\nColumbus, OH 43220'}
                autoComplete="off"
                autoCapitalize="words"
                rows={3}
              />
            </label>
          </div>
        ) : null}

        {step === 'facility' ? (
          <div className="flow-body flow-body--flush">
            <ChoiceList
              name="Facility type"
              options={FACILITY_TYPES}
              value={draft.facilityType}
              onChange={(id) => choose('facilityType', id)}
            />
          </div>
        ) : null}

        {step === 'traffic' ? (
          <div className="flow-body flow-body--flush">
            <p className="step-note">
              How the lot is used overall. Individual sections can differ.
            </p>
            <ChoiceList
              name="Traffic class"
              options={TRAFFIC_CLASSES}
              value={draft.trafficClass}
              onChange={(id) => choose('trafficClass', id)}
            />
          </div>
        ) : null}

        {step === 'climate' ? (
          <div className="flow-body flow-body--flush">
            <ChoiceList
              name="Climate region"
              options={CLIMATE_REGIONS}
              value={draft.climateRegion}
              onChange={(id) => choose('climateRegion', id)}
            />
          </div>
        ) : null}

        {step === 'assignment' ? (
          <div className="flow-body">
            <label className="field">
              <span className="field-label">Region / district</span>
              <input
                className="input"
                value={draft.region}
                onChange={(e) => set('region', e.target.value)}
                placeholder="Midwest — Ohio Valley"
                autoComplete="off"
                autoCapitalize="words"
              />
            </label>

            <label className="field">
              <span className="field-label">Property manager</span>
              <input
                className="input"
                value={draft.propertyManager}
                onChange={(e) => set('propertyManager', e.target.value)}
                placeholder="Dana Reyes"
                autoComplete="off"
                autoCapitalize="words"
              />
            </label>

            <label className="field">
              <span className="field-label">Business unit</span>
              <input
                className="input"
                value={draft.businessUnit}
                onChange={(e) => set('businessUnit', e.target.value)}
                placeholder="Commercial Retail Group"
                autoComplete="off"
                autoCapitalize="words"
              />
            </label>
          </div>
        ) : null}

        {step === 'sections' ? (
          <div className="flow-body">
            {sections.map((section, index) => (
              <div className="section-card" key={section.id}>
                <div className="section-card-head">
                  <span className="section-card-index">Section {index + 1}</span>
                  {sections.length > 1 ? (
                    <button
                      type="button"
                      className="btn btn--danger-text"
                      onClick={() =>
                        setSections((prev) =>
                          prev.filter((s) => s.id !== section.id),
                        )
                      }
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

                <div className="field">
                  <span className="field-label">Traffic class</span>
                  <button
                    type="button"
                    className="select-btn"
                    onClick={() => setPickingFor(section.id)}
                  >
                    <span
                      className={
                        section.trafficClass
                          ? 'select-btn-value'
                          : 'select-btn-value select-btn-value--empty'
                      }
                    >
                      {section.trafficClass
                        ? labelFor(TRAFFIC_CLASSES, section.trafficClass)
                        : 'Choose'}
                    </span>
                    <ChevronLeftIcon className="select-btn-caret" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn--ghost"
              onClick={() =>
                setSections((prev) => [
                  ...prev,
                  // New sections start at the property's class — most lots are
                  // uniform, and the outlier is the one worth a tap.
                  blankSection(draft.trafficClass),
                ])
              }
            >
              <PlusIcon />
              Add section
            </button>

            <div className="total-line">
              <span>Total area</span>
              <span className="total-line-value">{formatSqFt(totalSqFt)}</span>
            </div>
          </div>
        ) : null}

        <div className="action-bar">
          <button type="submit" className="btn" disabled={!canAdvance}>
            {isLast ? 'Save property' : 'Next'}
          </button>
        </div>
      </form>

      {picking ? (
        <ChoiceSheet
          title="Traffic class"
          options={TRAFFIC_CLASSES}
          value={picking.trafficClass}
          onChange={(id) => updateSection(picking.id, { trafficClass: id })}
          onClose={() => setPickingFor(null)}
        />
      ) : null}
    </div>
  )
}
