# pavement-assess

Pavement condition assessment tool for commercial property inspections —
parking lots and drive lanes. Built for one-handed use on a phone, outdoors,
often in direct sunlight and sometimes without signal.

This is the skeleton: navigation, the property model, and local persistence.
Assessment capture and reporting are stubbed.

## Running it

```sh
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## What's here

Three screens behind a bottom tab bar:

- **Properties** — list of properties with section count and total square
  footage, plus the empty state and the "New property" flow.
- **Assess** — placeholder for section-by-section condition capture.
- **Reports** — placeholder for client deliverables.

The **New property** flow captures a property name, address, and any number of
lot sections; each section has a name ("Main lot", "Rear drive lane") and an
approximate square footage. Tapping a property opens a read-only detail view
with its sections and a two-tap delete.

## Data

Everything is stored in `localStorage` under a single key
(`pavement-assess:v1`) — see `src/lib/storage.js`. Reads are defensive and
writes fail soft, so a full disk or a private-browsing context degrades instead
of crashing mid-inspection. There is no sync or backend yet; clearing site data
clears the surveys.

Stored shape:

```js
{
  properties: [
    {
      id, name, address, createdAt,
      sections: [{ id, name, squareFeet }] // squareFeet is a number or null
    }
  ]
}
```

## Design notes

Black and white only, Inter, generous spacing — a professional instrument, not
a consumer app. Colour is deliberately unspent so it can carry condition
severity later.

- Every control is at least 56px tall, for gloved hands on uneven ground.
- Borders are 2px and hairlines are used sparingly; low-contrast greys wash out
  in sunlight.
- Inputs are 17px so iOS doesn't zoom on focus.
- Inter is self-hosted (latin subset only) rather than loaded from a CDN, since
  the app has to render with no signal.
- Safe-area insets are respected top and bottom.

## Stack

Vite + React 18, no router and no state library — screen state is local. Keep
it that way until the assessment flow actually needs more.
