import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, VStack, HStack, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

type Card = {
  color: 'red' | 'green' | 'purple';
  shape: 'oval' | 'squiggle' | 'diamond';
  number: 1 | 2 | 3;
  shading: 'solid' | 'striped' | 'open';
};

const generateDeck = (): Card[] => {
  const deck: Card[] = [];
  const colors: Card['color'][] = ['red', 'green', 'purple'];
  const shapes: Card['shape'][] = ['oval', 'squiggle', 'diamond'];
  const numbers: Card['number'][] = [1, 2, 3];
  const shadings: Card['shading'][] = ['solid', 'striped', 'open'];

  for (const color of colors) {
    for (const shape of shapes) {
      for (const number of numbers) {
        for (const shading of shadings) {
          deck.push({ color, shape, number, shading });
        }
      }
    }
  }

  if (deck.length !== 81) {
    throw new Error(`Invalid deck size: ${deck.length}. Expected 81 unique cards.`);
  }

  return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const isSet = (cards: Card[]): boolean => {
  if (cards.length !== 3) return false;

  const properties: (keyof Card)[] = ['color', 'shape', 'number', 'shading'];
  return properties.every(prop =>
    (cards[0][prop] === cards[1][prop] && cards[1][prop] === cards[2][prop]) ||
    (cards[0][prop] !== cards[1][prop] && cards[1][prop] !== cards[2][prop] && cards[0][prop] !== cards[2][prop])
  );
};

const Game: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [board, setBoard] = useState<(Card | null)[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      startNewGame(id as string);
    }
  }, [id]);

  const startNewGame = (gameId: string) => {
    const seed = parseInt(gameId, 36);
    const newDeck = shuffleDeck(generateDeck());
    setDeck(newDeck);
    setBoard(newDeck.slice(0, 12));
    setSelectedCards([]);
    setScore(0);
  };

  const handleCardClick = (card: Card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 3) {
      const newSelectedCards = [...selectedCards, card];
      setSelectedCards(newSelectedCards);

      if (newSelectedCards.length === 3) {
        if (isSet(newSelectedCards)) {
          setScore(score + 1);
          toast({
            title: "Set found!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          replaceCards(newSelectedCards);
        } else {
          toast({
            title: "Not a set",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          setSelectedCards([]);
        }
      }
    }
  };

  const replaceCards = (cardsToReplace: Card[]) => {
    const newBoard = board.map((card) =>
      card && cardsToReplace.includes(card) ? null : card
    );
    setBoard(newBoard);
    setDeck(deck.filter((card) => !cardsToReplace.includes(card)));
    setSelectedCards([]);
  };

  const renderCard = (card: Card | null, index: number) => {
    if (card === null) {
      return (
        <Box
          key={index}
          borderWidth={2}
          borderColor="gray.200"
          borderRadius="lg"
          p={2}
          width="100%"
          height="150px"
          bg="gray.100"
        />
      );
    }

    const isSelected = selectedCards.includes(card);
    const cardColor = card.color === 'red' ? '#FF0000' : card.color === 'green' ? '#00FF00' : '#800080';

    const renderShape = () => {
      switch (card.shape) {
        case 'oval':
          return <ellipse cx="50" cy="50" rx="40" ry="25" />;
        case 'squiggle':
          return (
            <path d="M20,50 Q35,15 50,50 T80,50" strokeLinecap="round" strokeLinejoin="round" />
          );
        case 'diamond':
          return <polygon points="50,20 80,50 50,80 20,50" />;
      }
    };

    const getShading = () => {
      switch (card.shading) {
        case 'solid':
          return { fill: cardColor, stroke: 'none' };
        case 'striped':
          return {
            fill: `url(#striped-${card.color})`,
            stroke: cardColor,
          };
        case 'open':
          return { fill: 'none', stroke: cardColor, strokeWidth: 2 };
      }
    };

    return (
      <Box
        key={`${card.color}-${card.shape}-${card.number}-${card.shading}`}
        borderWidth={2}
        borderColor={isSelected ? "blue.500" : "gray.200"}
        borderRadius="lg"
        p={2}
        onClick={() => handleCardClick(card)}
        cursor="pointer"
        bg={isSelected ? "blue.100" : "white"}
        boxShadow="md"
        transition="all 0.2s"
        _hover={{ transform: "scale(1.05)" }}
        width="100%"
        height="150px"
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <svg width="80%" height="80%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id={`striped-${card.color}`} patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke={cardColor} strokeWidth="1" />
            </pattern>
          </defs>
          {[...Array(card.number)].map((_, index) => (
            <g key={index} transform={`translate(0, ${index * 30 - (card.number - 1) * 15})`}>
              {React.cloneElement(renderShape(), getShading())}
            </g>
          ))}
        </svg>
        <Text fontSize="xs" fontWeight="bold" mt={2}>
          {`${card.color} ${card.shape} ${card.number} ${card.shading}`}
        </Text>
      </Box>
    );
  };

  const resetGame = () => {
    const newGameId = Math.random().toString(36).substring(2, 15);
    router.push(`/game?id=${newGameId}`);
  };

  const clearSelection = () => {
    setSelectedCards([]);
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text fontSize="3xl" fontWeight="bold" textAlign="center">Set Game</Text>
      <Text fontSize="xl" fontWeight="semibold">Score: {score}</Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {board.map(renderCard)}
      </Grid>
      <HStack spacing={4} justifyContent="center">
        <Button colorScheme="blue" onClick={resetGame}>Reset Game</Button>
        <Button colorScheme="teal" onClick={clearSelection} isDisabled={selectedCards.length === 0}>Clear Selection</Button>
      </HStack>
      <Text fontSize="lg" fontWeight="medium" textAlign="center">Selected Cards: {selectedCards.length}/3</Text>
    </VStack>
  );
};

export default Game;
