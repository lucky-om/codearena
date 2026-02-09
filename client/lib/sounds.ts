// Sound effects using Web Audio API with proper timing
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.value = frequency;
      osc.type = type;

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Silently fail if audio context isn't ready
    }
  }

  // Button click - crisp, quick beep (50ms)
  click() {
    this.playTone(750, 0.08, 'square', 0.25);
  }

  // Hover effect - very subtle (30ms)
  hover() {
    this.playTone(950, 0.03, 'sine', 0.15);
  }

  // Success/confirmation - ascending three-note chime (synchronized with 300ms animation)
  success() {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;

    this.playTone(523, 0.15, 'sine', 0.3); // C note - starts immediately
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.32), 85); // E note - at 85ms
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.35), 170); // G note - at 170ms
  }

  // Verify/confirmation - medium beep (synchronized with 300ms delay)
  verify() {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;

    this.playTone(880, 0.12, 'sine', 0.3); // A note
    setTimeout(() => this.playTone(1047, 0.12, 'sine', 0.35), 100); // C note (high)
  }

  // Shuffle/spinning effect - rapid ascending pattern (synchronized with animation)
  shuffle() {
    if (!this.enabled || !this.audioContext) return;

    const freqs = [400, 480, 570, 680, 810, 960];
    freqs.forEach((freq, i) => {
      // Each tone at 80ms intervals, 60ms duration
      setTimeout(() => {
        this.playTone(freq, 0.06, 'triangle', 0.22);
      }, i * 70); // 70ms interval for smoother cascade
    });
  }

  // Draw result reveal - dramatic drop/impact sound (synchronized with 200ms reveal animation)
  reveal() {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;

    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      // Frequency sweep from 600 down to 120 over 200ms
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);
      osc.type = 'sawtooth';

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      // Silently fail
    }
  }

  // Error/invalid sound - warning beep (250ms)
  error() {
    if (!this.enabled || !this.audioContext) return;

    this.playTone(300, 0.12, 'square', 0.3);
    setTimeout(() => this.playTone(250, 0.12, 'square', 0.3), 130);
  }

  // Approve/success for admin - positive chime
  approve() {
    if (!this.enabled || !this.audioContext) return;

    this.playTone(659, 0.1, 'sine', 0.3); // E
    setTimeout(() => this.playTone(784, 0.1, 'sine', 0.3), 80); // G
    setTimeout(() => this.playTone(1047, 0.15, 'sine', 0.35), 160); // C (high)
  }
}

export const soundManager = new SoundManager();
