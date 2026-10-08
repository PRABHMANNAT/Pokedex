import { TYPES } from '../lib/pokemon';

export default function TypeBadge({ type }) {
  const [color, symbol] = TYPES[type] || TYPES.normal;
  return <span className="type-badge" style={{ '--type-color': color }}><span aria-hidden="true">{symbol}</span>{type}</span>;
}
