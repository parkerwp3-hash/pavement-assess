/**
 * Fixed vocabularies for property classification.
 *
 * These are picked from a list rather than typed. Free text here would make
 * reports impossible to group, and typing on a phone in a parking lot is the
 * slowest thing an inspector can be asked to do.
 *
 * The hints exist because traffic and climate are judgment calls made at the
 * curb — a new inspector should not have to guess what "Distribution" covers.
 */

export const FACILITY_TYPES = [
  { id: 'retail', label: 'Retail' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'distribution', label: 'Distribution' },
  { id: 'office', label: 'Office' },
  { id: 'medical', label: 'Medical' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'education', label: 'Education' },
  { id: 'church', label: 'Church' },
  { id: 'government', label: 'Government' },
  { id: 'fuel-station', label: 'Fuel Station' },
  { id: 'multi-family', label: 'Multi-Family' },
  { id: 'shopping-center', label: 'Shopping Center' },
  // Present as a facilityType in the client schema, distinct from the traffic
  // class of the same name: the terminal is what the site *is*, not just how
  // hard it is driven.
  { id: 'truck-terminal', label: 'Truck Terminal' },
]

export const TRAFFIC_CLASSES = [
  { id: 'light', label: 'Light', hint: 'Low turnover — small office, church' },
  { id: 'medium', label: 'Medium', hint: 'Steady cars — retail, schools' },
  { id: 'heavy', label: 'Heavy', hint: 'High turnover, delivery and bus mix' },
  {
    id: 'distribution',
    label: 'Distribution',
    hint: 'Regular tractor-trailer movement',
  },
  {
    id: 'industrial',
    label: 'Industrial',
    hint: 'Heavy equipment and loaded axles',
  },
  {
    id: 'truck-terminal',
    label: 'Truck Terminal',
    hint: 'Constant trailer traffic and dock loading',
  },
]

export const CLIMATE_ZONES = [
  {
    id: 'freeze-thaw',
    label: 'Freeze-Thaw',
    hint: 'Repeated freezing — cracking, potholes',
  },
  { id: 'hot-dry', label: 'Hot Dry', hint: 'High UV — oxidation, raveling' },
  {
    id: 'hot-humid',
    label: 'Hot Humid',
    hint: 'Heat plus moisture — rutting, stripping',
  },
  { id: 'coastal', label: 'Coastal', hint: 'Salt air, high water table' },
  { id: 'temperate', label: 'Temperate', hint: 'Mild swings year-round' },
  {
    id: 'mountain',
    label: 'Mountain',
    hint: 'Hard freezes, plowing, steep grades',
  },
]

function lookup(options) {
  const byId = new Map(options.map((o) => [o.id, o]))
  return (id) => byId.get(id) || null
}

export const facilityType = lookup(FACILITY_TYPES)
export const trafficClass = lookup(TRAFFIC_CLASSES)
export const climateZone = lookup(CLIMATE_ZONES)

/** Label for a stored id, or a dash when the field was never set. */
export function labelFor(options, id) {
  const match = options.find((o) => o.id === id)
  return match ? match.label : '—'
}

/* --------------------------------------------------------------------------
   Assessment vocabularies — repair zones and the packages they roll into.
   -------------------------------------------------------------------------- */

export const DISTRESS_TYPES = [
  { id: 'alligator_cracking', label: 'Alligator Cracking' },
  { id: 'block_cracking', label: 'Block Cracking' },
  { id: 'longitudinal_cracking', label: 'Longitudinal Cracking' },
  { id: 'transverse_cracking', label: 'Transverse Cracking' },
  { id: 'edge_cracking', label: 'Edge Cracking' },
  { id: 'rutting', label: 'Rutting' },
  { id: 'raveling', label: 'Raveling' },
  { id: 'potholes', label: 'Potholes' },
  { id: 'depression', label: 'Depression' },
  { id: 'failed_patch', label: 'Failed Patch' },
  { id: 'slab_cracking', label: 'Slab Cracking' },
  { id: 'joint_deterioration', label: 'Joint Deterioration' },
]

export const SEVERITIES = [
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'severe', label: 'Severe' },
]

export const SERVICES = [
  { id: 'asphalt', label: 'Asphalt' },
  { id: 'concrete', label: 'Concrete' },
  { id: 'sealcoat', label: 'Sealcoat' },
  { id: 'striping', label: 'Striping' },
]

export const TREATMENTS = [
  { id: 'full_depth_repair', label: 'Full Depth Repair' },
  { id: 'expanded_full_depth_repair', label: 'Expanded Full Depth Repair' },
  { id: 'mill_and_overlay', label: 'Mill and Overlay' },
  { id: 'surface_patch', label: 'Surface Patch' },
  { id: 'crack_seal', label: 'Crack Seal' },
  { id: 'seal_coat', label: 'Seal Coat' },
  { id: 'slab_replacement', label: 'Slab Replacement' },
  { id: 'joint_seal', label: 'Joint Seal' },
  { id: 'restripe', label: 'Restripe' },
]

export const PRIORITIES = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

/** Shared by confidence, projectionConfidence and growthProfile. */
export const LEVELS = [
  { id: 'high', label: 'High' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

export const RISK_TAGS = [
  { id: 'asset_preservation', label: 'Asset Preservation' },
  { id: 'operational_continuity', label: 'Operational Continuity' },
  { id: 'safety', label: 'Safety' },
  { id: 'liability', label: 'Liability' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'drainage', label: 'Drainage' },
]

export const UNITS = [
  { id: 'SF', label: 'SF' },
  { id: 'SY', label: 'SY' },
  { id: 'LF', label: 'LF' },
  { id: 'EA', label: 'EA' },
]

/**
 * Resolve a value that may arrive as either an id or a display label.
 *
 * The client schema writes labels ("Truck Terminal", "Hot Humid") while we
 * store ids, so every field that crosses that boundary goes through here. It
 * means a record pasted straight from their system imports without a
 * translation pass.
 */
export function toId(options, value) {
  if (!value) return ''
  const raw = String(value).trim()
  const direct = options.find((o) => o.id === raw)
  if (direct) return direct.id
  const slug = raw.toLowerCase().replace(/[\s-]+/g, '_')
  const bySlug = options.find((o) => o.id === slug)
  if (bySlug) return bySlug.id
  const byLabel = options.find(
    (o) => o.label.toLowerCase() === raw.toLowerCase(),
  )
  return byLabel ? byLabel.id : ''
}
