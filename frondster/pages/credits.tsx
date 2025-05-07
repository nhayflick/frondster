import React from 'react';
import { Box, VStack, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const Credits: React.FC = () => {
  const bg = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bg={bg}>
      <VStack spacing={4}>
        <Heading as="h1" size="2xl" textAlign="center" color={textColor}>
          Frondster
        </Heading>
        <Text fontSize="xl" fontWeight="medium" color={textColor}>
          Written by Devin
        </Text>
        <Text fontSize="xl" fontWeight="medium" color={textColor}>
          Built by Devin
        </Text>
        <Text fontSize="xl" fontWeight="medium" color={textColor}>
          Designed by Devin
        </Text>
      </VStack>
    </Box>
  );
};

export default Credits;
