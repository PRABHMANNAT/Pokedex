import { ArrowDown, ArrowUpRight, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import catalog from '../data/catalog.json';
import { FEATURED_STORAGE_KEY, selectFeatured } from '../lib/featured';
import { readStored, writeStored } from '../lib/storage';
import PokemonImage from './PokemonImage';

// Choose once per page load, not per render or route visit. Keeping this outside
// React's initializer also avoids double selection in development StrictMode.
const featured = selectFeatured(readStored(FEATURED_STORAGE_KEY, null, Number.isInteger));
writeStored(FEATURED_STORAGE_KEY, featured.id);

export default function Hero({ onRandom }) {
  const base = import.meta.env.BASE_URL;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="status-dot" /> THE WORLD OF POKÉMON, AT YOUR FINGERTIPS
        </div>
        <h1 id="hero-title">
          Little creatures.
          <br />
          <span>Endless discovery.</span>
        </h1>
        <p>
          Your next favorite is out there. Explore every Pokémon,
          <br className="desktop-break" /> learn what makes them special, and build your collection.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#pokedex">
            Explore the Pokédex <ArrowDown size={16} />
          </a>
          <button className="button encounter-button" onClick={onRandom}>
            <span className="encounter-icon">
              <Shuffle size={16} />
            </span>{' '}
            Surprise me
            <span className="encounter-arrow">
              <ArrowUpRight size={14} />
            </span>
          </button>
        </div>
        <div className="hero-facts">
          <span>
            <strong>{catalog.length.toLocaleString()}</strong> Pokémon
          </span>
          <i />
          <span>
            <strong>18</strong> Types
          </span>
          <i />
          <span>
            <strong>9</strong> Generations
          </span>
        </div>
      </div>
      <Link
        to={`/?pokemon=${featured.id}`}
        className="hero-art"
        aria-label={`Meet ${featured.name}`}
        data-pokemon-id={featured.id}
      >
        <span className="hero-art-grid" />
        <span className="hero-art-orbit" />
        <span className="hero-japanese" aria-hidden="true">
          {featured.japanese}
        </span>
        <span className="art-label">FIELD NOTES / NO. {String(featured.id).padStart(4, '0')}</span>
        <img
          className="pokemon-wordmark"
          src={`${base}brand/pokemon-logo.svg`}
          alt="Pokémon"
          width="80"
          height="30"
        />
        <span className="hero-art-stage">
          <PokemonImage className="hero-pokemon" id={featured.id} name={featured.name} eager />
        </span>
        <span className="hero-art-bottom">
          <span>
            <strong>{featured.name}</strong>
            <small>THE {featured.genus.toUpperCase()}</small>
          </span>
          <span className="hero-art-arrow">
            <ArrowUpRight size={21} />
          </span>
        </span>
      </Link>
    </section>
  );
}
