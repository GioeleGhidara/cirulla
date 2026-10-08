import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeckSkinId, DEFAULT_DECK_SKIN_ID } from '../assets/deckSkinsRegistry';
import { ALL_DECK_SKINS } from '../constants/deckSkins';

const DOWNLOADED_DECKS_KEY = '@cirulla_downloaded_decks_v2';

export interface DeckStorageState {
  readonly installedIds: readonly DeckSkinId[];
  readonly totalDiskUsageMB: number;
}

// Approximate size per deck in MB for user transparency
export const DECK_SIZE_MAP: Record<DeckSkinId, number> = {
  genovesi_dal_negro: 3.2, // Bundled core
  ramino_modiano: 1.8,
  baroque_piatnik: 2.1,
  ancient_french: 1.9,
  lombarde_ticinesi: 2.4,
  russian_atlasnye: 1.7,
  folklore_piatnik: 2.2,
  carta_mundi: 2.0,
  kaiser_piatnik: 2.3,
  genovesi_modiano: 1.8,
  napoletane_classiche: 1.5,
  salon_karte_66: 1.9,
  dondorf: 2.2,
  moderno: 0.1,
  classico_poker: 0.1,
};

export const BUNDLED_DECK_IDS: readonly DeckSkinId[] = [
  'genovesi_dal_negro',
  'moderno',
  'classico_poker',
];

/**
 * Load the list of installed deck IDs from local storage.
 * The core Genovesi Dal Negro deck is always installed.
 */
export async function getInstalledDeckIds(): Promise<DeckSkinId[]> {
  try {
    const raw = await AsyncStorage.getItem(DOWNLOADED_DECKS_KEY);
    if (!raw) {
      return [...BUNDLED_DECK_IDS];
    }
    const parsed = JSON.parse(raw) as DeckSkinId[];
    const set = new Set<DeckSkinId>([...BUNDLED_DECK_IDS, ...parsed]);
    return Array.from(set);
  } catch {
    return [...BUNDLED_DECK_IDS];
  }
}

/**
 * Check if a specific deck is available for play.
 */
export function isDeckAvailable(id: DeckSkinId, installedIds: readonly DeckSkinId[]): boolean {
  if (BUNDLED_DECK_IDS.includes(id)) return true;
  return installedIds.includes(id);
}

/**
 * Calculate the total disk space in MB used by user-downloaded decks.
 */
export function calculateInstalledDecksSizeMB(installedIds: readonly DeckSkinId[]): number {
  let total = 0;
  for (const id of installedIds) {
    // Only count optional downloaded decks, not bundled core
    if (!BUNDLED_DECK_IDS.includes(id)) {
      total += DECK_SIZE_MAP[id] ?? 1.8;
    }
  }
  return Math.round(total * 10) / 10;
}

/**
 * Simulate / perform deck installation.
 * Saves the ID to storage with progress callback for smooth UX.
 */
export async function installDeck(
  id: DeckSkinId,
  onProgress?: (progress: number) => void
): Promise<DeckSkinId[]> {
  const current = await getInstalledDeckIds();
  if (current.includes(id)) return current;

  // Smooth simulated progressive download steps
  const steps = [0.15, 0.45, 0.75, 1.0];
  for (const p of steps) {
    if (onProgress) onProgress(p);
    await new Promise((r) => setTimeout(r, 120));
  }

  const updated = [...current, id];
  try {
    await AsyncStorage.setItem(DOWNLOADED_DECKS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save installed deck', err);
  }

  return updated;
}

/**
 * Delete a downloaded deck to free up storage space.
 * Bundled decks cannot be deleted.
 */
export async function uninstallDeck(id: DeckSkinId): Promise<DeckSkinId[]> {
  if (BUNDLED_DECK_IDS.includes(id)) {
    // Cannot delete core bundled deck
    return await getInstalledDeckIds();
  }

  const current = await getInstalledDeckIds();
  const updated = current.filter((item) => item !== id);

  try {
    await AsyncStorage.setItem(DOWNLOADED_DECKS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to delete deck from storage', err);
  }

  return updated;
}

/**
 * Uninstall all optional downloaded decks, keeping only the core bundled deck.
 */
export async function uninstallAllOptionalDecks(): Promise<DeckSkinId[]> {
  const coreOnly = [...BUNDLED_DECK_IDS];
  try {
    await AsyncStorage.setItem(DOWNLOADED_DECKS_KEY, JSON.stringify(coreOnly));
  } catch (err) {
    console.warn('Failed to clean up decks', err);
  }
  return coreOnly;
}
