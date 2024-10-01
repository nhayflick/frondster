import React from 'react';
import { ChakraProvider, Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const router = useRouter();

  const startNewGame = () => {
    const randomGameId = Math.random().toString(36).substring(2, 15);
    router.push(`/game?id=${randomGameId}`);
  };

  return (
    <ChakraProvider>
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
        <VStack spacing={4}>
          <Heading as="h1" size="2xl" textAlign="center">
            Frondster
          </Heading>
          <Text fontSize="xl" fontWeight="bold">
            Coming soon
          </Text>
          <Button colorScheme="blue" onClick={startNewGame}>
            Start New Game
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
