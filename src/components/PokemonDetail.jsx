import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Image,
  Text,
  VStack,
  HStack,
  Tag,
  Grid,
  Progress,
  Button,
  Heading,
  Skeleton,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Spotlight } from './ui/spotlight';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        const [pokemonResponse, speciesResponse] = await Promise.all([
          axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`),
          axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        ]);
        setPokemon(pokemonResponse.data);
        setSpecies(speciesResponse.data);
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [id]);

  const getTypeColor = (type) => {
    const colors = {
      fire: 'red',
      water: 'blue',
      grass: 'green',
      electric: 'yellow',
      psychic: 'pink',
      ice: 'cyan',
      dragon: 'purple',
      dark: 'gray',
      fairy: 'pink',
      normal: 'gray',
      fighting: 'orange',
      flying: 'blue',
      poison: 'purple',
      ground: 'orange',
      rock: 'gray',
      bug: 'green',
      ghost: 'purple',
      steel: 'gray',
    };
    return colors[type] || 'gray';
  };

  const getFlavorText = () => {
    if (!species) return '';
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : '';
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        position="relative"
        overflow="hidden"
        bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
      >
        {colorMode === 'dark' && <Spotlight className="top-[-20%] left-0" />}
        <Container maxW="4xl" py={8}>
          <HStack justify="space-between" mb={6}>
            <Button
              as={RouterLink}
              to="/"
              leftIcon={<ArrowBackIcon />}
              colorScheme="blue"
              variant="ghost"
              isLoading
            >
              Back to List
            </Button>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme="blue"
              aria-label="Toggle color mode"
            />
          </HStack>
          <VStack spacing={4}>
            <Skeleton height="500px" borderRadius="lg" />
            <Skeleton height="20px" width="200px" />
            <Skeleton height="20px" width="150px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!pokemon) {
    return (
      <Box
        minH="100vh"
        position="relative"
        overflow="hidden"
        bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
      >
        {colorMode === 'dark' && <Spotlight className="top-[-20%] left-0" />}
        <Container maxW="4xl" py={8}>
          <HStack justify="space-between" mb={6}>
            <Button
              as={RouterLink}
              to="/"
              leftIcon={<ArrowBackIcon />}
              colorScheme="blue"
              variant="ghost"
            >
              Back to List
            </Button>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme="blue"
              aria-label="Toggle color mode"
            />
          </HStack>
          <Text textAlign="center" fontSize="xl">Pokemon not found</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
    >
      {colorMode === 'dark' && <Spotlight className="top-[-20%] left-0" />}
      
      <MotionContainer 
        maxW="4xl" 
        py={8}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        position="relative"
        zIndex={1}
      >
        <HStack justify="space-between" mb={6}>
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<ArrowBackIcon />}
            colorScheme="blue"
            variant="ghost"
            _hover={{ transform: 'translateX(-5px)' }}
            transition="all 0.2s"
          >
            Back to List
          </Button>
          
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="blue"
            _hover={{ transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            aria-label="Toggle color mode"
          />
        </HStack>

        <MotionBox
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          overflow="hidden"
          p={8}
          boxShadow="2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          _hover={{ transform: 'translateY(-5px)' }}
        >
          <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8}>
            <VStack spacing={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={pokemon.name}
                  w="full"
                  borderRadius="lg"
                  className="drop-shadow-2xl"
                />
              </MotionBox>
              <Heading 
                size="lg" 
                textTransform="capitalize"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                {pokemon.name}
              </Heading>
              <HStack spacing={2} wrap="wrap" justify="center">
                {pokemon.types.map((type) => (
                  <Tag
                    key={type.type.name}
                    colorScheme={getTypeColor(type.type.name)}
                    size="lg"
                    textTransform="capitalize"
                    px={4}
                    py={2}
                    borderRadius="full"
                    variant="subtle"
                  >
                    {type.type.name}
                  </Tag>
                ))}
              </HStack>
              {species && (
                <Text
                  color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                  textAlign="center"
                  fontSize="md"
                  fontStyle="italic"
                >
                  {getFlavorText()}
                </Text>
              )}
            </VStack>

            <VStack align="stretch" spacing={6}>
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Heading 
                  size="md" 
                  mb={4}
                  color={colorMode === 'light' ? 'gray.700' : 'white'}
                >
                  Base Stats
                </Heading>
                {pokemon.stats.map((stat, index) => (
                  <MotionBox 
                    key={stat.stat.name} 
                    mb={4}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text 
                        textTransform="capitalize" 
                        fontWeight="medium"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                      >
                        {stat.stat.name.replace('-', ' ')}
                      </Text>
                      <Text 
                        fontWeight="bold"
                        color={colorMode === 'light' ? 'gray.800' : 'white'}
                      >
                        {stat.base_stat}
                      </Text>
                    </HStack>
                    <Progress
                      value={stat.base_stat}
                      max={255}
                      colorScheme={stat.base_stat > 150 ? 'green' : stat.base_stat > 75 ? 'blue' : 'orange'}
                      borderRadius="full"
                      size="sm"
                      hasStripe
                      isAnimated
                    />
                  </MotionBox>
                ))}
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Heading 
                  size="md" 
                  mb={4}
                  color={colorMode === 'light' ? 'gray.700' : 'white'}
                >
                  Abilities
                </Heading>
                <HStack spacing={2} wrap="wrap">
                  {pokemon.abilities.map((ability) => (
                    <Tag
                      key={ability.ability.name}
                      size="lg"
                      textTransform="capitalize"
                      colorScheme="purple"
                      px={4}
                      py={2}
                      borderRadius="full"
                      variant="subtle"
                    >
                      {ability.ability.name.replace('-', ' ')}
                    </Tag>
                  ))}
                </HStack>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Heading 
                  size="md" 
                  mb={4}
                  color={colorMode === 'light' ? 'gray.700' : 'white'}
                >
                  Details
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontWeight="medium" color="gray.500">Height</Text>
                    <Text fontSize="lg" color={colorMode === 'light' ? 'gray.800' : 'white'}>
                      {pokemon.height / 10}m
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500">Weight</Text>
                    <Text fontSize="lg" color={colorMode === 'light' ? 'gray.800' : 'white'}>
                      {pokemon.weight / 10}kg
                    </Text>
                  </Box>
                </Grid>
              </MotionBox>
            </VStack>
          </Grid>
        </MotionBox>
      </MotionContainer>
    </Box>
  );
};

export default PokemonDetail;