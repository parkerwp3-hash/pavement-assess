/**
 * localStorage is the only persistence layer for now. Field sessions happen on
 * bad signal, so every read is defensive: a corrupt or half-written blob must
 * never take the app down mid-inspection.
 */

const KEY = 'pavement-assess:v1'

const EMPTY = { properties: [] }

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.properties)) return EMPTY
    return { properties: parsed.properties }
  } catch {
    return EMPTY
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  return `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
