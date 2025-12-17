export declare const GAME_OPTIONS: readonly ["Rock", "Gun", "Lightning", "Devil", "Dragon", "Water", "Air", "Paper", "Sponge", "Wolf", "Tree", "Human", "Snake", "Scissors", "Fire"];
export type GameOption = typeof GAME_OPTIONS[number];
export declare function isValidOption(option: string): option is GameOption;
export declare function getOptionIndex(option: GameOption): number;
//# sourceMappingURL=options.d.ts.map