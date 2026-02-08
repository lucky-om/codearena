// Sound effects using Web Audio API with proper timing
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined" && window.AudioContext) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.3,
  ) {
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
    this.playTone(750, 0.08, "square", 0.25);
  }

  // Hover effect - very subtle (30ms)
  hover() {
    this.playTone(950, 0.03, "sine", 0.15);
  }

  // Success/confirmation - ascending three-note chime (300ms total)
  success() {
    if (!this.enabled || !this.audioContext) return;

    this.playTone(523, 0.12, "sine", 0.3); // C note
    setTimeout(() => this.playTone(659, 0.12, "sine", 0.3), 100); // E note
    setTimeout(() => this.playTone(784, 0.15, "sine", 0.35), 200); // G note
  }

  // Verify/confirmation - medium beep (200ms)
  verify() {
    if (!this.enabled || !this.audioContext) return;

    this.playTone(880, 0.1, "sine", 0.3); // A note
    setTimeout(() => this.playTone(1047, 0.1, "sine", 0.3), 120); // C note
  }

  // Shuffle/spinning effect - rapid ascending pattern (600ms total)
  shuffle() {
    if (!this.enabled || !this.audioContext) return;

    const freqs = [400, 500, 600, 700, 800, 900];
    freqs.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.06, "triangle", 0.25);
      }, i * 80);
    });
  }

  // Draw result reveal - dramatic drop/impact sound (200ms)
  reveal() {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;

    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      osc.type = "sawtooth";

      gain.gain.setValueAtTime(0.35, now);
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

    this.playTone(300, 0.12, "square", 0.3);
    setTimeout(() => this.playTone(250, 0.12, "square", 0.3), 130);
  }

  // Approve/success for admin - positive chime
  approve() {
    if (!this.enabled || !this.audioContext) return;

    this.playTone(659, 0.1, "sine", 0.3); // E
    setTimeout(() => this.playTone(784, 0.1, "sine", 0.3), 80); // G
    setTimeout(() => this.playTone(1047, 0.15, "sine", 0.35), 160); // C (high)
  }
}

export const soundManager = new SoundManager();
