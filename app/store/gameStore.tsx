import { create } from 'zustand';
import {gameCategories, GameCategory} from '../categories-topics/gameCategories';
import gameWords, { GameWord } from '../categories-topics/gameWords';
import { gameTimers, GameTimer } from '../categories-topics/gameTime';

interface GameStoreState {
    readonly categories: readonly GameCategory[];
    gameWords: GameWord[];
    readonly gameTimers: readonly GameTimer[];
}

const useGameStore = create<GameStoreState>((set) => ({
    categories: gameCategories,
    gameWords: gameWords,
    gameTimers: gameTimers
}));

export default useGameStore;