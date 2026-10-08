import test from 'node:test';
import assert from 'node:assert/strict';
import { DEVELOPER_GROUPS, DEVELOPER_PICKS, starterKeys } from '../src/data/developerPicks.js';
import {
  additionError,
  initialTeamState,
  MAX_TEAMS,
  parseSharedTeam,
  resolveMember,
  teamInsights,
  teamReducer,
  validMembers,
  validTeamState,
} from '../src/lib/teams.js';

test('every PDF pick resolves and all ten starter teams have six distinct species', () => {
  assert.equal(DEVELOPER_GROUPS.length, 10);
  assert.equal(new Set(DEVELOPER_PICKS.map((pick) => pick.key)).size, DEVELOPER_PICKS.length);
  for (const pick of DEVELOPER_PICKS) {
    const member = resolveMember(pick.key);
    assert.equal(member.stats.length, 6);
    assert.ok(member.types.length);
    assert.ok(member.label);
  }
  for (const group of DEVELOPER_GROUPS) {
    assert.equal(starterKeys(group).length, 6, group.name);
    assert.ok(validMembers(starterKeys(group)), group.name);
  }
  assert.ok(validTeamState(initialTeamState()));
});

test('form data uses Mega and Alolan types rather than base species types', () => {
  assert.deepEqual(resolveMember('kanto-10034').types, ['fire', 'dragon']);
  assert.deepEqual(resolveMember('alola-10102').types, ['ice', 'steel']);
  assert.equal(resolveMember('kanto-130-shiny').shiny, true);
  assert.equal(resolveMember('missing'), null);
});

test('six slots reject unknown entries, duplicate forms, and seventh companions', () => {
  assert.match(additionError(['6'], 'kanto-10034'), /already/);
  assert.match(additionError(['1', '2', '3', '4', '5', '6'], '7'), /full/);
  assert.match(additionError([], 'invalid'), /not in/);
  assert.equal(additionError([], '1'), '');
  assert.equal(validMembers(['6', 'kanto-10034']), false);
  assert.equal(validMembers([1]), false);
  assert.equal(validMembers(['1', '2', '3', '4', '5', '6', '7']), false);
});

test('editing teams preserves valid state and keeps at least one saved team', () => {
  let state = initialTeamState();
  state = teamReducer(state, {
    type: 'create',
    id: 'mine',
    name: '  Adventure  ',
    members: ['1', '4'],
  });
  assert.equal(state.activeId, 'mine');
  assert.equal(state.teams[1].name, 'Adventure');
  state = teamReducer(state, { type: 'move', key: '4', direction: -1 });
  assert.deepEqual(state.teams[1].members, ['4', '1']);
  state = teamReducer(state, { type: 'add', key: '7' });
  state = teamReducer(state, { type: 'remove', key: '1' });
  assert.deepEqual(state.teams[1].members, ['4', '7']);
  state = teamReducer(state, { type: 'rename', name: 'New name' });
  assert.equal(state.teams[1].name, 'New name');
  state = teamReducer(state, { type: 'delete', id: 'mine' });
  assert.equal(state.activeId, 'prabh-kanto');
  assert.equal(teamReducer(state, { type: 'delete', id: 'prabh-kanto' }), state);
  assert.ok(validTeamState(state));
});

test('capacity and restored storage are validated', () => {
  let state = initialTeamState();
  for (let index = 1; index < MAX_TEAMS; index++)
    state = teamReducer(state, { type: 'create', id: `team-${index}`, name: 'Team' });
  assert.equal(teamReducer(state, { type: 'create', id: 'overflow', name: 'Team' }), state);
  assert.ok(validTeamState(state));
  assert.equal(validTeamState({ ...state, activeId: 'absent' }), false);
  assert.equal(validTeamState({ ...state, version: 2 }), false);
  assert.equal(validTeamState({ ...state, teams: [null] }), false);
  assert.equal(
    validTeamState({ ...state, teams: [{ id: '', name: 'Invalid', members: [] }] }),
    false,
  );
  assert.equal(teamReducer(state, { type: 'restore', state: { version: 1, teams: [] } }), state);
});

test('sharing accepts curated forms and rejects duplicate or invalid lineups', () => {
  const members = starterKeys(DEVELOPER_GROUPS[0]);
  const shared = parseSharedTeam(
    new URLSearchParams({ lineup: members.join('.'), name: 'Prabh & friends' }),
  );
  assert.deepEqual(shared, { members, name: 'Prabh & friends' });
  for (const lineup of ['1.1', '6.kanto-10034', '99999', '1.2.3.4.5.6.7'])
    assert.ok(parseSharedTeam(new URLSearchParams({ lineup })).error);
  assert.equal(parseSharedTeam(new URLSearchParams()), null);
});

test('team insights remain honest about stat totals and shared type weaknesses', () => {
  assert.deepEqual(teamInsights([]), { types: [], averageStats: 0, sharedWeaknesses: [] });
  const insights = teamInsights(['1', '2', '3']);
  assert.deepEqual(insights.types, ['grass', 'poison']);
  assert.equal(insights.averageStats, 416); // (318 + 405 + 525) / 3
  assert.ok(insights.sharedWeaknesses.some((item) => item.type === 'fire' && item.count === 3));
});
