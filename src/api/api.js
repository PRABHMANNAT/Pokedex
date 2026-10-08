const API_BASE_URL = import.meta.env.VITE_POKEMON_API_BASE_URL;

export const pokemonApi = {
  // Get list of pokemon with pagination
  getPokemonList: (limit = 20, offset = 0) => 
    `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,

  // Get single pokemon details by ID or name
  getPokemonDetails: (idOrName) => 
    `${API_BASE_URL}/pokemon/${idOrName}`,

  // Get pokemon species details
  getPokemonSpecies: (idOrName) => 
    `${API_BASE_URL}/pokemon-species/${idOrName}`,

  // Get pokemon evolution chain
  getEvolutionChain: (id) => 
    `${API_BASE_URL}/evolution-chain/${id}`,

  // Get pokemon abilities
  getPokemonAbility: (abilityName) => 
    `${API_BASE_URL}/ability/${abilityName}`,

  // Get pokemon types
  getPokemonType: (type) => 
    `${API_BASE_URL}/type/${type}`,

  // Get pokemon moves
  getPokemonMove: (move) => 
    `${API_BASE_URL}/move/${move}`,

  // Search pokemon by name
  searchPokemon: (query) => 
    `${API_BASE_URL}/pokemon/${query.toLowerCase()}`,

  // Get pokemon by generation
  getPokemonByGeneration: (generation) => 
    `${API_BASE_URL}/generation/${generation}`,

  // Get pokemon by habitat
  getPokemonByHabitat: (habitat) => 
    `${API_BASE_URL}/pokemon-habitat/${habitat}`,
};

// Optional: Helper functions for data transformation
export const pokemonHelpers = {
  // Format pokemon name (capitalize, remove hyphens)
  formatPokemonName: (name) => 
    name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),

  // Get pokemon image URL
  getPokemonImage: (id) => 
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,

  // Get pokemon types with colors
  getTypeColor: (type) => {
    const colors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type] || '#68A090';
  },

  // Format pokemon stats
  formatStats: (stats) => 
    stats.map(stat => ({
      name: stat.stat.name.replace('-', ' '),
      value: stat.base_stat,
      max: 255 // Maximum possible stat value
    })),

  // Get pokemon generation from ID
  getGeneration: (id) => {
    if (id <= 151) return 'I';
    if (id <= 251) return 'II';
    if (id <= 386) return 'III';
    if (id <= 493) return 'IV';
    if (id <= 649) return 'V';
    if (id <= 721) return 'VI';
    if (id <= 809) return 'VII';
    return 'VIII';
  }
};

// Optional: Service functions for API calls
export const pokemonService = {
  // Fetch pokemon list with error handling
  fetchPokemonList: async (limit = 20, offset = 0) => {
    try {
      const response = await fetch(pokemonApi.getPokemonList(limit, offset));
      if (!response.ok) throw new Error('Failed to fetch pokemon list');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pokemon list:', error);
      throw error;
    }
  },

  // Fetch single pokemon details with error handling
  fetchPokemonDetails: async (idOrName) => {
    try {
      const response = await fetch(pokemonApi.getPokemonDetails(idOrName));
      if (!response.ok) throw new Error('Failed to fetch pokemon details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pokemon details:', error);
      throw error;
    }
  }
};

export default pokemonApi;