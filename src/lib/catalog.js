import { totalStats, TYPES } from './pokemon.js';

export function filterCatalog(
  catalog,
  { query = '', type = '', generation = '', collection = false, rarity = '', sort = 'number' },
  favorites = [],
) {
  const normalized = query
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '');
  const ids = new Set(favorites);
  const results = catalog.filter((pokemon) => {
    const name = pokemon.name.replace(/[^a-z0-9]/g, '');
    return (
      (!normalized ||
        name.includes(normalized) ||
        String(pokemon.id) === normalized.replace(/^0+/, '')) &&
      (!type || pokemon.types.includes(type)) &&
      (!generation || pokemon.generation === Number(generation)) &&
      (!collection || ids.has(pokemon.id)) &&
      (!rarity || (rarity === 'legendary' ? pokemon.legendary : pokemon.mythical))
    );
  });
  return results.sort((a, b) =>
    sort === 'name'
      ? a.name.localeCompare(b.name)
      : sort === 'power'
        ? totalStats(b) - totalStats(a) || a.id - b.id
        : sort === 'reverse'
          ? b.id - a.id
          : a.id - b.id,
  );
}

export function readFilters(params) {
  const type = params.get('type');
  const generation = params.get('gen');
  const sort = params.get('sort');
  const rarity = params.get('rarity');
  return {
    query: (params.get('q') || '').slice(0, 100),
    type: Object.hasOwn(TYPES, type) ? type : '',
    generation: /^[1-9]$/.test(generation) ? generation : '',
    sort: ['number', 'reverse', 'name', 'power'].includes(sort) ? sort : 'number',
    rarity: ['legendary', 'mythical'].includes(rarity) ? rarity : '',
    collection: params.get('view') === 'collection',
  };
}
