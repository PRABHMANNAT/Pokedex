import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import PokemonImage from './PokemonImage';
import TypeBadge from './TypeBadge';
import { resolveMember } from '../lib/teams';
import { TYPES } from '../lib/pokemon';

export default function TeamSlot({ memberKey, index, count, onRemove, onMove, onChoose }) {
  const member = resolveMember(memberKey);
  if (!member)
    return (
      <button
        className="team-slot empty-team-slot"
        onClick={onChoose}
        aria-label={`Choose Pokémon for slot ${index + 1}`}
      >
        <span className="slot-number">0{index + 1}</span>
        <span className="empty-slot-ball">
          <Plus size={22} />
        </span>
        <strong>A new companion</strong>
        <small>Choose a Pokémon below</small>
      </button>
    );
  return (
    <article
      className="team-slot"
      style={{ '--type-color': TYPES[member.types[0]][0] }}
      aria-label={`Slot ${index + 1}: ${member.label}`}
    >
      <div className="slot-top">
        <span className="slot-number">0{index + 1}</span>
        {index === 0 && <span className="lead-badge">LEAD</span>}
        <button
          className="icon-button slot-remove"
          onClick={() => onRemove(memberKey)}
          aria-label={`Remove ${member.label} from team`}
        >
          <X size={14} />
        </button>
      </div>
      <div className="slot-art">
        <span />
        <PokemonImage id={member.artworkId} name={member.label} shiny={member.shiny} />
      </div>
      <h3>{member.label}</h3>
      <div className="slot-types">
        {member.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
      <div className="slot-bottom">
        <small>
          {member.artworkId !== member.id
            ? 'SPECIAL FORM'
            : member.shiny
              ? 'SHINY PICK'
              : 'YOUR COMPANION'}
        </small>
        <span>
          <button
            className="icon-button"
            aria-label={`Move ${member.label} earlier`}
            disabled={index === 0}
            onClick={() => onMove(memberKey, -1)}
          >
            <ChevronLeft size={13} />
          </button>
          <button
            className="icon-button"
            aria-label={`Move ${member.label} later`}
            disabled={index === count - 1}
            onClick={() => onMove(memberKey, 1)}
          >
            <ChevronRight size={13} />
          </button>
        </span>
      </div>
    </article>
  );
}
