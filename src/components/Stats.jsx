import { STAT_NAMES, totalStats } from '../lib/pokemon';

export default function Stats({ pokemon }) {
  return <section className="stats-section" aria-labelledby="stats-heading"><div className="section-heading"><h3 id="stats-heading">Base stats</h3><span>Total <strong>{totalStats(pokemon)}</strong></span></div>{pokemon.stats.map((value, index) => <div className="stat-row" key={STAT_NAMES[index]}><span>{STAT_NAMES[index]}</span><strong>{value}</strong><meter min="0" max="255" value={value} aria-label={`${STAT_NAMES[index]}: ${value}`} style={{ '--stat-color': ['#6a9a66', '#d78a56', '#d4b465', '#7c99b9', '#879ac0', '#bc81a3'][index] }} /></div>)}</section>;
}
