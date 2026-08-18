/**
 * localStorage-backed persistence.
 *
 * Everything lives under one key so a whole survey can be exported or wiped in
 * one move. Reads are defensive: a phone that ran out of storage mid-write, or
 * a private-browsing context that refuses writes, must not take the app down in
 * the field.
 */

const KEY = 'pavement-assess:v1'

const EMPTY = { properties: [] }

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.properties)) return EMPTY
    return parsed
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

/** Stable-enough id without pulling in a uuid dependency. */
export function makeId(prefix) {
  if (window.crypto?.randomUUID) return `${prefix}_${window.crypto.randomUUID()}`
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
