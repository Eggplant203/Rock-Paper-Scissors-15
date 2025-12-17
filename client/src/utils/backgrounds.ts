// Random background gradients for the game
export const BACKGROUNDS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple (default)
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green-Cyan
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink-Yellow
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // Cyan-Purple
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Light Cyan-Pink
  'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)', // Orange-Pink
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Peach
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)', // Red-Blue
];

// Get a random background on page load
export function getRandomBackground(): string {
  const randomIndex = Math.floor(Math.random() * BACKGROUNDS.length);
  return BACKGROUNDS[randomIndex];
}

// Initialize background on app load
export function initializeBackground(): void {
  const background = getRandomBackground();
  document.documentElement.style.setProperty('--app-background', background);
}
