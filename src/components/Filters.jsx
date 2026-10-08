import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { REGIONS, TYPES } from '../lib/pokemon';

export default function Filters({ filters, update, reset }) {
  const active = filters.type || filters.generation || filters.rarity;
  return (
    <aside className="filters" aria-label="Pokémon filters">
      <div className="filter-heading">
        <h3>
          <SlidersHorizontal size={15} /> Refine your search
        </h3>
        {active && (
          <button
            className="icon-button"
            onClick={reset}
            aria-label="Reset filters"
            title="Reset filters"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <fieldset>
        <legend>POKÉMON TYPE</legend>
        <div className="type-filter-grid">
          <button
            className={`type-filter all-types ${!filters.type ? 'selected' : ''}`}
            aria-pressed={!filters.type}
            onClick={() => update('type', '')}
          >
            <span>✦</span> All types <small>18</small>
          </button>
          {Object.entries(TYPES).map(([type, [color, symbol]]) => (
            <button
              key={type}
              style={{ '--type-color': color }}
              className={`type-filter ${filters.type === type ? 'selected' : ''}`}
              aria-pressed={filters.type === type}
              onClick={() => update('type', filters.type === type ? '' : type)}
            >
              <span aria-hidden="true">{symbol}</span>
              {type}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="filter-divider" />
      <label className="filter-select-label" htmlFor="generation">
        GENERATION
      </label>
      <select
        id="generation"
        value={filters.generation}
        onChange={(event) => update('gen', event.target.value)}
      >
        <option value="">All regions</option>
        {REGIONS.map((region, index) => (
          <option key={region} value={index + 1}>
            Gen {index + 1} · {region}
          </option>
        ))}
      </select>
      <label className="filter-select-label" htmlFor="rarity">
        SPECIAL ENCOUNTERS
      </label>
      <select
        id="rarity"
        value={filters.rarity}
        onChange={(event) => update('rarity', event.target.value)}
      >
        <option value="">Every Pokémon</option>
        <option value="legendary">Legendary</option>
        <option value="mythical">Mythical</option>
      </select>
      <div className="field-tip">
        <img src={`${import.meta.env.BASE_URL}brand/pikachu.png`} alt="" width="64" height="64" />
        <span>
          <strong>A little trainer tip</strong>
          <p>Tap the heart on any Pokémon to keep it in your collection.</p>
        </span>
      </div>
    </aside>
  );
}
