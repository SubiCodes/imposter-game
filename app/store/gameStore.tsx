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
        console.log('Starting game with payload:', game);
        router.push({ pathname: '/view-word', params: { gamePayload: JSON.stringify(game) } });
    }
}));

export default useGameStore;