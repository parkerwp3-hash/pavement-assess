/**
 * localStorage persistence.
 *
 * State is just { sites }. Older saves (and older exports) carried an
 * assumptions object from the full build — loads take the sites and drop the
 * rest, so nothing breaks for anyone who already has data.
 */

import { SEED_SITES } from './seed.js'

const KEY = 'ddl/v1/state'

const clone = (x) => JSON.parse(JSON.stringify(x))

export function freshState() {
  return { sites: clone(SEED_SITES) }
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return freshState()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.sites)) return freshState()
    return { sites: parsed.sites }
  } catch {
    return freshState()
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ sites: state.sites }))
    return true
  } catch {
    return false // quota or private browsing — the session keeps working in memory
  }
}

export function resetState() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  return freshState()
}

export function exportJSON(state) {
  return JSON.stringify(
    {
      format: 'diamond-decision-lab',
      version: 2,
      exportedAt: new Date().toISOString(),
      sites: state.sites,
    },
    null,
    2,
  )
}

/** Returns {state} or {error} — never throws into the UI. */
export function importJSON(text) {
  try {
    const parsed = JSON.parse(text)
    const sites = parsed.sites
    if (!Array.isArray(sites) || sites.length === 0) {
      return { error: 'No "sites" array found in that JSON.' }
    }
    for (const s of sites) {
      if (!s.id || !Array.isArray(s.repairZones)) {
        return { error: `Site ${s.id || '(missing id)'} is missing an id or repairZones array.` }
      }
    }
    return { state: { sites } }
  } catch (e) {
    return { error: `Could not parse JSON: ${e.message}` }
  }
}
