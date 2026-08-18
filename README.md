# Pavement Assess

Pavement condition assessment tool for commercial property inspections —
parking lots and drive lanes.

Built for a phone in the field: large touch targets, high-contrast black and
white so the screen stays readable in direct sunlight, and no network
dependency. This is the skeleton — screens, navigation, and the new-property
flow. Assessment capture and reporting come next.

## Running it

```sh
npm install
npm run dev      # dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## What's here

| Screen | State |
| --- | --- |
| **Properties** | Working. List with empty state, property detail, and the new-property flow. Each row shows facility type and a condition-score slot, empty until Assess lands. |
| **Assess** | Placeholder. |
| **Reports** | Placeholder. |

### New property flow

Six steps, one screen each. A single scrolling form with this many fields is
unusable one-handed in a parking lot, so each screen asks one thing:

| Step | Asks |
| --- | --- |
| 1. Property | Name, address |
| 2. Facility type | Retail, Industrial, Distribution, Office, Medical, Hospitality, Restaurant, Education, Church, Government, Fuel Station, Multi-Family, Shopping Center |
| 3. Traffic class | Light, Medium, Heavy, Distribution, Industrial, Truck Terminal |
| 4. Climate region | Freeze-Thaw, Hot Dry, Hot Humid, Coastal, Temperate, Mountain |
| 5. Assignment | Region / district, property manager, business unit |
| 6. Lot sections | Per section: name, approximate area, traffic class |

Only the property name is required. Everything else can be left for later
rather than blocking an inspector who is already on site.

The classification steps are picked from a list, never typed — free text there
would make reports impossible to group. They are laid out as full-width rows
rather than a native `<select>`, which on a phone collapses to a system wheel
with small, low-contrast targets and hides the options until tapped. Picking an
option advances the step; the tap is the answer.

Sections carry their own traffic class, because a rear drive lane and a main lot
wear differently within one property. New sections start at the property's class
— most lots are uniform, and the outlier is the one worth a tap. Section areas
roll up to a property total, and sections left completely blank are dropped on
save.

## Design

Black and white only, Inter, generous spacing — a professional instrument
rather than a consumer app.

- Two grays (`--ink-muted` #444, 9.7:1; `--ink-faint` #595959, 7.0:1) both clear
  7:1 contrast on white so they survive glare. Nothing else tints.
- Nothing tappable is under 56px (`--tap-min`); primary actions are 64px.
- Inputs are 17px, above the 16px threshold that makes iOS Safari zoom on
  focus.
- Safe-area insets are respected top and bottom for notched devices.
- Tokens live at the top of `src/styles.css`; there are no inline styles.
- The home-screen icon (`public/icon.svg`, `public/apple-touch-icon.png`) is the
  same black-and-white lot striping, so a bookmarked install looks like the tool.

## Data

Everything is stored in `localStorage` under `pavement-assess/v1/properties`.
A property records name, address, facility type, traffic class, climate region,
region / district, property manager, business unit, and its sections; each
section records name, area, and traffic class. Classification fields store the
option id (`shopping-center`), not the label, so labels can be reworded without
rewriting stored records.

Records saved before a field existed are normalized on read, so a property from
an older build loads with the new fields empty rather than undefined.
Inspectors work out of signal regularly, so the app is fully usable offline —
Inter is self-hosted (`public/fonts/`) rather than loaded from a CDN for the
same reason. Reads and writes fail soft: private browsing and full-quota
devices both throw on storage access, and that must never interrupt an
inspection in progress.

There is no sync yet and no undo, so deleting a property takes two deliberate
taps — a mis-tap in a work glove should not cost a site visit. Clearing site
data clears the properties.

## Layout

```
src/
  components/   TabBar, Screen shell, Placeholder, ChoiceList, ChoiceSheet, Icons
  screens/      Properties, PropertyDetail, NewPropertyFlow, Assess, Reports
  lib/          localStorage persistence, formatting, classification vocabularies
  styles.css    design tokens and all component styles
public/
  fonts/        self-hosted Inter
  icon.svg      app mark — stall striping on black
  apple-touch-icon.png   180px render of the same mark; iOS ignores SVG here
```
