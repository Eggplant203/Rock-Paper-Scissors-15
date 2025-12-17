class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  loadSound(name: string, path: string) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
  }

  play(name: string, volume: number = 1.0) {
    if (this.isMuted) return;

    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0;
      sound.volume = volume;
      sound.play().catch(err => {
        console.warn(`Failed to play sound ${name}:`, err);
      });
    }
  }

  stop(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  isMutedState(): boolean {
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();

// Initialize sounds
export function initializeSounds() {
  audioManager.loadSound('click', '/assets/sounds/click.wav');
  audioManager.loadSound('countdown', '/assets/sounds/countdown.wav');
  audioManager.loadSound('win', '/assets/sounds/win.wav');
  audioManager.loadSound('lose', '/assets/sounds/lose.wav');
  audioManager.loadSound('draw', '/assets/sounds/draw.wav');
}
