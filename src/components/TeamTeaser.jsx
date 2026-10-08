import { useContext } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamContext } from '../context/TeamContext';

export default function TeamTeaser() {
  const { activeTeam } = useContext(TeamContext);
  return (
    <Link to="/teams" className="team-teaser">
      <span className="teaser-balls" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className={`pokeball-mark ${index >= activeTeam.members.length ? 'empty-ball' : ''}`}
          />
        ))}
      </span>
      <span>
        <strong>Your dream team starts with six.</strong>
        <small>Build your own, or begin with Prabh’s favorites. No login needed.</small>
      </span>
      <span className="teaser-link">
        <span className="pokeball-mark" aria-hidden="true" />
        Build your team <ArrowUpRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
