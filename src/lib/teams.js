import catalog from '../data/catalog.json' with { type: 'json' };
import forms from '../data/pickForms.json' with { type: 'json' };
import { DEVELOPER_GROUPS, DEVELOPER_PICKS, starterKeys } from '../data/developerPicks.js';
import { defensiveMatchups, formatName, TYPES } from './pokemon.js';

export const TEAM_SIZE = 6;
export const MAX_TEAMS = 24;
export const TEAM_STORAGE_KEY = 'pokedex:teams:v1';
const pokemonById = new Map(catalog.map(pokemon => [pokemon.id, pokemon]));
const members = new Map(catalog.map(pokemon => [String(pokemon.id), { key: String(pokemon.id), id: pokemon.id, label: formatName(pokemon.name), artworkId: pokemon.id, shiny: false }]));
DEVELOPER_PICKS.forEach(pick => members.set(pick.key, pick));
export function resolveMember(key) {
  const member = members.get(String(key));
  if (!member) return null;
  const pokemon = pokemonById.get(member.id);
  return { ...pokemon, ...member, ...(forms[member.artworkId] || {}) };
}
export function additionError(keys, key) {
  const member = resolveMember(key);
  if (!member) return 'That Pokémon is not in the field guide.';
  if (keys.some(existing => resolveMember(existing)?.id === member.id)) return `${formatName(pokemonById.get(member.id).name)} is already on this team. Try another Pokémon or remove its current form first.`;
  if (keys.length >= TEAM_SIZE) return 'Your six slots are full. Remove a Pokémon or create another team.';
  return '';
}
export function validMembers(keys) {
  return Array.isArray(keys) && keys.length <= TEAM_SIZE && keys.every(key => typeof key === 'string' && resolveMember(key)) && new Set(keys.map(key => resolveMember(key).id)).size === keys.length;
}
export function validTeamState(value) {
  return value?.version === 1 && Array.isArray(value.teams) && value.teams.length > 0 && value.teams.length <= MAX_TEAMS &&
    value.teams.every(team => typeof team.id === 'string' && team.id.length <= 80 && typeof team.name === 'string' && team.name.trim().length > 0 && team.name.length <= 40 && validMembers(team.members)) &&
    new Set(value.teams.map(team => team.id)).size === value.teams.length && value.teams.some(team => team.id === value.activeId);
}
export function initialTeamState() {
  return { version: 1, activeId: 'prabh-kanto', teams: [{ id: 'prabh-kanto', name: 'Prabh’s Kanto six', members: starterKeys(DEVELOPER_GROUPS[0]), source: 'kanto' }] };
}
export function teamReducer(state, action) {
  const update = fn => ({ ...state, teams: state.teams.map(team => team.id === state.activeId ? fn(team) : team) });
  switch (action.type) {
    case 'restore': return validTeamState(action.state) ? action.state : state;
    case 'select': return state.teams.some(team => team.id === action.id) ? { ...state, activeId: action.id } : state;
    case 'create': {
      if (state.teams.length >= MAX_TEAMS || !validMembers(action.members || []) || state.teams.some(team => team.id === action.id)) return state;
      const name = (action.name || 'My next adventure').trim().slice(0, 40) || 'My next adventure';
      return { ...state, activeId: action.id, teams: [...state.teams, { id: action.id, name, members: action.members || [], source: action.source || null }] };
    }
    case 'rename': return action.name.trim() ? update(team => ({ ...team, name: action.name.trim().slice(0,40) })) : state;
    case 'add': return update(team => additionError(team.members, action.key) ? team : { ...team, members: [...team.members, String(action.key)] });
    case 'remove': return update(team => ({ ...team, members: team.members.filter(key => key !== action.key) }));
    case 'move': return update(team => {
      const index = team.members.indexOf(action.key);
      const next = index + action.direction;
      if (index < 0 || next < 0 || next >= team.members.length || ![-1, 1].includes(action.direction)) return team;
      const members = [...team.members];
      [members[index], members[next]] = [members[next], members[index]];
      return { ...team, members };
    });
    case 'delete': {
      if (state.teams.length === 1 || !state.teams.some(team => team.id === action.id)) return state;
      const teams = state.teams.filter(team => team.id !== action.id);
      return { ...state, teams, activeId: action.id === state.activeId ? teams[0].id : state.activeId };
    }
    default: return state;
  }
}
export function teamInsights(keys) {
  const roster = keys.map(resolveMember).filter(Boolean);
  return {
    types: [...new Set(roster.flatMap(member => member.types))],
    averageStats: roster.length ? Math.round(roster.reduce((sum, member) => sum + member.stats.reduce((a,b) => a+b, 0), 0) / roster.length) : 0,
    sharedWeaknesses: Object.keys(TYPES).map(type => ({ type, count: roster.filter(member => defensiveMatchups(member.types).find(matchup => matchup.type === type).multiplier > 1).length })).filter(item => item.count >= 3),
  };
}
export function parseSharedTeam(params) {
  const lineup = params.get('lineup');
  if (!lineup) return null;
  const members = lineup.split('.');
  if (!validMembers(members) || !members.length) return { error: 'This team link contains an invalid or duplicate Pokémon.' };
  return { name: (params.get('name') || 'A shared adventure').trim().slice(0, 40) || 'A shared adventure', members };
}
