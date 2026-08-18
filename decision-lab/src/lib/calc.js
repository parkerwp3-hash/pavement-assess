/**
 * All derived and modeled math in one place.
 *
 * DERIVED values are arithmetic on observed inputs and carry no assumptions.
 * MODELED values depend on the adjustable assumptions object and are labeled
 * as such wherever they render. Nothing here ever modifies
 * currentCustomerPrice — those are authoritative imports from Diamond's
 * costing system.
 */

import { BASE_YEAR } from './seed.js'

/* Deep repairs only. Mill & overlay is surface rehabilitation and counting it
   as structural burden would push moderate sites into Critical. */
export const STRUCTURAL_TREATMENTS = new Set([
  'full_depth_repair',
  'expanded_full_depth_repair',
  'reconstruction',
])

export const BANDS = [
  { id: 0, label: 'Good — Preserve', short: 'Good', tone: 'good' },
  { id: 1, label: 'Fair — Plan', short: 'Fair', tone: 'fair' },
  { id: 2, label: 'Poor — Act', short: 'Poor', tone: 'poor' },
  { id: 3, label: 'Critical — Rehabilitate', short: 'Critical', tone: 'critical' },
]

export const SEVERITY_SCORE = { low: 35, moderate: 65, severe: 95 }

const sum = (arr, f = (x) => x) => arr.reduce((a, x) => a + f(x), 0)

function bandIndex(value, thresholds) {
  if (value <= thresholds[0]) return 0
  if (value <= thresholds[1]) return 1
  if (value <= thresholds[2]) return 2
  return 3
}

