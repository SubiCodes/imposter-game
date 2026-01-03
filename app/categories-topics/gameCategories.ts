export const gameCategories = [
  "Places",
  "Professions",
  "Food & Drinks",
  "Animals",
  "Sports & Activities",
  "Technology & Gadgets",
  "Vehicles",
  "Movies & TV Shows",
  "Hobbies & Interests",
  "Household Objects"
] as const;

// This automatically creates a union type from the array values
export type GameCategory = typeof gameCategories[number];

export interface GameWord {
  word: string;
  clue: string;
  category: GameCategory;
}