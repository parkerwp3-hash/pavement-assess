/**
 * Demo seed — eight fictional fleet/logistics sites.
 *
 * Everything here is MOCK DATA for product discovery. Site names, prices and
 * geometry are invented. `currentCustomerPrice` values play the role of
 * imports from Diamond's costing system: the app treats them as authoritative
 * OBSERVED inputs and never recomputes them.
 *
 * Zone geometry is normalized 0–1 against the site extent. The layout block
 * drives the procedural mock aerial when no image has been uploaded.
 */

export const BASE_YEAR = 2026

let zn = 0
function zone(o) {
  zn += 1
  return {
    id: `RZ-${String(zn).padStart(3, '0')}`,
    riskTags: [],
    confidence: 'moderate',
    growthProfile: null, // null = no modeled growth for this zone
    ...o,
  }
}

function pkg(id, name, zoneIds, year, reason) {
  return { id, name, repairZoneIds: zoneIds, recommendedYear: year, approvalReason: reason }
}

function site(o) {
  return { conditionOverride: null, mapImage: null, ...o }
}

export const SEED_SITES = [
  // 1 — healthy preservation candidate
  site({
    id: 'SITE-101',
    name: 'Riverton Logistics Hub',
    region: 'Midwest',
    climateZone: 'Temperate',
    facilityType: 'Distribution',
    trafficClass: 'Distribution',
    assessmentDate: '2026-04-02',
    asphaltSF: 310000,
    concreteSF: 24000,
    layout: { building: [0.58, 0.08, 0.34, 0.3], docks: 'south', green: 0.06, seedTone: 0 },
    repairZones: [
      zone({ distressType: 'block_cracking', severity: 'low', service: 'sealcoat', treatment: 'seal_coat', quantity: 236000, unit: 'SF', currentCustomerPrice: 66100, priority: 'medium', confidence: 'high', riskTags: ['asset_preservation'], geometry: [[0.06, 0.08], [0.52, 0.08], [0.52, 0.6], [0.06, 0.6]] }),
      zone({ distressType: 'longitudinal_cracking', severity: 'low', service: 'asphalt', treatment: 'crack_seal', quantity: 2600, unit: 'LF', currentCustomerPrice: 4900, priority: 'medium', confidence: 'high', riskTags: ['asset_preservation'], growthProfile: 'low', geometry: [[0.08, 0.66], [0.5, 0.64], [0.52, 0.86], [0.1, 0.88]] }),
      zone({ distressType: 'failed_patch', severity: 'moderate', service: 'asphalt', treatment: 'surface_patch', quantity: 1400, unit: 'SF', currentCustomerPrice: 15400, priority: 'medium', confidence: 'high', riskTags: ['asset_preservation'], geometry: [[0.62, 0.5], [0.72, 0.48], [0.74, 0.6], [0.64, 0.62]] }),
      zone({ distressType: 'faded_markings', severity: 'low', service: 'striping', treatment: 'restripe', quantity: 410, unit: 'EA', currentCustomerPrice: 12300, priority: 'low', confidence: 'high', riskTags: ['safety'], geometry: [[0.62, 0.68], [0.9, 0.66], [0.9, 0.88], [0.62, 0.9]] }),
    ],
    projectPackages: [
      pkg('PKG-101A', '2026 Preservation Program', ['RZ-001', 'RZ-002', 'RZ-003'], 2026, 'Low-severity surface distress across a structurally sound lot; sealing now defers overlay work.'),
      pkg('PKG-101B', '2027 Striping Refresh', ['RZ-004'], 2027, 'Stall and lane markings faded below visibility standards.'),
    ],
  }),

  // 2 — moderate structural repair burden
  site({
    id: 'SITE-102',
    name: 'Cedar Junction Distribution Center',
    region: 'Southeast',
    climateZone: 'Hot Humid',
    facilityType: 'Distribution',
    trafficClass: 'Heavy',
    assessmentDate: '2026-03-18',
    asphaltSF: 268000,
    concreteSF: 18000,
    layout: { building: [0.06, 0.06, 0.3, 0.42], docks: 'east', green: 0.05, seedTone: 1 },
    repairZones: [
      zone({ distressType: 'alligator_cracking', severity: 'severe', service: 'asphalt', treatment: 'full_depth_repair', quantity: 8200, unit: 'SF', currentCustomerPrice: 110700, priority: 'high', confidence: 'high', riskTags: ['asset_preservation', 'operational_continuity'], growthProfile: 'high', geometry: [[0.42, 0.14], [0.58, 0.12], [0.6, 0.3], [0.44, 0.32]] }),
      zone({ distressType: 'rutting', severity: 'moderate', service: 'asphalt', treatment: 'mill_and_overlay', quantity: 64000, unit: 'SF', currentCustomerPrice: 281600, priority: 'high', confidence: 'moderate', riskTags: ['operational_continuity'], growthProfile: 'base', geometry: [[0.42, 0.4], [0.9, 0.38], [0.92, 0.62], [0.44, 0.64]] }),
      zone({ distressType: 'transverse_cracking', severity: 'moderate', service: 'asphalt', treatment: 'crack_seal', quantity: 7400, unit: 'LF', currentCustomerPrice: 14100, priority: 'medium', confidence: 'high', riskTags: ['asset_preservation'], growthProfile: 'base', geometry: [[0.1, 0.56], [0.36, 0.56], [0.36, 0.88], [0.1, 0.88]] }),
      zone({ distressType: 'block_cracking', severity: 'low', service: 'sealcoat', treatment: 'seal_coat', quantity: 120000, unit: 'SF', currentCustomerPrice: 34800, priority: 'medium', confidence: 'high', riskTags: ['asset_preservation'], geometry: [[0.44, 0.7], [0.9, 0.68], [0.9, 0.9], [0.46, 0.92]] }),
    ],
    projectPackages: [
      pkg('PKG-102A', '2026 Structural Repairs', ['RZ-005', 'RZ-006'], 2026, 'Connected fatigue cracking and rutting in the primary truck route.'),
      pkg('PKG-102B', '2027 Surface Preservation', ['RZ-007', 'RZ-008'], 2027, 'Seal remaining surface after structural work completes.'),
    ],
  }),

  // 3 — heavy truck terminal
  site({
    id: 'SITE-103',
    name: 'Gulf Gate Truck Terminal',
    region: 'Southeast',
    climateZone: 'Hot Humid',
    facilityType: 'Truck Terminal',
    trafficClass: 'Truck Terminal',
    assessmentDate: '2026-05-11',
    asphaltSF: 520000,
    concreteSF: 64000,
    layout: { building: [0.3, 0.36, 0.42, 0.24], docks: 'both', green: 0.03, seedTone: 2 },
    repairZones: [
      zone({ distressType: 'alligator_cracking', severity: 'severe', service: 'asphalt', treatment: 'full_depth_repair', quantity: 34000, unit: 'SF', currentCustomerPrice: 476000, priority: 'high', confidence: 'high', riskTags: ['operational_continuity', 'asset_preservation'], growthProfile: 'high', geometry: [[0.06, 0.08], [0.3, 0.06], [0.32, 0.28], [0.08, 0.3]] }),
      zone({ distressType: 'rutting', severity: 'severe', service: 'asphalt', treatment: 'mill_and_overlay', quantity: 210000, unit: 'SF', currentCustomerPrice: 987000, priority: 'high', confidence: 'moderate', riskTags: ['operational_continuity'], growthProfile: 'base', geometry: [[0.06, 0.66], [0.68, 0.64], [0.7, 0.92], [0.08, 0.94]] }),
      zone({ distressType: 'joint_deterioration', severity: 'severe', service: 'concrete', treatment: 'slab_replacement', quantity: 14200, unit: 'SF', currentCustomerPrice: 639000, priority: 'high', confidence: 'high', riskTags: ['safety', 'operational_continuity'], geometry: [[0.76, 0.36], [0.94, 0.34], [0.94, 0.56], [0.76, 0.58]] }),
      zone({ distressType: 'potholes', severity: 'severe', service: 'asphalt', treatment: 'surface_patch', quantity: 2600, unit: 'SF', currentCustomerPrice: 33800, priority: 'high', confidence: 'high', riskTags: ['safety', 'liability'], growthProfile: 'high', geometry: [[0.4, 0.1], [0.5, 0.08], [0.52, 0.2], [0.42, 0.22]] }),
      zone({ distressType: 'transverse_cracking', severity: 'moderate', service: 'asphalt', treatment: 'crack_seal', quantity: 16800, unit: 'LF', currentCustomerPrice: 30200, priority: 'medium', confidence: 'moderate', riskTags: ['asset_preservation'], growthProfile: 'base', geometry: [[0.56, 0.08], [0.92, 0.06], [0.92, 0.26], [0.58, 0.28]] }),
    ],
    projectPackages: [
      pkg('PKG-103A', '2026 Terminal Structural Program', ['RZ-009', 'RZ-010', 'RZ-012'], 2026, 'Severe fatigue and rutting under constant trailer traffic; open potholes at the gate.'),
      pkg('PKG-103B', '2027 Dock Apron Concrete', ['RZ-011'], 2027, 'Failed joints on the dock apron are a tire and trip hazard.'),
      pkg('PKG-103C', '2027 Crack Program', ['RZ-013'], 2027, 'Seal remaining cracking after structural work.'),
    ],
  }),

  // 4 — drainage-driven failures
  site({
    id: 'SITE-104',
    name: 'Bayou Crossing Freight Yard',
    region: 'Southwest',
    climateZone: 'Coastal',
    facilityType: 'Distribution',
    trafficClass: 'Heavy',
    assessmentDate: '2026-02-24',
    asphaltSF: 348000,
    concreteSF: 20000,
    layout: { building: [0.62, 0.6, 0.3, 0.3], docks: 'north', green: 0.08, seedTone: 3 },
    repairZones: [
      zone({ distressType: 'depression', severity: 'severe', service: 'asphalt', treatment: 'full_depth_repair', quantity: 18600, unit: 'SF', currentCustomerPrice: 260400, priority: 'high', confidence: 'moderate', riskTags: ['drainage', 'operational_continuity'], growthProfile: 'high', geometry: [[0.08, 0.62], [0.34, 0.6], [0.36, 0.86], [0.1, 0.88]] }),
      zone({ distressType: 'alligator_cracking', severity: 'severe', service: 'asphalt', treatment: 'full_depth_repair', quantity: 11800, unit: 'SF', currentCustomerPrice: 165200, priority: 'high', confidence: 'high', riskTags: ['drainage', 'asset_preservation'], growthProfile: 'high', geometry: [[0.4, 0.66], [0.56, 0.64], [0.58, 0.9], [0.42, 0.92]] }),
      zone({ distressType: 'drainage_failure', severity: 'severe', service: 'drainage', treatment: 'drainage_reconstruction', quantity: 1450, unit: 'LF', currentCustomerPrice: 391500, priority: 'high', confidence: 'moderate', riskTags: ['drainage', 'liability'], geometry: [[0.08, 0.4], [0.9, 0.36], [0.9, 0.5], [0.08, 0.54]] }),
      zone({ distressType: 'raveling', severity: 'moderate', service: 'asphalt', treatment: 'mill_and_overlay', quantity: 52000, unit: 'SF', currentCustomerPrice: 234000, priority: 'medium', confidence: 'moderate', riskTags: ['asset_preservation'], growthProfile: 'base', geometry: [[0.08, 0.06], [0.52, 0.04], [0.54, 0.3], [0.1, 0.32]] }),
    ],
    projectPackages: [
      pkg('PKG-104A', '2026 Drainage Corridor Reconstruction', ['RZ-016', 'RZ-014', 'RZ-015'], 2026, 'Standing water is driving base failure; pavement repairs without the drainage fix will not hold.'),
      pkg('PKG-104B', '2028 North Apron Overlay', ['RZ-017'], 2028, 'Surface wear ahead of schedule from ponding spray; overlay after drainage stabilizes.'),
    ],
  }),

  // 5 — freeze-thaw deterioration
  site({
    id: 'SITE-105',
    name: 'Northgate Freeze Line Depot',
    region: 'Northeast',
    climateZone: 'Freeze-Thaw',
    facilityType: 'Fleet Maintenance',
    trafficClass: 'Heavy',
    assessmentDate: '2026-04-20',
    asphaltSF: 296000,
    concreteSF: 30000,
    layout: { building: [0.08, 0.62, 0.36, 0.3], docks: 'east', green: 0.07, seedTone: 4 },
    repairZones: [
      zone({ distressType: 'transverse_cracking', severity: 'severe', service: 'asphalt', treatment: 'crack_seal', quantity: 21400, unit: 'LF', currentCustomerPrice: 40700, priority: 'high', confidence: 'high', riskTags: ['asset_preservation'], growthProfile: 'high', geometry: [[0.08, 0.08], [0.9, 0.06], [0.9, 0.26], [0.08, 0.28]] }),
      zone({ distressType: 'potholes', severity: 'severe', service: 'asphalt', treatment: 'surface_patch', quantity: 3800, unit: 'SF', currentCustomerPrice: 49400, priority: 'high', confidence: 'high', riskTags: ['safety', 'liability'], growthProfile: 'high', geometry: [[0.5, 0.34], [0.62, 0.32], [0.64, 0.46], [0.52, 0.48]] }),
      zone({ distressType: 'alligator_cracking', severity: 'moderate', service: 'asphalt', treatment: 'full_depth_repair', quantity: 9600, unit: 'SF', currentCustomerPrice: 129600, priority: 'high', confidence: 'moderate', riskTags: ['asset_preservation'], growthProfile: 'base', geometry: [[0.08, 0.34], [0.4, 0.32], [0.42, 0.52], [0.1, 0.54]] }),
      zone({ distressType: 'block_cracking', severity: 'moderate', service: 'asphalt', treatment: 'mill_and_overlay', quantity: 68000, unit: 'SF', currentCustomerPrice: 306000, priority: 'medium', confidence: 'moderate', riskTags: ['asset_preservation'], growthProfile: 'base', geometry: [[0.5, 0.56], [0.92, 0.54], [0.92, 0.9], [0.52, 0.92]] }),
    ],
    projectPackages: [
      pkg('PKG-105A', '2026 Winter Damage Response', ['RZ-019', 'RZ-018'], 2026, 'Open potholes and active thermal cracking; each freeze cycle widens the damage.'),
      pkg('PKG-105B', '2027 Structural Recovery', ['RZ-020', 'RZ-021'], 2027, 'Fatigued areas and block cracking from repeated freeze-thaw; repair before next winter.'),
    ],
  }),

  // 6 — concrete and ADA needs
  site({
    id: 'SITE-106',
    name: 'Summit Ridge Service Center',
    region: 'West',
    climateZone: 'Mountain',
    facilityType: 'Fleet Maintenance',
    trafficClass: 'Medium',
    assessmentDate: '2026-05-02',
    asphaltSF: 152000,
    concreteSF: 98000,
    layout: { building: [0.34, 0.08, 0.32, 0.34], docks: 'south', green: 0.1, seedTone: 5 },
    repairZones: [
      zone({ distressType: 'slab_cracking', severity: 'severe', service: 'concrete', treatment: 'slab_replacement', quantity: 16400, unit: 'SF', currentCustomerPrice: 738000, priority: 'high', confidence: 'high', riskTags: ['safety', 'operational_continuity'], geometry: [[0.08, 0.5], [0.44, 0.48], [0.46, 0.74], [0.1, 0.76]] }),
      zone({ distressType: 'joint_deterioration', severity: 'moderate', service: 'concrete', treatment: 'joint_seal', quantity: 8600, unit: 'LF', currentCustomerPrice: 43000, priority: 'medium', confidence: 'high', riskTags: ['asset_preservation'], geometry: [[0.52, 0.5], [0.9, 0.48], [0.9, 0.66], [0.52, 0.68]] }),
      zone({ distressType: 'ada_noncompliance', severity: 'severe', service: 'concrete', treatment: 'ada_ramp_upgrade', quantity: 14, unit: 'EA', currentCustomerPrice: 53200, priority: 'high', confidence: 'high', riskTags: ['accessibility', 'liability'], geometry: [[0.08, 0.1], [0.28, 0.08], [0.3, 0.24], [0.1, 0.26]] }),
      zone({ distressType: 'block_cracking', severity: 'low', service: 'sealcoat', treatment: 'seal_coat', quantity: 118000, unit: 'SF', currentCustomerPrice: 33000, priority: 'low', confidence: 'high', riskTags: ['asset_preservation'], geometry: [[0.52, 0.74], [0.9, 0.72], [0.9, 0.92], [0.52, 0.94]] }),
    ],
    projectPackages: [
      pkg('PKG-106A', '2026 ADA Compliance Program', ['RZ-024'], 2026, 'Fourteen ramps out of compliance; accessibility exposure at an occupied service center.'),
      pkg('PKG-106B', '2027 Concrete Rehabilitation', ['RZ-022', 'RZ-023'], 2027, 'Failed slabs in the equipment yard; joints opening across the apron.'),
      pkg('PKG-106C', '2028 Asphalt Preservation', ['RZ-025'], 2028, 'Asphalt areas remain sound; seal to keep them that way.'),
    ],
  }),

  // 7 — striping and appearance needs
  site({
    id: 'SITE-107',
    name: 'Palo Verde Crossdock',
    region: 'Southwest',
    climateZone: 'Hot Dry',
    facilityType: 'Distribution',
    trafficClass: 'Medium',
    assessmentDate: '2026-03-30',
    asphaltSF: 214000,
    concreteSF: 12000,
    layout: { building: [0.36, 0.62, 0.3, 0.28], docks: 'north', green: 0.04, seedTone: 6 },
    repairZones: [
      zone({ distressType: 'raveling', severity: 'low', service: 'sealcoat', treatment: 'seal_coat', quantity: 186000, unit: 'SF', currentCustomerPrice: 52100, priority: 'medium', confidence: 'high', riskTags: ['asset_preservation'], geometry: [[0.06, 0.08], [0.92, 0.06], [0.92, 0.5], [0.06, 0.52]] }),
      zone({ distressType: 'faded_markings', severity: 'moderate', service: 'striping', treatment: 'restripe', quantity: 520, unit: 'EA', currentCustomerPrice: 16100, priority: 'medium', confidence: 'high', riskTags: ['safety'], geometry: [[0.06, 0.58], [0.3, 0.56], [0.32, 0.9], [0.08, 0.92]] }),
      zone({ distressType: 'longitudinal_cracking', severity: 'low', service: 'asphalt', treatment: 'crack_seal', quantity: 3900, unit: 'LF', currentCustomerPrice: 7400, priority: 'low', confidence: 'high', riskTags: ['asset_preservation'], growthProfile: 'low', geometry: [[0.7, 0.58], [0.92, 0.56], [0.92, 0.9], [0.72, 0.92]] }),
    ],
    projectPackages: [
      pkg('PKG-107A', '2026 Appearance & Preservation', ['RZ-026', 'RZ-027', 'RZ-028'], 2026, 'UV-oxidized surface and faded markings at a customer-facing crossdock.'),
    ],
  }),

  // 8 — major rehabilitation candidate
  site({
    id: 'SITE-108',
    name: 'Iron District Terminal',
    region: 'Midwest',
    climateZone: 'Freeze-Thaw',
    facilityType: 'Truck Terminal',
    trafficClass: 'Truck Terminal',
    assessmentDate: '2026-06-08',
    asphaltSF: 610000,
    concreteSF: 42000,
    layout: { building: [0.06, 0.06, 0.4, 0.26], docks: 'south', green: 0.02, seedTone: 7 },
    repairZones: [
      zone({ distressType: 'alligator_cracking', severity: 'severe', service: 'asphalt', treatment: 'reconstruction', quantity: 168000, unit: 'SF', currentCustomerPrice: 1478400, priority: 'high', confidence: 'high', riskTags: ['operational_continuity', 'asset_preservation'], growthProfile: 'high', geometry: [[0.06, 0.4], [0.5, 0.38], [0.52, 0.7], [0.08, 0.72]] }),
      zone({ distressType: 'rutting', severity: 'severe', service: 'asphalt', treatment: 'mill_and_overlay', quantity: 240000, unit: 'SF', currentCustomerPrice: 1152000, priority: 'high', confidence: 'moderate', riskTags: ['operational_continuity'], growthProfile: 'base', geometry: [[0.56, 0.36], [0.94, 0.34], [0.94, 0.68], [0.58, 0.7]] }),
      zone({ distressType: 'potholes', severity: 'severe', service: 'asphalt', treatment: 'surface_patch', quantity: 6200, unit: 'SF', currentCustomerPrice: 80600, priority: 'high', confidence: 'high', riskTags: ['safety', 'liability'], growthProfile: 'high', geometry: [[0.52, 0.08], [0.64, 0.06], [0.66, 0.2], [0.54, 0.22]] }),
      zone({ distressType: 'joint_deterioration', severity: 'moderate', service: 'concrete', treatment: 'slab_replacement', quantity: 7800, unit: 'SF', currentCustomerPrice: 351000, priority: 'medium', confidence: 'moderate', riskTags: ['operational_continuity'], geometry: [[0.72, 0.08], [0.94, 0.06], [0.94, 0.26], [0.74, 0.28]] }),
      zone({ distressType: 'transverse_cracking', severity: 'severe', service: 'asphalt', treatment: 'crack_seal', quantity: 24800, unit: 'LF', currentCustomerPrice: 47100, priority: 'medium', confidence: 'high', riskTags: ['asset_preservation'], growthProfile: 'high', geometry: [[0.06, 0.78], [0.94, 0.76], [0.94, 0.94], [0.08, 0.96]] }),
    ],
    projectPackages: [
      pkg('PKG-108A', '2026 Phase 1 Reconstruction', ['RZ-029', 'RZ-031'], 2026, 'Base failure across the main circulation area; patching no longer holds through a season.'),
      pkg('PKG-108B', '2027 Phase 2 Overlay', ['RZ-030', 'RZ-033'], 2027, 'Rutted lanes adjacent to the Phase 1 area; overlay once reconstruction traffic ends.'),
      pkg('PKG-108C', '2028 Dock Concrete', ['RZ-032'], 2028, 'Slab deterioration at the dock line; schedule with terminal downtime.'),
    ],
  }),
]

/*
 * Scale pass: the seed archetypes were authored at single-lot scale, but the
 * budget scenarios this lab exists to exercise are $25M–$50M. Scaling area,
 * quantity and price together keeps unit costs, burden percentages and crack
 * densities exactly as authored — only the absolute magnitudes grow to
 * national-portfolio scale. EA-unit zones (ramps, stalls) are left alone.
 */
const SCALE = 4
for (const s of SEED_SITES) {
  s.asphaltSF *= SCALE
  s.concreteSF *= SCALE
  for (const z of s.repairZones) {
    if (z.unit === 'SF' || z.unit === 'LF') {
      z.quantity *= SCALE
      z.currentCustomerPrice *= SCALE
    }
  }
}

