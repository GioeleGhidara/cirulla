import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { DealScores } from '../types/card';

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

  const isMatchOver = playerTotal >= targetScore || aiTotal >= targetScore;

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
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.headerTitle}>Fine Smazzata</Text>
          <Text style={styles.headerSub}>Riepilogo Punti del Mazzo</Text>

          <View style={styles.playersBar}>
            <Text style={styles.playerName}>TU</Text>
            <Text style={styles.playerName}>AVVERSARIO</Text>
          </View>

          <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent}>
            {/* Carte */}
            {renderRow(
              'Carte (>20)',
              scores.cartePlayer,
              scores.carteAI,
              scores.cartePoint
            )}

            {/* Denari */}
            {renderRow(
              'Denari (>5)',
              scores.denariPlayer,
              scores.denariAI,
              scores.denariPoint
            )}

            {/* Settebello */}
            {renderRow(
              'Settebello (7♦)',
              scores.settebelloPoint === 'player' ? '+1 pt' : '-',
              scores.settebelloPoint === 'ai' ? '+1 pt' : '-',
              scores.settebelloPoint
            )}

            {/* Primiera */}
            {renderRow(
              'Primiera',
              scores.primieraPlayer,
              scores.primieraAI,
              scores.primieraPoint
            )}

            {/* Piccola */}
            {(scores.piccolaPlayerPoints > 0 || scores.piccolaAIPoints > 0) &&
              renderRow(
                'Piccola Denari',
                scores.piccolaPlayerPoints > 0 ? `+${scores.piccolaPlayerPoints} pt` : '-',
                scores.piccolaAIPoints > 0 ? `+${scores.piccolaAIPoints} pt` : '-',
                scores.piccolaPlayerPoints > scores.piccolaAIPoints ? 'player' : 'ai'
              )}

            {/* Grande */}
            {(scores.grandePlayerPoints > 0 || scores.grandeAIPoints > 0) &&
              renderRow(
                'Grande Denari',
                scores.grandePlayerPoints > 0 ? '+5 pt' : '-',
                scores.grandeAIPoints > 0 ? '+5 pt' : '-',
                scores.grandePlayerPoints > scores.grandeAIPoints ? 'player' : 'ai'
              )}

            {/* Scope */}
            {renderRow(
              'Scope',
              scores.scopePlayer > 0 ? `+${scores.scopePlayer}` : '0',
              scores.scopeAI > 0 ? `+${scores.scopeAI}` : '0',
              scores.scopePlayer > scores.scopeAI ? 'player' : scores.scopeAI > scores.scopePlayer ? 'ai' : 'tie'
            )}

            {/* Accuse */}
            {renderRow(
              'Accuse di Mano',
              scores.accusePlayerPoints > 0 ? `+${scores.accusePlayerPoints}` : '0',
              scores.accuseAIPoints > 0 ? `+${scores.accuseAIPoints}` : '0',
              scores.accusePlayerPoints > scores.accuseAIPoints ? 'player' : scores.accuseAIPoints > scores.accusePlayerPoints ? 'ai' : 'tie'
            )}

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
                <Text style={styles.matchScoreTitle}>PUNTEGGIO TOTALE</Text>
                <Text style={styles.targetInfo}>Traguardo: {targetScore} pt</Text>
              </View>
              <View style={styles.matchScoreItem}>
                <Text style={styles.matchScoreVal}>{aiTotal}</Text>
                <Text style={styles.matchScoreLabel}>Avversario</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8} onPress={onNextDeal}>
            <Text style={styles.continueBtnText}>
              {isMatchOver ? 'Vedi Verdetto Finale' : 'Continua Partita'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 22,
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  playersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginBottom: 8,
  },
  playerName: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scrollList: {
    maxHeight: 340,
  },
  scrollContent: {
    paddingVertical: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  cellSide: {
    width: 60,
    alignItems: 'center',
  },
  cellRight: {
    alignItems: 'center',
  },
  cellCenter: {
    flex: 1,
    alignItems: 'center',
  },
  labelCategory: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  valText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  winText: {
    color: '#22c55e',
    fontWeight: '900',
    fontSize: 14,
  },
  dealTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  dealTotalLabel: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
  },
  dealTotalVal: {
    color: '#38bdf8',
    fontSize: 15,
    fontWeight: '900',
  },
  matchTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: '#eab308',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  matchScoreItem: {
    alignItems: 'center',
    width: 70,
  },
  matchScoreVal: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '900',
  },
  matchScoreLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  matchCenter: {
    alignItems: 'center',
  },
  matchScoreTitle: {
    color: '#eab308',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  targetInfo: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  continueBtn: {
    marginTop: 14,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
