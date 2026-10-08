import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlayerProfile, PlayerAvatar, Trophy } from '../../types/profile';
import { GameStats } from '../../types/card';
import { AppModal } from '../common/AppModal';
import { AppBadge } from '../common/AppBadge';
import { PillButton } from '../common/PillButton';
import { theme } from '../../theme/tokens';
import { triggerHaptic } from '../../services/audio';
import {
  AVAILABLE_AVATARS,
  ALL_TROPHIES,
  getRankProgress,
  savePlayerProfile,
} from '../../services/profileStorage';

interface ProfileModalProps {
  visible: boolean;
  profile: PlayerProfile;
  stats: GameStats;
  onClose: () => void;
  onUpdateProfile: (newProfile: PlayerProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  profile,
  stats,
  onClose,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId);
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeTab, setActiveTab] = useState<'profilo' | 'trofei' | 'statistiche'>('profilo');

  const currentAvatar =
    AVAILABLE_AVATARS.find((a) => a.id === selectedAvatarId) ?? AVAILABLE_AVATARS[0];

  const { percent, current: currentRank, next: nextRank } = getRankProgress(profile.xp);

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const handleSaveAvatar = (avatarId: string) => {
    triggerHaptic('light');
    setSelectedAvatarId(avatarId);
    const updated: PlayerProfile = {
      ...profile,
      avatarId,
    };
    onUpdateProfile(updated);
    savePlayerProfile(updated);
  };

  const handleSaveName = () => {
    const trimmed = name.trim() || 'Giocatore Ligure';
    setName(trimmed);
    setIsEditingName(false);
    const updated: PlayerProfile = {
      ...profile,
      name: trimmed,
      avatarId: selectedAvatarId,
    };
    onUpdateProfile(updated);
    savePlayerProfile(updated);
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Profilo & Carriera"
      subtitle="Personalizza il tuo giocatore e consulta i traguardi"
      icon="person-outline"
      iconColor={theme.colors.primaryLight}
      maxWidth={520}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Navigation Tabs */}
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'profilo' && styles.tabBtnActive]}
            onPress={() => setActiveTab('profilo')}
          >
            <Ionicons
              name="person-outline"
              size={15}
              color={activeTab === 'profilo' ? theme.colors.primaryLight : theme.colors.textSecondary}
            />
            <Text style={[styles.tabBtnText, activeTab === 'profilo' && styles.tabBtnTextActive]}>
              Identità
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'trofei' && styles.tabBtnActive]}
            onPress={() => setActiveTab('trofei')}
          >
            <Ionicons
              name="trophy-outline"
              size={15}
              color={activeTab === 'trofei' ? theme.colors.accentGoldLight : theme.colors.textSecondary}
            />
            <Text style={[styles.tabBtnText, activeTab === 'trofei' && styles.tabBtnTextActive]}>
              Trofei ({profile.unlockedTrophyIds.length}/{ALL_TROPHIES.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, activeTab === 'statistiche' && styles.tabBtnActive]}
            onPress={() => setActiveTab('statistiche')}
          >
            <Ionicons
              name="stats-chart-outline"
              size={15}
              color={activeTab === 'statistiche' ? '#10b981' : theme.colors.textSecondary}
            />
            <Text style={[styles.tabBtnText, activeTab === 'statistiche' && styles.tabBtnTextActive]}>
              Record
            </Text>
          </Pressable>
        </View>

        {activeTab === 'profilo' && (
          <>
            {/* Identity Card */}
            <View style={styles.heroCard}>
              <View style={[styles.avatarCircle, { backgroundColor: `${currentAvatar.color}22` }]}>
                <Ionicons name={currentAvatar.icon as any} size={44} color={currentAvatar.color} />
              </View>

              <View style={styles.heroInfo}>
                {isEditingName ? (
                  <View style={styles.nameEditRow}>
                    <TextInput
                      style={styles.nameInput}
                      value={name}
                      onChangeText={setName}
                      maxLength={22}
                      autoFocus
                      placeholder="Nome giocatore"
                      placeholderTextColor={theme.colors.textMuted}
                    />
                    <Pressable style={styles.saveNameBtn} onPress={handleSaveName}>
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable style={styles.nameDisplayRow} onPress={() => setIsEditingName(true)}>
                    <Text style={styles.playerName}>{name}</Text>
                    <Ionicons name="pencil-sharp" size={14} color={theme.colors.textSecondary} />
                  </Pressable>
                )}

                <Text style={styles.avatarRole}>{currentAvatar.role}</Text>

                <View style={styles.rankPillRow}>
                  <AppBadge
                    label={`Liv. ${currentRank.level} • ${currentRank.title}`}
                    variant="gold"
                    size="sm"
                    icon="shield-checkmark-outline"
                  />
                  <Text style={styles.xpText}>{profile.xp} XP</Text>
                </View>
              </View>
            </View>

            {/* Rank Progress Bar */}
            <View style={styles.rankProgressCard}>
              <View style={styles.rankProgressHeader}>
                <Text style={styles.progressLabel}>Progresso di Carriera</Text>
                <Text style={styles.progressPercent}>
                  {nextRank ? `${percent}% verso ${nextRank.title}` : 'Grado Massimo Raggiunto'}
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
              </View>
              <Text style={styles.rankLore}>{currentRank.description}</Text>
            </View>

            {/* Avatar Selector Grid */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.sectionTitle}>Scegli il tuo Personaggio Ligure</Text>
              </View>

              <View style={styles.avatarsGrid}>
                {AVAILABLE_AVATARS.map((avatar) => {
                  const isSelected = avatar.id === selectedAvatarId;
                  return (
                    <Pressable
                      key={avatar.id}
                      style={[
                        styles.avatarCard,
                        isSelected && styles.avatarCardSelected,
                        { borderColor: isSelected ? avatar.color : 'rgba(255, 255, 255, 0.08)' },
                      ]}
                      onPress={() => handleSaveAvatar(avatar.id)}
                    >
                      <View style={[styles.avatarCardIcon, { backgroundColor: `${avatar.color}18` }]}>
                        <Ionicons name={avatar.icon as any} size={24} color={avatar.color} />
                      </View>
                      <Text style={[styles.avatarCardName, isSelected && { color: avatar.color }]}>
                        {avatar.name}
                      </Text>
                      <Text style={styles.avatarCardRole} numberOfLines={1}>
                        {avatar.role}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {activeTab === 'trofei' && (
          <View style={styles.trophiesList}>
            {ALL_TROPHIES.map((trophy) => {
              const isUnlocked = profile.unlockedTrophyIds.includes(trophy.id);
              return (
                <View
                  key={trophy.id}
                  style={[
                    styles.trophyCard,
                    isUnlocked ? styles.trophyCardUnlocked : styles.trophyCardLocked,
                  ]}
                >
                  <View
                    style={[
                      styles.trophyIconBox,
                      {
                        backgroundColor: isUnlocked
                          ? `${trophy.color}20`
                          : 'rgba(255, 255, 255, 0.03)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={trophy.icon as any}
                      size={24}
                      color={isUnlocked ? trophy.color : theme.colors.textMuted}
                    />
                  </View>

                  <View style={styles.trophyInfo}>
                    <View style={styles.trophyTopRow}>
                      <Text
                        style={[
                          styles.trophyTitle,
                          isUnlocked ? { color: theme.colors.textPrimary } : { color: theme.colors.textMuted },
                        ]}
                      >
                        {trophy.title}
                      </Text>
                      <AppBadge
                        label={`+${trophy.xpValue} XP`}
                        variant={isUnlocked ? 'gold' : 'default'}
                        size="sm"
                      />
                    </View>
                    <Text style={styles.trophyDesc}>{trophy.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'statistiche' && (
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxVal}>{stats.gamesPlayed}</Text>
                <Text style={styles.statBoxLabel}>Partite Giocate</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statBoxVal, { color: '#10b981' }]}>{stats.gamesWon}</Text>
                <Text style={styles.statBoxLabel}>Vittorie ({winRate}%)</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statBoxVal, { color: theme.colors.accentGoldLight }]}>
                  {stats.totalScope}
                </Text>
                <Text style={styles.statBoxLabel}>Scope Totali</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxVal}>{stats.bestScoreInGame}</Text>
                <Text style={styles.statBoxLabel}>Miglior Punteggio</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxVal}>{stats.piccoleMade}</Text>
                <Text style={styles.statBoxLabel}>Piccole Realizzate</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxVal}>{stats.grandiMade}</Text>
                <Text style={styles.statBoxLabel}>Grandi Realizzate</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.footerAction}>
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            onPress={onClose}
          >
            <Text style={styles.closeBtnText}>Chiudi</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.lg,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: theme.radii.md,
    padding: 3,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: theme.radii.sm,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabBtnTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  nameDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  nameInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  saveNameBtn: {
    backgroundColor: theme.colors.primary,
    padding: 6,
    borderRadius: theme.radii.sm,
  },
  avatarRole: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  rankPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accentGoldLight,
  },
  rankProgressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  rankProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  progressPercent: {
    fontSize: 11,
    color: theme.colors.accentGoldLight,
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.accentGoldLight,
    borderRadius: 4,
  },
  rankLore: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  sectionBlock: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarCard: {
    width: '31%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderRadius: theme.radii.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  avatarCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  avatarCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCardName: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  avatarCardRole: {
    fontSize: 9,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  trophiesList: {
    gap: theme.spacing.sm,
  },
  trophyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.md,
  },
  trophyCardUnlocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  trophyCardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderColor: 'rgba(255, 255, 255, 0.04)',
    opacity: 0.6,
  },
  trophyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyInfo: {
    flex: 1,
    gap: 2,
  },
  trophyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trophyTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  trophyDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    lineHeight: 15,
  },
  statsSection: {
    gap: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statBoxVal: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  statBoxLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  footerAction: {
    marginTop: theme.spacing.xs,
  },
  closeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.radii.full,
    paddingVertical: 12,
  },
  closeBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
});
