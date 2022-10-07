import { useEffect, useMemo } from "react";
import { fetchBoard } from "./hooks/board";
import { useGameState, type GameState } from "./hooks/gameState";
import Main from "./ui/Main";

export function Game() {
    const savedState = useMemo(() => {
        const savedGame = localStorage.getItem("saved_game");
        if (savedGame) {
            return JSON.parse(savedGame) as GameState;
        }
    }, []);
    const [gameState, dispatch] = useGameState(savedState);

    const urlBoardSeed = document.location.pathname.replace(/^\/(b\/)?/, '');
    const boardSeed = urlBoardSeed.length > 0 ? urlBoardSeed : undefined;

    useEffect(() => {
        localStorage.setItem("saved_game", JSON.stringify(gameState));
    }, [gameState]);

    async function newGame(seed?: string) {
        const board = await fetchBoard(seed);
        window.history.replaceState(null, '', '/');
        dispatch({ type: "new_game", seed: board.seed, boardLetters: board.letters, words: board.words.map((word) => word.form) });
    }

    return (
        <Main
            gameState={gameState}
            boardSeed={boardSeed}

            onNewGame={newGame}
            onDeleteLetter={() => dispatch({ type: "delete_letter" })}
            onSelectLetter={(index) => dispatch({ type: "select_letter", index: index })}
            onGiveUp={() => dispatch({ type: "give_up" })}
            onSubmit={() => dispatch({ type: "submit" })}
            onClear={() => dispatch({type: "clear"})}
        />
    );
}
