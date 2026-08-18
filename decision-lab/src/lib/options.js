/** Field vocabularies for the repair-zone form. Values match the seed data. */

export const DISTRESS_OPTIONS = [
  'alligator_cracking', 'block_cracking', 'longitudinal_cracking',
  'transverse_cracking', 'edge_cracking', 'rutting', 'raveling', 'potholes',
  'depression', 'failed_patch', 'slab_cracking', 'joint_deterioration',
  'ada_noncompliance', 'faded_markings', 'drainage_failure',
]

export const SEVERITY_OPTIONS = ['low', 'moderate', 'severe']

export const SERVICE_OPTIONS = ['asphalt', 'concrete', 'sealcoat', 'striping', 'drainage']

export const TREATMENT_OPTIONS = [
  'crack_seal', 'seal_coat', 'surface_patch', 'full_depth_repair',
  'expanded_full_depth_repair', 'mill_and_overlay', 'reconstruction',
  'slab_replacement', 'joint_seal', 'ada_ramp_upgrade', 'restripe',
  'drainage_reconstruction',
]

export const UNIT_OPTIONS = ['SF', 'LF', 'EA']

export const PRIORITY_OPTIONS = ['high', 'medium', 'low']

export const CONFIDENCE_OPTIONS = ['high', 'moderate', 'low']

export const RISK_TAG_OPTIONS = [
  'asset_preservation', 'operational_continuity', 'safety', 'liability',
  'accessibility', 'drainage',
]

/** Next zone id unique within this site (RZ-<n+1> over its own zones). */
export function nextZoneId(site) {
  const max = site.repairZones.reduce((m, z) => {
    const n = Number(String(z.id).replace(/\D/g, ''))
    return Number.isFinite(n) ? Math.max(m, n) : m
  }, 0)
  return `RZ-${String(max + 1).padStart(3, '0')}`
}
