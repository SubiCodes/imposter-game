import { create } from 'zustand';
import { gameCategories, GameCategory } from '../categories-topics/gameCategories';
import gameWords, { GameWord } from '../categories-topics/gameWords';
import { gameTimers, GameTimer } from '../categories-topics/gameTime';
import { GamePayload } from '../index';

interface GameStoreState {
    readonly categories: readonly GameCategory[];
    gameWords: GameWord[];
    readonly gameTimers: readonly GameTimer[];
    startGame: (game: GamePayload, router: any) => void;
    playAgain: (previousGame: any, router: any) => void;
}

const useGameStore = create<GameStoreState>((set) => ({
    categories: gameCategories,
    gameWords: gameWords,
    gameTimers: gameTimers,
    startGame: (game: GamePayload, router: any) => {
        const imposter = game.players[Math.floor(Math.random() * game.players.length)];
        const word = game.customTopics && game.customTopics.length > 0
            ? game.customTopics[Math.floor(Math.random() * game.customTopics.length)]
            : gameWords
                .filter(gw => game.categories.includes(gw.category))
                .map(gw => gw.word)[Math.floor(Math.random() * gameWords.filter(gw => game.categories.includes(gw.category)).length)];
        let clue = null;
        if (game.clue) {
            clue = gameWords.find(gw => gw.word === word)?.clue;
        } else {
            clue = null;
        };
        const finalGamePayload = {
            players: game.players,
            categories: game.categories,
            word: word,
            clue: clue,
            timer: game.timeInMs,
            imposter: imposter,
            customTopics: game.customTopics,
        };
        router.push({ pathname: '/view-word', params: { gamePayload: JSON.stringify(finalGamePayload) } });
    },
    playAgain: (previousGame: any, router: any) => {
        // Reuse the same players and categories, but randomize imposter and word
        const imposter = previousGame.players[Math.floor(Math.random() * previousGame.players.length)];

        // Get a new random word from the same categories OR custom topics
        let word: string;
        if (previousGame.customTopics && previousGame.customTopics.length > 0) {
            word = previousGame.customTopics[Math.floor(Math.random() * previousGame.customTopics.length)];
        } else {
            const availableWords = gameWords
                .filter(gw => previousGame.categories.includes(gw.category))
                .map(gw => gw.word);
            word = availableWords[Math.floor(Math.random() * availableWords.length)];
        }

        // Get clue if the previous game had clues enabled (check if clue exists)
        let clue = null;
        if (previousGame.clue !== null && previousGame.clue !== undefined) {
            clue = gameWords.find(gw => gw.word === word)?.clue || null;
        }

        const finalGamePayload = {
            players: previousGame.players,
            categories: previousGame.categories,
            word: word,
            clue: clue,
            timer: previousGame.timer,
            imposter: imposter,
            customTopics: previousGame.customTopics,
        };

        router.replace({ pathname: '/view-word', params: { gamePayload: JSON.stringify(finalGamePayload) } });
    },
}));

export default useGameStore;