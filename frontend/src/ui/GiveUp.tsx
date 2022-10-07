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

export function GiveUp({ onGiveUp, disabled }: { disabled?: boolean, onGiveUp(): void }) {
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
  