/** The small arithmetic layer the lean app needs. All of it is plain sums
    over observed inputs — imported prices are never recomputed. */

const sum = (arr, f = (x) => x) => arr.reduce((a, x) => a + f(x), 0)

export function labelize(id) {
  return String(id || '')
    .split('_')
    .map((w) => (w === 'ada' ? 'ADA' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

export function siteSummary(site) {
  return {
    pavedSF: site.asphaltSF + site.concreteSF,
    invest: sum(site.repairZones, (z) => z.currentCustomerPrice),
    zoneCount: site.repairZones.length,
    packageCount: site.projectPackages.length,
  }
}

export function packagePrice(pkg, site) {
  return sum(
    site.repairZones.filter((z) => pkg.repairZoneIds.includes(z.id)),
    (z) => z.currentCustomerPrice,
  )
}
