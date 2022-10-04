import { useQuery } from "@tanstack/react-query";

interface Board {
    letters: string;
    words: {
        form: string;
        definition: string;
    }[];
}

function getRandomBoard() {
    const url = process.env.REACT_APP_BOARD_SERVER
        ? process.env.REACT_APP_BOARD_SERVER + '/board'
        : '/board';

    return fetch(url).then(r => r.json());
}

export function useRandomBoard(): [Board, () => Promise<Board>] {
    const { data, refetch } = useQuery<Board>(["random-board"], getRandomBoard, {
        staleTime: 30*60*1000,
        cacheTime: 30*60*1000,
    });
    return [data!, async () => { return (await refetch()).data!; } ];
}
