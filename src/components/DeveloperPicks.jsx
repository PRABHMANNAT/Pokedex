import { useContext, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DEVELOPER_GROUPS, DEVELOPER_PICKS, starterKeys } from '../data/developerPicks';
import { TeamContext } from '../context/TeamContext';
import { resolveMember } from '../lib/teams';
import { TYPES } from '../lib/pokemon';
import PokemonImage from './PokemonImage';
import TypeBadge from './TypeBadge';
import TeamAddButton from './TeamAddButton';

export default function DeveloperPicks() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { applyPreset } = useContext(TeamContext);
  const group =
    DEVELOPER_GROUPS.find((group) => group.id === params.get('region')) || DEVELOPER_GROUPS[0];
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Prabh’s developer picks · Pokédex';
    return () => {
      document.title = 'Pokédex · A Trainer’s Field Guide';
    };
  }, []);
  return (
    <main className="page-shell developer-page">
      <Link className="back-to-teams" to="/teams">
        <ArrowLeft size={15} /> Back to your teams
      </Link>
      <div className="picks-intro">
        <div>
          <div className="eyebrow">
            <Heart size={12} /> THE DEVELOPER’S NOTEBOOK
          </div>
          <h1>
            The ones I’d
            <br />
            <span>take along.</span>
          </h1>
          <p>
            Prabhmannat’s favorites, straight from his team sheet.
            <br />
            From Kanto classics to Paldea encounters — special forms and all.
          </p>
        </div>
        <div className="picks-count">
          <strong>{DEVELOPER_PICKS.length}</strong>
          <span>PERSONAL PICKS</span>
          <small>9 regions + Gigantamax</small>
        </div>
      </div>
      <div className="region-tabs" role="group" aria-label="Developer pick regions">
        {DEVELOPER_GROUPS.map((item) => (
          <button
            key={item.id}
            className={group.id === item.id ? 'active' : ''}
            aria-pressed={group.id === item.id}
            onClick={() => setParams({ region: item.id }, { replace: true })}
          >
            {item.generation && <small>{String(item.generation).padStart(2, '0')}</small>}
            {item.name}
          </button>
        ))}
      </div>
      <section className="preset-banner" aria-labelledby="preset-title">
        <div>
          <span className="eyebrow">
            {group.generation ? `GENERATION ${group.generation}` : 'SPECIAL ENCOUNTERS'} /{' '}
            {group.picks.length} FAVORITES
          </span>
          <h2 id="preset-title">
            Prabh’s {group.name} six<span className="heading-dot">.</span>
          </h2>
          <p>An editable starter team drawn from the larger favorites list below.</p>
        </div>
        <div className="preset-roster">
          {starterKeys(group).map((key) => {
            const member = resolveMember(key);
            return (
              <PokemonImage
                key={key}
                id={member.artworkId}
                name={member.label}
                shiny={member.shiny}
              />
            );
          })}
        </div>
        <button
          className="button button-primary"
          onClick={() => {
            if (applyPreset(group)) navigate('/teams');
          }}
        >
          Use this team <ArrowRight size={15} />
        </button>
      </section>
      <div className="picks-section-heading">
        <h2>Every favorite in {group.name}</h2>
        <span>
          <Sparkles size={12} /> Shiny choices are shown as listed
        </span>
      </div>
      <div className="developer-picks-grid">
        {group.picks.map((pick) => {
          const member = resolveMember(pick.key);
          return (
            <article
              className="developer-pick-card"
              key={pick.key}
              style={{ '--type-color': TYPES[member.types[0]][0] }}
            >
              <div className="pick-card-top">
                <span>
                  {pick.artworkId !== pick.id
                    ? 'SPECIAL FORM'
                    : pick.shiny
                      ? 'SHINY PICK'
                      : 'DEVELOPER PICK'}
                </span>
                {pick.shiny && <Sparkles size={13} />}
              </div>
              <div className="pick-art">
                <span />
                <PokemonImage id={pick.artworkId} name={pick.label} shiny={pick.shiny} />
              </div>
              <h3>{pick.label}</h3>
              <div className="pick-types">
                {member.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
              {pick.note && <p className="pick-note">{pick.note}</p>}
              <TeamAddButton memberKey={pick.key} />
              <Link className="pick-species-link" to={`/pokemon/${pick.id}`}>
                View base species <ArrowRight size={11} />
              </Link>
            </article>
          );
        })}
      </div>
      <p className="picks-source-note">
        Transcribed from Prabhmannat’s 15-page personal team sheet. Region groupings follow his
        notebook, including cross-generation favorites. Starter sixes are selections, not a claim
        that the original lists had only six members.
      </p>
    </main>
  );
}
