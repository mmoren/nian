interface Board {
    seed: string;
    letters: string;
    words: {
        form: string;
        definition: string;
    }[];
}

export async function fetchBoard(seed?: string): Promise<Board> {
    const url = `${process.env.REACT_APP_BOARD_SERVER ?? ''}/boards/${seed ?? 'random'}`;
    const response = await fetch(url, {
        redirect: 'follow',
    });
    return response.json();
}
