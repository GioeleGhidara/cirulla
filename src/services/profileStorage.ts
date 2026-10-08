import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerAvatar, Trophy, CareerRank, PlayerProfile } from '../types/profile';
import { GameStats } from '../types/card';

const PROFILE_KEY = '@cirulla_player_profile_v1';

export const AVAILABLE_AVATARS: readonly PlayerAvatar[] = [
  {
    id: 'lupo_di_mare',
    name: 'Lupo di Mare',
    role: 'Pescatore di Camogli',
    icon: 'boat-outline',
    color: '#0284c7',
    description: 'Conosce ogni vento del Golfo e ogni giocata a terra.',
  },
  {
    id: 'lanterna',
    name: 'La Lanterna',
    role: 'Guardiano del Porto',
    icon: 'flame-outline',
    color: '#f59e0b',
    description: 'Illumina il tavolo con saggezza e non perde mai il conto del 15.',
  },
  {
    id: 'capitano',
    name: 'Capitano Bacci',
    role: 'Comandante di Lungo Corso',
    icon: 'compass-outline',
    color: '#10b981',
    description: 'Ha navigato in tutti i mari e cala sempre il 7 di cuori al momento giusto.',
  },
  {
    id: 'boccadasse',
    name: 'Rosa di Boccadasse',
    role: 'Maestra del Borgo',
    icon: 'heart-circle-outline',
    color: '#ec4899',
    description: 'Imbattibile nelle prese a scopa tra le case color pastello.',
  },
  {
    id: 'doge',
    name: 'Doge di Genova',
    role: 'Signore della Repubblica',
    icon: 'shield-checkmark-outline',
    color: '#eab308',
    description: 'Mente strategica e custode dell’antico regolamento genovese.',
  },
  {
    id: 'oste',
    name: 'Oste dei Caruggi',
    role: 'Re dell’Osteria Storica',
    icon: 'wine-outline',
    color: '#8b5cf6',
    description: 'Distribuisce le smazzate tra focaccia calda e mugugno amichevole.',
  },
];

export const CAREER_RANKS: readonly CareerRank[] = [
  {
    level: 1,
    title: 'Mozzo di Banchina',
    minXp: 0,
    maxXp: 150,
    badgeColor: '#64748b',
    description: 'I primi passi tra le carte e le prese a 15.',
  },
  {
    level: 2,
    title: 'Marinaio di Prè',
    minXp: 150,
    maxXp: 400,
    badgeColor: '#0284c7',
    description: 'Inizia a padroneggiare la Matta e l’Accusa da 3.',
  },
  {
    level: 3,
    title: 'Giocatore da Osteria',
    minXp: 400,
    maxXp: 800,
    badgeColor: '#10b981',
    description: 'Temuto nei circoli del centro storico per le sue scope a sorpresa.',
  },
  {
    level: 4,
    title: 'Campione dei Caruggi',
    minXp: 800,
    maxXp: 1400,
    badgeColor: '#f59e0b',
    description: 'Calcola le carte scese a memoria e punta sempre al Cappotto.',
  },
  {
    level: 5,
    title: 'Doge della Cirulla',
    minXp: 1400,
    maxXp: 99999,
    badgeColor: '#eab308',
    description: 'Leggenda immortale del gioco ligure.',
  },
];

