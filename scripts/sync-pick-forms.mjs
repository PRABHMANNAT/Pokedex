import { writeFile } from 'node:fs/promises';
import { DEVELOPER_PICKS } from '../src/data/developerPicks.js';

const base = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/';
const tables = Object.fromEntries(await Promise.all(['pokemon_types', 'pokemon_stats', 'types'].map(async name => {
  const response = await fetch(`${base}${name}.csv`);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  const [header, ...lines] = (await response.text()).trim().split(/\r?\n/);
  return [name, lines.map(line => Object.fromEntries(line.split(',').map((value, i) => [header.split(',')[i], value])))];
})));
const types = new Map(tables.types.map(type => [type.id, type.identifier]));
const result = {};
for (const id of new Set(DEVELOPER_PICKS.filter(pick => pick.artworkId !== pick.id).map(pick => pick.artworkId))) {
  const typeRows = tables.pokemon_types.filter(row => Number(row.pokemon_id) === id).sort((a,b) => a.slot - b.slot);
  const statRows = tables.pokemon_stats.filter(row => Number(row.pokemon_id) === id).sort((a,b) => a.stat_id - b.stat_id);
  if (!typeRows.length || statRows.length !== 6) throw new Error(`Missing form data: ${id}`);
  result[id] = { types: typeRows.map(row => types.get(row.type_id)), stats: statRows.map(row => Number(row.base_stat)) };
}
await writeFile(new URL('../src/data/pickForms.json', import.meta.url), JSON.stringify(result) + '\n');
console.log(`Synced ${Object.keys(result).length} developer pick forms.`);
