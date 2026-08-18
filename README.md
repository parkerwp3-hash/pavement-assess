# Pavement Assess

Pavement condition assessment for commercial properties — parking lots and drive
lanes. Built for field use on a phone: high contrast for direct sunlight, large
touch targets, and no network dependency.

## Status

Skeleton only. Property records work end to end; assessment and reporting are
placeholders.

- **Properties** — list of sites with an empty state, plus the new-property flow
  (name, address, and one or more lot sections with approximate square footage)
- **Assess** — placeholder
- **Reports** — placeholder

## Running it

```sh
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Notes

- **Storage** is `localStorage` (`pavement-assess/properties/v1`), read and
  written through `src/lib/storage.js`. Reads tolerate missing, malformed, or
  disabled storage. Swapping in a syncing backend means replacing that module.
- **Fonts** are bundled via `@fontsource-variable/inter` rather than fetched from
  a CDN, so the app renders correctly with no signal.
- **Design** is pure black on white with a 56px minimum touch target
  (`--touch`), set as tokens at the top of `src/styles.css`.
