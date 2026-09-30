/**
 * DTMF (Dual-Tone Multi-Frequency) and Telephony Audio Synthesizer
 * Uses Web Audio API to produce standard telephony tones, ringback tones, and recording beeps.
 */

class DTMFAudioService {
  private ctx: AudioContext | null = null;
  private ringOsc1: OscillatorNode | null = null;
  private ringOsc2: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private ringInterval: number | null = null;

  // DTMF frequency map (row x col)
  private readonly DTMF_FREQS: Record<string, [number, number]> = {
    '1': [697, 1209],
    '2': [697, 1336],
    '3': [697, 1477],
    '4': [770, 1209],
    '5': [770, 1336],
    '6': [770, 1477],
    '7': [852, 1209],
    '8': [852, 1336],
    '9': [852, 1477],
    '*': [941, 1209],
    '0': [941, 1336],
    '#': [941, 1477],
  };

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play DTMF tone for a telephone keypad key (0-9, *, #)
   */
  public playKeyTone(key: string, durationMs: number = 180): void {
    const freqs = this.DTMF_FREQS[key];
    if (!freqs) return;

    try {
      const ctx = this.getAudioContext();
      const [f1, f2] = freqs;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(f1, ctx.currentTime);
      osc2.frequency.setValueAtTime(f2, ctx.currentTime);

      // Volume envelope to prevent click artifacts
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.015);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime + (durationMs / 1000) - 0.02);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + (durationMs / 1000));

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);

      osc1.stop(ctx.currentTime + (durationMs / 1000));
      osc2.stop(ctx.currentTime + (durationMs / 1000));
    } catch {
      // AudioContext could be blocked by autoplay policies
    }
  }

  /**
   * Start Indian/US standard ringing cadence (2s tone, 4s silence)
   */
  public startRingingTone(): void {
    this.stopRingingTone();
    try {
      const ctx = this.getAudioContext();

      const playRingBurst = () => {
        if (!this.ctx || this.ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const g = ctx.createGain();

        // 440 Hz + 480 Hz ringback standard
        o1.type = 'sine';
        o2.type = 'sine';
        o1.frequency.setValueAtTime(440, now);
        o2.frequency.setValueAtTime(480, now);

        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.08, now + 0.05);
        g.gain.setValueAtTime(0.08, now + 1.6);
        g.gain.linearRampToValueAtTime(0, now + 1.8);

        o1.connect(g);
        o2.connect(g);
        g.connect(ctx.destination);

        o1.start(now);
        o2.start(now);
        o1.stop(now + 1.8);
        o2.stop(now + 1.8);
      };

      playRingBurst();
      this.ringInterval = window.setInterval(playRingBurst, 3500);
    } catch {
      // AudioContext failure handled safely
    }
  }

  public stopRingingTone(): void {
    if (this.ringInterval !== null) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
    if (this.ringOsc1) {
      try { this.ringOsc1.stop(); } catch { /* ignore */ }
      this.ringOsc1 = null;
    }
    if (this.ringOsc2) {
      try { this.ringOsc2.stop(); } catch { /* ignore */ }
      this.ringOsc2 = null;
    }
  }

  /**
   * Play high beep tone (e.g. before voice message recording)
   */
  public playPromptBeep(durationMs: number = 350): void {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + (durationMs / 1000) - 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + (durationMs / 1000));
    } catch {
      // Ignore
    }
  }

  /**
   * Play call disconnect / busy fast-busy tone
   */
  public playCallEndTone(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now + i * 0.25);
        gain.gain.setValueAtTime(0.1, now + i * 0.25);
        gain.gain.setValueAtTime(0, now + i * 0.25 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 0.15);
      }
    } catch {
      // Ignore
    }
  }
}

export const dtmfAudioService = new DTMFAudioService();
