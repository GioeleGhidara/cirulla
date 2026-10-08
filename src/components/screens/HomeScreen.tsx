import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlayerProfile } from '../../types/profile';
import { GameSettings, GameStats, PlayerSide } from '../../types/card';
import { AppBadge } from '../common/AppBadge';
import { PillButton } from '../common/PillButton';
import { theme } from '../../theme/tokens';
import { triggerHaptic } from '../../services/audio';
import { AVAILABLE_AVATARS, getCurrentRank } from '../../services/profileStorage';
import { ALL_DECK_SKINS } from '../../constants/deckSkins';

interface HomeScreenProps {
  hasActiveMatch: boolean;
  activeMatchInfo?: {
    playerScore: number;
    aiScore: number;
    targetScore: number;
    handIndex: number;
    dealer: PlayerSide;
  };
  playerProfile: PlayerProfile;
  settings: GameSettings;
  stats: GameStats;
  installedDeckCount: number;
  onResumeMatch: () => void;
  onOpenMatchSetup: () => void;
  onOpenProfile: () => void;
  onOpenDeckSkins: () => void;
  onOpenDeckGallery: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  hasActiveMatch,
  activeMatchInfo,
  playerProfile,
  settings,
  stats,
  installedDeckCount,
  onResumeMatch,
  onOpenMatchSetup,
  onOpenProfile,
  onOpenDeckSkins,
  onOpenDeckGallery,
  onOpenRules,
  onOpenStats,
  onOpenSettings,
}) => {
  const avatar =
    AVAILABLE_AVATARS.find((a) => a.id === playerProfile.avatarId) ?? AVAILABLE_AVATARS[0];
  const rank = getCurrentRank(playerProfile.xp);
  const selectedSkin = ALL_DECK_SKINS.find(
    (s) => s.id === (settings.deckSkinId ?? 'genovesi_dal_negro')
  );

  return (
    <View style={styles.screen}>
      {/* Top App Header with Profile Preview & Quick Settings */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.profilePill, pressed && styles.profilePillPressed]}
          onPress={() => {
            triggerHaptic('light');
            onOpenProfile();
          }}
          accessibilityRole="button"
          accessibilityLabel="Apri profilo giocatore"
        >
          <View style={[styles.avatarMiniBox, { backgroundColor: `${avatar.color}25` }]}>
            <Ionicons name={avatar.icon as any} size={20} color={avatar.color} />
          </View>
          <View style={styles.profileTextCol}>
            <Text style={styles.profileName} numberOfLines={1}>
              {playerProfile.name}
            </Text>
            <View style={styles.profileRankRow}>
              <Text style={styles.profileRankText}>Liv. {rank.level}</Text>
              <Text style={styles.profileDot}>•</Text>
              <Text style={styles.profileTitleText} numberOfLines={1}>
                {rank.title}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={14} color={theme.colors.textMuted} />
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [styles.iconActionBtn, pressed && styles.btnPressed]}
            onPress={() => {
              triggerHaptic('light');
              onOpenDeckSkins();
            }}
            accessibilityRole="button"
            accessibilityLabel="Mazzi e skin"
          >
            <Ionicons name="color-palette-outline" size={20} color={theme.colors.accentGoldLight} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.iconActionBtn, pressed && styles.btnPressed]}
            onPress={() => {
              triggerHaptic('light');
              onOpenRules();
            }}
            accessibilityRole="button"
            accessibilityLabel="Regolamento"
          >
            <Ionicons name="book-outline" size={20} color={theme.colors.textSecondary} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.iconActionBtn, pressed && styles.btnPressed]}
            onPress={() => {
              triggerHaptic('light');
              onOpenSettings();
            }}
            accessibilityRole="button"
            accessibilityLabel="Impostazioni"
          >
            <Ionicons name="settings-outline" size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Brand Banner */}
        <View style={styles.brandHero}>
          <View style={styles.brandTagline}>
            <Ionicons name="heart" size={13} color="#ef4444" />
            <Text style={styles.taglineText}>CIRULLA DELLA TRADIZIONE LIGURE</Text>
          </View>
          <Text style={styles.heroTitle}>CIRULLA</Text>
          <Text style={styles.heroSubtitle}>
            Il gioco di carte più amato della Riviera e dei Caruggi di Genova
          </Text>
        </View>

        {/* Active Match or Quick Play Card */}
        {hasActiveMatch && activeMatchInfo ? (
          <View style={styles.activeMatchCard}>
            <View style={styles.activeMatchHeader}>
              <View style={styles.activeBadgeGroup}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeBadgeText}>Partita in Corso</Text>
              </View>
              <AppBadge
                label={`Smazzata ${activeMatchInfo.handIndex}/6`}
                variant="gold"
                size="sm"
              />
            </View>

            <View style={styles.matchScoreRow}>
              <View style={styles.scoreCol}>
                <Text style={styles.scoreLabel}>TU</Text>
                <Text style={styles.scoreNumber}>{activeMatchInfo.playerScore}</Text>
              </View>
              <View style={styles.scoreVsCol}>
                <Text style={styles.scoreVs}>VS</Text>
                <Text style={styles.targetLabel}>Traguardo {activeMatchInfo.targetScore} pt</Text>
              </View>
              <View style={styles.scoreCol}>
                <Text style={styles.scoreLabel}>AVVERSARIO</Text>
                <Text style={styles.scoreNumber}>{activeMatchInfo.aiScore}</Text>
              </View>
            </View>

            <View style={styles.activeMatchButtons}>
              <Pressable
                style={({ pressed }) => [styles.primaryCtaBtn, pressed && styles.btnPressed]}
                onPress={() => {
                  triggerHaptic('medium');
                  onResumeMatch();
                }}
              >
                <Ionicons name="play" size={18} color="#090e17" />
                <Text style={styles.primaryCtaText}>Riprendi Partita</Text>
              </Pressable>

              <Pressable
                style={styles.newMatchSecondaryBtn}
                onPress={() => {
                  triggerHaptic('light');
                  onOpenMatchSetup();
                }}
              >
                <Text style={styles.newMatchSecondaryText}>Nuova Partita</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.heroActionCard}>
            <View style={styles.heroActionInfo}>
              <Text style={styles.heroActionTitle}>Pronto per una Smazzata?</Text>
              <Text style={styles.heroActionDesc}>
                Scegli il traguardo (51 o 31 pt), la difficoltà dell'IA e siediti al tavolo da gioco.
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.primaryCtaBtn, pressed && styles.btnPressed]}
              onPress={() => {
                triggerHaptic('medium');
                onOpenMatchSetup();
              }}
            >
              <Ionicons name="play" size={18} color="#090e17" />
              <Text style={styles.primaryCtaText}>Gioca Subito</Text>
            </Pressable>
          </View>
        )}

        {/* Game Modes Selection Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="game-controller-outline" size={18} color={theme.colors.accentGoldLight} />
          <Text style={styles.sectionTitle}>Scegli la Modalità</Text>
        </View>

        <View style={styles.modesContainer}>
          {/* Mode 1: Singolo contro IA */}
          <Pressable
            style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
            onPress={() => {
              triggerHaptic('medium');
              onOpenMatchSetup();
            }}
          >
            <View style={[styles.modeIconCircle, { backgroundColor: 'rgba(2, 132, 199, 0.15)' }]}>
              <Ionicons name="hardware-chip-outline" size={26} color={theme.colors.primaryLight} />
            </View>
            <View style={styles.modeTextCol}>
              <View style={styles.modeTitleRow}>
                <Text style={styles.modeTitle}>Partita Singola</Text>
                <AppBadge label="Contro IA" variant="primary" size="sm" />
              </View>
              <Text style={styles.modeDesc}>
                Sfida l'intelligenza artificiale genovese: Principiante, Esperto o Campione.
              </Text>
              <View style={styles.modeTagsRow}>
                <Text style={styles.modeTag}>51 o 31 Punti</Text>
                <Text style={styles.modeTagDot}>•</Text>
                <Text style={styles.modeTag}>3 Livelli Tattici</Text>
                <Text style={styles.modeTagDot}>•</Text>
                <Text style={styles.modeTag}>Salvataggio Auto</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </Pressable>

          {/* Mode 2: Passa e Gioca (2G Locale) */}
          <Pressable
            style={({ pressed }) => [styles.modeCard, pressed && styles.cardPressed]}
            onPress={() => {
              triggerHaptic('light');
              onOpenMatchSetup();
            }}
          >
            <View style={[styles.modeIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="people-outline" size={26} color="#10b981" />
            </View>
            <View style={styles.modeTextCol}>
              <View style={styles.modeTitleRow}>
                <Text style={styles.modeTitle}>Passa e Gioca</Text>
                <AppBadge label="2 Giocatori" variant="success" size="sm" />
              </View>
              <Text style={styles.modeDesc}>
                Sfida un amico sullo stesso schermo alternando le smazzate a turno.
              </Text>
              <View style={styles.modeTagsRow}>
                <Text style={styles.modeTag}>Stesso Schermo</Text>
                <Text style={styles.modeTagDot}>•</Text>
                <Text style={styles.modeTag}>Senza Connessione</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </Pressable>

          {/* Mode 3: Multigiocatore Online (Coming Soon) */}
          <View style={[styles.modeCard, styles.modeCardDisabled]}>
            <View style={[styles.modeIconCircle, { backgroundColor: 'rgba(148, 163, 184, 0.1)' }]}>
              <Ionicons name="globe-outline" size={26} color={theme.colors.textMuted} />
            </View>
            <View style={styles.modeTextCol}>
              <View style={styles.modeTitleRow}>
                <Text style={[styles.modeTitle, { color: theme.colors.textMuted }]}>
                  Multigiocatore Online
                </Text>
                <AppBadge label="In Arrivo" variant="default" size="sm" />
              </View>
              <Text style={styles.modeDesc}>
                Stanze private tra amici e partite classificate con giocatori da tutta Italia.
              </Text>
            </View>
          </View>
        </View>

        {/* Hub Grid Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="apps-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.sectionTitle}>Sezioni dell'App</Text>
        </View>

        <View style={styles.hubGrid}>
          {/* Tile 1: Mazzi e Skin */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.cardPressed]}
            onPress={() => {
              triggerHaptic('light');
              onOpenDeckSkins();
            }}
          >
            <View style={[styles.hubIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="color-palette-outline" size={24} color={theme.colors.accentGoldLight} />
            </View>
            <Text style={styles.hubCardTitle}>Mazzi & Skin</Text>
            <Text style={styles.hubCardSub}>
              {selectedSkin?.name ?? 'Genovesi Dal Negro'} ({installedDeckCount} pronti)
            </Text>
            <View style={styles.hubCardFooter}>
              <Text style={styles.hubCardAction}>Gestisci e Scarica</Text>
              <Ionicons name="arrow-forward" size={12} color={theme.colors.accentGoldLight} />
            </View>
          </Pressable>

          {/* Tile 2: Profilo e Trofei */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.cardPressed]}
            onPress={() => {
              triggerHaptic('light');
              onOpenProfile();
            }}
          >
            <View style={[styles.hubIconBox, { backgroundColor: `${avatar.color}20` }]}>
              <Ionicons name={avatar.icon as any} size={24} color={avatar.color} />
            </View>
            <Text style={styles.hubCardTitle}>Profilo & Carriera</Text>
            <Text style={styles.hubCardSub}>
              {rank.title} • {playerProfile.unlockedTrophyIds.length} Trofei
            </Text>
            <View style={styles.hubCardFooter}>
              <Text style={[styles.hubCardAction, { color: avatar.color }]}>Personalizza</Text>
              <Ionicons name="arrow-forward" size={12} color={avatar.color} />
            </View>
          </Pressable>

          {/* Tile 3: Statistiche e Record */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.cardPressed]}
            onPress={() => {
              triggerHaptic('light');
              onOpenStats();
            }}
          >
            <View style={[styles.hubIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="stats-chart-outline" size={24} color="#10b981" />
            </View>
            <Text style={styles.hubCardTitle}>Statistiche</Text>
            <Text style={styles.hubCardSub}>
              {stats.gamesWon} Vinte • {stats.totalScope} Scope fatte
            </Text>
            <View style={styles.hubCardFooter}>
              <Text style={[styles.hubCardAction, { color: '#10b981' }]}>Vedi Storico</Text>
              <Ionicons name="arrow-forward" size={12} color="#10b981" />
            </View>
          </Pressable>

          {/* Tile 4: Regolamento e Guida */}
          <Pressable
            style={({ pressed }) => [styles.hubCard, pressed && styles.cardPressed]}
            onPress={() => {
              triggerHaptic('light');
              onOpenRules();
            }}
          >
            <View style={[styles.hubIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Ionicons name="book-outline" size={24} color={theme.colors.primaryLight} />
            </View>
            <Text style={styles.hubCardTitle}>Regole Ufficiali</Text>
            <Text style={styles.hubCardSub}>Matta (7♥), Prese a 15, Accusa da 3 e 10</Text>
            <View style={styles.hubCardFooter}>
              <Text style={[styles.hubCardAction, { color: theme.colors.primaryLight }]}>
                Leggi Guida
              </Text>
              <Ionicons name="arrow-forward" size={12} color={theme.colors.primaryLight} />
            </View>
          </Pressable>
        </View>

        {/* Culture Footer */}
        <View style={styles.cultureFooter}>
          <Text style={styles.cultureText}>
            «A Çirulla a l'è o zêugo ciù bello do mondo» — Tradizione Genovese
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090e17',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.full,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  profilePillPressed: {
    opacity: 0.8,
  },
  avatarMiniBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTextCol: {
    gap: 1,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  profileRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileRankText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.accentGoldLight,
  },
  profileDot: {
    fontSize: 9,
    color: theme.colors.textMuted,
  },
  profileTitleText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    maxWidth: 90,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.7,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
    paddingBottom: 40,
  },
  brandHero: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.spacing.sm,
  },
  brandTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.radii.full,
    marginBottom: 4,
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#f87171',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#f8fafc',
  },
  heroSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 340,
  },
  activeMatchCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  activeMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  matchScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.xs,
  },
  scoreCol: {
    alignItems: 'center',
    gap: 2,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8fafc',
  },
  scoreVsCol: {
    alignItems: 'center',
    gap: 2,
  },
  scoreVs: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.accentGoldLight,
  },
  targetLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  activeMatchButtons: {
    gap: theme.spacing.sm,
  },
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.accentGold,
    borderRadius: theme.radii.full,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#090e17',
    letterSpacing: 0.3,
  },
  newMatchSecondaryBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  newMatchSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  heroActionCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  heroActionInfo: {
    gap: 4,
  },
  heroActionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  heroActionDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.3,
  },
  modesContainer: {
    gap: theme.spacing.md,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modeCardDisabled: {
    opacity: 0.55,
  },
  modeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTextCol: {
    flex: 1,
    gap: 3,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
  },
  modeDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  modeTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  modeTag: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.accentGoldLight,
  },
  modeTagDot: {
    fontSize: 8,
    color: theme.colors.textMuted,
  },
  hubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hubCard: {
    width: '48%',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: 6,
  },
  hubIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f8fafc',
  },
  hubCardSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    lineHeight: 14,
  },
  hubCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  hubCardAction: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.accentGoldLight,
  },
  cultureFooter: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  cultureText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
