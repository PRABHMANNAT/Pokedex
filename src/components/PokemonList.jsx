import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion } from 'framer-motion';
import { Box, Container, SimpleGrid, Skeleton, useColorMode, Flex, Text, IconButton, Tooltip } from '@chakra-ui/react';
import { FocusCard } from './ui/FocusCard';
import { Command } from './ui/Command';
import { SunIcon, MoonIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { MovingBorderTitle } from './ui/MovingBorderTitle';
import { FaGithub, FaStar } from 'react-icons/fa';
import useSound from 'use-sound';
import snapSound from '../assets/snap.mp3';

const limit = 30;

const AnimatedBackground = () => {
  const { colorMode } = useColorMode();
  const pathVariants = {
    initial: { strokeDashoffset: 800, strokeDasharray: "50 800" },
    animate: {
      strokeDashoffset: 0,
      strokeDasharray: "20 800",
      opacity: [0, 1, 1, 0],
    },
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={0}
      opacity={0.05}
    >
      <motion.svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {Array.from({ length: 20 }).map((_, idx) => (
          <motion.path
            key={idx}
            d={`M${Math.random() * 1440} ${Math.random() * 900} Q ${Math.random() * 1440} ${Math.random() * 900}, ${Math.random() * 1440} ${Math.random() * 900}`}
            stroke={`hsl(${Math.random() * 360}, 70%, 50%)`}
            strokeWidth="2"
            strokeLinecap="round"
            variants={pathVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 10,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 10,
              repeatDelay: Math.random() * 10,
            }}
          />
        ))}
      </motion.svg>
    </Box>
  );
};

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const [playSnapSound] = useSound(snapSound, { 
    volume: 0.5,
    soundEnabled: true,
  });

  const handleThemeToggle = () => {
    playSnapSound();
    toggleColorMode();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPokemon = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      
      if (response.data.results.length === 0) {
        setHasMore(false);
        return;
      }

      const pokemonData = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return {
            id: details.data.id,
            name: details.data.name.replace(/-/g, ' '),
            image: details.data.sprites.other['official-artwork'].front_default,
            types: details.data.types.map(type => type.type.name),
            stats: details.data.stats.map(stat => ({
              name: stat.stat.name,
              value: stat.base_stat
            }))
          };
        })
      );

      setPokemon(prev => {
        const newPokemon = [...prev, ...pokemonData];
        return Array.from(new Map(newPokemon.map(p => [p.id, p])).values());
      });
      setOffset(prev => prev + limit);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredPokemon(pokemon);
      return;
    }

    const filtered = pokemon.filter(poke => 
      poke.name.toLowerCase().includes(query) ||
      poke.types.some(type => type.toLowerCase().includes(query))
    );
    setFilteredPokemon(filtered);
  }, [searchQuery, pokemon]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderSkeletons = (count, keyPrefix) => (
    [...Array(count)].map((_, i) => (
      <Skeleton 
        key={`${keyPrefix}-skeleton-${i}`}
        height="350px" 
        borderRadius="xl"
        startColor={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        endColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        className="transform transition-all duration-300 hover:scale-[1.02]"
      />
    ))
  );

  return (
    <Box 
      minH="100vh" 
      w="100%"
      position="relative"
      overflow="hidden"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
      transition="background-color 0.2s ease"
    >
      <AnimatedBackground />
      
      <Box 
        py={6}
        position="sticky"
        top={0}
        zIndex={10}
        bgImage="url('/pika.png')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={colorMode === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.5)'}
          backdropFilter="blur(8px)"
          transition="background-color 0.2s ease"
        />
  
        <Container maxW="7xl" position="relative">
          <Flex direction="column" gap={8}>
            <Flex justify="space-between" align="center">
              <MovingBorderTitle
                containerClassName="w-[200px]"
                borderClassName={`bg-[radial-gradient(var(--${colorMode === 'light' ? 'purple' : 'blue'}-500)_40%,transparent_60%)]`}
                className={`border-none ${colorMode === 'light' ? 'bg-slate-900/[0.2]' : 'bg-slate-100/[0.2]'}`}
                duration={2500}
              >
                <Flex align="center" gap={2} className="group">
                  <Box 
                    as="img" 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" 
                    w="30px" 
                    h="30px"
                    className="animate-bounce-slow group-hover:animate-none transition-all duration-300"
                  />
                  <Box 
                    as="h1" 
                    fontSize="2xl" 
                    fontWeight="bold"
                    color={colorMode === 'light' ? 'gray.800' : 'white'}
                  >
                    Pokédex
                  </Box>
                </Flex>
              </MovingBorderTitle>

              <Flex gap={4} align="center">
                <Tooltip
                  label="Star on GitHub"
                  hasArrow
                  placement="bottom"
                  bg={colorMode === 'light' ? 'purple.500' : 'blue.500'}
                >
                  <Flex
                    as="a"
                    href="https://github.com/Ankitmohanty2/Pokedex-Web"
                    target="_blank"
                    rel="noopener noreferrer"
                    align="center"
                    gap={2}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    bg={colorMode === 'light' ? 'white' : 'gray.800'}
                    border="2px solid"
                    borderColor={colorMode === 'light' ? 'purple.500' : 'blue.500'}
                    color={colorMode === 'light' ? 'gray.800' : 'white'}
                    boxShadow="sm"
                    cursor="pointer"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                      bg: colorMode === 'light' ? 'purple.500' : 'blue.500',
                      color: 'white',
                    }}
                    _active={{
                      transform: 'translateY(0)',
                    }}
                    transition="all 0.2s ease"
                  >
                    <FaGithub size={20} />
                    <Flex align="center" gap={2}>
                      <Text fontWeight="semibold" fontSize="sm">
                        Star
                      </Text>
                      <Flex
                        align="center"
                        justify="center"
                        bg={colorMode === 'light' ? 'purple.100' : 'whiteAlpha.200'}
                        color={colorMode === 'light' ? 'purple.700' : 'white'}
                        px={2.5}
                        py={0.5}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="bold"
                        ml={1}
                      >
                        <FaStar size={12} style={{ marginRight: '4px' }} />
                        0
                      </Flex>
                    </Flex>
                  </Flex>
                </Tooltip>

                <IconButton
                  onClick={handleThemeToggle}
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  aria-label="Toggle color mode"
                  variant="ghost"
                  colorScheme={colorMode === 'light' ? 'purple' : 'blue'}
                  size="lg"
                  _hover={{
                    transform: 'scale(1.1)',
                  }}
                  transition="all 0.2s ease"
                />
              </Flex>
            </Flex>
  
            <Command
              value={searchQuery}
              onChange={handleSearch}
              colorMode={colorMode}
            />
          </Flex>
        </Container>
      </Box>
  
      <Container maxW="7xl" px={[4, 6, 8]} py={8} position="relative" zIndex={2}>
        {isLoading && pokemon.length === 0 ? (
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
            {renderSkeletons(8, 'initial')}
          </SimpleGrid>
        ) : filteredPokemon.length === 0 ? (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            minH="60vh"
            gap={4}
          >
            <Box 
              as="img" 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/202.png"
              w="200px"
              h="200px"
              opacity={0.7}
            />
            <Text 
              fontSize="xl" 
              color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
              fontWeight="medium"
              textAlign="center"
            >
              No Pokémon found matching "{searchQuery}"
            </Text>
            <Text color="gray.500" textAlign="center">
              Try searching for a different name or type
            </Text>
          </Flex>
        ) : (
          <InfiniteScroll
            dataLength={filteredPokemon.length}
            next={fetchPokemon}
            hasMore={hasMore && !searchQuery}
            loader={
              <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} mt={6}>
                {renderSkeletons(4, 'scroll')}
              </SimpleGrid>
            }
            style={{ overflow: 'visible' }}
          >
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
              {filteredPokemon.map((poke) => (
                <FocusCard
                  key={`pokemon-${poke.id}`}
                  pokemon={poke}
                  hovered={hovered}
                  setHovered={setHovered}
                  onClick={() => navigate(`/pokemon/${poke.id}`)}
                  colorMode={colorMode}
                />
              ))}
            </SimpleGrid>
          </InfiniteScroll>
        )}
      </Container>

      {showScrollTop && (
        <Tooltip 
          label="Back to Top" 
          placement="left" 
          hasArrow
          bg={colorMode === 'light' ? 'purple.500' : 'blue.500'}
          openDelay={0}
          closeDelay={100}
        >
          <Flex
            position="fixed"
            bottom="8"
            right="8"
            zIndex={99}
            alignItems="center"
            justifyContent="center"
            onClick={scrollToTop}
            cursor="pointer"
            transition="all 0.3s ease"
            animation="fadeIn 0.5s ease-out"
          >
            <IconButton
              aria-label="Scroll to top"
              icon={
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  gap={1}
                >
                  <ArrowUpIcon boxSize={5} />
                  <Text fontSize="xs" fontWeight="bold">
                    TOP
                  </Text>
                </Flex>
              }
              size="lg"
              width="65px"
              height="65px"
              borderRadius="full"
              boxShadow="xl"
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              color={colorMode === 'light' ? 'purple.500' : 'blue.500'}
              border="2px solid"
              borderColor={colorMode === 'light' ? 'purple.500' : 'blue.500'}
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: '2xl',
                bg: colorMode === 'light' ? 'purple.500' : 'blue.500',
                color: 'white',
                borderColor: 'transparent'
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: 'lg'
              }}
              sx={{
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
            />
          </Flex>
        </Tooltip>
      )}
    </Box>
  );
};

export default PokemonList;