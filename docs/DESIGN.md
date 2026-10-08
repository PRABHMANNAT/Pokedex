# Design notes

The interface borrows from a trainer's notebook: warm paper, quiet borders, a red ink accent, numbered field notes, and official Pokémon illustrations. It favors useful controls and readable data over decorative motion.

- **Typography:** Manrope for names and headings; DM Sans for body copy and controls. Both have system fallbacks.
- **Color:** global theme tokens live in `src/index.css`. Card accents come from each Pokémon's primary type. Dark mode uses green charcoal surfaces and muted warm highlights.
- **Cards:** National ID, save control, official artwork, type badges, and three quick stats. The whole details button is keyboard accessible.
- **Details:** the native dialog traps focus, closes with Escape, and returns focus to the opener. Direct `/pokemon/:id` routes support links and refreshes on SPA-compatible hosting.
- **Motion:** small hover movements with `prefers-reduced-motion` support. No autoplay sound.
- **Mobile:** two card columns, horizontally scrollable type filters, compact header controls, and vertically stacked detail panels.
- **Assets:** real sourced artwork and actual browser screenshots; see `ATTRIBUTION.md`.

Use `scripts/capture-screenshots.mjs` to refresh the README images against a running localhost server. It uses Playwright; install Chromium first, or set `PLAYWRIGHT_CHANNEL=chrome` to use installed Chrome. Do not substitute fabricated app screenshots.
