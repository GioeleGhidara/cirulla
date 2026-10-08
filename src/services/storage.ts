import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, GameSettings, GameStats, PlayerSide } from '../types/card';

const SETTINGS_KEY = '@cirulla_settings_v1';
const STATS_KEY = '@cirulla_stats_v1';
const ACTIVE_MATCH_KEY = '@cirulla_active_match_v2';

export interface SavedMatchState {
  readonly playerTotalScore: number;
  readonly aiTotalScore: number;
  readonly dealer: PlayerSide;
  readonly handIndex: number;
  readonly deck: Card[];
  readonly playerHand: Card[];
  readonly aiHand: Card[];
  readonly tableCards: Card[];
  readonly playerCaptured: Card[];
  readonly aiCaptured: Card[];
  readonly playerScope: number;
  readonly aiScope: number;
  readonly playerAccusePts: number;
  readonly aiAccusePts: number;
  readonly isPlayerTurn: boolean;
  readonly savedAt: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  deckStyle: 'genovesi',
  cardGraphicStyle: 'genovesi_autentiche',
  deckSkinId: 'genovesi_dal_negro',
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

export async function loadActiveMatch(): Promise<SavedMatchState | null> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_MATCH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedMatchState;
  } catch {
    return null;
  }
}

export async function saveActiveMatch(match: SavedMatchState | null): Promise<void> {
  try {
    if (!match) {
      await AsyncStorage.removeItem(ACTIVE_MATCH_KEY);
    } else {
      await AsyncStorage.setItem(ACTIVE_MATCH_KEY, JSON.stringify(match));
    }
  } catch (e) {
    console.warn('Failed to save active match', e);
  }
}

export async function clearActiveMatch(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ACTIVE_MATCH_KEY);
  } catch (e) {
    console.warn('Failed to clear active match', e);
  }
}
