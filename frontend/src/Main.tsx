import { Box, Button, Container, GridItem, Heading, HStack, Icon, SimpleGrid, VStack, Wrap, WrapItem, Text } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';

interface BoardProps {
  selectedIndices: number[];
  foundWords: string[];
  allWords: string[];
  letters: string;
  onSelectLetter(index: number): void;
  onNewGame(): void;
  onClear(): void;
  onDeleteLetter(): void;
  onGiveUp(): void;
  onSubmit(): void;
  gameOver: boolean;
}

export default function Main({ letters, allWords, gameOver, foundWords, onClear, onSelectLetter, onDeleteLetter, onNewGame, onGiveUp, onSubmit, selectedIndices }: BoardProps) {
  return (
    <Container maxWidth="container.xl">
      <Wrap>
        <WrapItem>
          <VStack width="full" height="full" paddingY={5} spacing={5} alignItems="flex-start">
            <HStack width="full" alignItems="center" justifyContent="space-between">
              <Heading size="2xl">Nian</Heading>
              <HStack>
                <Button size="md" colorScheme="red" onClick={() => onGiveUp()} disabled={gameOver}>Give up</Button>
                <Button size="md" colorScheme="green" onClick={() => onNewGame()}>New</Button>
              </HStack>
            </HStack>
            <SimpleGrid columns={3} columnGap={3} rowGap={3} width="full">
              {Array.from(letters).map((letter, i) => (
                <GridItem key={"letter-" + i}>
                  <Button
                    disabled={gameOver}
                    isActive={selectedIndices.indexOf(i) !== -1}
                    textTransform="uppercase"
                    colorScheme={i === 4 ? "cyan" : "gray"}
                    size="lg"
                    width="full"
                    onClick={() => {
                      if (selectedIndices.indexOf(i)) {
                        onSelectLetter(i)
                      }
                    }}
                  >
                    {letter}
                  </Button>
                </GridItem>
              ))}
            </SimpleGrid>
            <HStack spacing={1} width="full">
            {([0, 1, 2, 3, 4, 5, 6, 7, 8]).map((idx) => (
              <Box fontFamily="monospace" key={`letter-${idx}`} borderRadius="md" bg="blackAlpha.300" paddingX={3} paddingY={2}>
                <Text textTransform="uppercase" fontSize="lg">{letters[selectedIndices[idx]] ?? <>&nbsp;</>}</Text>
              </Box>
            ))}
            </HStack>
            <HStack width="full">
              <Button width="full" onClick={() => onClear()} disabled={gameOver}>
                <DeleteIcon/>
              </Button>
              <Button width="full" onClick={() => onDeleteLetter()} disabled={gameOver}>
                <ArrowBackIcon/>
              </Button>
            </HStack>
            <Button width="full" onClick={() => onSubmit()} disabled={gameOver || selectedIndices.length < 4 || selectedIndices.indexOf(4) === -1}>
              Submit
            </Button>
          </VStack>
        </WrapItem>
        <WrapItem>
          <Wrap width="full" height="full" padding={5} spacing={3}>
            {(gameOver ? allWords : foundWords).map((word, i) => (
              <HStack alignItems="center">
                {foundWords.indexOf(word) !== -1 ? (
                  <Icon as={CheckCircleIcon} color="green.500" />
                ) : (
                  <Icon as={WarningIcon} color="red.500" />
                )}
                <Box textTransform="uppercase">{word}</Box>
              </HStack>
            ))}
          </Wrap>
        </WrapItem>
      </Wrap>
    </Container>
  )
}