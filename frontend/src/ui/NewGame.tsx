import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

interface NewGameProps {
  boardSeed?: string;
  disabled?: boolean;
  onNewGame(seed?: string): void;
}

export function NewGame({ boardSeed, onNewGame, disabled }: NewGameProps) {
  const { onClose, onOpen, isOpen } = useDisclosure({ defaultIsOpen: !!boardSeed });
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        disabled={disabled}
        size="sm"
        variant="outline"
        colorScheme="green"
        onClick={() => onOpen()}
      >
        Ny bricka
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Starta ett nytt spel?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {boardSeed
              ? <>Är du säker på att du vill börja ett nytt spel med denna bricka och överge ditt nuvarande spel?</>
              : <>Är du säker på att du vill starta med en ny slumpad bricka och överge ditt nuvarande spel?</>}
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={() => {
              window.history.replaceState(null, '', '/');
              onClose();
            }}>
              Avbryt
            </Button>
            <Button
              isLoading={loading}
              colorScheme='green'
              onClick={async () => {
                setLoading(true);
                await onNewGame(boardSeed);
                setLoading(false);
                onClose();
              }}
            >
              Ny bricka
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
