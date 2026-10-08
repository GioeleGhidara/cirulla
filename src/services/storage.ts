import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, GameStats } from '../types/card';

const SETTINGS_KEY = '@cirulla_settings_v1';
const STATS_KEY = '@cirulla_stats_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  deckStyle: 'genovesi',
  cardGraphicStyle: 'moderno',
  aiDifficulty: 'normale',
  targetScore: 51,
  soundEnabled: true,
  hapticsEnabled: true,
  autoSelectBestCapture: false,
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalScope: 0,
  bestScoreInGame: 0,
  piccoleMade: 0,
  grandiMade: 0,
  accuseTreMade: 0,
  accuseDieciMade: 0,
};

export async function loadSettings(): Promise<GameSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}

export async function loadStats(): Promise<GameStats> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export async function saveStats(stats: GameStats): Promise<void> {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save stats', e);
  }
}
