import { FEATURED_POKEMON } from '../data/featuredPokemon.js';

export const FEATURED_STORAGE_KEY = 'pokedex:featured:v1';
export function selectFeatured(previousId, random = Math.random) {
  const candidates = FEATURED_POKEMON.filter((pokemon) => pokemon.id !== previousId);
  const index = Math.min(
    candidates.length - 1,
    Math.max(0, Math.floor(random() * candidates.length)),
  );
  return candidates[index];
}
