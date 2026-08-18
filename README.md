# Pavement Assess

Pavement condition assessment for commercial property portfolios — parking
lots, drive lanes and truck terminals.

The UI follows the Diamond Solutions design: black sidebar, cyan chrome, white
cards, heavy uppercase headings. The layout is the desktop portal from the
designs, made responsive so a phone in a parking lot stays usable — under
900px the sidebar becomes a bottom tab bar and the two-column detail stacks.

## Running it

```sh
npm install
npm run dev      # dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Screens

| Screen | What it shows |
| --- | --- |
| **Portfolio** | Every site as a record card — cyan name block, ID, project status, last inspection, the four pavement-rating marks, priority star. Search, density toggle, pagination. |
| **Property detail** | Header facts, site map with repair zones, project-status stepper, repair-zone list, photos, activity. Right column: team, projects, pavement ratings, budgets, documents. |
| **Proposals** | Project packages as a sortable table — ID, property, address, requested, value, status. |
| **Projects** | Project packages as record cards with stage pills (Kickoff, Awaiting Approval, Scheduling, Executing, Complete). |

### New property flow

Seven steps, one screen each. A single scrolling form with this many fields is
unusable one-handed on a lot, so each screen asks one thing:

| Step | Asks |
| --- | --- |
| 1. Property | Name, address |
| 2. Facility type | Retail, Industrial, Distribution, Office, Medical, Hospitality, Restaurant, Education, Church, Government, Fuel Station, Multi-Family, Shopping Center, Truck Terminal |
| 3. Traffic class | Light, Medium, Heavy, Distribution, Industrial, Truck Terminal |
| 4. Climate zone | Freeze-Thaw, Hot Dry, Hot Humid, Coastal, Temperate, Mountain |
| 5. Surface areas | Asphalt and concrete square footage |
| 6. Assignment | Region / district, property manager, business unit |
| 7. Lot sections | Per section: name, approximate area, traffic class |

Only the property name is required. Classification is picked from a list, never
typed — free text would make reports impossible to group. Picking an option
advances the step, so each classification costs one tap. Sections carry their
own traffic class, because a rear drive lane and a main lot wear differently
within one property; new sections start at the property's class.

## Data model

The canonical shape is the client assessment schema. A record exported from
their system imports unchanged.

```
site
  id, clientId, name, address, region
  facilityType, trafficClass, climateZone
  inspectionDate, mockData, highPriority
  surfaceAreas   { asphaltSF, concreteSF, totalPavedSF }
  map            { imageUrl, coordinateSystem }
  sections[]     { id, name, sqft, trafficClass }
  repairZones[]  { id, distressType, severity, service, recommendedTreatment,
                   quantity, unit, currentCustomerPrice, priority, confidence,
                   riskTags[], linkedProjectPackageId,
                   geometry { type, points[] },
                   modeledAssumptions { growthProfile, nextLikelyTreatment,
                                        projectionConfidence } }
  projectPackages[] { id, name, repairZoneIds[], recommendedYear,
                      currentCustomerPrice, priorityScore, approvalReason,
                      status }
  ratings, team[], budgets[], documents[], activities[], projectStage
```

Two conventions worth knowing:

- **Ids in, labels out.** Classification is stored as ids (`truck_terminal`,
  `hot-humid`), never display labels, so wording can change without rewriting
  stored records. `toId()` accepts either form, which is why a record written
  with labels (`"facilityType": "Truck Terminal"`) imports directly.
- **`totalPavedSF` is trusted when present** and derived from the two materials
  otherwise, so an imported total is never silently overwritten.

`Truck Terminal` exists in both the facility-type and traffic-class
vocabularies. They are different facts — what the site *is* versus how hard it
is driven — and the client schema uses it in both positions.

### Repair zone geometry

Zone `geometry.points` are normalized 0–1 against the site extent, so they
scale to any viewport without touching stored coordinates. The detail screen
draws them over the site map, colored by severity, and selecting a zone in
either the map or the list highlights it in both. No record has supplied
`map.imageUrl` yet, so the base is a drawn surface rather than a photo standing
in for one.

## Data storage

Everything is stored in `localStorage` under `pavement-assess/v1/properties`.
Inspectors work out of signal regularly, so the app is fully usable offline —
Inter is self-hosted (`public/fonts/`) rather than loaded from a CDN for the
same reason. Reads and writes fail soft: private browsing and full-quota
devices both throw on storage access, and that must never interrupt an
inspection in progress.

On a genuinely first run the app seeds the Charlotte Fleet Service Center demo
site so the screens have something to show. It carries `mockData: true` and
every screen labels it **DEMO DATA — NOT A REAL SURVEY**; records created
through the flow are never flagged. The offer is recorded, so deleting the demo
keeps it deleted rather than resurrecting it on the next load.

There is no sync yet and no undo, so deleting a property takes two deliberate
taps. Clearing site data clears the properties.

## Layout

```
src/
  app/          Sidebar, TopBar
  components/   PageHead, Toolbar, Pagination, SiteMap, ChoiceList,
                ChoiceSheet, Icons
  screens/      Portfolio, PropertyDetail, Proposals, Projects,
                NewPropertyFlow
  lib/          schema (normalize + demo seed), taxonomy (vocabularies),
                storage (localStorage), format
  styles.css    design tokens and all component styles
public/
  fonts/        self-hosted Inter
  icon.svg      app mark — stall striping on black
  apple-touch-icon.png   180px render of the same mark; iOS ignores SVG here
```

Notes on the visual system: tokens live at the top of `src/styles.css`, and
there are no inline styles except a handful of one-off spacing overrides.
Nothing tappable falls below 40px. Inputs are 16px, at the threshold that stops
iOS Safari zooming on focus.
