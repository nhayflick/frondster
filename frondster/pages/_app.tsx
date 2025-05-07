import { ChakraProvider, ColorModeScript, useColorMode, Button, Box, Text } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Link from 'next/link';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#1A202C' : 'gray.100',
      },
    }),
  },
});

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode} position="absolute" top="4" right="4">
      Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ThemeToggle />
      <Component {...pageProps} />
      <Box position="fixed" bottom="4" left="4">
        <Link href="/credits">
          <Text display="flex" alignItems="center" gap="2">🎬 Credits</Text>
        </Link>
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;
