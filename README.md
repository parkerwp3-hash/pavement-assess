# Pavement Assess

Mobile-first field tool for commercial pavement condition assessments —
parking lots and drive lanes on commercial property inspections.

This repo currently contains the **skeleton only**: navigation, the property
model, and the new-property flow. Assessment capture and reporting are stubbed.

## Running

```sh
npm install
npm run dev      # dev server
npm run build    # production build
npm run preview  # serve the production build
```

## What's here

- **Properties** — list of properties with an empty state, and a full-screen
  "New property" flow (name, address, and any number of lot sections, each with
  a name and an approximate square footage).
- **Assess** — placeholder.
- **Reports** — placeholder.

## Design constraints

The tool is used outdoors, on a phone, in direct sunlight, often on bad signal:

- Pure black on white, no color, no gradients — readable at full glare.
- Every interactive target is at least 56px tall.
- Inter is bundled (`@fontsource-variable/inter`), not fetched from a CDN, so
  the app renders correctly with no connectivity.
- No network calls at all. State lives in `localStorage` under the key
  `pavement-assess:v1` and reads are defensive — a corrupt blob falls back to an
  empty state rather than breaking an inspection in progress.

## Structure

```
src/
  App.jsx              tab + sheet routing, persistence effect
  storage.js           localStorage load/save, id generation
  format.js            sq ft formatting and totals
  components/          TabBar, Header, Icons
  screens/             Properties, PropertyDetail, NewProperty, Assess, Reports
  styles.css           design tokens and all component styles
```

## Not built yet

Distress capture (type / severity / extent), photos, per-section scoring,
report generation, and any sync or export. `localStorage` is a placeholder for
a real offline-first store.
