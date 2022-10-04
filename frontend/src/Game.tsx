import { useToast } from "@chakra-ui/react";
import { useRandomBoard } from "./hooks/board";
import { useGateState as useGameState } from "./hooks/gameState";
import Main from "./Main";


export function Game() {
    const [gameState, dispatch] = useGameState();
    const [, fetchBoard] = useRandomBoard();

    return (
        <Main
            onNewGame={async () => {
                const board = await fetchBoard();
                dispatch({ type: "new_game", boardLetters: board.letters, words: board.words.map((word) => word.form) });
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
