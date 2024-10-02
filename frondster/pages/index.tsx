import React from 'react';
import { Box, VStack, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const router = useRouter();
  const bg = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const startNewGame = () => {
    const randomGameId = Math.random().toString(36).substring(2, 15);
    router.push(`/game?id=${randomGameId}`);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bg={bg}>
      <VStack spacing={4}>
        <Heading as="h1" size="2xl" textAlign="center" color={textColor}>
          Frondster
        </Heading>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Coming soon
        </Text>
        <Button colorScheme="blue" onClick={startNewGame}>
          Start New Game
        </Button>
      </VStack>
    </Box>
  );
};

export default Home;
