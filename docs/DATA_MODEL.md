# Data model

The catalog is a checked-in snapshot of 1,025 default National Pokédex entries from [PokéAPI's CSV repository](https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv). Alternate forms and Mega evolutions are outside this snapshot.

| Field                   | Type            | Meaning                                                                              |
| ----------------------- | --------------- | ------------------------------------------------------------------------------------ |
| `id`                    | integer         | Unique National Pokédex number, 1–1025.                                              |
| `name`                  | string          | PokéAPI identifier, e.g. `mr-mime`.                                                  |
| `types`                 | string[]        | One or two elemental types, primary first.                                           |
| `generation`            | integer         | Original generation, 1–9. Hisui species are grouped with Gen 8.                      |
| `height`                | integer         | Height in decimeters; display divides by 10.                                         |
| `weight`                | integer         | Weight in hectograms; display divides by 10.                                         |
| `stats`                 | integer[6]      | HP, Attack, Defense, Special Attack, Special Defense, Speed.                         |
| `abilities`             | object[]        | `{ name, hidden }` ability identifiers and hidden-ability flag.                      |
| `evolvesFrom`           | integer or null | National ID of the preceding species. Connections do not imply evolution conditions. |
| `legendary`, `mythical` | boolean         | Species categories from PokéAPI.                                                     |

`effectiveness.json` maps attacking type → defending type → multiplier. Dual-type defenses multiply the two factors. This describes type matchups, not the effects of abilities, moves, or battle state.

Species prose, genus, and habitat are fetched on demand and cached in memory. API failure leaves the indexed information usable. Images are requested from the PokéAPI sprite repository and show an explicit fallback if unavailable; shiny artwork is not present for every upstream entry.

## Local state

- `pokedex:collection:v1`: an array of validated National IDs in localStorage.
- `pokedex:theme:v1`: `light` or `dark` in localStorage, initially based on the device preference.
- URL query: `q`, `type`, `gen`, `rarity`, `sort`, `view=collection`, `pokemon=ID`.
- Collection membership stays on the current device and is not embedded in shared URLs.

## Refreshing data

Run `npm run data:sync` with network access. The script downloads eight public CSV files, normalizes them, validates the count and required fields, then updates both generated JSON files. Run the tests and inspect the changes before committing. Normal builds never need to fetch the catalog.
