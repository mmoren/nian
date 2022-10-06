import { useQuery } from "@tanstack/react-query";

interface Board {
    seed: string;
    letters: string;
    words: {
        form: string;
        definition: string;
    }[];
}

async function getRandomBoard(seed?: string) {
    const url = `${process.env.REACT_APP_BOARD_SERVER ?? ''}/boards/random`;
    const response = await fetch(url, {
        redirect: 'follow',
    });
    return response.json();
}

export function useBoard(): () => Promise<Board> {
    const { refetch } = useQuery<Board>(["board", "random"], () => getRandomBoard(), {
        enabled: false,
    });
    return async () => { return (await refetch()).data!; };
}
