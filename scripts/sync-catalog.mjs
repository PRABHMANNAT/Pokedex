import { mkdir, writeFile } from 'node:fs/promises';

// Only simple numeric/identifier CSVs are used; quoted prose is fetched through PokéAPI.
const source = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
const files = ['pokemon', 'pokemon_species', 'pokemon_types', 'types', 'pokemon_stats', 'pokemon_abilities', 'abilities', 'type_efficacy'];
const tables = Object.fromEntries(await Promise.all(files.map(async name => {
  const response = await fetch(`${source}${name}.csv`);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const [header, ...lines] = (await response.text()).trim().split(/\r?\n/);
  const keys = header.split(',');
  return [name, lines.map(line => Object.fromEntries(line.split(',').map((value, i) => [keys[i], value])))];
})));
const species = new Map(tables.pokemon_species.map(row => [Number(row.id), row]));
const types = new Map(tables.types.map(row => [row.id, row.identifier]));
const abilities = new Map(tables.abilities.map(row => [row.id, row.identifier]));
function group(rows) {
  const map = new Map();
  for (const row of rows) {
    const id = Number(row.pokemon_id);
    map.set(id, [...(map.get(id) || []), row]);
  }
  return map;
}
const typeGroups = group(tables.pokemon_types);
const statGroups = group(tables.pokemon_stats);
const abilityGroups = group(tables.pokemon_abilities);
const catalog = tables.pokemon.filter(row => row.is_default === '1').map(row => {
  const s = species.get(Number(row.species_id));
  return {
    id: Number(row.id), name: row.identifier,
    types: typeGroups.get(Number(row.id)).sort((a, b) => Number(a.slot) - Number(b.slot)).map(t => types.get(t.type_id)),
    generation: Number(s.generation_id), height: Number(row.height), weight: Number(row.weight),
    stats: statGroups.get(Number(row.id)).sort((a, b) => Number(a.stat_id) - Number(b.stat_id)).map(stat => Number(stat.base_stat)),
    abilities: abilityGroups.get(Number(row.id)).map(a => ({ name: abilities.get(a.ability_id), hidden: a.is_hidden === '1' })),
    evolvesFrom: Number(s.evolves_from_species_id) || null,
    legendary: s.is_legendary === '1', mythical: s.is_mythical === '1',
  };
}).filter(row => row.id <= 1025).sort((a, b) => a.id - b.id);
if (catalog.length !== 1025 || catalog.some(p => p.stats.length !== 6 || !p.types.length)) {
  throw new Error('Catalog validation failed. Review upstream data before updating.');
}
const effectiveness = {};
for (const row of tables.type_efficacy) {
  const attack = types.get(row.damage_type_id);
  const defense = types.get(row.target_type_id);
  if (Number(row.damage_type_id) <= 18 && Number(row.target_type_id) <= 18) {
    (effectiveness[attack] ||= {})[defense] = Number(row.damage_factor) / 100;
  }
}
await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/catalog.json', import.meta.url), JSON.stringify(catalog) + '\n');
await writeFile(new URL('../src/data/effectiveness.json', import.meta.url), JSON.stringify(effectiveness) + '\n');
console.log(`Synced ${catalog.length} national entries and the 18-type chart from PokéAPI.`);
