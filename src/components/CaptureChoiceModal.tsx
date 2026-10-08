import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CardView } from './CardView';
import { CaptureMove, DeckSkinId, DeckStyle } from '../types/card';
import { AppModal } from './common/AppModal';
import { AppBadge } from './common/AppBadge';
import { theme } from '../theme/tokens';

interface CaptureChoiceModalProps {
  visible: boolean;
  moves: CaptureMove[];
  deckStyle?: DeckStyle;
  deckSkinId?: DeckSkinId;
  onSelectMove: (move: CaptureMove) => void;
  onCancel: () => void;
}

export const CaptureChoiceModal: React.FC<CaptureChoiceModalProps> = ({
  visible,
  moves,
  deckStyle,
  deckSkinId,
  onSelectMove,
  onCancel,
}) => {
  if (!visible || moves.length === 0) return null;

  return (
    <AppModal
      visible={visible}
      onClose={onCancel}
      title="Scegli la Presa"
      subtitle="Hai più combinazioni possibili di presa con questa carta."
      icon="layers-outline"
      iconColor={theme.colors.primaryLight}
      maxWidth={440}
      contentContainerStyle={styles.content}
      footer={
        <Pressable
          style={({ pressed }) => [
            styles.cancelBtn,
            pressed && styles.cancelBtnPressed,
          ]}
          hitSlop={theme.touch.hitSlop}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Annulla selezione presa"
        >
          <Text style={styles.cancelBtnText}>Annulla selezione</Text>
        </Pressable>
      }
    >
      <View style={styles.movesList}>
        {moves.map((move, index) => {
          let reason = '';
          if (move.isAceSweep) reason = 'Asso pigliatutto (svuota tavolo)';
          else if (move.is15Sum) reason = `Regola del 15 (${move.cardPlayed.value} + ${15 - move.cardPlayed.value} = 15)`;
          else if (move.isDirectMatch) reason = `Presa d'uguale (${move.cardPlayed.name})`;
          else reason = `Presa per somma pari a ${move.cardPlayed.value}`;

          return (
            <Pressable
              key={`move-choice-${index}`}
              style={({ pressed }) => [
                styles.moveOption,
                move.isScopa && styles.moveOptionScopa,
                pressed && styles.moveOptionPressed,
              ]}
              hitSlop={theme.touch.hitSlop}
              onPress={() => onSelectMove(move)}
              accessibilityRole="button"
              accessibilityLabel={`Scegli presa: ${reason}`}
            >
              <View style={styles.moveHeader}>
                <Text style={styles.moveReason}>{reason}</Text>
                {move.isScopa && (
                  <AppBadge label="Scopa (+1 pt)" variant="gold" size="sm" icon="star" />
                )}
              </View>

              <View style={styles.cardsRow}>
                <Text style={styles.arrowIcon}>Prendi:</Text>
                {move.capturedCards.map((c, cIdx) => (
                  <CardView
                    key={`choice-card-${c.id}-${cIdx}`}
                    card={c}
                    deckStyle={deckStyle}
                    deckSkinId={deckSkinId}
                    width={46}
                    height={66}
                  />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
  },
  movesList: {
    gap: theme.spacing.md,
  },
  moveOption: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  moveOptionScopa: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(217, 119, 6, 0.06)',
  },
  moveOptionPressed: {
    opacity: 0.8,
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  moveReason: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowIcon: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginRight: 2,
  },
  cancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    minHeight: 40,
  },
  cancelBtnPressed: {
    opacity: 0.7,
  },
  cancelBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
