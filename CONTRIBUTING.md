# Contributing to the field guide

Good contributions make the next encounter easier to explore. Bug fixes, accessibility improvements, better data handling, and thoughtful interface ideas are welcome.

1. Fork the repository, clone it, and create a branch for your change.
2. Use Node 22.12+ or Node 24, then run `npm ci` and `npm run dev`.
3. Keep the design consistent with the warm paper palette, type colors, and quiet motion. Check both themes and a 390px mobile viewport.
4. Run `npm run lint`, `npm test`, and `npm run build`. For interaction changes, install the test browser with `npx playwright install chromium`, then run `npm run test:e2e`.
5. Open a pull request describing the user-visible result, verification, and screenshots where relevant.

## Data and artwork

Do not hand-edit the generated catalog. Run `npm run data:sync`, inspect the diff, and update tests deliberately if upstream data changes. The generator intentionally validates a fixed 1,025-entry National Pokédex snapshot.

Use existing Pokémon artwork or assets with clear source attribution. Add credits to [ATTRIBUTION.md](ATTRIBUTION.md). Keep generated promotional imagery out of the project. Never include API tokens or local environment files.

## Useful starting points

- Improve search for localized names.
- Add informative evolution conditions or regional forms with a clear schema.
- Expand keyboard and screen reader verification.
- Improve image delivery without losing artwork quality.

Please keep discussion kind, specific, and constructive. Contributions should be your own work or carry appropriate permission; no broad license for third-party Pokémon assets is implied.
