import { useContext } from 'react';
import { Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamContext } from '../context/TeamContext';
import { resolveMember, TEAM_SIZE } from '../lib/teams';

export default function TeamAddButton({ memberKey, compact = false }) {
  const { activeTeam, addMember } = useContext(TeamContext);
  const member = resolveMember(memberKey);
  const present = activeTeam.members.some(key => resolveMember(key).id === member.id);
  const className = `team-add-button ${compact ? 'compact-add' : ''} ${present ? 'on-team' : ''}`;
  if (present) return <span className={className}><Check size={13} /> On your team</span>;
  if (activeTeam.members.length === TEAM_SIZE) return <Link className={className} to={`/teams?candidate=${encodeURIComponent(memberKey)}`} aria-label={`Choose ${member.label} for team`}><Plus size={13} /> Choose for team</Link>;
  return <button className={className} onClick={() => addMember(memberKey)} aria-label={`Add ${member.label} to team`}><Plus size={13} /> Add to team</button>;
}
