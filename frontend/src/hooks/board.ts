import { useQuery } from "@tanstack/react-query";

interface Board {
    letters: string;
    words: {
        form: string;
        definition: string;
    }[];
}

function getRandomBoard() {
    return fetch('http://localhost:8080/').then(r => r.json());
}

export function useRandomBoard(): [Board, () => Promise<Board>] {
    const { data, refetch } = useQuery<Board>(["random-board"], getRandomBoard, {
        staleTime: 30*60*1000,
        cacheTime: 30*60*1000,
    });
    return [data!, async () => { return (await refetch()).data!; } ];
}
