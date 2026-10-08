import { totalStats } from './pokemon';

export function filterCatalog(catalog, { query = '', type = '', generation = '', collection = false, rarity = '', sort = 'number' }, favorites = []) {
  const normalized = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const ids = new Set(favorites);
  const results = catalog.filter(pokemon => {
    const name = pokemon.name.replace(/[^a-z0-9]/g, '');
    return (!normalized || name.includes(normalized) || String(pokemon.id) === normalized.replace(/^0+/, ''))
      && (!type || pokemon.types.includes(type))
      && (!generation || pokemon.generation === Number(generation))
      && (!collection || ids.has(pokemon.id))
      && (!rarity || (rarity === 'legendary' ? pokemon.legendary : pokemon.mythical));
  });
  return results.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'power' ? totalStats(b) - totalStats(a) || a.id - b.id : sort === 'reverse' ? b.id - a.id : a.id - b.id);
}

export function readFilters(params) {
  return { query: params.get('q') || '', type: params.get('type') || '', generation: params.get('gen') || '', sort: params.get('sort') || 'number', rarity: params.get('rarity') || '', collection: params.get('view') === 'collection' };
}
