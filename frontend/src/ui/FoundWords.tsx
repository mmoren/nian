import { Center, Text, Box, Wrap, HStack, Icon } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { GameState } from "../hooks/gameState";

interface FoundWordsProps {
  gameState: GameState;
}

export default function FoundWords({ gameState: { gameOver, foundWords, allWords } }: FoundWordsProps) {
  return (
    <>
      <Center width="full">
        <Text fontSize="lg">{foundWords.length} of {allWords.length} found</Text>
      </Center>
      <Box borderColor="blackAlpha.300" borderRadius="lg" overflowY="scroll" style={{ touchAction: "pan-y" }} borderWidth="medium" width="full">
        <Wrap width="full" height="full" padding={5} spacing={3} overflow="visible">

          {(gameOver ? allWords : foundWords).sort().map((word, i) => (
            <HStack key={"words-" + i} alignItems="center">
              {foundWords.indexOf(word) !== -1 ? (
                <Icon as={CheckCircleIcon} color="green.500" />
              ) : (
                <Icon as={WarningIcon} color="red.500" />
              )}
              <Box textTransform="uppercase">{word}</Box>
            </HStack>
          ))}
        </Wrap>
      </Box>
    </>
  );
}
