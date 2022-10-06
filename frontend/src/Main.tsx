import { Box, Button, Container, GridItem, Heading, HStack, Icon, SimpleGrid, VStack, Wrap, WrapItem, Text, Center, useDisclosure, createIcon, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, useClipboard } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiShare, FiShare2 } from 'react-icons/fi';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useState } from 'react';

interface BoardProps {
  seed: string;
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

function GiveUp({ onGiveUp, disabled }: { disabled?: boolean, onGiveUp(): void }) {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Button disabled={disabled} size="sm" variant="outline" colorScheme="red" onClick={() => onOpen()}>Ge upp</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ge upp?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Är du säker på att du vill ge upp och visa facit?
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Avbryt
            </Button>
            <Button
              isLoading={loading}
              colorScheme='red'
              onClick={async () => {
                setLoading(true);
                await onGiveUp();
                setLoading(false);
                onClose();
              }}
            >
              Ge upp
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function NewGame({ onNewGame, disabled }: { disabled?: boolean, onNewGame(): void }) {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Button disabled={disabled} size="sm" variant="outline" colorScheme="green" onClick={() => onOpen()}>Börja om</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Starta ett nytt spel?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Är du säker på att du vill starta ett nytt spel?
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Avbryt
            </Button>
            <Button
              isLoading={loading}
              colorScheme='green'
              onClick={async () => {
                setLoading(true);
                await onNewGame();
                setLoading(false);
                onClose();
              }}
            >
              Nytt spel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const shareIcon = /iPad|iPhone|iPod/.test(navigator.platform) ? FiShare : FiShare2;

function Share({ seed }: { seed: string }) {
  const url = `http://localhost:3000/${seed}`;
  const { onCopy, hasCopied } = useClipboard(url);
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="sm" leftIcon={<Icon as={shareIcon} />}></Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Dela brickan</PopoverHeader>
        <PopoverBody>
          <HStack spacing={3}>
            <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" borderRadius="md" padding={1} bg="blackAlpha.300" fontFamily="mono">{url}</Text>
            <Button size="sm" paddingX={4} onClick={onCopy}>{hasCopied ? "Kopierad" : "Kopiera"}</Button>
            {navigator.share && (
              <Button size="sm" paddingX={4} onClick={() => {
                  navigator.share({
                    title: `9an`,
                    text: 'Kolla in min spelbricka',
                    url,
                  });

              }}>Dela...</Button>
            )}
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default function Main({ seed, letters, allWords, gameOver, foundWords, onClear, onSelectLetter, onDeleteLetter, onNewGame, onGiveUp, onSubmit, selectedIndices }: BoardProps) {
  return (
    <Container maxWidth="container.sm">
      <VStack width="full" height="100vh" paddingY={5} spacing={5} alignItems="flex-start">
        <HStack width="full" alignItems="center" justifyContent="space-between">
          <Heading size="xl" color="blackAlpha.400">9an</Heading>
          <HStack>
            <Share seed={seed} />
            <GiveUp disabled={gameOver} onGiveUp={onGiveUp} />
            <NewGame onNewGame={onNewGame} />
          </HStack>
        </HStack>
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
        <HStack spacing={1} width="full" justifyContent="space-between">
          {([0, 1, 2, 3, 4, 5, 6, 7, 8]).map((idx) => (
            <Box fontFamily="monospace" key={`letter-${idx}`} borderRadius="md" bg="blackAlpha.300" paddingX={3} paddingY={2}>
              <Text textTransform="uppercase" fontSize="lg">{letters[selectedIndices[idx]] ?? <>&nbsp;</>}</Text>
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

        <Center width="full"><Text fontSize="lg">{foundWords.length} of {allWords.length} found</Text></Center>
        <Box borderColor="blackAlpha.300" borderRadius="lg" overflowY="scroll" style={{ touchAction: "pan-y" }} borderWidth="medium" width="full">
          <Wrap width="full" height="full" padding={5} spacing={3} overflow="visible">

            {(gameOver ? allWords : foundWords).sort().map((word, i) => (
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
        </Box>
      </VStack>
    </Container>
  )
}
