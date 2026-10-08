import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIDifficulty, DeckSkinId, GameSettings, PlayerSide } from '../../types/card';
import { AppModal } from '../common/AppModal';
import { AppBadge } from '../common/AppBadge';
import { PillButton } from '../common/PillButton';
import { theme } from '../../theme/tokens';
import { triggerHaptic } from '../../services/audio';
import { ALL_DECK_SKINS } from '../../constants/deckSkins';

interface MatchSetupModalProps {
  visible: boolean;
  onClose: () => void;
  currentSettings: GameSettings;
  onStartMatch: (options: {
    targetScore: 31 | 51;
    aiDifficulty: AIDifficulty;
    dealer: PlayerSide;
    deckSkinId?: DeckSkinId;
  }) => void;
  onOpenSkinsModal: () => void;
}

export const MatchSetupModal: React.FC<MatchSetupModalProps> = ({
  visible,
  onClose,
  currentSettings,
  onStartMatch,
  onOpenSkinsModal,
}) => {
  const [targetScore, setTargetScore] = useState<31 | 51>(currentSettings.targetScore);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(currentSettings.aiDifficulty);
  const [dealerChoice, setDealerChoice] = useState<'random' | 'player' | 'ai'>('random');

  const selectedSkin = ALL_DECK_SKINS.find(
    (s) => s.id === (currentSettings.deckSkinId ?? 'genovesi_dal_negro')
  );

  const handleStart = () => {
    triggerHaptic('heavy');
    const chosenDealer: PlayerSide =
      dealerChoice === 'random'
        ? Math.random() < 0.5
          ? 'player'
          : 'ai'
        : dealerChoice;

    onStartMatch({
      targetScore,
      aiDifficulty,
      dealer: chosenDealer,
      deckSkinId: currentSettings.deckSkinId,
    });
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Configura Partita"
      subtitle="Scegli le regole, il mazzo e la difficoltà dell'avversario"
      icon="game-controller-outline"
      iconColor={theme.colors.accentGoldLight}
      maxWidth={520}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Section 1: Modalità & Punteggio Obiettivo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flag-outline" size={17} color={theme.colors.accentGoldLight} />
            <Text style={styles.sectionTitle}>Obiettivo di Punteggio</Text>
          </View>
          <View style={styles.optionsRow}>
            <Pressable
              style={[
                styles.optionCard,
                targetScore === 51 && styles.optionCardSelected,
              ]}
              onPress={() => {
                triggerHaptic('light');
                setTargetScore(51);
              }}
            >
              <View style={styles.optionTop}>
                <Text
                  style={[
                    styles.optionTitle,
                    targetScore === 51 && styles.optionTitleSelected,
                  ]}
                >
                  Classica Ligure
                </Text>
                <AppBadge label="51 PT" variant={targetScore === 51 ? 'gold' : 'default'} size="sm" />
              </View>
              <Text style={styles.optionDesc}>
                La tradizione storica genovese. Smazzate complete fino al traguardo di 51 punti.
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.optionCard,
                targetScore === 31 && styles.optionCardSelected,
              ]}
              onPress={() => {
                triggerHaptic('light');
                setTargetScore(31);
              }}
            >
              <View style={styles.optionTop}>
                <Text
                  style={[
                    styles.optionTitle,
                    targetScore === 31 && styles.optionTitleSelected,
                  ]}
                >
                  Partita Rapida
                </Text>
                <AppBadge label="31 PT" variant={targetScore === 31 ? 'gold' : 'default'} size="sm" />
              </View>
              <Text style={styles.optionDesc}>
                Ideale per una sessione sprint, ritmi incalzanti e decisione rapida.
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Section 2: Difficoltà IA */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="hardware-chip-outline" size={17} color={theme.colors.primaryLight} />
            <Text style={styles.sectionTitle}>Difficoltà dell'Avversario</Text>
          </View>

          <View style={styles.difficultyColumn}>
            {/* Facile */}
            <Pressable
              style={[
                styles.diffCard,
                aiDifficulty === 'facile' && styles.diffCardSelected,
              ]}
              onPress={() => {
                triggerHaptic('light');
                setAiDifficulty('facile');
              }}
            >
              <View style={[styles.diffIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="happy-outline" size={20} color="#10b981" />
              </View>
              <View style={styles.diffInfo}>
                <View style={styles.diffHeaderRow}>
                  <Text style={[styles.diffName, aiDifficulty === 'facile' && styles.diffNameSelected]}>
                    Principiante
                  </Text>
                  {aiDifficulty === 'facile' && <Ionicons name="checkmark-circle" size={18} color="#10b981" />}
                </View>
                <Text style={styles.diffDesc}>
                  Mosse intuitive, non calcola le carte uscite, ideale per imparare.
                </Text>
              </View>
            </Pressable>

            {/* Normale */}
            <Pressable
              style={[
                styles.diffCard,
                aiDifficulty === 'normale' && styles.diffCardSelected,
              ]}
              onPress={() => {
                triggerHaptic('light');
                setAiDifficulty('normale');
              }}
            >
              <View style={[styles.diffIconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Ionicons name="people-outline" size={20} color={theme.colors.primaryLight} />
              </View>
              <View style={styles.diffInfo}>
                <View style={styles.diffHeaderRow}>
                  <Text style={[styles.diffName, aiDifficulty === 'normale' && styles.diffNameSelected]}>
                    Esperto di Circolo
                  </Text>
                  {aiDifficulty === 'normale' && <Ionicons name="checkmark-circle" size={18} color={theme.colors.primaryLight} />}
                </View>
                <Text style={styles.diffDesc}>
                  Attento alle prese a 15, difende il banco ed evita scope facili.
                </Text>
              </View>
            </Pressable>

            {/* Campione */}
            <Pressable
              style={[
                styles.diffCard,
                aiDifficulty === 'campione' && styles.diffCardSelected,
              ]}
              onPress={() => {
                triggerHaptic('light');
                setAiDifficulty('campione');
              }}
            >
              <View style={[styles.diffIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Ionicons name="skull-outline" size={20} color={theme.colors.accentGoldLight} />
              </View>
              <View style={styles.diffInfo}>
                <View style={styles.diffHeaderRow}>
                  <Text style={[styles.diffName, aiDifficulty === 'campione' && styles.diffNameSelected]}>
                    Campione Genovese
                  </Text>
                  {aiDifficulty === 'campione' && <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGoldLight} />}
                </View>
                <Text style={styles.diffDesc}>
                  Memorizza le carte cadute, sfrutta la Matta (7♥) con maestria e cerca il Cappotto.
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Section 3: Primo Mazziere */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="layers-outline" size={17} color={theme.colors.textSecondary} />
            <Text style={styles.sectionTitle}>Primo Mazziere</Text>
          </View>
          <View style={styles.dealerOptionsRow}>
            <Pressable
              style={[styles.dealerChip, dealerChoice === 'random' && styles.dealerChipSelected]}
              onPress={() => setDealerChoice('random')}
            >
              <Ionicons
                name="shuffle-outline"
                size={16}
                color={dealerChoice === 'random' ? theme.colors.accentGoldLight : theme.colors.textSecondary}
              />
              <Text style={[styles.dealerChipText, dealerChoice === 'random' && styles.dealerChipTextSelected]}>
                A Sorte
              </Text>
            </Pressable>

            <Pressable
              style={[styles.dealerChip, dealerChoice === 'player' && styles.dealerChipSelected]}
              onPress={() => setDealerChoice('player')}
            >
              <Ionicons
                name="person-outline"
                size={16}
                color={dealerChoice === 'player' ? theme.colors.accentGoldLight : theme.colors.textSecondary}
              />
              <Text style={[styles.dealerChipText, dealerChoice === 'player' && styles.dealerChipTextSelected]}>
                Tu Mazziere
              </Text>
            </Pressable>

            <Pressable
              style={[styles.dealerChip, dealerChoice === 'ai' && styles.dealerChipSelected]}
              onPress={() => setDealerChoice('ai')}
            >
              <Ionicons
                name="hardware-chip-outline"
                size={16}
                color={dealerChoice === 'ai' ? theme.colors.accentGoldLight : theme.colors.textSecondary}
              />
              <Text style={[styles.dealerChipText, dealerChoice === 'ai' && styles.dealerChipTextSelected]}>
                Avversario
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Section 4: Mazzo Selezionato */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={17} color={theme.colors.accentGoldLight} />
            <Text style={styles.sectionTitle}>Mazzo Attivo</Text>
          </View>
          <View style={styles.skinPreviewCard}>
            <View style={styles.skinPreviewInfo}>
              <Text style={styles.skinName}>{selectedSkin?.name ?? 'Genovesi Tradizionali'}</Text>
              <Text style={styles.skinOrigin}>{selectedSkin?.origin ?? 'Dal Negro • Genova'}</Text>
            </View>
            <Pressable
              style={styles.changeSkinBtn}
              onPress={() => {
                onClose();
                onOpenSkinsModal();
              }}
            >
              <Text style={styles.changeSkinBtnText}>Cambia Mazzo</Text>
              <Ionicons name="chevron-forward" size={15} color={theme.colors.primaryLight} />
            </Pressable>
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
            onPress={handleStart}
          >
            <Ionicons name="play" size={18} color="#090e17" />
            <Text style={styles.submitBtnText}>Siediti al Tavolo</Text>
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
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: 0.3,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  optionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  optionCardSelected: {
    borderColor: theme.colors.accentGold,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  optionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  optionTitleSelected: {
    color: theme.colors.textPrimary,
  },
  optionDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  difficultyColumn: {
    gap: theme.spacing.sm,
  },
  diffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  diffCardSelected: {
    borderColor: theme.colors.accentGoldLight,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  diffIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffInfo: {
    flex: 1,
    gap: 2,
  },
  diffHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diffName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  diffNameSelected: {
    color: theme.colors.textPrimary,
  },
  diffDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  dealerOptionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dealerChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.md,
  },
  dealerChipSelected: {
    borderColor: theme.colors.accentGoldLight,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  dealerChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  dealerChipTextSelected: {
    color: theme.colors.accentGoldLight,
    fontWeight: '700',
  },
  skinPreviewCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  skinPreviewInfo: {
    gap: 2,
  },
  skinName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  skinOrigin: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  changeSkinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radii.full,
  },
  changeSkinBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primaryLight,
  },
  ctaContainer: {
    marginTop: theme.spacing.sm,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.accentGold,
    borderRadius: theme.radii.full,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#090e17',
    letterSpacing: 0.3,
  },
});
