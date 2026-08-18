/** Digits only — field entry on a phone keypad is sloppy. */
export function digitsOnly(value) {
  return value.replace(/[^\d]/g, '')
}

export function toSquareFeet(value) {
  const digits = digitsOnly(String(value ?? ''))
  return digits ? Number(digits) : 0
}

export function formatSqFt(value) {
  return `${Number(value || 0).toLocaleString('en-US')} sq ft`
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}
