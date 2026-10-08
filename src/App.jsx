import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Github, Heart, X } from 'lucide-react';
import Header from './components/Header';
import useFavorites from './hooks/useFavorites';
import useTheme from './hooks/useTheme';
import useTeams from './hooks/useTeams';
import { TeamContext } from './context/TeamContext';
import { REPOSITORY } from './lib/pokemon';
import './App.css';
import './styles/catalog.css';
import './styles/detail.css';
import './styles/responsive.css';
import './styles/teams.css';
import './styles/team-responsive.css';
import './styles/team-gallery.css';

const TeamBuilder = lazy(() => import('./components/TeamBuilder'));
const TeamGallery = lazy(() => import('./components/TeamGallery'));
const DeveloperPicks = lazy(() => import('./components/DeveloperPicks'));
const PokemonList = lazy(() => import('./components/PokemonList'));
const PokemonDetail = lazy(() => import('./components/PokemonDetail'));

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();
  const teams = useTeams();
  return (
    <TeamContext.Provider value={teams}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div id="main-content">
          <Suspense
            fallback={
              <main className="page-shell route-loading" role="status">
                <span className="pokeball-mark" /> Opening your next adventure…
              </main>
            }
          >
            <Routes>
              <Route path="/teams" element={<TeamBuilder />} />
              <Route path="/teams/all" element={<TeamGallery />} />
              <Route path="/picks" element={<DeveloperPicks />} />
              <Route
                path="/"
                element={<PokemonList favorites={favorites} toggleFavorite={toggleFavorite} />}
              />
              <Route
                path="/pokemon/:id"
                element={<PokemonDetail favorites={favorites} toggleFavorite={toggleFavorite} />}
              />
              <Route
                path="*"
                element={
                  <main className="not-found">
                    <h1>A little off the beaten path.</h1>
                    <Link className="button button-primary" to="/">
                      Back to the Pokédex
                    </Link>
                  </main>
                }
              />
            </Routes>
          </Suspense>
        </div>
        <footer className="site-footer">
          <div>
            <span className="footer-brand">pokédex.</span>
            <span>
              <span className="maker-credit">
                Made by{' '}
                <a href="https://github.com/PRABHMANNAT" target="_blank" rel="noreferrer">
                  Prabhmannat Singh
                </a>
                <small>
                  With a lot of time, care, and love <Heart size={11} />
                </small>
              </span>
            </span>
          </div>
          <p>An independent fan project. Pokémon © Nintendo / Creatures / GAME FREAK.</p>
          <a href={REPOSITORY} target="_blank" rel="noreferrer">
            <Github size={16} /> View source <span>↗</span>
          </a>
        </footer>
        {teams.notice && (
          <div className="team-toast" role="status">
            <span className="pokeball-mark" aria-hidden="true" />
            <span>{teams.notice}</span>
            <button
              className="icon-button"
              aria-label="Dismiss team notification"
              onClick={() => teams.setNotice('')}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </BrowserRouter>
    </TeamContext.Provider>
  );
}
