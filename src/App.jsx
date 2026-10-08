import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';
import Header from './components/Header';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import useFavorites from './hooks/useFavorites';
import useTheme from './hooks/useTheme';
import { REPOSITORY } from './lib/pokemon';
import './App.css';
import './styles/catalog.css';
import './styles/detail.css';
import './styles/responsive.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div id="main-content">
        <Routes>
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
      </div>
      <footer className="site-footer">
        <div>
          <span className="footer-brand">pokédex.</span>
          <span>
            <span className="maker-credit">Made by <a href="https://github.com/PRABHMANNAT" target="_blank" rel="noreferrer">Prabhmannat Singh</a><small>With a lot of time, care, and love <Heart size={11} /></small></span>
          </span>
        </div>
        <p>An independent fan project. Pokémon © Nintendo / Creatures / GAME FREAK.</p>
        <a href={REPOSITORY} target="_blank" rel="noreferrer">
          <Github size={16} /> View source <span>↗</span>
        </a>
      </footer>
    </BrowserRouter>
  );
}
