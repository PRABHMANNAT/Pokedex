import { ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { REPOSITORY } from '../lib/pokemon';

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Pokédex home">
          <span className="brand-icon">
            <img
              src={`${import.meta.env.BASE_URL}brand/poke-ball.png`}
              alt=""
              width="32"
              height="32"
            />
          </span>
          <span>
            pokédex<span className="brand-dot">.</span>
            <small>A TRAINER’S FIELD GUIDE</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link className="nav-link" to="/">
            Explore the Pokédex
          </Link>
          <span className="header-divider" />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <a className="github-button" href={REPOSITORY} target="_blank" rel="noreferrer">
            <Star size={15} />
            <span>Star on GitHub</span>
            <ArrowUpRight size={14} />
          </a>
        </nav>
      </div>
    </header>
  );
}
