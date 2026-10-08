import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../types/card';
import { isDenari } from '../engine/rules';

interface ScoreHeaderProps {
  playerScore: number;
  aiScore: number;
  targetScore: number;
  deckCount: number;
  playerCaptured: Card[];
  aiCaptured: Card[];
  playerScope: number;
  aiScope: number;
  currentHandIndex: number; // 1 to 6
  aiDifficulty: string;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenDeckGallery?: () => void;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  playerScore,
  aiScore,
  targetScore,
  deckCount,
  playerCaptured,
  aiCaptured,
  playerScope,
  aiScope,
  currentHandIndex,
  aiDifficulty,
  onOpenSettings,
  onOpenRules,
  onOpenStats,
  onOpenDeckGallery,
}) => {
  const playerDenari = playerCaptured.filter(isDenari).length;
  const aiDenari = aiCaptured.filter(isDenari).length;

  return (
    <View style={styles.container}>
      {/* Top action row */}
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.appTitle}>CIRULLA</Text>
          <View style={styles.targetBadge}>
            <Text style={styles.targetText}>🎯 {targetScore} pt</Text>
          </View>
          <View style={styles.diffBadge}>
            <Text style={styles.diffText}>{aiDifficulty.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.actionsGroup}>
          {onOpenDeckGallery && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onOpenDeckGallery}
              accessibilityLabel="Layout Carte"
            >
              <Ionicons name="images-outline" size={20} color="#38bdf8" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenRules}
            accessibilityLabel="Regole"
          >
            <Ionicons name="book-outline" size={20} color="#f8fafc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenStats}
            accessibilityLabel="Statistiche"
          >
            <Ionicons name="trophy-outline" size={20} color="#facc15" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenSettings}
            accessibilityLabel="Impostazioni"
          >
            <Ionicons name="settings-outline" size={20} color="#f8fafc" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Score Board */}
      <View style={styles.boardCard}>
        {/* Player Section */}
        <View style={styles.playerSection}>
          <View style={styles.nameRow}>
            <Ionicons name="person-circle" size={18} color="#60a5fa" />
            <Text style={styles.playerName}>TU</Text>
          </View>
          <Text style={styles.mainScore}>{playerScore}</Text>
          <View style={styles.statsMiniRow}>
            <Text style={styles.statsMiniText}>
              🎴 {playerCaptured.length}  ♦ {playerDenari}
            </Text>
            {playerScope > 0 && (
              <View style={styles.scopaMiniBadge}>
                <Text style={styles.scopaMiniText}>⭐ {playerScope}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Center Round Info */}
        <View style={styles.centerDivider}>
          <View style={styles.handBadge}>
            <Text style={styles.handText}>MANO {currentHandIndex}/6</Text>
          </View>
          <Text style={styles.deckCountText}>
            {deckCount > 0 ? `${deckCount} nel mazzo` : 'Ultima mano'}
          </Text>
        </View>

        {/* AI Section */}
        <View style={[styles.playerSection, styles.aiSection]}>
          <View style={styles.nameRow}>
            <Ionicons name="hardware-chip-outline" size={16} color="#f87171" />
            <Text style={styles.playerName}>AVVERSARIO</Text>
          </View>
          <Text style={styles.mainScore}>{aiScore}</Text>
          <View style={styles.statsMiniRow}>
            <Text style={styles.statsMiniText}>
              🎴 {aiCaptured.length}  ♦ {aiDenari}
            </Text>
            {aiScope > 0 && (
              <View style={[styles.scopaMiniBadge, styles.scopaAIBadge]}>
                <Text style={styles.scopaMiniText}>⭐ {aiScope}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  targetBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.5)',
  },
  targetText: {
    color: '#fef08a',
    fontSize: 11,
    fontWeight: '700',
  },
  diffBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  diffText: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  playerSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  aiSection: {
    alignItems: 'flex-end',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerName: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mainScore: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
  },
  statsMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statsMiniText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
  },
  scopaMiniBadge: {
    backgroundColor: '#eab308',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  scopaAIBadge: {
    backgroundColor: '#f97316',
  },
  scopaMiniText: {
    color: '#0f172a',
    fontSize: 9,
    fontWeight: '900',
  },
  centerDivider: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  handBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  handText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
  },
  deckCountText: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 3,
  },
});
