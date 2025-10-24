// Audio feedback service for gamification

class AudioService {
  private enabled: boolean = true;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  xpGain() {
    if (!this.enabled) return;
    // Placeholder for XP gain sound
    console.log('🎵 XP gain sound');
  }

  levelUp() {
    if (!this.enabled) return;
    // Placeholder for level up sound
    console.log('🎵 Level up sound!');
  }

  achievement() {
    if (!this.enabled) return;
    // Placeholder for achievement sound
    console.log('🎵 Achievement unlocked!');
  }

  error() {
    if (!this.enabled) return;
    // Placeholder for error sound
    console.log('🎵 Error sound');
  }

  success() {
    if (!this.enabled) return;
    // Placeholder for success sound
    console.log('🎵 Success sound');
  }

  softPop() {
    if (!this.enabled) return;
    // Placeholder for soft pop sound
    console.log('🎵 Soft pop sound');
  }

  click() {
    if (!this.enabled) return;
    // Placeholder for click sound
    console.log('🎵 Click sound');
  }
}

export const audioService = new AudioService();
