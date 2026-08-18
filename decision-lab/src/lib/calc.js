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

/* Condition tone from an imported PCI score. Colors are the app's status
   tokens, and the label always renders beside the color. */
export function pciTone(pci) {
  if (pci == null) return { label: 'Not scored', cssVar: 'var(--ink-3)' }
  if (pci >= 80) return { label: 'Good', cssVar: 'var(--good)' }
  if (pci >= 60) return { label: 'Fair', cssVar: 'var(--fair)' }
  if (pci >= 40) return { label: 'Poor', cssVar: 'var(--poor)' }
  return { label: 'Critical', cssVar: 'var(--critical)' }
}

const DEEP_STRUCTURAL = new Set([
  'full_depth_repair',
  'expanded_full_depth_repair',
  'reconstruction',
  'slab_replacement',
])

/** True when a zone belongs to a display category. Categories mirror the
    portfolio card: four are tag-driven, structural is treatment-driven. */
export function zoneInCategory(zone, key) {
  const hasTag = (...tags) => zone.riskTags?.some((t) => tags.includes(t))
  if (key === 'liability') return hasTag('liability', 'safety')
  if (key === 'ada') return hasTag('accessibility')
  if (key === 'maintenance') return hasTag('asset_preservation')
  if (key === 'drainage') return hasTag('drainage')
  if (key === 'structural') return DEEP_STRUCTURAL.has(zone.treatment)
  return false
}

/** Issue counts DERIVED from the risk tags and treatments already on zones —
    the card invents nothing. Each entry counts matching zones. */
export function issueCounts(site) {
  const n = (key) => site.repairZones.filter((z) => zoneInCategory(z, key)).length
  return [
    { key: 'liability', label: 'Liability', count: n('liability'), cssVar: 'var(--critical)' },
    { key: 'ada', label: 'ADA', count: n('ada'), cssVar: 'var(--poor)' },
    { key: 'maintenance', label: 'Maint.', count: n('maintenance'), cssVar: 'var(--cat-asphalt)' },
    { key: 'drainage', label: 'Drainage', count: n('drainage'), cssVar: 'var(--cat-sealcoat)' },
    { key: 'structural', label: 'Structural', count: n('structural'), cssVar: 'var(--ink-2)' },
  ]
}
