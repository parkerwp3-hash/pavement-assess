/**
 * localStorage-backed persistence.
 *
 * Everything is local for now — the field device is often out of signal, so the
 * app must be fully usable with no network. Reads and writes are defensive:
 * private browsing and full-quota devices both throw on access, and losing a
 * write must never take down the inspection in progress.
 */

const KEY = 'pavement-assess/v1/properties'

function safeStorage() {
  try {
    const probe = '__pa_probe__'
    window.localStorage.setItem(probe, probe)
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

export function loadProperties() {
  const store = safeStorage()
  if (!store) return []

  try {
    const raw = store.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveProperties(properties) {
  const store = safeStorage()
  if (!store) return false

  try {
    store.setItem(KEY, JSON.stringify(properties))
    return true
  } catch {
    return false
  }
}

/** Stable id without pulling in a dependency. */
export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
