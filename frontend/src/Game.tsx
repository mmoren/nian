import { useEffect, useMemo } from "react";
import { useBoard } from "./hooks/board";
import { useGateState as useGameState, type GameState } from "./hooks/gameState";
import Main from "./Main";

export function Game() {
    const savedState = useMemo(() => {
        const savedGame = localStorage.getItem("saved_game");
        if (savedGame) {
            return JSON.parse(savedGame) as GameState;
        }
    }, []);
    const [gameState, dispatch] = useGameState(savedState);
    const fetchBoard = useBoard();

    useEffect(() => {
        localStorage.setItem("saved_game", JSON.stringify(gameState));
    }, [gameState]);

    return (
        <Main
            seed={gameState.seed}
            onNewGame={async () => {
                const board = await fetchBoard();
                dispatch({ type: "new_game", seed: board.seed, boardLetters: board.letters, words: board.words.map((word) => word.form) });
            }}
            onDeleteLetter={() => dispatch({ type: "delete_letter" })}
            selectedIndices={gameState.selectedIndices}
            onSelectLetter={(index) => dispatch({ type: "select_letter", index: index })}
            onGiveUp={() => dispatch({ type: "give_up" })}
            onSubmit={() => dispatch({ type: "submit" })}
            letters={gameState.boardLetters}
            allWords={gameState.allWords}
            foundWords={gameState.foundWords}
            gameOver={gameState.gameOver}
            onClear={() => dispatch({type: "clear"})}
        />
    );
}
