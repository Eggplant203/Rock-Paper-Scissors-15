export function generateRandomNickname(): string {
  const adjectives = [
    'Swift', 'Brave', 'Clever', 'Mighty', 'Silent', 'Golden', 'Shadow', 'Thunder',
    'Cosmic', 'Blazing', 'Mystic', 'Ancient', 'Noble', 'Wild', 'Iron', 'Storm',
    'Crystal', 'Frost', 'Crimson', 'Emerald', 'Royal', 'Steel', 'Lunar', 'Solar'
  ];
  
  const nouns = [
    'Wolf', 'Dragon', 'Eagle', 'Tiger', 'Phoenix', 'Bear', 'Hawk', 'Lion',
    'Falcon', 'Panther', 'Raven', 'Viper', 'Warrior', 'Knight', 'Hunter', 'Samurai',
    'Ninja', 'Guardian', 'Champion', 'Legend', 'Hero', 'Master', 'Sage', 'Wizard'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999);
  
  return `${adjective}${noun}${number}`;
}
