import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

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
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, playerWon ? styles.winBorder : styles.loseBorder]}>
          <Text style={styles.emojiBanner}>
            {playerWon ? '🏆 👑 🏆' : '💀 🥈 💀'}
          </Text>

          <Text style={[styles.title, playerWon ? styles.winTitle : styles.loseTitle]}>
            {playerWon ? 'HAI VINTO!' : 'HAI PERSO!'}
          </Text>

          <Text style={styles.subtitle}>
            {playerWon
              ? 'Congratulazioni, hai dominato la partita di Cirulla!'
              : "L'avversario ha raggiunto l'obiettivo per primo."}
          </Text>

          <View style={styles.finalScoreBox}>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreVal}>{playerTotal}</Text>
              <Text style={styles.scoreName}>Tu</Text>
            </View>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreVal}>{aiTotal}</Text>
              <Text style={styles.scoreName}>Avversario</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionBtn, playerWon ? styles.winBtn : styles.loseBtn]}
            activeOpacity={0.8}
            onPress={onNewGame}
          >
            <Text style={styles.actionBtnText}>Gioca un'altra Partita</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    width: '100%',
    maxWidth: 380,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
  },
  winBorder: {
    borderColor: '#eab308',
  },
  loseBorder: {
    borderColor: '#ef4444',
  },
  emojiBanner: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  winTitle: {
    color: '#facc15',
  },
  loseTitle: {
    color: '#f87171',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  finalScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  scoreCol: {
    alignItems: 'center',
    minWidth: 80,
  },
  scoreVal: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '900',
  },
  scoreName: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  vsText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '900',
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  winBtn: {
    backgroundColor: '#16a34a',
  },
  loseBtn: {
    backgroundColor: '#3b82f6',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
