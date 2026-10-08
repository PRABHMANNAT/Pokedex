import { useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import catalog from '../data/catalog.json';
import { formatName } from '../lib/pokemon';
import PokemonPanel from './PokemonPanel';

export default function PokemonDetail({ favorites, toggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const pokemon = catalog.find(
    (pokemon) => String(pokemon.id) === id || pokemon.name === id?.toLowerCase(),
  );
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = pokemon
      ? `${formatName(pokemon.name)} · Pokédex`
      : 'Pokémon not found · Pokédex';
    return () => {
      document.title = 'Pokédex · A Trainer’s Field Guide';
    };
  }, [pokemon]);
  if (!pokemon)
    return (
      <main className="not-found">
        <span className="pokeball-mark" />
        <h1>This Pokémon wandered off.</h1>
        <p>Try a National Pokédex number from 1 to {catalog.length}.</p>
        <Link className="button button-primary" to="/">
          Back to the Pokédex
        </Link>
      </main>
    );
  return (
    <main className="detail-page">
      <div className="detail-nav">
        <Link to="/">
          <ArrowLeft size={16} /> Back to the Pokédex
        </Link>
        <div>
          <button
            className="icon-button"
            aria-label="Previous Pokémon"
            disabled={pokemon.id === 1}
            onClick={() => navigate(`/pokemon/${pokemon.id - 1}`)}
          >
            <ChevronLeft size={19} />
          </button>
          <button
            className="icon-button"
            aria-label="Next Pokémon"
            disabled={pokemon.id === catalog.length}
            onClick={() => navigate(`/pokemon/${pokemon.id + 1}`)}
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>
      <PokemonPanel
        key={pokemon.id}
        pokemon={pokemon}
        favorite={favorites.includes(pokemon.id)}
        onFavorite={toggleFavorite}
        onNavigate={(id) => navigate(`/pokemon/${id}`)}
      />
    </main>
  );
}
