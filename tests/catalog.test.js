import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../src/data/catalog.json' with { type: 'json' };
import { filterCatalog, readFilters } from '../src/lib/catalog.js';
import { defensiveMatchups, formatName, totalStats, TYPES } from '../src/lib/pokemon.js';
import { readStored, writeStored } from '../src/lib/storage.js';

test('national catalog has contiguous unique IDs and valid Pokemon records', () => {
  assert.equal(catalog.length, 1025);
  catalog.forEach((pokemon, index) => {
    assert.equal(pokemon.id, index + 1);
    assert.equal(pokemon.stats.length, 6);
    assert.ok(pokemon.stats.every((value) => value > 0 && value <= 255));
    assert.ok(pokemon.types.length >= 1 && pokemon.types.every((type) => TYPES[type]));
    assert.ok(pokemon.generation >= 1 && pokemon.generation <= 9);
    assert.ok(pokemon.abilities.length >= 1);
    assert.ok(
      pokemon.evolvesFrom === null || catalog.some((parent) => parent.id === pokemon.evolvesFrom),
    );
  });
});

test('search reaches unloaded late generations and padded national numbers', () => {
  assert.equal(filterCatalog(catalog, { query: 'Pecharunt' })[0].id, 1025);
  assert.equal(filterCatalog(catalog, { query: ' #0025 ' })[0].name, 'pikachu');
  assert.equal(filterCatalog(catalog, { query: 'Mr. Mime' })[0].id, 122);
  assert.equal(filterCatalog(catalog, { query: 'unfindable' }).length, 0);
});

test('type generation rarity and collection filters intersect globally', () => {
  const fire = filterCatalog(catalog, { type: 'fire', generation: '1' });
  assert.equal(fire.length, 12);
  assert.ok(fire.every((pokemon) => pokemon.types.includes('fire') && pokemon.generation === 1));
  assert.deepEqual(
    filterCatalog(catalog, { collection: true, type: 'electric' }, [6, 25, 1025]).map((p) => p.id),
    [25],
  );
  assert.equal(filterCatalog(catalog, { rarity: 'mythical', generation: '9' })[0].id, 1025);
  assert.equal(filterCatalog(catalog, { collection: true }, []).length, 0);
});

test('sorting preserves catalog order and returns correct totals', () => {
  const highest = filterCatalog(catalog, { sort: 'power' });
  assert.ok(
    highest.every(
      (pokemon, index) => index === 0 || totalStats(highest[index - 1]) >= totalStats(pokemon),
    ),
  );
  assert.equal(filterCatalog(catalog, { sort: 'reverse' })[0].id, 1025);
  assert.equal(catalog[0].id, 1);
  assert.equal(totalStats(catalog[24]), 320);
});

test('dual-type matchups correctly multiply immunities and fourfold weaknesses', () => {
  const charizard = defensiveMatchups(['fire', 'flying']);
  assert.equal(charizard.find((matchup) => matchup.type === 'rock').multiplier, 4);
  assert.equal(charizard.find((matchup) => matchup.type === 'ground').multiplier, 0);
  assert.equal(charizard.find((matchup) => matchup.type === 'grass').multiplier, 0.25);
});

test('URLs restore combinations and gendered names remain readable', () => {
  assert.deepEqual(
    readFilters(
      new URLSearchParams('q=mew&type=psychic&gen=1&sort=name&view=collection&rarity=mythical'),
    ),
    {
      query: 'mew',
      type: 'psychic',
      generation: '1',
      sort: 'name',
      collection: true,
      rarity: 'mythical',
    },
  );
  assert.equal(formatName('nidoran-f'), 'Nidoran ♀');
});

test('malformed and denied local storage do not break browsing', () => {
  globalThis.localStorage = {
    getItem: () => 'not json',
    setItem: () => {
      throw new Error('storage denied');
    },
  };
  assert.deepEqual(readStored('test', []), []);
  assert.doesNotThrow(() => writeStored('test', []));
  globalThis.localStorage.getItem = () => JSON.stringify('invalid');
  assert.deepEqual(readStored('test', [], Array.isArray), []);
  delete globalThis.localStorage;
});
