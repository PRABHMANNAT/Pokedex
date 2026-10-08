import { ArrowUpRight, Github, Star } from 'lucide-react';
import { useContext } from 'react';
import { TeamContext } from '../context/TeamContext';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { REPOSITORY } from '../lib/pokemon';

export default function Header({ theme, toggleTheme }) {
  const { activeTeam } = useContext(TeamContext);
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
          <Link
            className="teams-nav"
            to="/teams"
            aria-label={`My teams, ${activeTeam.members.length} of 6 companions`}
          >
            <span className="team-nav-emblem" aria-hidden="true">
              <span className="pokeball-mark" />
              <span className="pokeball-mark" />
              <span className="pokeball-mark" />
            </span>
            <span>My team</span>
            <small>{activeTeam.members.length}/6</small>
          </Link>
          <span className="header-divider" />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <a
            className="github-button"
            href={REPOSITORY}
            target="_blank"
            rel="noreferrer"
            aria-label="Star on GitHub"
          >
            <span className="github-button-icon">
              <Github size={17} />
            </span>
            <span>Star on GitHub</span>
            <span className="github-star">
              <Star size={13} />
            </span>
            <ArrowUpRight size={13} />
          </a>
        </nav>
      </div>
    </header>
  );
}
