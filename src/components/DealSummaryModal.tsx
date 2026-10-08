import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DealScores } from '../types/card';
import { AppModal } from './common/AppModal';
import { theme } from '../theme/tokens';

interface DealSummaryModalProps {
  visible: boolean;
  scores: DealScores | null;
  playerTotal: number;
  aiTotal: number;
  targetScore: number;
  onNextDeal: () => void;
}

export const DealSummaryModal: React.FC<DealSummaryModalProps> = ({
  visible,
  scores,
  playerTotal,
  aiTotal,
  targetScore,
  onNextDeal,
}) => {
  if (!visible || !scores) return null;

  const isMatchOver =
    playerTotal >= targetScore ||
    aiTotal >= targetScore ||
    Boolean(scores.isCappottoPlayer) ||
    Boolean(scores.isCappottoAI);

  const renderRow = (
    label: string,
    playerVal: string | number,
    aiVal: string | number,
    winner: 'player' | 'ai' | 'tie' | 'none'
  ) => {
    return (
      <View style={styles.scoreRow}>
        <View style={styles.cellSide}>
          <Text
            style={[
              styles.valText,
              winner === 'player' && styles.winText,
            ]}
          >
            {playerVal}
          </Text>
        </View>

        <View style={styles.cellCenter}>
          <Text style={styles.labelCategory}>{label}</Text>
        </View>

        <View style={[styles.cellSide, styles.cellRight]}>
          <Text
            style={[
              styles.valText,
              winner === 'ai' && styles.winText,
            ]}
          >
            {aiVal}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <AppModal
      visible={visible}
      onClose={onNextDeal}
      title="Riepilogo Smazzata"
      subtitle="Conteggio ufficiale dei punti del mazzo"
      icon="list-circle-outline"
      iconColor={theme.colors.accentGoldLight}
      maxWidth={480}
      contentContainerStyle={styles.content}
      footer={
        <Pressable
          style={({ pressed }) => [
            styles.continueBtn,
            pressed && styles.continueBtnPressed,
          ]}
          hitSlop={theme.touch.hitSlop}
          onPress={onNextDeal}
          accessibilityRole="button"
          accessibilityLabel={isMatchOver ? 'Vedi verdetto finale' : 'Continua partita'}
        >
          <Text style={styles.continueBtnText}>
            {isMatchOver ? 'Vedi Verdetto Finale' : 'Continua Partita'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </Pressable>
      }
    >
      {/* Player header */}
      <View style={styles.playersBar}>
        <Text style={styles.playerName}>TU</Text>
        <Text style={styles.playerName}>AVVERSARIO</Text>
      </View>

      <View style={styles.scoresList}>
        {renderRow('Carte (>20)', scores.cartePlayer, scores.carteAI, scores.cartePoint)}
        {renderRow('Denari (>5)', scores.denariPlayer, scores.denariAI, scores.denariPoint)}
        {renderRow(
          'Settebello',
          scores.settebelloPoint === 'player' ? '+1 pt' : '-',
          scores.settebelloPoint === 'ai' ? '+1 pt' : '-',
          scores.settebelloPoint
        )}
        {renderRow('Primiera', scores.primieraPlayer, scores.primieraAI, scores.primieraPoint)}

        {(scores.piccolaPlayerPoints > 0 || scores.piccolaAIPoints > 0) &&
          renderRow(
            'Piccola (Denari)',
            scores.piccolaPlayerPoints > 0 ? `+${scores.piccolaPlayerPoints} pt` : '-',
            scores.piccolaAIPoints > 0 ? `+${scores.piccolaAIPoints} pt` : '-',
            scores.piccolaPlayerPoints > scores.piccolaAIPoints ? 'player' : 'ai'
          )}

        {(scores.grandePlayerPoints > 0 || scores.grandeAIPoints > 0) &&
          renderRow(
            'Grande (Denari)',
            scores.grandePlayerPoints > 0 ? '+5 pt' : '-',
            scores.grandeAIPoints > 0 ? '+5 pt' : '-',
            scores.grandePlayerPoints > scores.grandeAIPoints ? 'player' : 'ai'
          )}

        {renderRow(
          'Scope',
          scores.scopePlayer > 0 ? `+${scores.scopePlayer}` : '0',
          scores.scopeAI > 0 ? `+${scores.scopeAI}` : '0',
          scores.scopePlayer > scores.scopeAI ? 'player' : scores.scopeAI > scores.scopePlayer ? 'ai' : 'tie'
        )}

        {renderRow(
          'Accuse di mano',
          scores.accusePlayerPoints > 0 ? `+${scores.accusePlayerPoints}` : '0',
          scores.accuseAIPoints > 0 ? `+${scores.accuseAIPoints}` : '0',
          scores.accusePlayerPoints > scores.accuseAIPoints ? 'player' : scores.accuseAIPoints > scores.accusePlayerPoints ? 'ai' : 'tie'
        )}
      </View>

      {/* Smazzata Total */}
      <View style={styles.dealTotalRow}>
        <Text style={styles.dealTotalVal}>+{scores.totalDealPlayer} pt</Text>
        <Text style={styles.dealTotalLabel}>Totale Smazzata</Text>
        <Text style={styles.dealTotalVal}>+{scores.totalDealAI} pt</Text>
      </View>

      {/* Overall Match Total */}
      <View style={styles.matchTotalBox}>
        <View style={styles.matchScoreItem}>
          <Text style={styles.matchScoreVal}>{playerTotal}</Text>
          <Text style={styles.matchScoreLabel}>Tu</Text>
        </View>
        <View style={styles.matchCenter}>
          <Text style={styles.matchScoreTitle}>Punteggio Partita</Text>
          <Text style={styles.targetInfo}>Traguardo: {targetScore} pt</Text>
        </View>
        <View style={styles.matchScoreItem}>
          <Text style={styles.matchScoreVal}>{aiTotal}</Text>
          <Text style={styles.matchScoreLabel}>Avversario</Text>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
  },
  playersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  playerName: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  scoresList: {
    gap: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  cellSide: {
    flex: 1,
    alignItems: 'flex-start',
  },
  cellRight: {
    alignItems: 'flex-end',
  },
  cellCenter: {
    flex: 2,
    alignItems: 'center',
  },
  valText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  winText: {
    color: theme.colors.accentGoldLight,
    fontWeight: '800',
  },
  labelCategory: {
    fontSize: 12.5,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  dealTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginTop: theme.spacing.xs,
  },
  dealTotalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.success,
  },
  dealTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  matchTotalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  matchScoreItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  matchScoreVal: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  matchScoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  matchCenter: {
    alignItems: 'center',
  },
  matchScoreTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  targetInfo: {
    fontSize: 11,
    color: theme.colors.primaryLight,
    marginTop: 2,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    minHeight: 44,
  },
  continueBtnPressed: {
    opacity: 0.85,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
