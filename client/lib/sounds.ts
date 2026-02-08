// Sound effects using Web Audio API
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

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.frequency.value = frequency;
    osc.type = type;

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Button click - crisp beep
  click() {
    this.playTone(800, 0.1, 'square');
  }

  // Success/confirmation - ascending tone
  success() {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;
    
    this.playTone(600, 0.15, 'sine');
    setTimeout(() => this.playTone(800, 0.15, 'sine'), 100);
    setTimeout(() => this.playTone(1000, 0.2, 'sine'), 200);
  }

  // Shuffle/spinning effect - repeated tones
  shuffle() {
    if (!this.enabled || !this.audioContext) return;
    
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const freq = 400 + i * 100;
        this.playTone(freq, 0.08, 'triangle');
      }, i * 100);
    }
  }

  // Draw result reveal - impact sound
  reveal() {
    if (!this.enabled || !this.audioContext) return;
    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Error sound
  error() {
    if (!this.enabled || !this.audioContext) return;
    this.playTone(300, 0.3, 'square');
  }

  // UI hover effect
  hover() {
    this.playTone(900, 0.05, 'sine');
  }
}

export const soundManager = new SoundManager();
