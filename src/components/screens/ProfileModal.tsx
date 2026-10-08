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
import { PlayerProfile } from '../../types/profile';
import { GameStats } from '../../types/card';
import { AppModal } from '../common/AppModal';
import { AppBadge } from '../common/AppBadge';
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

const PRESET_NICKNAMES = ['Gioele', 'Zena', 'Lupo', 'Capitano', 'Doge', 'Mugugno'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  profile,
  stats,
  onClose,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId);
  const [activeTab, setActiveTab] = useState<'profilo' | 'trofei' | 'statistiche'>('profilo');

  const currentAvatar =
    AVAILABLE_AVATARS.find((a) => a.id === selectedAvatarId) ?? AVAILABLE_AVATARS[0];

  const { percent, current: currentRank, next: nextRank } = getRankProgress(profile.xp);

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const handleUpdateName = (newName: string) => {
    setName(newName);
    const trimmed = newName.trim();
    if (trimmed.length > 0) {
      const updated: PlayerProfile = {
        ...profile,
        name: trimmed,
        avatarId: selectedAvatarId,
      };
      onUpdateProfile(updated);
      savePlayerProfile(updated);
    }
  };

  const handleSelectPreset = (preset: string) => {
    triggerHaptic('light');
    setName(preset);
    const updated: PlayerProfile = {
      ...profile,
      name: preset,
      avatarId: selectedAvatarId,
    };
    onUpdateProfile(updated);
    savePlayerProfile(updated);
  };

  const handleSelectAvatar = (avatarId: string) => {
    triggerHaptic('light');
    setSelectedAvatarId(avatarId);
    const updated: PlayerProfile = {
      ...profile,
      name: name.trim() || profile.name,
      avatarId,
    };
    onUpdateProfile(updated);
    savePlayerProfile(updated);
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Profilo & Carriera"
      subtitle="Scegli il tuo nickname, avatar e consulta i traguardi"
      icon="person-outline"
      iconColor={theme.colors.primaryLight}
      maxWidth={540}
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
              Identità & Avatar
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
              Statistiche
            </Text>
          </Pressable>
        </View>

        {activeTab === 'profilo' && (
          <>
            {/* 1. SEZIONE NICKNAME */}
            <View style={styles.cardSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="create-outline" size={16} color={theme.colors.accentGoldLight} />
                <Text style={styles.sectionHeaderTitle}>NICKNAME GIOCATORE</Text>
                <Text style={styles.charCountText}>{name.length}/18</Text>
              </View>

              <View style={styles.nicknameInputRow}>
                <View style={[styles.inputPrefixIcon, { backgroundColor: `${currentAvatar.color}20` }]}>
                  <Ionicons name={currentAvatar.icon as any} size={18} color={currentAvatar.color} />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={handleUpdateName}
                  maxLength={18}
                  placeholder="Inserisci il tuo nome..."
                  placeholderTextColor="#64748b"
                  autoCorrect={false}
                  returnKeyType="done"
                />
                {name.length > 0 && (
                  <Pressable
                    style={styles.inputClearBtn}
                    onPress={() => handleUpdateName('')}
                    hitSlop={8}
                  >
                    <Ionicons name="close-circle" size={16} color="#64748b" />
                  </Pressable>
                )}
              </View>

              {/* Suggerimenti Nickname */}
              <View style={styles.presetsContainer}>
                <Text style={styles.presetsLabel}>Suggeriti:</Text>
                <View style={styles.presetsList}>
                  {PRESET_NICKNAMES.map((preset) => {
                    const isCurrent = name.trim().toLowerCase() === preset.toLowerCase();
                    return (
                      <Pressable
                        key={preset}
                        style={[styles.presetChip, isCurrent && styles.presetChipActive]}
                        onPress={() => handleSelectPreset(preset)}
                      >
                        <Text style={[styles.presetChipText, isCurrent && styles.presetChipTextActive]}>
                          {preset}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* 2. SPOTLIGHT AVATAR ATTIVO */}
            <View style={[styles.spotlightCard, { borderColor: `${currentAvatar.color}40` }]}>
              <View
                style={[
                  styles.spotlightAvatarCircle,
                  {
                    backgroundColor: `${currentAvatar.color}22`,
                    borderColor: currentAvatar.color,
                  },
                ]}
              >
                <Ionicons name={currentAvatar.icon as any} size={42} color={currentAvatar.color} />
                <View style={[styles.spotlightCheckDot, { backgroundColor: currentAvatar.color }]}>
                  <Ionicons name="checkmark" size={10} color="#090e17" />
                </View>
              </View>

              <View style={styles.spotlightDetails}>
                <View style={styles.spotlightNameRow}>
                  <Text style={styles.spotlightPlayerName} numberOfLines={1}>
                    {name.trim() || 'Giocatore'}
                  </Text>
                  <AppBadge
                    label={`Liv. ${currentRank.level}`}
                    variant="gold"
                    size="sm"
                  />
                </View>
                <Text style={[styles.spotlightRoleName, { color: currentAvatar.color }]}>
                  {currentAvatar.name} — {currentAvatar.role}
                </Text>
                <Text style={styles.spotlightQuote}>
                  «{currentAvatar.description}»
                </Text>
              </View>
            </View>

            {/* 3. PROGRESSO CARRIERA XP */}
            <View style={styles.rankProgressCard}>
              <View style={styles.rankProgressHeader}>
                <Text style={styles.progressLabel}>
                  Grado: <Text style={styles.rankTitleBold}>{currentRank.title}</Text>
                </Text>
                <Text style={styles.progressPercent}>
                  {nextRank ? `${percent}% • Prossimo: ${nextRank.title}` : 'Grado Massimo'}
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
              </View>
              <Text style={styles.xpText}>{profile.xp} XP totali accumulati</Text>
            </View>

            {/* 4. GRIGLIA SELEZIONE AVATAR */}
            <View style={styles.cardSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="people-outline" size={16} color={theme.colors.accentGoldLight} />
                <Text style={styles.sectionHeaderTitle}>SCEGLI IL TUO PERSONAGGIO</Text>
              </View>

              <View style={styles.avatarsGrid}>
                {AVAILABLE_AVATARS.map((avatar) => {
                  const isSelected = avatar.id === selectedAvatarId;
                  return (
                    <Pressable
                      key={avatar.id}
                      style={({ pressed }) => [
                        styles.avatarGridItem,
                        isSelected && [
                          styles.avatarGridItemSelected,
                          {
                            borderColor: avatar.color,
                            backgroundColor: `${avatar.color}15`,
                          },
                        ],
                        pressed && styles.avatarGridItemPressed,
                      ]}
                      onPress={() => handleSelectAvatar(avatar.id)}
                    >
                      <View
                        style={[
                          styles.avatarIconBox,
                          { backgroundColor: `${avatar.color}22` },
                          isSelected && { borderColor: avatar.color, borderWidth: 1.5 },
                        ]}
                      >
                        <Ionicons name={avatar.icon as any} size={24} color={avatar.color} />
                        {isSelected && (
                          <View style={[styles.avatarCheckBadge, { backgroundColor: avatar.color }]}>
                            <Ionicons name="checkmark" size={9} color="#090e17" />
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.avatarGridName,
                          isSelected && { color: avatar.color, fontWeight: '800' },
                        ]}
                        numberOfLines={1}
                      >
                        {avatar.name}
                      </Text>
                      <Text style={styles.avatarGridRole} numberOfLines={1}>
                        {avatar.role}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* TAB 2: TROFEI */}
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

        {/* TAB 3: STATISTICHE */}
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

        {/* Footer Close Button */}
        <View style={styles.footerAction}>
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            onPress={onClose}
          >
            <Text style={styles.closeBtnText}>Chiudi e Salva</Text>
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
  cardSection: {
    gap: theme.spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  charCountText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  nicknameInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.radii.md,
    paddingHorizontal: 10,
    gap: 8,
    minHeight: 46,
  },
  inputPrefixIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    paddingVertical: 8,
  },
  inputClearBtn: {
    padding: 4,
  },
  presetsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  presetsLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  presetsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.full,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  presetChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: theme.colors.primaryLight,
  },
  presetChipText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  presetChipTextActive: {
    color: theme.colors.primaryLight,
    fontWeight: '700',
  },
  spotlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  spotlightAvatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  spotlightCheckDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#090e17',
  },
  spotlightDetails: {
    flex: 1,
    gap: 2,
  },
  spotlightNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotlightPlayerName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#f8fafc',
    flex: 1,
  },
  spotlightRoleName: {
    fontSize: 12,
    fontWeight: '700',
  },
  spotlightQuote: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
    lineHeight: 15,
  },
  rankProgressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: 4,
  },
  rankProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  rankTitleBold: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  progressPercent: {
    fontSize: 11,
    color: theme.colors.accentGoldLight,
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.accentGoldLight,
    borderRadius: 3,
  },
  xpText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarGridItem: {
    width: '23%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.radii.md,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 4,
  },
  avatarGridItemPressed: {
    opacity: 0.75,
  },
  avatarGridItemSelected: {
    borderWidth: 1.5,
  },
  avatarIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarCheckBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGridName: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  avatarGridRole: {
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
