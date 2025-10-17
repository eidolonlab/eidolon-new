const audioContext = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

function isAudioEnabled(): boolean {
  try {
    const settings = localStorage.getItem('eidolon-settings');
    if (!settings) return true;
    const parsed = JSON.parse(settings);
    return parsed?.training?.soundEffects !== false;
  } catch {
    return true;
  }
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.15,
  fadeOut: boolean = true
) {
  if (!audioContext || !isAudioEnabled()) return;

  try {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.value = volume;

    if (fadeOut) {
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

export const audioService = {
  xpGain() {
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  },

  levelUp() {
    if (!audioContext || !isAudioEnabled()) return;

    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const now = audioContext.currentTime;

      const playNote = (freq: number, startTime: number, duration: number = 0.12) => {
        const osc = audioContext!.createOscillator();
        const gain = audioContext!.createGain();

        osc.connect(gain);
        gain.connect(audioContext!.destination);

        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      playNote(523.25, now);
      playNote(659.25, now + 0.08);
      playNote(783.99, now + 0.16);
      playNote(1046.50, now + 0.24, 0.25);
    } catch (error) {
      console.warn('Level up audio failed:', error);
    }
  },

  achievementUnlock() {
    if (!audioContext || !isAudioEnabled()) return;

    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const now = audioContext.currentTime;

      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
        const osc = audioContext!.createOscillator();
        const gain = audioContext!.createGain();

        osc.connect(gain);
        gain.connect(audioContext!.destination);

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + (i * 0.06);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (error) {
      console.warn('Achievement audio failed:', error);
    }
  },

  streakExtended() {
    playTone(698.46, 0.08, 'sine', 0.1);

    setTimeout(() => {
      playTone(830.61, 0.12, 'sine', 0.12);
    }, 80);
  },

  success() {
    playTone(783.99, 0.15, 'triangle', 0.1);
  },

  softPop() {
    if (!audioContext || !isAudioEnabled()) return;

    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (error) {
      console.warn('Pop audio failed:', error);
    }
  }
};
