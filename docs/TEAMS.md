# Your six · Team builder

Open `/teams` to create a team without signing in. A new browser starts with **Prabh’s Kanto six**, selected from his supplied personal favorites sheet. The original lists contain more than six picks per region; starter sixes are editable selections, not a claim that the document specifies only six members.

## Your adventure

- Create and rename up to 24 local teams, each with zero to six distinct Pokémon species.
- Search the full National Pokédex and filter companions by type or generation.
- Remove companions, move them earlier or later, and choose the first slot as your lead.
- Add Pokémon from the explorer, detail notes, or developer notebook. Full teams link back to the editor so you can make room.
- Copy a share link. Importing a shared team requires pressing **Save shared team** and never silently replaces an existing lineup.
- Use `/picks?region=hoenn` (or another notebook region) for personal favorites and one-click starter teams. The tenth group is Gigantamax.
- The **Choose a team** selector lists both your saves and every regional preset. Selecting a preset opens its existing local copy if available, preserving edits; otherwise it creates an editable copy without replacing another team.
- **View all generation teams** opens `/teams/all`, a visual collection of all ten Prabh templates and your saved lineups. Filter by creator/source and generation. Custom saved teams match generations represented by their companions; preset copies follow their notebook region. This is not a public directory of strangers' teams.

## Source and forms

`src/data/developerPicks.js` transcribes the favorites from the owner's 15-page *My Pokemon Team.pdf*. The original PDF and extracted page images are intentionally not published. Region groupings follow the source even when a favorite originated in another generation.

Every pick records its National ID, display label, artwork ID, and shiny choice. Curated Mega, Alolan, Sky, Complete, and Gigantamax variants use their specific artwork and PokéAPI form types/stats from `src/data/pickForms.json`. The giant Golurk favorite is an anime reference, not an official alternate stat record, and is labeled accordingly. **View base species** links show National Pokédex notes, not form-specific abilities or moves.

Run `npm run data:forms` to regenerate curated form metadata from the public PokéAPI CSV source. This does not expand the 1,025-entry National catalog.

## Storage, privacy and sharing

`pokedex:teams:v1` holds a versioned state in localStorage: active team ID, team names, optional preset source, and member keys. State is validated before restoration. Malformed JSON, unknown members, duplicate species and oversized lineups are rejected. Valid changes sync between tabs on the same origin. If storage is blocked, the editor remains usable for the current session and displays a warning.

There is no server, account, login, or cloud backup. Clearing browser storage or using a different browser/origin means the teams will not be available there. Keep a share link if you want a portable copy. Share URLs contain the team name and member keys in plain text; do not put private information in a team name. A link is a snapshot, not live collaborative editing.

## Insights are not a battle simulator

The summary shows distinct types, average base-stat total, and attacking types that are super-effective against at least three companions. Dual-type effectiveness and immunities are multiplied using the type chart. Abilities, moves, items, levels, EVs, IVs, transformations and battle mechanics are outside scope. In particular, a collection of multiple Mega/Gigantamax favorites is a personal showcase, not a promise of competitive battle legality.

## Verification

`npm test` checks every pick and starter lineup, form metadata, duplicate prevention, capacity, reducer edits, invalid restoration, sharing, and insight calculations. `npm run test:e2e` checks actual editing, reload persistence, lead ordering, deletion confirmation, clipboard sharing, import confirmation, invalid links, blocked storage, regional presets, filters and mobile overflow. README captures use original live artwork, not test fixtures or AI-generated visuals.
