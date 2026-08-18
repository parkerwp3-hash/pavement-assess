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

export const CLIMATE_REGIONS = [
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
export const climateRegion = lookup(CLIMATE_REGIONS)

/** Label for a stored id, or a dash when the field was never set. */
export function labelFor(options, id) {
  const match = options.find((o) => o.id === id)
  return match ? match.label : '—'
}
