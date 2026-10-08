import { useEffect, useReducer, useState } from 'react';
import { readStored } from '../lib/storage';
import { additionError, initialTeamState, MAX_TEAMS, TEAM_STORAGE_KEY, teamReducer, validTeamState } from '../lib/teams';
import { starterKeys } from '../data/developerPicks';

export default function useTeams() {
  const [state, dispatch] = useReducer(teamReducer, null, () => readStored(TEAM_STORAGE_KEY, initialTeamState(), validTeamState));
  const [notice, setNotice] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);
  const activeTeam = state.teams.find(team => team.id === state.activeId);
  useEffect(() => {
    try { localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(state)); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }, [state]);
  useEffect(() => {
    const sync = event => {
      if (event.key === TEAM_STORAGE_KEY && event.newValue) {
        try { dispatch({ type: 'restore', state: JSON.parse(event.newValue) }); } catch { /* Ignore invalid state from another tab. */ }
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const addMember = key => {
    const error = additionError(activeTeam.members, key);
    if (error) { setNotice(error); return false; }
    dispatch({ type: 'add', key });
    setNotice(`Added to ${activeTeam.name}.`);
    return true;
  };
  const createTeam = (name, members = [], source = null) => {
    if (state.teams.length >= MAX_TEAMS) { setNotice(`You have ${MAX_TEAMS} teams. Remove an unused team before creating another.`); return false; }
    dispatch({ type: 'create', id: crypto.randomUUID(), name, members, source });
    setNotice('Your new adventure is ready.');
    return true;
  };
  return {
    state, activeTeam, notice, storageAvailable, setNotice, dispatch, addMember, createTeam,
    applyPreset: group => createTeam(`Prabh’s ${group.name} six`, starterKeys(group), group.id),
  };
}
