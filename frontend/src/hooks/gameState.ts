import { useReducer } from "react";
import { toast } from "../globalToasts";

export interface GameState {
    seed: string;
    boardLetters: string;
    selectedIndices: number[];
    foundWords: string[];
    allWords: string[];
    gameOver: boolean;
}

interface LetterSelectAction {
    type: "select_letter";
    index: number;
}

interface DeleteLetterAction {
    type: "delete_letter" | "clear";
}

interface SubmitAction {
    type: "submit";
}

interface GiveUpAction {
    type: "give_up"
}

interface NewGameAction {
    type: "new_game";
    boardLetters: string;
    seed: string;
    words: string[];
}

type GameStateAction = LetterSelectAction | GiveUpAction | DeleteLetterAction | SubmitAction | NewGameAction;

const initialState: GameState = {
    seed: '',
    boardLetters: '',
    selectedIndices: [],
    foundWords: [],
    allWords: [],
    gameOver: true,
};

export function useGameState(savedState?: GameState) {
    return useReducer(reducer, savedState ?? initialState);
}

function reducer(s: GameState, action: GameStateAction): GameState {
    switch (action.type) {
        case "select_letter":
            if (s.selectedIndices.indexOf(action.index) === -1) {
                return {...s, selectedIndices: [...s.selectedIndices, action.index]};
            }
            break;
        case "clear":
            return {...s, selectedIndices: []};
        case "delete_letter":
            return {...s, selectedIndices: s.selectedIndices.slice(0, s.selectedIndices.length - 1)};
        case "new_game":
            return {...s, selectedIndices: [], seed: action.seed, boardLetters: action.boardLetters, allWords: action.words, foundWords: [], gameOver: false};
        case "give_up":
            return {
                ...s,
                gameOver: true,
            }
        case "submit":
            const submittedWord = s.selectedIndices.map(idx => s.boardLetters[idx]).join("");
            const wordIndex = s.allWords.indexOf(submittedWord);
            if (wordIndex !== -1) {
                if (s.foundWords.indexOf(submittedWord) === -1) {
                    const foundWords = [...s.foundWords, s.allWords[wordIndex]];
                    if (foundWords.length === s.allWords.length) {
                        return { ...s, gameOver: true, foundWords, selectedIndices: []};
                    }
                    return {...s, foundWords, selectedIndices: []}
                } else {
                    setTimeout(() => toast({ title: "Redan hittat", description: `Du har redan hittat ordet "${submittedWord}"` }))
                }
            } else {
                setTimeout(() => toast({ title: "Okänt ord", description: `Ordet "${submittedWord}" finns inte i ordlistan` }));
            }
            break;
    }
    return s;
};
