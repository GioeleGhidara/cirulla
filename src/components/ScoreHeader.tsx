import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../types/card';
import { isDenari } from '../engine/rules';
import { theme } from '../theme/tokens';
import { AppBadge } from './common/AppBadge';

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
  playerName?: string;
  playerAvatarIcon?: string;
  playerAvatarColor?: string;
  onGoHome?: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenDeckGallery?: () => void;
  onOpenDeckSkins?: () => void;
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
  playerName,
  playerAvatarIcon,
  playerAvatarColor,
  onGoHome,
  onOpenSettings,
  onOpenRules,
  onOpenStats,
  onOpenDeckGallery,
  onOpenDeckSkins,
}) => {
  const playerDenari = playerCaptured.filter(isDenari).length;
  const aiDenari = aiCaptured.filter(isDenari).length;

  return (
    <View style={styles.container}>
      {/* Top action row */}
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          {onGoHome && (
            <Pressable
              style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
              hitSlop={theme.touch.hitSlop}
              onPress={onGoHome}
              accessibilityRole="button"
              accessibilityLabel="Torna al menu principale"
            >
              <Ionicons name="home-outline" size={18} color={theme.colors.textPrimary} />
            </Pressable>
          )}
          <Text style={styles.appTitle}>CIRULLA</Text>
          <AppBadge
            label={`${targetScore} PT`}
            variant="gold"
            icon="flag-outline"
            size="sm"
          />
          <AppBadge
            label={aiDifficulty}
            variant="default"
            size="sm"
          />
        </View>

        <View style={styles.actionsGroup}>
          {onOpenDeckSkins && (
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                styles.actionBtnSkin,
                pressed && styles.actionBtnPressed,
              ]}
              hitSlop={theme.touch.hitSlop}
              onPress={onOpenDeckSkins}
              accessibilityRole="button"
              accessibilityLabel="Scegli skin del mazzo"
            >
              <Ionicons name="color-palette-outline" size={19} color={theme.colors.accentGoldLight} />
            </Pressable>
          )}

          {onOpenDeckGallery && (
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.actionBtnPressed,
              ]}
              hitSlop={theme.touch.hitSlop}
              onPress={onOpenDeckGallery}
              accessibilityRole="button"
              accessibilityLabel="Mostra tutti i layout delle carte"
            >
              <Ionicons name="images-outline" size={19} color={theme.colors.primaryLight} />
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            hitSlop={theme.touch.hitSlop}
            onPress={onOpenRules}
            accessibilityRole="button"
            accessibilityLabel="Regolamento di gioco"
          >
            <Ionicons name="book-outline" size={19} color={theme.colors.textPrimary} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            hitSlop={theme.touch.hitSlop}
            onPress={onOpenStats}
            accessibilityRole="button"
            accessibilityLabel="Statistiche di gioco"
          >
            <Ionicons name="stats-chart-outline" size={19} color={theme.colors.textPrimary} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            hitSlop={theme.touch.hitSlop}
            onPress={onOpenSettings}
            accessibilityRole="button"
            accessibilityLabel="Impostazioni"
          >
            <Ionicons name="settings-outline" size={19} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* Main Score Board */}
      <View style={styles.boardCard}>
        {/* Player Section */}
        <View style={styles.playerSection}>
          <View style={styles.nameRow}>
            <Ionicons
              name={(playerAvatarIcon as any) || 'person-circle-outline'}
              size={15}
              color={playerAvatarColor || theme.colors.primaryLight}
            />
            <Text style={styles.playerName} numberOfLines={1}>
              {playerName ? playerName.toUpperCase() : 'TU'}
            </Text>
          </View>
          <Text style={styles.mainScore}>{playerScore}</Text>
          <View style={styles.statsMiniRow}>
            <View style={styles.miniStatItem}>
              <Ionicons name="copy-outline" size={11} color={theme.colors.textSecondary} />
              <Text style={styles.statsMiniText}>{playerCaptured.length}</Text>
            </View>
            <View style={styles.miniStatItem}>
              <Ionicons name="diamond-outline" size={11} color={theme.colors.cardRed} />
              <Text style={styles.statsMiniText}>{playerDenari}</Text>
            </View>
            {playerScope > 0 && (
              <View style={styles.scopaMiniBadge}>
                <Text style={styles.scopaMiniText}>S {playerScope}</Text>
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
            <Ionicons name="hardware-chip-outline" size={15} color={theme.colors.danger} />
            <Text style={styles.playerName}>AVVERSARIO</Text>
          </View>
          <Text style={styles.mainScore}>{aiScore}</Text>
          <View style={styles.statsMiniRow}>
            {aiScope > 0 && (
              <View style={[styles.scopaMiniBadge, styles.scopaAIBadge]}>
                <Text style={[styles.scopaMiniText, styles.scopaAIText]}>S {aiScope}</Text>
              </View>
            )}
            <View style={styles.miniStatItem}>
              <Ionicons name="diamond-outline" size={11} color={theme.colors.cardRed} />
              <Text style={styles.statsMiniText}>{aiDenari}</Text>
            </View>
            <View style={styles.miniStatItem}>
              <Ionicons name="copy-outline" size={11} color={theme.colors.textSecondary} />
              <Text style={styles.statsMiniText}>{aiCaptured.length}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  appTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSkin: {
    borderColor: 'rgba(217, 119, 6, 0.4)',
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
  },
  actionBtnPressed: {
    opacity: 0.75,
  },
  boardCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
    elevation: 8,
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
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  mainScore: {
    color: theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
    marginTop: 2,
  },
  statsMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  miniStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statsMiniText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  scopaMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: theme.colors.accentGoldLight,
    borderRadius: theme.radii.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  scopaAIBadge: {
    backgroundColor: theme.colors.danger,
  },
  scopaMiniText: {
    color: '#0f172a',
    fontSize: 9.5,
    fontWeight: '900',
  },
  scopaAIText: {
    color: '#ffffff',
  },
  centerDivider: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  handBadge: {
    backgroundColor: 'rgba(2, 132, 199, 0.14)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    borderRadius: theme.radii.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  handText: {
    color: theme.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  deckCountText: {
    color: theme.colors.textMuted,
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 3,
  },
});
