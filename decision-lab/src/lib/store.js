/**
 * localStorage persistence for the whole lab state.
 *
 * One key holds sites + assumptions. Uploaded map images are kept inside the
 * site records (data URLs), so export/import round-trips them; a size guard
 * warns before a big image threatens the ~5MB storage quota.
 */

import { DEFAULT_ASSUMPTIONS, SEED_SITES } from './seed.js'

const KEY = 'ddl/v1/state'

const clone = (x) => JSON.parse(JSON.stringify(x))

export function freshState() {
  return { sites: clone(SEED_SITES), assumptions: clone(DEFAULT_ASSUMPTIONS) }
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return freshState()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.sites) || !parsed.assumptions) return freshState()
    // Missing assumption fields (older saves) fall back to defaults.
    return {
      sites: parsed.sites,
      assumptions: { ...clone(DEFAULT_ASSUMPTIONS), ...parsed.assumptions },
    }
  } catch {
    return freshState()
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
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
    { format: 'diamond-decision-lab', version: 1, exportedAt: new Date().toISOString(), ...state },
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
    return {
      state: {
        sites,
        assumptions: { ...freshState().assumptions, ...(parsed.assumptions || {}) },
      },
    }
  } catch (e) {
    return { error: `Could not parse JSON: ${e.message}` }
  }
}
