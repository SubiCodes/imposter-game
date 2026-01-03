import { create } from 'zustand';
import {gameCategories, GameCategory} from '../categories-topics/gameCategories';
import gameWords, { GameWord } from '../categories-topics/gameWords';

interface GameStoreState {
    readonly categories: readonly GameCategory[];
    gameWords: GameWord[];
}

const useGameStore = create<GameStoreState>((set) => ({
    categories: gameCategories,
    gameWords: gameWords,
}));

export default useGameStore;