import { Box, Button, Container, Heading, HStack, VStack, Text } from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import FoundWords from './FoundWords';
import { Share } from './Share';
import { GiveUp } from './GiveUp';
import { NewGame } from './NewGame';
import { Board } from './Board';
import { GameState } from '../hooks/gameState';

interface BoardProps {
  gameState: GameState;
  boardSeed?: string;
  onSelectLetter(index: number): void;
  onNewGame(seed?: string): void;
  onClear(): void;
  onDeleteLetter(): void;
  onGiveUp(): void;
  onSubmit(): void;
}

export default function Main({ gameState, boardSeed, onClear, onSelectLetter, onDeleteLetter, onNewGame, onGiveUp, onSubmit }: BoardProps) {
  const { seed, gameOver, boardLetters, selectedIndices } = gameState;
  return (
    <Container maxWidth="container.sm">
      <VStack width="full" height="100vh" paddingY={5} spacing={5} alignItems="flex-start">
        <HStack width="full" alignItems="center" justifyContent="space-between">
          <Heading size="xl" color="blackAlpha.400">9an</Heading>
          <HStack>
            <Share seed={seed} />
            <GiveUp disabled={gameOver} onGiveUp={onGiveUp} />
            <NewGame boardSeed={boardSeed} onNewGame={onNewGame} />
          </HStack>
        </HStack>
        <Board
          gameState={gameState}
          onSelectLetter={onSelectLetter}
        />
        <HStack spacing={1} width="full" justifyContent="space-between">
          {([0, 1, 2, 3, 4, 5, 6, 7, 8]).map((idx) => (
            <Box fontFamily="monospace" key={`letter-${idx}`} borderRadius="md" bg="blackAlpha.300" paddingX={3} paddingY={2}>
              <Text textTransform="uppercase" fontSize="lg">{boardLetters[selectedIndices[idx]] ?? <>&nbsp;</>}</Text>
            </Box>
          ))}
        </HStack>
        <HStack width="full">
          <Button width="full" onClick={() => onClear()} disabled={gameOver}>
            <DeleteIcon />
          </Button>
          <Button width="full" onClick={() => onDeleteLetter()} disabled={gameOver}>
            <ArrowBackIcon />
          </Button>
        </HStack>
        <Button width="full" padding="3" colorScheme="green" onClick={() => onSubmit()} disabled={gameOver || selectedIndices.length < 4 || selectedIndices.indexOf(4) === -1}>
          Lägg in ord
        </Button>

        <FoundWords
          gameState={gameState}
        />
      </VStack>
    </Container>
  )
}
