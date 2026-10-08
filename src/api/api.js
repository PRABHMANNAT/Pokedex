const BASE = (import.meta.env.VITE_POKEMON_API_BASE_URL || 'https://pokeapi.co/api/v2').replace(/\/$/, '');
const cache = new Map();

export async function fetchSpecies(id, signal) {
  if (cache.has(id)) return cache.get(id);
  const response = await fetch(`${BASE}/pokemon-species/${id}`, { signal });
  if (!response.ok) throw new Error(`Species request failed (${response.status})`);
  const data = await response.json();
  const entry = data.flavor_text_entries.find(entry => entry.language.name === 'en');
  const species = {
    description: entry?.flavor_text.replace(/[\n\f\r]/g, ' ') || 'This Pokémon is waiting for its next field note.',
    genus: data.genera.find(entry => entry.language.name === 'en')?.genus || 'Pokémon',
    habitat: data.habitat?.name || 'Unknown', captureRate: data.capture_rate,
  };
  cache.set(id, species);
  return species;
}
