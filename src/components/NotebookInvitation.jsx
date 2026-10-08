import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import PokemonImage from './PokemonImage';

export default function NotebookInvitation() {
  return (
    <Link
      to="/picks"
      className="developer-invitation notebook-invitation"
      aria-label="Explore Prabh’s developer picks"
    >
      <span className="notebook-heading">
        <BookOpen size={14} /> PRABH’S FIELD NOTES <span>VOL. 01</span>
      </span>
      <strong>
        Favorites worth
        <br />
        <span>taking along.</span>
      </strong>
      <p>
        A personal collection from nine regions.
        <br />
        Mega forms, shiny finds, lifelong favorites.
      </p>
      <span className="notebook-companions" aria-hidden="true">
        <PokemonImage id={6} name="Charizard" />
        <PokemonImage id={448} name="Lucario" />
        <PokemonImage id={658} name="Greninja" />
      </span>
      <span className="notebook-cta">
        Explore Prabh’s picks{' '}
        <span>
          <ArrowUpRight size={18} />
        </span>
      </span>
    </Link>
  );
}
