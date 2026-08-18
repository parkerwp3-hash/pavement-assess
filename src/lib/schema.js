/**
 * Site records: normalization and the demo seed.
 *
 * The canonical shape is the client's assessment schema — surfaceAreas,
 * repairZones with normalized map geometry, projectPackages. Their records
 * carry display labels ("Truck Terminal") where we store ids, so normalize()
 * accepts either and always yields ids. A record exported from their system
 * can be dropped in unchanged.
 */

import {
  createId,
  loadProperties,
  readFlag,
  saveProperties,
  writeFlag,
} from './storage.js'
import {
  CLIMATE_ZONES,
  DISTRESS_TYPES,
  FACILITY_TYPES,
  LEVELS,
  PRIORITIES,
  SERVICES,
  SEVERITIES,
  TRAFFIC_CLASSES,
  TREATMENTS,
  toId,
} from './taxonomy.js'

function num(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function normalizeRepairZone(zone, index) {
  const quantity = num(zone.quantity)
  return {
    id: zone.id || `RZ-${String(index + 1).padStart(3, '0')}`,
    distressType: toId(DISTRESS_TYPES, zone.distressType),
    severity: toId(SEVERITIES, zone.severity),
    service: toId(SERVICES, zone.service),
    recommendedTreatment: toId(TREATMENTS, zone.recommendedTreatment),
    quantity,
    unit: zone.unit || 'SF',
    currentCustomerPrice: num(zone.currentCustomerPrice),
    priority: toId(PRIORITIES, zone.priority),
    confidence: toId(LEVELS, zone.confidence),
    riskTags: Array.isArray(zone.riskTags) ? zone.riskTags : [],
    linkedProjectPackageId: zone.linkedProjectPackageId || '',
    geometry: {
      type: zone.geometry?.type || 'polygon',
      points: Array.isArray(zone.geometry?.points) ? zone.geometry.points : [],
    },
    modeledAssumptions: {
      growthProfile: toId(LEVELS, zone.modeledAssumptions?.growthProfile),
      nextLikelyTreatment: toId(
        TREATMENTS,
        zone.modeledAssumptions?.nextLikelyTreatment,
      ),
      projectionConfidence: toId(
        LEVELS,
        zone.modeledAssumptions?.projectionConfidence,
      ),
    },
  }
}

function normalizePackage(pkg, index) {
  return {
    id: pkg.id || `PKG-${String(index + 1).padStart(3, '0')}`,
    name: pkg.name || 'Untitled package',
    repairZoneIds: Array.isArray(pkg.repairZoneIds) ? pkg.repairZoneIds : [],
    recommendedYear: num(pkg.recommendedYear),
    currentCustomerPrice: num(pkg.currentCustomerPrice),
    priorityScore: num(pkg.priorityScore),
    approvalReason: pkg.approvalReason || '',
    status: pkg.status || 'proposed',
  }
}

/**
 * Fill in every field a screen might read.
 *
 * Records predate most of this schema — the app shipped with name, address and
 * sections only — so each screen would otherwise need its own guards.
 */
export function normalizeSite(site = {}) {
  const surfaceAreas = site.surfaceAreas || {}
  const asphaltSF = num(surfaceAreas.asphaltSF)
  const concreteSF = num(surfaceAreas.concreteSF)

  const sections = (site.sections || []).map((section) => ({
    id: section.id || createId(),
    name: section.name || '',
    sqft: num(section.sqft),
    trafficClass: toId(TRAFFIC_CLASSES, section.trafficClass),
  }))

  return {
    id: site.id || createId(),
    clientId: site.clientId || '',
    name: site.name || '',
    address: site.address || '',
    region: site.region || '',
    facilityType: toId(FACILITY_TYPES, site.facilityType),
    trafficClass: toId(TRAFFIC_CLASSES, site.trafficClass),
    climateZone: toId(CLIMATE_ZONES, site.climateZone ?? site.climateRegion),
    propertyManager: site.propertyManager || '',
    businessUnit: site.businessUnit || '',
    inspectionDate: site.inspectionDate || '',
    createdAt: site.createdAt || '',
    highPriority: Boolean(site.highPriority),
    // Seeded content is flagged so it can never be mistaken for a real survey.
    mockData: Boolean(site.mockData),

    surfaceAreas: {
      asphaltSF,
      concreteSF,
      // Trust an explicit total when present; otherwise derive it.
      totalPavedSF: num(surfaceAreas.totalPavedSF) || asphaltSF + concreteSF,
    },

    map: {
      imageUrl: site.map?.imageUrl ?? null,
      coordinateSystem: site.map?.coordinateSystem || 'normalized',
    },

    sections,
    repairZones: (site.repairZones || []).map(normalizeRepairZone),
    projectPackages: (site.projectPackages || []).map(normalizePackage),

    ratings: site.ratings || null,
    team: site.team || [],
    budgets: site.budgets || [],
    documents: site.documents || [],
    projects: site.projects || [],
    activities: site.activities || [],
    projectStage: num(site.projectStage),
  }
}

/** Sum of every repair zone's price — what the site needs in total. */
export function totalRepairPrice(site) {
  return (site.repairZones || []).reduce(
    (sum, zone) => sum + zone.currentCustomerPrice,
    0,
  )
}

export function zonesForPackage(site, packageId) {
  return (site.repairZones || []).filter(
    (zone) => zone.linkedProjectPackageId === packageId,
  )
}

/**
 * Demo site, carried verbatim from the client's example record and extended
 * with enough zones and packages to exercise the map and package views.
 * `mockData` stays true so every screen can label it.
 */
export const DEMO_SITE = normalizeSite({
  id: 'SITE-001',
  clientId: 'PENSKE-DEMO',
  name: 'Charlotte Fleet Service Center',
  address: 'Demo Location',
  region: 'Southeast',
  facilityType: 'Truck Terminal',
  trafficClass: 'Heavy',
  climateZone: 'Hot Humid',
  inspectionDate: '2026-06-15',
  mockData: true,
  highPriority: true,
  projectStage: 3,
  propertyManager: 'Dana Reyes',
  businessUnit: 'Fleet Operations',

  surfaceAreas: { asphaltSF: 420000, concreteSF: 28000, totalPavedSF: 448000 },
  map: { imageUrl: null, coordinateSystem: 'normalized' },

  sections: [
    { id: 'SEC-1', name: 'Main lot', sqft: 268000, trafficClass: 'heavy' },
    { id: 'SEC-2', name: 'Dock apron', sqft: 96000, trafficClass: 'truck-terminal' },
    { id: 'SEC-3', name: 'Rear drive lane', sqft: 56000, trafficClass: 'distribution' },
    { id: 'SEC-4', name: 'Fuel island', sqft: 28000, trafficClass: 'heavy' },
  ],

  repairZones: [
    {
      id: 'RZ-001',
      distressType: 'alligator_cracking',
      severity: 'severe',
      service: 'asphalt',
      recommendedTreatment: 'full_depth_repair',
      quantity: 4200,
      unit: 'SF',
      currentCustomerPrice: 54600,
      priority: 'high',
      confidence: 'high',
      riskTags: ['asset_preservation', 'operational_continuity'],
      linkedProjectPackageId: 'PKG-001',
      geometry: {
        type: 'polygon',
        points: [
          [0.18, 0.31],
          [0.31, 0.28],
          [0.36, 0.42],
          [0.22, 0.47],
        ],
      },
      modeledAssumptions: {
        growthProfile: 'high',
        nextLikelyTreatment: 'expanded_full_depth_repair',
        projectionConfidence: 'low',
      },
    },
    {
      id: 'RZ-002',
      distressType: 'rutting',
      severity: 'moderate',
      service: 'asphalt',
      recommendedTreatment: 'mill_and_overlay',
      quantity: 9800,
      unit: 'SF',
      currentCustomerPrice: 41160,
      priority: 'high',
      confidence: 'moderate',
      riskTags: ['operational_continuity'],
      linkedProjectPackageId: 'PKG-001',
      geometry: {
        type: 'polygon',
        points: [
          [0.46, 0.22],
          [0.68, 0.2],
          [0.7, 0.33],
          [0.48, 0.35],
        ],
      },
      modeledAssumptions: {
        growthProfile: 'moderate',
        nextLikelyTreatment: 'full_depth_repair',
        projectionConfidence: 'moderate',
      },
    },
    {
      id: 'RZ-003',
      distressType: 'joint_deterioration',
      severity: 'severe',
      service: 'concrete',
      recommendedTreatment: 'slab_replacement',
      quantity: 620,
      unit: 'SF',
      currentCustomerPrice: 27900,
      priority: 'high',
      confidence: 'high',
      riskTags: ['safety', 'operational_continuity'],
      linkedProjectPackageId: 'PKG-002',
      geometry: {
        type: 'polygon',
        points: [
          [0.74, 0.52],
          [0.88, 0.5],
          [0.89, 0.63],
          [0.75, 0.65],
        ],
      },
      modeledAssumptions: {
        growthProfile: 'high',
        nextLikelyTreatment: 'slab_replacement',
        projectionConfidence: 'moderate',
      },
    },
    {
      id: 'RZ-004',
      distressType: 'block_cracking',
      severity: 'low',
      service: 'sealcoat',
      recommendedTreatment: 'crack_seal',
      quantity: 31000,
      unit: 'SF',
      currentCustomerPrice: 18600,
      priority: 'medium',
      confidence: 'moderate',
      riskTags: ['asset_preservation'],
      linkedProjectPackageId: 'PKG-003',
      geometry: {
        type: 'polygon',
        points: [
          [0.12, 0.62],
          [0.4, 0.6],
          [0.42, 0.82],
          [0.14, 0.84],
        ],
      },
      modeledAssumptions: {
        growthProfile: 'low',
        nextLikelyTreatment: 'seal_coat',
        projectionConfidence: 'high',
      },
    },
    {
      id: 'RZ-005',
      distressType: 'potholes',
      severity: 'severe',
      service: 'asphalt',
      recommendedTreatment: 'surface_patch',
      quantity: 890,
      unit: 'SF',
      currentCustomerPrice: 12460,
      priority: 'high',
      confidence: 'high',
      riskTags: ['safety', 'liability'],
      linkedProjectPackageId: 'PKG-002',
      geometry: {
        type: 'polygon',
        points: [
          [0.55, 0.68],
          [0.64, 0.66],
          [0.66, 0.78],
          [0.56, 0.8],
        ],
      },
      modeledAssumptions: {
        growthProfile: 'high',
        nextLikelyTreatment: 'full_depth_repair',
        projectionConfidence: 'low',
      },
    },
  ],

  projectPackages: [
    {
      id: 'PKG-001',
      name: '2027 Structural Asphalt Repairs',
      repairZoneIds: ['RZ-001', 'RZ-002'],
      recommendedYear: 2027,
      currentCustomerPrice: 95760,
      priorityScore: 88,
      approvalReason:
        'Severe connected cracking in a heavy truck circulation area.',
      status: 'awaiting_approval',
    },
    {
      id: 'PKG-002',
      name: '2027 Safety and Concrete Remediation',
      repairZoneIds: ['RZ-003', 'RZ-005'],
      recommendedYear: 2027,
      currentCustomerPrice: 40360,
      priorityScore: 81,
      approvalReason:
        'Open potholes and failed joints on the dock apron are a trip and tire hazard.',
      status: 'proposed',
    },
    {
      id: 'PKG-003',
      name: '2028 Preventive Surface Program',
      repairZoneIds: ['RZ-004'],
      recommendedYear: 2028,
      currentCustomerPrice: 18600,
      priorityScore: 54,
      approvalReason:
        'Low-severity block cracking; sealing now defers a costly overlay.',
      status: 'proposed',
    },
  ],

  ratings: {
    function: { label: 'Rating: A', tone: 'good', date: '2026-06-15' },
    liability: { label: 'Risk Rating: High Risk', tone: 'bad', date: '2026-06-15' },
    aesthetics: { label: 'Rating: B', tone: 'warn', date: '2026-06-15' },
    condition: { label: 'Overall Rating: Fair Condition', tone: 'mid', date: '2026-06-15' },
  },

  team: [
    {
      id: 'T-1',
      name: 'Susan Miller',
      role: 'Regional Director',
      email: 'susan@acmeproperties.com',
      phone: '+1 285 567 8901',
    },
    {
      id: 'T-2',
      name: 'John Smith',
      role: 'Facilities Manager',
      email: 'john@acmeproperties.com',
      phone: '+1 285 567 8901',
    },
  ],

  budgets: [
    { id: 'B-2027', year: 2027, budget: 175000, actual: 136120 },
    { id: 'B-2026', year: 2026, budget: 155000, actual: 164500 },
  ],

  documents: [
    { id: 'D-1', title: 'Contract #24006', date: '2026-06-20', amount: 95760, status: 'Approved' },
    { id: 'D-2', title: 'Proposal #240007', date: '2026-06-18', amount: 95760, status: 'Converted to Contract' },
    { id: 'D-3', title: 'Proposal #240008', date: '2026-06-18', amount: 40360, status: 'Awaiting Approval' },
  ],

  activities: [
    { id: 'A-1', title: 'New photos added', at: '2026-06-15T12:30:00Z' },
    { id: 'A-2', title: 'Estimator assigned', at: '2026-06-15T12:33:00Z' },
    { id: 'A-3', title: 'Condition assessment completed', at: '2026-06-15T15:02:00Z' },
    { id: 'A-4', title: 'Repair zones mapped', at: '2026-06-16T09:14:00Z' },
    { id: 'A-5', title: 'Proposal #240007 submitted', at: '2026-06-18T10:05:00Z' },
  ],
})

/**
 * Read every stored site, normalized.
 *
 * On a genuinely first run the demo site is offered so the screens have
 * something to show. The offer is recorded, so deleting the demo keeps it
 * deleted rather than resurrecting it on the next load.
 */
export function loadSites() {
  const stored = loadProperties()
  if (stored.length > 0) return stored.map(normalizeSite)
  if (readFlag('demo')) return []
  writeFlag('demo')
  return [DEMO_SITE]
}

export function saveSites(sites) {
  return saveProperties(sites)
}
