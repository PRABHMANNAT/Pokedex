import { useContext, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Plus, Users } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TeamContext } from '../context/TeamContext';
import { DEVELOPER_GROUPS, starterKeys } from '../data/developerPicks';
import { resolveMember } from '../lib/teams';
import { REGIONS } from '../lib/pokemon';
import PokemonImage from './PokemonImage';

export default function TeamGallery() {
  const { state, dispatch, openPreset } = useContext(TeamContext);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const creator = ['prabh', 'saved'].includes(params.get('creator')) ? params.get('creator') : '';
  const generation = params.get('gen') || '';
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'All teams · Pokédex';
    return () => {
      document.title = 'Pokédex · A Trainer’s Field Guide';
    };
  }, []);
  const change = (key, value) => {
    const next = new URLSearchParams(window.location.search);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };
  const groups = DEVELOPER_GROUPS.filter(
    (group) => !generation || String(group.generation || 'special') === generation,
  );
  const saved = state.teams.filter((team) => {
    if (!generation) return true;
    const group = DEVELOPER_GROUPS.find((group) => group.id === team.source);
    if (group) return String(group.generation || 'special') === generation;
    return team.members.some((key) => String(resolveMember(key).generation) === generation);
  });
  const presets = creator !== 'saved' ? groups : [];
  const local = creator !== 'prabh' ? saved : [];
  const roster = (members) => (
    <div className="gallery-roster">
      {Array.from({ length: 6 }, (_, index) => {
        const member = resolveMember(members[index]);
        return (
          <div key={index} className={member ? '' : 'vacant-gallery-slot'}>
            {member ? (
              <>
                <PokemonImage id={member.artworkId} name={member.label} shiny={member.shiny} />
                <span>{member.label}</span>
              </>
            ) : (
              <>
                <span className="pokeball-mark" />
                <span>Open slot</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
  return (
    <main className="page-shell team-gallery-page">
      <Link className="back-to-teams" to="/teams">
        <ArrowLeft size={15} /> Back to the team builder
      </Link>
      <div className="gallery-intro">
        <div>
          <span className="eyebrow">THE TEAM COLLECTION</span>
          <h1>
            Every region.
            <br />
            <span>A new adventure.</span>
          </h1>
          <p>All Prabh’s generation teams, together with the teams saved in your browser.</p>
        </div>
        <div className="gallery-book-mark" aria-hidden="true">
          <span className="pokeball-mark" />
          <small>TEAM / ARCHIVE</small>
          <strong>01—09</strong>
        </div>
      </div>
      <div className="gallery-filters">
        <label>
          Created by
          <select
            aria-label="Created by"
            value={creator}
            onChange={(event) => change('creator', event.target.value)}
          >
            <option value="">All teams</option>
            <option value="prabh">Prabh’s presets</option>
            <option value="saved">Saved in this browser</option>
          </select>
        </label>
        <label>
          Generation
          <select
            aria-label="Generation"
            value={generation}
            onChange={(event) => change('gen', event.target.value)}
          >
            <option value="">All generations</option>
            {REGIONS.map((region, index) => (
              <option key={region} value={index + 1}>
                Gen {index + 1} · {region}
              </option>
            ))}
            <option value="special">Gigantamax</option>
          </select>
        </label>
        <span>{presets.length + local.length} teams to explore</span>
      </div>
      <p className="gallery-privacy-note">
        No public directory or login: other people’s teams appear here only after you save a shared
        team link.
      </p>
      {presets.length > 0 && (
        <section className="gallery-section" aria-labelledby="prabh-teams-title">
          <div className="gallery-section-heading">
            <h2 id="prabh-teams-title">
              <BookOpen size={19} /> Prabh’s generation teams
            </h2>
            <span>Original templates · editable copies</span>
          </div>
          <div className="team-gallery-grid">
            {presets.map((group) => {
              const existing = state.teams.some((team) => team.source === group.id);
              return (
                <article className="team-gallery-card" key={group.id}>
                  <div className="gallery-card-meta">
                    <span>
                      {group.generation
                        ? `GEN ${String(group.generation).padStart(2, '0')} / ${group.name}`
                        : 'SPECIAL / GIGANTAMAX'}
                    </span>
                    <small>BY PRABH</small>
                  </div>
                  <h3>Prabh’s {group.name} six</h3>
                  {roster(starterKeys(group))}
                  <div className="gallery-card-actions">
                    <button
                      className="button button-primary"
                      aria-label={`Open Prabh’s ${group.name} team`}
                      onClick={() => {
                        if (openPreset(group)) navigate('/teams');
                      }}
                    >
                      {existing ? 'Open saved copy' : 'Start with this team'}
                      <ArrowRight size={14} />
                    </button>
                    <Link to={`/picks?region=${group.id}`}>All favorites</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
      {local.length > 0 && (
        <section className="gallery-section" aria-labelledby="saved-teams-title">
          <div className="gallery-section-heading">
            <h2 id="saved-teams-title">
              <Users size={19} /> Saved in this browser
            </h2>
            <Link to="/teams">
              <Plus size={13} /> Create another team
            </Link>
          </div>
          <div className="team-gallery-grid">
            {local.map((team) => (
              <article className="team-gallery-card saved-gallery-card" key={team.id}>
                <div className="gallery-card-meta">
                  <span>{team.source ? 'YOUR EDITABLE COPY' : 'YOUR OWN ADVENTURE'}</span>
                  <small>{team.members.length}/6 COMPANIONS</small>
                </div>
                <h3>{team.name}</h3>
                {roster(team.members)}
                <div className="gallery-card-actions">
                  <button
                    className="button button-outlined"
                    aria-label={`Edit ${team.name}`}
                    onClick={() => {
                      dispatch({ type: 'select', id: team.id });
                      navigate('/teams');
                    }}
                  >
                    Edit team
                    <ArrowRight size={14} />
                  </button>
                  <span>{team.id === state.activeId ? 'CURRENT TEAM' : 'LOCAL SAVE'}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {!presets.length && !local.length && (
        <div className="team-picker-empty">
          <h2>No teams in this view yet.</h2>
          <p>Try another generation or creator, or build a new team.</p>
          <button className="button button-outlined" onClick={() => setParams({})}>
            Show all teams
          </button>
        </div>
      )}
    </main>
  );
}
