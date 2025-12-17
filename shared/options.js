"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_OPTIONS = void 0;
exports.isValidOption = isValidOption;
exports.getOptionIndex = getOptionIndex;
// 15 options in circular order
exports.GAME_OPTIONS = [
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
];
function isValidOption(option) {
    return exports.GAME_OPTIONS.includes(option);
}
function getOptionIndex(option) {
    return exports.GAME_OPTIONS.indexOf(option);
}
//# sourceMappingURL=options.js.map