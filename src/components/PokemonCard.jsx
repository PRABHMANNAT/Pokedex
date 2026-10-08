import { ArrowUpRight, Heart } from 'lucide-react';
import { dexNumber, formatName, TYPES } from '../lib/pokemon';
import PokemonImage from './PokemonImage';
import TypeBadge from './TypeBadge';
import TeamAddButton from './TeamAddButton';

export default function PokemonCard({ pokemon, favorite, onFavorite, onOpen, shiny }) {
  const [color] = TYPES[pokemon.types[0]];
  return (
    <article className="pokemon-card" style={{ '--type-color': color }}>
      <div className="card-top">
        <span className="dex-number">{dexNumber(pokemon.id)}</span>
        <button
          className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
          aria-label={`${favorite ? 'Remove' : 'Add'} ${formatName(pokemon.name)} ${favorite ? 'from' : 'to'} collection`}
          aria-pressed={favorite}
          onClick={() => onFavorite(pokemon.id)}
        >
          <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <button
        className="card-open"
        onClick={() => onOpen(pokemon.id)}
        aria-label={`View ${formatName(pokemon.name)} details`}
      >
        <div className="card-art">
          <span className="card-orbit" />
          <span className="card-watermark" aria-hidden="true">
            {String(pokemon.id).padStart(3, '0')}
          </span>
          <PokemonImage id={pokemon.id} name={pokemon.name} shiny={shiny} />
        </div>
        <div className="card-title">
          <h3>{formatName(pokemon.name)}</h3>
          <ArrowUpRight size={17} />
        </div>
        <div className="card-types">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
        <div className="card-stats">
          {['HP', 'ATK', 'DEF'].map((name, index) => (
            <span key={name}>
              <small>{name}</small>
              <strong>{pokemon.stats[index]}</strong>
              <i>
                <i style={{ width: `${Math.min((pokemon.stats[index] / 180) * 100, 100)}%` }} />
              </i>
            </span>
          ))}
        </div>
      </button>
      <TeamAddButton memberKey={String(pokemon.id)} compact />
    </article>
  );
}
