import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CardView } from './CardView';
import { CaptureMove, DeckStyle } from '../types/card';

interface CaptureChoiceModalProps {
  visible: boolean;
  moves: CaptureMove[];
  deckStyle?: DeckStyle;
  onSelectMove: (move: CaptureMove) => void;
  onCancel: () => void;
}

export const CaptureChoiceModal: React.FC<CaptureChoiceModalProps> = ({
  visible,
  moves,
  deckStyle,
  onSelectMove,
  onCancel,
}) => {
  if (!visible || moves.length === 0) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Scegli la Presa</Text>
          <Text style={styles.modalSub}>
            Hai più combinazioni possibili con questa carta:
          </Text>

          <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent}>
            {moves.map((move, index) => {
              let reason = '';
              if (move.isAceSweep) reason = 'Asso Pigliatutto (Tutto il tavolo)';
              else if (move.is15Sum) reason = `Regola del 15 (${move.cardPlayed.value} + ${15 - move.cardPlayed.value} = 15)`;
              else if (move.isDirectMatch) reason = `Presa d'uguale (${move.cardPlayed.name})`;
              else reason = `Presa per somma pari a ${move.cardPlayed.value}`;

              return (
                <TouchableOpacity
                  key={`move-choice-${index}`}
                  style={[
                    styles.moveOption,
                    move.isScopa && styles.moveOptionScopa,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onSelectMove(move)}
                >
                  <View style={styles.moveHeader}>
                    <Text style={styles.moveReason}>{reason}</Text>
                    {move.isScopa && (
                      <View style={styles.scopaBadge}>
                        <Text style={styles.scopaBadgeText}>★ SCOPA</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardsRow}>
                    <Text style={styles.arrowIcon}>Prendi:</Text>
                    {move.capturedCards.map((c, cIdx) => (
                      <CardView
                        key={`choice-card-${c.id}-${cIdx}`}
                        card={c}
                        deckStyle={deckStyle}
                        width={46}
                        height={66}
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Annulla selezione</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  modalSub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  scrollList: {
    maxHeight: 340,
  },
  scrollContent: {
    gap: 10,
  },
  moveOption: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#475569',
  },
  moveOptionScopa: {
    borderColor: '#eab308',
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moveReason: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  scopaBadge: {
    backgroundColor: '#eab308',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scopaBadgeText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '900',
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  arrowIcon: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  cancelBtn: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
});
