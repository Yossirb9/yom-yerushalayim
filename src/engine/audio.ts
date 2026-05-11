// Tiny procedural WebAudio helper.  No external assets.

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, durMs: number, type: OscillatorType = 'square', vol = 0.04) {
  const c = ensureCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = vol;
  osc.connect(gain).connect(c.destination);
  const now = c.currentTime;
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durMs / 1000);
  osc.start(now);
  osc.stop(now + durMs / 1000);
}

export const audio = {
  beep() {
    tone(880, 30);
  },
  step() {
    tone(180, 50, 'square', 0.02);
  },
  confirm() {
    tone(660, 60);
    setTimeout(() => tone(880, 80), 50);
  },
  cancel() {
    tone(330, 80, 'square', 0.04);
  },
  itemGet() {
    tone(523, 70);
    setTimeout(() => tone(659, 70), 70);
    setTimeout(() => tone(784, 120), 140);
  },
  questDone() {
    tone(523, 80);
    setTimeout(() => tone(659, 80), 80);
    setTimeout(() => tone(784, 80), 160);
    setTimeout(() => tone(1046, 200), 240);
  },
};
