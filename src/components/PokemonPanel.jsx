import { useEffect, useState } from 'react';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import catalog from '../data/catalog.json';
import { fetchSpecies } from '../api/api';
import { defensiveMatchups, dexNumber, formatName, REGIONS, TYPES } from '../lib/pokemon';
import PokemonImage from './PokemonImage';
import Stats from './Stats';
import TypeBadge from './TypeBadge';
import TeamAddButton from './TeamAddButton';

export default function PokemonPanel({ pokemon, favorite, onFavorite, onNavigate }) {
  const [shiny, setShiny] = useState(false);
  const [notes, setNotes] = useState({ id: null, status: 'loading', data: null });
  useEffect(() => {
    const controller = new AbortController();
    fetchSpecies(pokemon.id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setNotes({ id: pokemon.id, status: 'ready', data });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setNotes({ id: pokemon.id, status: 'error', data: null });
      });
    return () => controller.abort();
  }, [pokemon.id]);
  const species = notes.id === pokemon.id ? notes.data : null;
  const status = notes.id === pokemon.id ? notes.status : 'loading';
  const family = catalog.filter(
    (entry) => entry.id === pokemon.evolvesFrom || entry.evolvesFrom === pokemon.id,
  );
  const weaknesses = defensiveMatchups(pokemon.types).filter((entry) => entry.multiplier > 1);
  return (
    <div className="pokemon-panel" style={{ '--type-color': TYPES[pokemon.types[0]][0] }}>
      <div className="panel-art">
        <span className="panel-art-number" aria-hidden="true">
          {String(pokemon.id).padStart(3, '0')}
        </span>
        <div className="panel-art-meta">
          <span>{dexNumber(pokemon.id)}</span>
          <span>
            GEN {pokemon.generation} · {REGIONS[pokemon.generation - 1]}
          </span>
        </div>
        <PokemonImage
          key={`${pokemon.id}-${shiny}`}
          id={pokemon.id}
          name={pokemon.name}
          shiny={shiny}
          eager
        />
        <button
          className={`button shiny-button ${shiny ? 'active' : ''}`}
          aria-pressed={shiny}
          onClick={() => setShiny((value) => !value)}
        >
          <Sparkles size={15} /> {shiny ? 'Shiny artwork' : 'Show shiny'}
        </button>
        <TeamAddButton memberKey={String(pokemon.id)} />
      </div>
      <div className="panel-info">
        <div className="panel-title">
          <div>
            <span className="eyebrow">{species?.genus || 'NATIONAL POKÉDEX'}</span>
            <h2>{formatName(pokemon.name)}</h2>
          </div>
          <button
            className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
            onClick={() => onFavorite(pokemon.id)}
            aria-label={`${favorite ? 'Remove' : 'Add'} ${formatName(pokemon.name)} ${favorite ? 'from' : 'to'} collection`}
            aria-pressed={favorite}
          >
            <Heart size={21} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="panel-types">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
          {pokemon.legendary && <span className="rarity-badge">Legendary</span>}
          {pokemon.mythical && <span className="rarity-badge">Mythical</span>}
        </div>
        <p className="flavor-text">
          {species?.description ||
            (status === 'error'
              ? 'Field notes are unavailable right now. You can still explore this Pokémon’s stats, abilities, and evolution.'
              : 'Fetching this Pokémon’s field notes…')}
        </p>
        <div className="physical-stats">
          <span>
            <small>HEIGHT</small>
            <strong>
              {pokemon.height / 10} <i>m</i>
            </strong>
          </span>
          <span>
            <small>WEIGHT</small>
            <strong>
              {pokemon.weight / 10} <i>kg</i>
            </strong>
          </span>
          <span>
            <small>HABITAT</small>
            <strong className="habitat">{species?.habitat || '—'}</strong>
          </span>
        </div>
        <Stats pokemon={pokemon} />
        <section className="abilities-section">
          <h3>Abilities</h3>
          <div className="ability-list">
            {pokemon.abilities.map((ability) => (
              <span key={ability.name}>
                {formatName(ability.name)}
                {ability.hidden && <small>Hidden</small>}
              </span>
            ))}
          </div>
        </section>
        <section className="weakness-section">
          <h3>Weak against</h3>
          <div className="weaknesses">
            {weaknesses.map(({ type, multiplier }) => (
              <span key={type}>
                <TypeBadge type={type} />
                <small>×{multiplier}</small>
              </span>
            ))}
          </div>
          <p className="fine-print">Type matchups only; abilities and moves can change damage.</p>
        </section>
        {family.length > 0 && (
          <section className="evolution-section">
            <h3>Evolution connections</h3>
            <div className="evolution-list">
              {family.map((entry) => (
                <button key={entry.id} onClick={() => onNavigate(entry.id)}>
                  <PokemonImage id={entry.id} name={entry.name} />
                  <span>
                    <small>
                      {entry.id === pokemon.evolvesFrom ? 'EVOLVES FROM' : 'EVOLVES INTO'}
                    </small>
                    {formatName(entry.name)}
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
