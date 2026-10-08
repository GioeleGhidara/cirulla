import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppModal } from './common/AppModal';
import { theme } from '../theme/tokens';

interface GameOverModalProps {
  visible: boolean;
  playerTotal: number;
  aiTotal: number;
  targetScore: number;
  onNewGame: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  playerTotal,
  aiTotal,
  targetScore,
  onNewGame,
}) => {
  if (!visible) return null;

  const playerWon = playerTotal >= targetScore && playerTotal > aiTotal;

  return (
    <AppModal
      visible={visible}
      onClose={onNewGame}
      title={playerWon ? 'Vittoria' : 'Partita Conclusa'}
      subtitle={
        playerWon
          ? 'Congratulazioni! Hai tagliato per primo il traguardo dei punti.'
          : "L'avversario ha raggiunto per primo l'obiettivo stabilito."
      }
      icon={playerWon ? 'trophy-outline' : 'flag-outline'}
      iconColor={playerWon ? theme.colors.accentGoldLight : theme.colors.textMuted}
      maxWidth={420}
      contentContainerStyle={styles.content}
      footer={
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            playerWon ? styles.winBtn : styles.loseBtn,
            pressed && styles.actionBtnPressed,
          ]}
          hitSlop={theme.touch.hitSlop}
          onPress={onNewGame}
          accessibilityRole="button"
          accessibilityLabel="Gioca un'altra partita"
        >
          <Ionicons name="reload" size={16} color="#ffffff" />
          <Text style={styles.actionBtnText}>Gioca un'altra partita</Text>
        </Pressable>
      }
    >
      {/* Result Hero Banner */}
      <View
        style={[
          styles.heroBanner,
          playerWon ? styles.winHero : styles.loseHero,
        ]}
      >
        <View style={styles.heroIconBox}>
          <Ionicons
            name={playerWon ? 'trophy' : 'shield-outline'}
            size={36}
            color={playerWon ? theme.colors.accentGoldLight : theme.colors.textSecondary}
          />
        </View>
        <Text style={[styles.heroTitle, playerWon ? styles.winTitle : styles.loseTitle]}>
          {playerWon ? 'HAI VINTO LA PARTITA' : 'VITTORIA AVVERSARIO'}
        </Text>
        <Text style={styles.heroSubtitle}>
          Traguardo partita: {targetScore} punti
        </Text>
      </View>

      {/* Score Comparison Box */}
      <View style={styles.scoreComparison}>
        <View style={styles.scoreCol}>
          <Text style={[styles.scoreVal, playerWon && styles.winScoreVal]}>{playerTotal}</Text>
          <Text style={styles.scoreLabel}>Tuo Punteggio</Text>
        </View>

        <View style={styles.vsDivider}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.scoreCol}>
          <Text style={[styles.scoreVal, !playerWon && styles.loseScoreVal]}>{aiTotal}</Text>
          <Text style={styles.scoreLabel}>Avversario</Text>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
  },
  heroBanner: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
  },
  winHero: {
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  loseHero: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderColor: theme.colors.cardBorder,
  },
  heroIconBox: {
    marginBottom: theme.spacing.sm,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  winTitle: {
    color: theme.colors.accentGoldLight,
  },
  loseTitle: {
    color: theme.colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  scoreComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreVal: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  winScoreVal: {
    color: theme.colors.accentGoldLight,
  },
  loseScoreVal: {
    color: theme.colors.danger,
  },
  scoreLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  vsDivider: {
    paddingHorizontal: theme.spacing.md,
  },
  vsText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textMuted,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    minHeight: 44,
  },
  winBtn: {
    backgroundColor: theme.colors.feltGreen,
  },
  loseBtn: {
    backgroundColor: theme.colors.primary,
  },
  actionBtnPressed: {
    opacity: 0.85,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
