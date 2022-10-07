import {
  SimpleGrid,
  GridItem,
  Button,
} from "@chakra-ui/react";
import { GameState } from "../hooks/gameState";

interface BoardProps {
  gameState: GameState;
  onSelectLetter(index: number): void;
}

export function Board({ gameState: { boardLetters: letters, gameOver, selectedIndices }, onSelectLetter }: BoardProps) {
  return (
    <SimpleGrid columns={3} columnGap={1} rowGap={1} width="full">
      {Array.from(letters).map((letter, i) => (
        <GridItem key={"letter-" + i}>
          <Button
            disabled={gameOver}
            borderWidth="medium"
            backgroundColor={i === 4 ? "whiteAlpha.300" : ""}
            borderColor={selectedIndices.indexOf(i) !== -1 ? "green.500" : "transparent"}
            textTransform="uppercase"
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
  );
}
