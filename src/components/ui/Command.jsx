import React from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement, Box, useColorMode } from "@chakra-ui/react";

export const Command = ({ value, onChange }) => {
  const { colorMode } = useColorMode(); // Add this line to use the hook

  return (
    <Box className="w-full max-w-2xl mx-auto">
      <InputGroup size="lg">
        <InputLeftElement
          pointerEvents="none"
          className="text-gray-400"
          h="full"
          pl={4}
        >
          <SearchIcon className="w-5 h-5" />
        </InputLeftElement>
        
        <Input
          value={value}
          onChange={onChange}
          placeholder="Search Pokémon..."
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          border="1px solid"
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          _hover={{
            borderColor: colorMode === 'light' ? 'gray.300' : 'gray.600'
          }}
          _focus={{
            borderColor: 'purple.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)'
          }}
          pl={12}
          py={6}
          fontSize="md"
          borderRadius="lg"
        />
      </InputGroup>
    </Box>
  );
};