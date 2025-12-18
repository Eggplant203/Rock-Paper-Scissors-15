class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private currentBackground: string | null = null;

  loadSound(name: string, path: string, loop: boolean = false) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.loop = loop;
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

  playBackground(name: string, volume: number = 0.3) {
    if (this.currentBackground === name) return;

    // Stop current background music
    this.stopAllBackgrounds();

    if (this.isMuted) {
      this.currentBackground = name;
      return;
    }

    const sound = this.sounds.get(name);
    if (sound) {
      sound.volume = volume;
      sound.play().catch(err => {
        console.warn(`Failed to play background ${name}:`, err);
      });
      this.currentBackground = name;
    }
  }

  stopAllBackgrounds() {
    const backgrounds = ['background_menu', 'background_matchmaking', 'background_gameplay'];
    backgrounds.forEach(bg => {
      const sound = this.sounds.get(bg);
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
    this.currentBackground = null;
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
    
    if (muted) {
      this.stopAllBackgrounds();
    } else if (this.currentBackground) {
      // Resume current background
      const sound = this.sounds.get(this.currentBackground);
      if (sound) {
        sound.play().catch(err => {
          console.warn(`Failed to resume background:`, err);
        });
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setMuted(this.isMuted);
    return this.isMuted;
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  pauseBackground() {
    if (this.currentBackground) {
      const sound = this.sounds.get(this.currentBackground);
      if (sound && !sound.paused) {
        sound.pause();
      }
    }
  }

  resumeBackground() {
    if (this.currentBackground && !this.isMuted) {
      const sound = this.sounds.get(this.currentBackground);
      if (sound && sound.paused) {
        sound.play().catch(err => {
          console.warn(`Failed to resume background:`, err);
        });
      }
    }
  }
}

export const audioManager = new AudioManager();

// Initialize sounds
export function initializeSounds() {
  // Sound effects
  audioManager.loadSound('click', '/assets/sounds/click.wav');
  audioManager.loadSound('countdown', '/assets/sounds/countdown.wav');
  audioManager.loadSound('win', '/assets/sounds/win.wav');
  audioManager.loadSound('lose', '/assets/sounds/lose.wav');
  audioManager.loadSound('draw', '/assets/sounds/draw.wav');
  audioManager.loadSound('logout', '/assets/sounds/logout.wav');
  audioManager.loadSound('send', '/assets/sounds/send.wav');
  audioManager.loadSound('receive', '/assets/sounds/receive.wav');
  
  // Background music (with loop enabled)
  audioManager.loadSound('background_menu', '/assets/sounds/background_menu.wav', true);
  audioManager.loadSound('background_matchmaking', '/assets/sounds/background_matchmaking.wav', true);
  audioManager.loadSound('background_gameplay', '/assets/sounds/background_gameplay.wav', true);
}
