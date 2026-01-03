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
        if (game.clue){
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
        };
        router.push({ pathname: '/view-word', params: { gamePayload: JSON.stringify(finalGamePayload) } });
    },
}));

export default useGameStore;