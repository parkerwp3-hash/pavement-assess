import { makeId } from './storage.js'

/** Shape of a lot section row in the new-property form. */
export function blankSection() {
  return { id: makeId('sec'), name: '', squareFeet: '' }
}

export function blankDraft() {
  return { name: '', address: '', sections: [blankSection()] }
}

/**
 * Normalise a draft from the form into a stored property.
 * Blank section rows are dropped; square footage is stored as a number or null
 * when the inspector hasn't measured it yet.
 */
export function draftToProperty(draft) {
  const sections = draft.sections
    .map((s) => ({
      id: s.id,
      name: s.name.trim(),
      squareFeet: parseSquareFeet(s.squareFeet),
    }))
    .filter((s) => s.name !== '' || s.squareFeet !== null)

  return {
    id: makeId('prop'),
    name: draft.name.trim(),
    address: draft.address.trim(),
    sections,
    createdAt: new Date().toISOString(),
  }
}

export function parseSquareFeet(value) {
  const digits = String(value).replace(/[^0-9.]/g, '')
  if (digits === '') return null
  const n = Number(digits)
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null
}

export function totalSquareFeet(property) {
  return property.sections.reduce((sum, s) => sum + (s.squareFeet ?? 0), 0)
}

export function formatNumber(n) {
  return n.toLocaleString('en-US')
}

export function pluralize(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`
}
