export const gameTimers = [
   "1:00",
   "1:30",
   "2:00",
   "2:30",
   "3:00",
] as const;

// This automatically creates a union type from the array values
export type GameTimer = typeof gameTimers[number];