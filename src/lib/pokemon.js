import effectiveness from '../data/effectiveness.json' with { type: 'json' };

export const REPOSITORY = 'https://github.com/PRABHMANNAT/Pokedex';
export const TYPES = {
  normal: ['#797d87', '○'],
  fire: ['#c65c32', '♨'],
  water: ['#397ab8', '≈'],
  electric: ['#997515', 'ϟ'],
  grass: ['#4d8856', '♧'],
  ice: ['#367e87', '❄'],
  fighting: ['#ab514b', '✦'],
  poison: ['#8658a0', '◉'],
  ground: ['#9b744d', '▰'],
  flying: ['#737dad', '↗'],
  psychic: ['#bd5d81', '◎'],
  bug: ['#79882e', '❋'],
  rock: ['#89754a', '◆'],
  ghost: ['#71669d', '☽'],
  dragon: ['#6562b8', '✧'],
  dark: ['#666174', '◐'],
  steel: ['#627e87', '⬡'],
  fairy: ['#b76c9b', '✿'],
};
export const REGIONS = [
  'Kanto',
  'Johto',
  'Hoenn',
  'Sinnoh',
  'Unova',
  'Kalos',
  'Alola',
  'Galar / Hisui',
  'Paldea',
];
export const STAT_NAMES = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
export const formatName = (name) =>
  name === 'nidoran-f'
    ? 'Nidoran ♀'
    : name === 'nidoran-m'
      ? 'Nidoran ♂'
      : name
          .split('-')
          .map((part) => part[0]?.toUpperCase() + part.slice(1))
          .join(' ');
export const dexNumber = (id) => `#${String(id).padStart(4, '0')}`;
export const artwork = (id, shiny = false) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shiny ? 'shiny/' : ''}${id}.png`;
export const totalStats = (pokemon) => pokemon.stats.reduce((a, b) => a + b, 0);
export function defensiveMatchups(types) {
  return Object.keys(TYPES).map((type) => ({
    type,
    multiplier: types.reduce(
      (product, defense) => product * (effectiveness[type]?.[defense] ?? 1),
      1,
    ),
  }));
}
