import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameStats } from '../types/card';

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
  if (!visible) return null;

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconBadge, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerTitleGroup}>
              <Ionicons name="trophy" size={22} color="#facc15" />
              <Text style={styles.headerTitle}>Statistiche Carriera</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent}>
            {/* Main Win Rate Banner */}
            <View style={styles.winRateBanner}>
              <View>
                <Text style={styles.winRateNum}>{winRate}%</Text>
                <Text style={styles.winRateSub}>Percentuale Vittorie</Text>
              </View>
              <View style={styles.winRecordRow}>
                <Text style={styles.winRecordText}>
                  Vinte: <Text style={styles.greenText}>{stats.gamesWon}</Text>  |  Perse: <Text style={styles.redText}>{stats.gamesLost}</Text>
                </Text>
                <Text style={styles.totalGamesText}>
                  Partite Giocate: {stats.gamesPlayed}
                </Text>
              </View>
            </View>

            {/* Grid of stats */}
            <View style={styles.grid}>
              {renderStatCard('Scope Totali', stats.totalScope, 'star', '#facc15')}
              {renderStatCard('Miglior Punteggio', stats.bestScoreInGame, 'flame', '#f97316')}
              {renderStatCard('Piccole Fatte', stats.piccoleMade, 'trending-up', '#38bdf8')}
              {renderStatCard('Grandi (5 pt)', stats.grandiMade, 'diamond', '#ec4899')}
              {renderStatCard('Buona da 3', stats.accuseTreMade, 'sparkles', '#a855f7')}
              {renderStatCard('Buona da 10', stats.accuseDieciMade, 'ribbon', '#10b981')}
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={onResetStats}>
              <Text style={styles.resetBtnText}>Azzera Statistiche</Text>
            </TouchableOpacity>
          </ScrollView>
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
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  closeBtn: {
    padding: 4,
  },
  scrollList: {
    maxHeight: 460,
  },
  scrollContent: {
    gap: 14,
  },
  winRateBanner: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  winRateNum: {
    color: '#facc15',
    fontSize: 32,
    fontWeight: '900',
  },
  winRateSub: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  winRecordRow: {
    alignItems: 'flex-end',
  },
  winRecordText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  greenText: {
    color: '#22c55e',
    fontWeight: '900',
  },
  redText: {
    color: '#ef4444',
    fontWeight: '900',
  },
  totalGamesText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  resetBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  resetBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
