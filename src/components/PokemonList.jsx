import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Heart,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import catalog from '../data/catalog.json';
import { filterCatalog, readFilters } from '../lib/catalog';
import { TYPES } from '../lib/pokemon';
import Filters from './Filters';
import Hero from './Hero';
import PokemonCard from './PokemonCard';
import PokemonDialog from './PokemonDialog';

const PAGE_SIZE = 24;
export default function PokemonList({ favorites, toggleFavorite }) {
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [layout, setLayout] = useState('grid');
  const [shiny, setShiny] = useState(false);
  const search = useRef(null);
  const results = filterCatalog(catalog, filters, favorites);
  const selected = catalog.find((pokemon) => pokemon.id === Number(params.get('pokemon')));
  const filterKey = JSON.stringify(filters);
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filterKey]);
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        search.current?.focus();
      }
      if (
        event.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) &&
        !document.querySelector('dialog[open]')
      ) {
        event.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  const update = (key, value) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        value ? next.set(key, String(value)) : next.delete(key);
        return next;
      },
      { replace: key !== 'pokemon' },
    );
  const reset = () =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        ['q', 'type', 'gen', 'rarity', 'sort'].forEach((key) => next.delete(key));
        return next;
      },
      { replace: true },
    );
  const random = () =>
    update(
      'pokemon',
      (results.length ? results : catalog)[
        Math.floor(Math.random() * (results.length || catalog.length))
      ].id,
    );
  return (
    <main className="page-shell">
      <Hero onRandom={random} />
      <section id="pokedex" className="catalog-section" aria-labelledby="catalog-title">
        <div className="catalog-intro">
          <div>
            <div className="eyebrow">FIND YOUR NEXT FAVORITE</div>
            <h2 id="catalog-title">
              The Pokédex<span className="heading-dot">.</span>
            </h2>
          </div>
          <span className="catalog-intro-note">
            Every Pokémon has a story.
            <br />
            Start exploring yours.
          </span>
        </div>
        <div className="search-row">
          <div className="search-box">
            <Search size={19} />
            <label className="sr-only" htmlFor="pokemon-search">
              Search by Pokémon name or number
            </label>
            <input
              ref={search}
              id="pokemon-search"
              type="search"
              placeholder="Search by name or Pokédex number…"
              value={filters.query}
              onChange={(event) => update('q', event.target.value)}
              autoComplete="off"
            />
            {filters.query ? (
              <button
                className="icon-button"
                aria-label="Clear search"
                onClick={() => {
                  update('q', '');
                  search.current?.focus();
                }}
              >
                <X size={16} />
              </button>
            ) : (
              <kbd>⌘ / Ctrl K</kbd>
            )}
          </div>
          <button
            className={`button shiny-control ${shiny ? 'active' : ''}`}
            aria-pressed={shiny}
            onClick={() => setShiny((value) => !value)}
          >
            {shiny ? <Check size={16} /> : <Sparkles size={16} />} Shiny mode
          </button>
        </div>
        <div className="catalog-layout">
          <Filters filters={filters} update={update} reset={reset} />
          <div className="catalog-results">
            <div className="results-toolbar">
              <div className="catalog-tabs" role="group" aria-label="Pokémon list">
                <button
                  className={!filters.collection ? 'active' : ''}
                  aria-pressed={!filters.collection}
                  onClick={() => update('view', '')}
                >
                  <LayoutGrid size={15} /> All Pokémon{' '}
                  <span>{catalog.length.toLocaleString()}</span>
                </button>
                <button
                  className={filters.collection ? 'active' : ''}
                  aria-pressed={filters.collection}
                  onClick={() => update('view', 'collection')}
                >
                  <Heart size={15} /> My collection <span>{favorites.length}</span>
                </button>
              </div>
              <div className="layout-toggle" role="group" aria-label="Card layout">
                <button
                  className={layout === 'grid' ? 'active' : ''}
                  aria-pressed={layout === 'grid'}
                  aria-label="Grid layout"
                  onClick={() => setLayout('grid')}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  className={layout === 'compact' ? 'active' : ''}
                  aria-pressed={layout === 'compact'}
                  aria-label="Compact layout"
                  onClick={() => setLayout('compact')}
                >
                  <List size={17} />
                </button>
              </div>
            </div>
            <div className="result-summary">
              <span aria-live="polite">
                <strong>{results.length.toLocaleString()}</strong> Pokémon{' '}
                {filters.collection ? 'in your collection' : 'to discover'}
                {filters.type && (
                  <span
                    className="active-filter"
                    style={{ '--type-color': TYPES[filters.type]?.[0] }}
                  >
                    {filters.type}
                    <button onClick={() => update('type', '')} aria-label="Remove type filter">
                      <X size={11} />
                    </button>
                  </span>
                )}
              </span>
              <label htmlFor="sort-order">
                Sort by{' '}
                <select
                  id="sort-order"
                  value={filters.sort}
                  onChange={(event) => update('sort', event.target.value)}
                >
                  <option value="number">Pokédex number ↑</option>
                  <option value="reverse">Pokédex number ↓</option>
                  <option value="name">Name A–Z</option>
                  <option value="power">Highest base stats</option>
                </select>
              </label>
            </div>
            {results.length ? (
              <>
                <div className={`pokemon-grid ${layout === 'compact' ? 'compact' : ''}`}>
                  {results.slice(0, visible).map((pokemon) => (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      favorite={favorites.includes(pokemon.id)}
                      onFavorite={toggleFavorite}
                      onOpen={(id) => update('pokemon', id)}
                      shiny={shiny}
                    />
                  ))}
                </div>
                <div className="load-more">
                  <p>
                    Showing {Math.min(visible, results.length)} of {results.length.toLocaleString()}{' '}
                    Pokémon
                  </p>
                  {visible < results.length && (
                    <button
                      className="button discover-button"
                      onClick={() => setVisible((current) => current + PAGE_SIZE)}
                    >
                      <span className="pokeball-mark" aria-hidden="true" /> Discover more <span className="discover-arrow"><ArrowDown size={15} /></span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <img
                  src={`${import.meta.env.BASE_URL}brand/pikachu.png`}
                  alt="Pikachu"
                  width="130"
                  height="130"
                />
                <h3>
                  {filters.collection
                    ? 'Your next favorite is waiting.'
                    : 'No Pokémon in this patch of grass.'}
                </h3>
                <p>
                  {filters.collection
                    ? 'Save Pokémon with the heart button, or loosen your filters to find your saved entries.'
                    : 'Try another name, number, or combination of filters.'}
                </p>
                <button className="button button-primary" onClick={() => setParams({})}>
                  Explore all Pokémon
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="closing-note">
        <span className="pokeball-mark" />
        <p>
          A world worth exploring.
          <br />
          <strong>One Pokémon at a time.</strong>
        </p>
        <button
          className="button return-button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'instant'
                : 'smooth',
            })
          }
        >
          <span className="return-ball"><span className="pokeball-mark" aria-hidden="true" /></span><span>Back to top<small>RETURN TO BASE</small></span><ArrowUp size={15} />
        </button>
      </div>
      {selected && (
        <PokemonDialog
          pokemon={selected}
          favorite={favorites.includes(selected.id)}
          onFavorite={toggleFavorite}
          onClose={() => update('pokemon', '')}
          onNavigate={(id) => update('pokemon', id)}
          maxId={catalog.length}
        />
      )}
    </main>
  );
}
