// 15 options in circular order
export const GAME_OPTIONS = [
  'Rock',
  'Gun',
  'Lightning',
  'Devil',
  'Dragon',
  'Water',
  'Air',
  'Paper',
  'Sponge',
  'Wolf',
  'Tree',
  'Human',
  'Snake',
  'Scissors',
  'Fire',
] as const;

export type GameOption = typeof GAME_OPTIONS[number];

export function isValidOption(option: string): option is GameOption {
  return GAME_OPTIONS.includes(option as GameOption);
}

export function getOptionIndex(option: GameOption): number {
  return GAME_OPTIONS.indexOf(option);
}