export const ALL_TROPHIES: readonly Trophy[] = [
  {
    id: 'prima_vittoria',
    title: 'Battesimo del Fuoco',
    description: 'Vinci la tua prima partita completa.',
    icon: 'trophy-outline',
    color: '#10b981',
    xpValue: 100,
  },
  {
    id: 're_della_scopa',
    title: 'Re della Scopa',
    description: 'Realizza almeno 10 scope complessive in carriera.',
    icon: 'sparkles-outline',
    color: '#f59e0b',
    xpValue: 150,
  },
  {
    id: 'la_vera_matta',
    title: 'La Vera Matta',
    description: 'Gioca il 7 di Cuori per una presa decisiva o un’accusa.',
    icon: 'heart-outline',
    color: '#ef4444',
    xpValue: 80,
  },
  {
    id: 'settebello_rubato',
    title: 'Cacciatore di Denari',
    description: 'Conquista il Settebello in almeno 3 partite.',
    icon: 'diamond-outline',
    color: '#eab308',
    xpValue: 120,
  },
  {
    id: 'grande_trionfo',
    title: 'La Grande di Denari',
    description: 'Realizza la Grande (Fante, Donna e Re di Denari).',
    icon: 'ribbon-outline',
    color: '#8b5cf6',
    xpValue: 200,
  },
  {
    id: 'accusa_dieci',
    title: 'Mano Miracolosa',
    description: 'Dichiara un’Accusa da 10 punti (somma carte in mano ≤ 9).',
    icon: 'flash-outline',
    color: '#06b6d4',
    xpValue: 250,
  },
  {
    id: 'veterano_51',
    title: 'Maestro dei 51 Punti',
    description: 'Vinci una partita classica a 51 punti a livello Campione.',
    icon: 'star-outline',
    color: '#f97316',
    xpValue: 300,
  },
];

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Giocatore Ligure',
  avatarId: 'lupo_di_mare',
  xp: 120,
  unlockedTrophyIds: ['la_vera_matta'],
  gamesPlayedCount: 0,
  createdAt: Date.now(),
};

export async function loadPlayerProfile(): Promise<PlayerProfile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function savePlayerProfile(profile: PlayerProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save player profile', e);
  }
}

export function getCurrentRank(xp: number): CareerRank {
  for (let i = CAREER_RANKS.length - 1; i >= 0; i--) {
    if (xp >= CAREER_RANKS[i].minXp) {
      return CAREER_RANKS[i];
    }
  }
  return CAREER_RANKS[0];
}

export function getRankProgress(xp: number): { percent: number; current: CareerRank; next: CareerRank | null } {
  const current = getCurrentRank(xp);
  const currentIndex = CAREER_RANKS.findIndex((r) => r.level === current.level);
  const next = currentIndex < CAREER_RANKS.length - 1 ? CAREER_RANKS[currentIndex + 1] : null;

  if (!next) {
    return { percent: 100, current, next: null };
  }

  const range = next.minXp - current.minXp;
  const currentInTier = Math.max(0, xp - current.minXp);
  const percent = Math.min(100, Math.round((currentInTier / range) * 100));

  return { percent, current, next };
}

/**
 * Automatically check and evaluate trophies earned based on game stats and history
 */
export function evaluateTrophiesEarned(
  profile: PlayerProfile,
  stats: GameStats
): { updatedProfile: PlayerProfile; newlyUnlocked: Trophy[] } {
  const unlockedSet = new Set<string>(profile.unlockedTrophyIds);
  const newlyUnlocked: Trophy[] = [];
  let addedXp = 0;

  if (stats.gamesWon >= 1 && !unlockedSet.has('prima_vittoria')) {
    unlockedSet.add('prima_vittoria');
    const t = ALL_TROPHIES.find((x) => x.id === 'prima_vittoria')!;
    newlyUnlocked.push(t);
    addedXp += t.xpValue;
  }

  if (stats.totalScope >= 10 && !unlockedSet.has('re_della_scopa')) {
    unlockedSet.add('re_della_scopa');
    const t = ALL_TROPHIES.find((x) => x.id === 're_della_scopa')!;
    newlyUnlocked.push(t);
    addedXp += t.xpValue;
  }

  if (stats.grandiMade >= 1 && !unlockedSet.has('grande_trionfo')) {
    unlockedSet.add('grande_trionfo');
    const t = ALL_TROPHIES.find((x) => x.id === 'grande_trionfo')!;
    newlyUnlocked.push(t);
    addedXp += t.xpValue;
  }

  if (stats.accuseDieciMade >= 1 && !unlockedSet.has('accusa_dieci')) {
    unlockedSet.add('accusa_dieci');
    const t = ALL_TROPHIES.find((x) => x.id === 'accusa_dieci')!;
    newlyUnlocked.push(t);
    addedXp += t.xpValue;
  }

  const updatedProfile: PlayerProfile = {
    ...profile,
    xp: profile.xp + addedXp,
    unlockedTrophyIds: Array.from(unlockedSet),
    gamesPlayedCount: stats.gamesPlayed,
  };

  return { updatedProfile, newlyUnlocked };
}
