import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Web Audio API synthesizer for instant zero-latency sound effects on web/preview
class SoundSynthesizer {
  private ctx: any = null;

  private getContext() {
    if (Platform.OS !== 'web') return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playCardSnap() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  playCaptureChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.22);
      });
    } catch {}
  }

  playScopaFanfare() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // Arpeggio C5 -> E5 -> G5 -> C6
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch {}
  }

  playAccusa() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        const start = ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.38);
      });
    } catch {}
  }

  playVictory() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523, 659, 783, 1046, 783, 1046, 1318];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.12;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.55);
      });
    } catch {}
  }

  playShuffle() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      for (let i = 0; i < 7; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + i * 0.05;
        osc.frequency.setValueAtTime(360 + (i % 2) * 60, start);
        osc.frequency.exponentialRampToValueAtTime(130, start + 0.038);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.038);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.045);
      }
    } catch {}
  }
}

const synth = new SoundSynthesizer();

export async function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning', enabled: boolean = true) {
  if (!enabled) return;
  if (Platform.OS === 'web') return;

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
    }
  } catch {}
}

export function playSound(
  sound: 'card' | 'capture' | 'scopa' | 'accusa' | 'victory' | 'shuffle',
  soundEnabled: boolean = true,
  hapticsEnabled: boolean = true
) {
  if (soundEnabled) {
    if (sound === 'card') synth.playCardSnap();
    if (sound === 'shuffle') synth.playShuffle();
    if (sound === 'capture') synth.playCaptureChime();
    if (sound === 'scopa') synth.playScopaFanfare();
    if (sound === 'accusa') synth.playAccusa();
    if (sound === 'victory') synth.playVictory();
  }

  if (hapticsEnabled) {
    if (sound === 'card' || sound === 'shuffle') triggerHaptic('light', hapticsEnabled);
    if (sound === 'capture') triggerHaptic('medium', hapticsEnabled);
    if (sound === 'scopa') triggerHaptic('success', hapticsEnabled);
    if (sound === 'accusa') triggerHaptic('heavy', hapticsEnabled);
    if (sound === 'victory') triggerHaptic('success', hapticsEnabled);
  }
}
