export const gameCategories = [
    "✏️ Custom",
    "📍 Places",
    "🎬 Movies & TV Shows",
    "💼 Professions",
    "🍔 Food & Drinks",
    "⚽ Sports & Activities",
    "🐾 Animals",
    "🚗 Vehicles",
    "📱 Technology & Gadgets",
    "🎨 Hobbies & Interests",
    "🏠 Household Objects",
] as const;

// This automatically creates a union type from the array values
export type GameCategory = typeof gameCategories[number];

export interface GameWord {
    word: string;
    clue: string;
    category: GameCategory;
}