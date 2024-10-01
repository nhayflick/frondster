import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, VStack, Text, useToast } from '@chakra-ui/react';

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
  const [board, setBoard] = useState<Card[]>([]);
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
    const newDeck = shuffleDeck(generateDeck(), seed);
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
    const newBoard = board.map(card =>
      cardsToReplace.includes(card) ? deck[12] : card
    );
    setBoard(newBoard);
    setDeck(deck.slice(13));
    setSelectedCards([]);
  };

  const renderCard = (card: Card) => {
    const isSelected = selectedCards.includes(card);
    return (
      <Box
        key={`${card.color}-${card.shape}-${card.number}-${card.shading}`}
        borderWidth={2}
        borderColor={isSelected ? "blue.500" : "gray.200"}
        borderRadius="md"
        p={4}
        onClick={() => handleCardClick(card)}
        cursor="pointer"
      >
        <Text>{`${card.color} ${card.shape} ${card.number} ${card.shading}`}</Text>
      </Box>
    );
  };

  const resetGame = () => {
    const newGameId = Math.random().toString(36).substring(2, 15);
    router.push(`/game?id=${newGameId}`);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">Set Game</Text>
      <Text>Score: {score}</Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {board.map(renderCard)}
      </Grid>
      <Button onClick={resetGame}>Reset Game</Button>
    </VStack>
  );
};

export default Game;
