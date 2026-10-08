export interface PlayerAvatar {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly icon: string; // Ionicons name
  readonly color: string;
  readonly description: string;
}

export interface Trophy {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly xpValue: number;
}

export interface CareerRank {
  readonly level: number;
  readonly title: string;
  readonly minXp: number;
  readonly maxXp: number;
  readonly badgeColor: string;
  readonly description: string;
}

export interface PlayerProfile {
  readonly name: string;
  readonly avatarId: string;
  readonly xp: number;
  readonly unlockedTrophyIds: readonly string[];
  readonly gamesPlayedCount: number;
  readonly createdAt: number;
}
