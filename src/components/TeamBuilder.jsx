import { useContext, useEffect, useState } from 'react';
import { ArrowRight, Check, Copy, Heart, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { TeamContext } from '../context/TeamContext';
import {
  additionError,
  MAX_TEAMS,
  parseSharedTeam,
  resolveMember,
  TEAM_SIZE,
  teamInsights,
} from '../lib/teams';
import TeamSlot from './TeamSlot';
import TeamPicker from './TeamPicker';
import TypeBadge from './TypeBadge';

export default function TeamBuilder() {
  const { state, activeTeam, createTeam, addMember, dispatch, storageAvailable, setNotice } =
    useContext(TeamContext);
  const [params, setParams] = useSearchParams();
  const shared = parseSharedTeam(params);
  const candidate = resolveMember(params.get('candidate'));
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('My next adventure');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const insights = teamInsights(activeTeam.members);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Your teams · Pokédex';
    return () => {
      document.title = 'Pokédex · A Trainer’s Field Guide';
    };
  }, []);
  useEffect(() => {
    setConfirmDelete(false);
    setCopied(false);
  }, [state.activeId]);
  const choose = () => {
    document.getElementById('team-search')?.focus();
  };
  const copy = async () => {
    const query = new URLSearchParams({
      lineup: activeTeam.members.join('.'),
      name: activeTeam.name,
    });
    const link = new URL(`${import.meta.env.BASE_URL}teams?${query}`, location.origin).href;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setNotice('The browser could not copy this link. You can still keep your team saved here.');
    }
  };
  return (
    <main className="page-shell team-page">
      <div className="team-page-intro">
        <div>
          <div className="eyebrow">
            <span className="status-dot" /> SIX COMPANIONS. A THOUSAND POSSIBILITIES.
          </div>
          <h1>
            Your six.
            <br />
            <span>Your story.</span>
          </h1>
          <p>
            Build a team that feels like you. No account, no sign-up.
            <br />
            Just your favorites, ready for the next adventure.
          </p>
          <div className="team-local-note">
            <ShieldCheck size={14} />{' '}
            {storageAvailable
              ? 'Saved on this browser · No login needed'
              : 'Storage unavailable · Your team works for this session'}
          </div>
        </div>
        <Link to="/picks" className="developer-invitation">
          <span className="eyebrow">
            <Heart size={12} /> FROM THE DEVELOPER’S NOTEBOOK
          </span>
          <strong>Meet Prabh’s picks.</strong>
          <p>
            Nine regions, some special forms,
            <br />
            and a whole lot of favorites.
          </p>
          <span>
            Find your inspiration <ArrowRight size={16} />
          </span>
        </Link>
      </div>
      {shared && (
        <section className="shared-team-banner" aria-label="Shared team">
          {shared.error ? (
            <>
              <p>{shared.error}</p>
              <button className="button button-outlined" onClick={() => setParams({})}>
                Dismiss link
              </button>
            </>
          ) : (
            <>
              <div>
                <strong>A team someone wanted you to meet.</strong>
                <p>
                  {shared.name} · {shared.members.map((key) => resolveMember(key).label).join(', ')}
                </p>
              </div>
              <button
                className="button button-primary"
                onClick={() => {
                  if (createTeam(shared.name, shared.members)) setParams({});
                }}
              >
                Save shared team
              </button>
            </>
          )}
        </section>
      )}
      <section className="team-workbench" aria-labelledby="team-name">
        <div className="workbench-toolbar">
          <div>
            <label htmlFor="active-team">YOUR SAVED TEAMS</label>
            <select
              id="active-team"
              value={state.activeId}
              onChange={(event) => dispatch({ type: 'select', id: event.target.value })}
            >
              {state.teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="button button-primary create-team-button"
            disabled={state.teams.length >= MAX_TEAMS}
            onClick={() => setCreating((value) => !value)}
          >
            <Plus size={16} /> Create team
          </button>
        </div>
        {creating && (
          <form
            className="create-team-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (createTeam(name)) {
                setCreating(false);
                setName('My next adventure');
              }
            }}
          >
            <label htmlFor="new-team-name">A name for your next adventure</label>
            <input
              id="new-team-name"
              autoFocus
              required
              maxLength={40}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <button className="button button-primary" type="submit">
              Save new team <ArrowRight size={14} />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Cancel new team"
              onClick={() => setCreating(false)}
            >
              <X size={17} />
            </button>
          </form>
        )}
        <div className="roster-heading">
          <div>
            <span className="eyebrow">
              {activeTeam.source ? 'ADAPTED FROM PRABH’S PICKS' : 'YOUR OWN FIELD NOTES'}
            </span>
            <h2 id="team-name">
              {activeTeam.name}
              <span className="heading-dot">.</span>
            </h2>
            <form
              key={activeTeam.id + activeTeam.name}
              className="rename-team-form"
              onSubmit={(event) => {
                event.preventDefault();
                dispatch({
                  type: 'rename',
                  name: new FormData(event.currentTarget).get('teamName'),
                });
              }}
            >
              <label className="sr-only" htmlFor="rename-team">
                Team name
              </label>
              <input
                id="rename-team"
                name="teamName"
                defaultValue={activeTeam.name}
                required
                maxLength={40}
              />
              <button type="submit">Rename</button>
            </form>
          </div>
          <div className="roster-counter">
            <span>{activeTeam.members.length}</span> / 6<small>COMPANIONS</small>
          </div>
        </div>
        {candidate && (
          <div className="candidate-banner">
            <div>
              <strong>Make room for {candidate.label}.</strong>
              <p>
                {additionError(activeTeam.members, candidate.key) ||
                  'There is room on your team for this Pokémon.'}
              </p>
            </div>
            <button
              className="button button-outlined"
              disabled={Boolean(additionError(activeTeam.members, candidate.key))}
              onClick={() => {
                addMember(candidate.key);
                setParams({});
              }}
            >
              Add {candidate.label}
            </button>
            <button
              className="icon-button"
              aria-label="Dismiss selected Pokémon"
              onClick={() => setParams({})}
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="team-slots">
          {Array.from({ length: TEAM_SIZE }, (_, index) => (
            <TeamSlot
              key={`${index}-${activeTeam.members[index] || 'empty'}`}
              memberKey={activeTeam.members[index]}
              index={index}
              count={activeTeam.members.length}
              onRemove={(key) => dispatch({ type: 'remove', key })}
              onMove={(key, direction) => dispatch({ type: 'move', key, direction })}
              onChoose={choose}
            />
          ))}
        </div>
        <div className="team-insights">
          <div>
            <small>TYPE DIVERSITY</small>
            <strong>
              {insights.types.length}
              <span> / 18 types</span>
            </strong>
            <div>
              {insights.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
          <div>
            <small>AVERAGE BASE-STAT TOTAL</small>
            <strong>{insights.averageStats || '—'}</strong>
            <p>A quick comparison, not a battle rating.</p>
          </div>
          <div>
            <small>SHARED TYPE WEAKNESSES</small>
            <div className="shared-weaknesses">
              {insights.sharedWeaknesses.length ? (
                insights.sharedWeaknesses.map(({ type, count }) => (
                  <span key={type}>
                    <TypeBadge type={type} />
                    <small>
                      {count}/{activeTeam.members.length}
                    </small>
                  </span>
                ))
              ) : (
                <p>
                  {activeTeam.members.length
                    ? 'No type threatens three or more members.'
                    : 'Choose some companions to see your coverage.'}
                </p>
              )}
            </div>
            <p>Type chart only; abilities and moves may change damage.</p>
          </div>
        </div>
        <div className="team-workbench-bottom">
          <span>
            <Check size={13} />{' '}
            {storageAvailable
              ? 'Your edits save automatically here.'
              : 'Changes cannot be saved while browser storage is blocked.'}
          </span>
          <div>
            <button
              className="button button-outlined"
              disabled={!activeTeam.members.length}
              onClick={copy}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Link copied' : 'Copy team link'}
            </button>
            {confirmDelete ? (
              <>
                <span className="delete-confirmation">Remove this saved team?</span>
                <button
                  className="delete-team-confirm"
                  onClick={() => {
                    dispatch({ type: 'delete', id: activeTeam.id });
                    setConfirmDelete(false);
                  }}
                >
                  Yes, delete
                </button>
                <button
                  className="icon-button"
                  aria-label="Cancel team deletion"
                  onClick={() => setConfirmDelete(false)}
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              <button
                className="icon-button"
                aria-label="Delete current team"
                title={
                  state.teams.length === 1
                    ? 'Keep at least one team; remove members to start fresh.'
                    : 'Delete current team'
                }
                disabled={state.teams.length === 1}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      </section>
      <TeamPicker activeTeam={activeTeam} onAdd={addMember} />
    </main>
  );
}
