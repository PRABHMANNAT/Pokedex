import test from 'node:test';
import assert from 'node:assert/strict';
import { selectFeatured } from '../src/lib/featured.js';
import { FEATURED_POKEMON } from '../src/data/featuredPokemon.js';
import catalog from '../src/data/catalog.json' with { type: 'json' };

test('every featured encounter has a valid species and sourced display metadata', () => {
  assert.equal(
    new Set(FEATURED_POKEMON.map((pokemon) => pokemon.id)).size,
    FEATURED_POKEMON.length,
  );
  for (const pokemon of FEATURED_POKEMON) {
    assert.ok(catalog.some((entry) => entry.id === pokemon.id));
    assert.ok(pokemon.name && pokemon.japanese && pokemon.genus.endsWith('Pokémon'));
  }
});
test('refresh selection excludes the last encounter at every random boundary', () => {
  for (const pokemon of FEATURED_POKEMON) {
    for (const random of [0, 0.25, 0.5, 0.999999, 1])
      assert.notEqual(selectFeatured(pokemon.id, () => random).id, pokemon.id);
  }
  assert.ok(selectFeatured(99999));
  assert.ok(selectFeatured(null));
});