export function labelize(id) {
  return String(id || '')
    .split('_')
    .map((w) => (w === 'ada' ? 'ADA' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

/** DERIVED site metrics plus the (assumption-dependent) condition band. */
export function siteMetrics(site, A) {
  const z = site.repairZones
  const structuralSF = sum(
    z.filter((x) => x.service === 'asphalt' && STRUCTURAL_TREATMENTS.has(x.treatment) && x.unit === 'SF'),
    (x) => x.quantity,
  )
  const concreteRepairSF = sum(
    z.filter((x) => x.service === 'concrete' && x.unit === 'SF'),
    (x) => x.quantity,
  )
  const crackFillLF = sum(
    z.filter((x) => x.treatment === 'crack_seal' && x.unit === 'LF'),
    (x) => x.quantity,
  )
  const sealcoatSF = sum(
    z.filter((x) => x.service === 'sealcoat' && x.unit === 'SF'),
    (x) => x.quantity,
  )
  const invest = sum(z, (x) => x.currentCustomerPrice)
  const pavedSF = site.asphaltSF + site.concreteSF

  const burdenPct = site.asphaltSF ? (structuralSF / site.asphaltSF) * 100 : 0
  const concretePct = site.concreteSF ? (concreteRepairSF / site.concreteSF) * 100 : 0
  const crackDensity = site.asphaltSF ? crackFillLF / (site.asphaltSF / 1000) : 0
  const sealcoatSharePct = site.asphaltSF ? (sealcoatSF / site.asphaltSF) * 100 : 0
  const needPerSF = pavedSF ? invest / pavedSF : 0
  const criticalCount = z.filter((x) => x.severity === 'severe').length

  // MODELED: the band depends on adjustable thresholds; worse index wins.
  const computedBand = Math.max(
    bandIndex(burdenPct, A.burdenThresholds),
    bandIndex(crackDensity, A.crackDensityThresholds),
  )
  const override = site.conditionOverride
  const band = override ? override.band : computedBand
  const isPreservation =
    burdenPct <= A.preservation.maxBurdenPct &&
    sealcoatSharePct >= A.preservation.minSealcoatSharePct

  return {
    structuralSF,
    concreteRepairSF,
    crackFillLF,
    sealcoatSF,
    invest,
    pavedSF,
    burdenPct,
    concretePct,
    crackDensity,
    sealcoatSharePct,
    needPerSF,
    criticalCount,
    computedBand,
    band,
    overridden: Boolean(override),
    isPreservation,
  }
}

/** MODELED package priority score (0–100) from adjustable weights. */
export function packageScore(pkg, site, A) {
  const zones = site.repairZones.filter((z) => pkg.repairZoneIds.includes(z.id))
  if (zones.length === 0) return { score: 0, S: 0, R: 0, U: 0 }
  const S = sum(zones, (z) => SEVERITY_SCORE[z.severity] || 50) / zones.length
  const tags = new Set(zones.flatMap((z) => z.riskTags))
  const R = Math.min(100, tags.size * 25)
  const yearsOut = Math.max(0, pkg.recommendedYear - BASE_YEAR)
  const U = Math.max(0, 100 - yearsOut * 25)
  const w = A.priorityWeights
  const wTotal = w.severity + w.risk + w.urgency || 1
  const score = (w.severity * S + w.risk * R + w.urgency * U) / wTotal
  return { score: Math.round(score), S: Math.round(S), R, U }
}

export function packagePrice(pkg, site) {
  return sum(
    site.repairZones.filter((z) => pkg.repairZoneIds.includes(z.id)),
    (z) => z.currentCustomerPrice,
  )
}

/** Every package across the portfolio with its site, price and score. */
export function allPackages(sites, A) {
  return sites.flatMap((site) =>
    site.projectPackages.map((pkg) => ({
      site,
      pkg,
      price: packagePrice(pkg, site),
      ...packageScore(pkg, site, A),
    })),
  )
}

/** MODELED: current prices inflated to each package's recommended year. */
export function fiveYearInvestment(sites, A) {
  const infl = A.inflationPct / 100
  return sum(allPackages(sites, A), (row) => {
    const years = Math.max(0, row.pkg.recommendedYear - BASE_YEAR)
    return row.price * Math.pow(1 + infl, years)
  })
}

/**
 * MODELED budget scenario. Orders packages by the selected method, then funds
 * greedily in that order, skipping any package larger than what remains.
 */
export function budgetScenario(sites, A, budget) {
  const rows = allPackages(sites, A)
  const ordered = [...rows]
  if (A.budgetMethod === 'worst_first') {
    const burden = new Map(sites.map((s) => [s.id, siteMetrics(s, A).band]))
    ordered.sort(
      (a, b) => burden.get(b.site.id) - burden.get(a.site.id) || b.score - a.score,
    )
  } else if (A.budgetMethod === 'efficiency') {
    ordered.sort((a, b) => b.score / Math.max(1, b.price) - a.score / Math.max(1, a.price))
  } else {
    ordered.sort((a, b) => b.score - a.score)
  }

  const funded = []
  const unfunded = []
  let remaining = budget
  for (const row of ordered) {
    if (row.price <= remaining) {
      funded.push(row)
      remaining -= row.price
    } else {
      unfunded.push(row)
    }
  }

  const fundedSites = new Set(funded.map((r) => r.site.id))
  const highFunded = funded.filter((r) => r.score >= 70).length
  const highTotal = rows.filter((r) => r.score >= 70).length
  return {
    ordered,
    funded,
    unfunded,
    spend: sum(funded, (r) => r.price),
    remaining,
    sitesAddressed: fundedSites.size,
    pavedSFAddressed: sum(
      sites.filter((s) => fundedSites.has(s.id)),
      (s) => s.asphaltSF + s.concreteSF,
    ),
    highFunded,
    highRemaining: highTotal - highFunded,
    needFunded: sum(funded, (r) => r.price),
    needRemaining: sum(unfunded, (r) => r.price),
  }
}

/**
 * MODELED zone projection at `years` out. Quantity grows by the zone's
 * growth profile; unit cost inflates. Returns a range, never one number —
 * the direction and shape of future expansion are not known.
 */
export function projectZone(zone, years, A) {
  if (!zone.growthProfile || years === 0) return null
  const unitCost = zone.quantity ? zone.currentCustomerPrice / zone.quantity : 0
  const infl = Math.pow(1 + A.inflationPct / 100, years)
  const grow = (pct) => zone.quantity * Math.pow(1 + pct / 100, years)
  const g = A.growthPct
  // All three assumption paths are always computed; the zone's profile only
  // marks which path Diamond expects. The range is the answer, not one line.
  const qty = { low: grow(g.low), base: grow(g.base), high: grow(g.high) }
  return {
    qty,
    cost: {
      low: qty.low * unitCost * infl,
      base: qty.base * unitCost * infl,
      high: qty.high * unitCost * infl,
    },
    unitCostNow: unitCost,
    unitCostThen: unitCost * infl,
  }
}

/* -------- portfolio rollups for the dashboard charts -------- */

export function portfolioRollups(sites, A) {
  const zones = sites.flatMap((s) => s.repairZones.map((z) => ({ site: s, z })))
  const by = (keyFn) => {
    const map = new Map()
    for (const { z, site } of zones) {
      const key = keyFn(z, site)
      map.set(key, (map.get(key) || 0) + z.currentCustomerPrice)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }
  const byYear = new Map()
  for (const row of allPackages(sites, A)) {
    byYear.set(row.pkg.recommendedYear, (byYear.get(row.pkg.recommendedYear) || 0) + row.price)
  }
  // Risk attribution uses the zone's primary (first) tag so sums equal total.
  return {
    byService: by((z) => z.service),
    byRegion: by((_, s) => s.region),
    byRisk: by((z) => z.riskTags[0] || 'unclassified'),
    byYear: [...byYear.entries()].sort((a, b) => a[0] - b[0]),
    conditionSF: BANDS.map((band) =>
      sum(
        sites.filter((s) => siteMetrics(s, A).band === band.id),
        (s) => s.asphaltSF + s.concreteSF,
      ),
    ),
    confidenceValue: ['high', 'moderate', 'low'].map((c) =>
      sum(zones.filter(({ z }) => z.confidence === c), ({ z }) => z.currentCustomerPrice),
    ),
  }
}
