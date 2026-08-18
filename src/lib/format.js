/** Digits only — field entry on a phone keypad is sloppy. */
export function digitsOnly(value) {
  return value.replace(/[^\d]/g, '')
}

export function toSquareFeet(value) {
  const digits = digitsOnly(String(value ?? ''))
  return digits ? Number(digits) : 0
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-US')
}

export function formatSqFt(value) {
  return `${formatNumber(value)} sq ft`
}

/** Whole dollars — cents are noise at these magnitudes. */
export function formatMoney(value) {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

/**
 * Date-only strings are formatted without a timezone shift.
 * `new Date('2026-06-15')` parses as UTC midnight and renders as the 14th
 * anywhere west of Greenwich, which would silently misdate inspections.
 */
export function formatDate(value) {
  if (!value) return '—'
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const d = dateOnly ? new Date(`${value}T12:00:00`) : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })} | ${d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}
