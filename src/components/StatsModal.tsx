import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameStats } from '../types/card';
import { AppModal } from './common/AppModal';
import { theme } from '../theme/tokens';

interface StatsModalProps {
  visible: boolean;
  stats: GameStats;
  onClose: () => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  visible,
  stats,
  onClose,
  onResetStats,
}) => {
  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const renderStatCard = (
    title: string,
    value: string | number,
    icon: keyof typeof Ionicons.glyphMap,
    color: string
  ) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconBadge, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </View>
  );

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Statistiche"
      subtitle="Rendimento di gioco e combinazioni realizzate"
      icon="stats-chart-outline"
      iconColor={theme.colors.primaryLight}
      maxWidth={460}
      contentContainerStyle={styles.content}
    >
      {/* Win Rate Summary */}
      <View style={styles.winRateBanner}>
        <View style={styles.winRateCol}>
          <Text style={styles.winRateNum}>{winRate}%</Text>
          <Text style={styles.winRateSub}>Vittorie</Text>
        </View>
        <View style={styles.winRecordCol}>
          <Text style={styles.winRecordText}>
            Vinte: <Text style={styles.greenText}>{stats.gamesWon}</Text>  •  Perse: <Text style={styles.redText}>{stats.gamesLost}</Text>
          </Text>
          <Text style={styles.totalGamesText}>
            Partite giocate: {stats.gamesPlayed}
          </Text>
        </View>
      </View>

      {/* Grid of stats */}
      <View style={styles.grid}>
        {renderStatCard('Scope totali', stats.totalScope, 'sparkles-outline', theme.colors.accentGoldLight)}
        {renderStatCard('Miglior punteggio', stats.bestScoreInGame, 'trophy-outline', theme.colors.warning)}
        {renderStatCard('Piccole (Denari)', stats.piccoleMade, 'trending-up-outline', theme.colors.primaryLight)}
        {renderStatCard('Grandi (5 pt)', stats.grandiMade, 'diamond-outline', '#ec4899')}
        {renderStatCard('Cirulla (3 pt)', stats.accuseTreMade, 'hand-left-outline', '#a855f7')}
        {renderStatCard('Decino (10 pt)', stats.accuseDieciMade, 'ribbon-outline', theme.colors.success)}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.resetBtn,
          pressed && styles.resetBtnPressed,
        ]}
        hitSlop={theme.touch.hitSlop}
        onPress={onResetStats}
        accessibilityRole="button"
        accessibilityLabel="Azzera statistiche"
      >
        <Ionicons name="refresh-outline" size={16} color={theme.colors.danger} />
        <Text style={styles.resetBtnText}>Azzera statistiche</Text>
      </Pressable>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  winRateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  winRateCol: {
    paddingRight: theme.spacing.lg,
    borderRightWidth: 1,
    borderRightColor: theme.colors.cardBorder,
    alignItems: 'center',
  },
  winRateNum: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  winRateSub: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  winRecordCol: {
    paddingLeft: theme.spacing.lg,
    flex: 1,
  },
  winRecordText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  totalGamesText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  greenText: {
    color: theme.colors.success,
    fontWeight: '800',
  },
  redText: {
    color: theme.colors.danger,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    minHeight: 44,
  },
  resetBtnPressed: {
    opacity: 0.75,
  },
  resetBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: theme.colors.danger,
  },
});
