import {
    Button,
    HStack,
    Icon,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    useClipboard,
} from "@chakra-ui/react";
import {
    FiShare,
    FiShare2,
} from "react-icons/fi";

const shareIcon = /iPad|iPhone|iPod/.test(navigator.platform) ? FiShare : FiShare2;

interface ShareProps {
    seed: string;
}

export function Share({ seed }: ShareProps) {
    const url = `${process.env.PUBLIC_URL}/${seed}`;
    const { onCopy, hasCopied } = useClipboard(url);
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="ghost" size="sm" leftIcon={<Icon as={shareIcon} />}></Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Dela nuvarande bricka</PopoverHeader>
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
