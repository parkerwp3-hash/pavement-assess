// localStorage-backed persistence.
//
// Field devices lose signal constantly, so every write is local and synchronous.
// A sync layer can be added later by replaying this same shape to a server.

const KEY = 'pavement-assess/properties/v1'

function isProperty(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  )
}

export function loadProperties() {
  let raw
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    // Private browsing or storage disabled — run in memory for this session.
    return []
  }
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isProperty).map((p) => ({
      ...p,
      sections: Array.isArray(p.sections) ? p.sections : [],
    }))
  } catch {
    return []
  }
}

export function saveProperties(properties) {
  try {
    localStorage.setItem(KEY, JSON.stringify(properties))
    return true
  } catch {
    return false
  }
}

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
