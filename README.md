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
| **Properties** | Working. List with empty state, property detail, and the new-property flow. |
| **Assess** | Placeholder. |
| **Reports** | Placeholder. |

### New property flow

Captures a property name, address, and any number of lot sections. Each section
has a name (`Main lot`, `Rear drive lane`) and an approximate area in square
feet; areas roll up to a property total. Sections left completely blank are
dropped on save.

## Design

Black and white only, Inter, generous spacing — a professional instrument
rather than a consumer app.

- Two grays (`--ink-muted`, `--ink-faint`) both clear 7:1 contrast on white so
  they survive glare. Nothing else tints.
- Nothing tappable is under 56px (`--tap-min`); primary actions are 64px.
- Inputs are 17px, above the 16px threshold that makes iOS Safari zoom on
  focus.
- Safe-area insets are respected top and bottom for notched devices.
- Tokens live at the top of `src/styles.css`; there are no inline styles.
- The home-screen icon (`public/icon.svg`, `public/apple-touch-icon.png`) is the
  same black-and-white lot striping, so a bookmarked install looks like the tool.

## Data

Everything is stored in `localStorage` under `pavement-assess/v1/properties`.
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
  components/   TabBar, Screen shell, Placeholder, Icons
  screens/      Properties, PropertyDetail, NewPropertyFlow, Assess, Reports
  lib/          localStorage persistence, number/area formatting
  styles.css    design tokens and all component styles
```
