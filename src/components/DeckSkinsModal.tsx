import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardView } from './CardView';
import { ALL_DECK_SKINS, DeckCategory } from '../constants/deckSkins';
import { DeckSkinId, DEFAULT_DECK_SKIN_ID } from '../assets/deckSkinsRegistry';
import { Card } from '../types/card';
import { AppModal } from './common/AppModal';
import { AppBadge } from './common/AppBadge';
import { PillButton } from './common/PillButton';
import { theme } from '../theme/tokens';
import { triggerHaptic } from '../services/audio';
import {
  getInstalledDeckIds,
  installDeck,
  uninstallDeck,
  uninstallAllOptionalDecks,
  calculateInstalledDecksSizeMB,
  DECK_SIZE_MAP,
  BUNDLED_DECK_IDS,
} from '../services/deckStorage';

interface DeckSkinsModalProps {
  visible: boolean;
  onClose: () => void;
  currentSkinId?: DeckSkinId;
  onSelectSkin: (skinId: DeckSkinId) => void;
}

const SAMPLE_CARDS: Card[] = [
  { id: 'denari_1', suit: 'denari', rank: 1, value: 1, name: 'Asso di Denari' },
  { id: 'denari_7', suit: 'denari', rank: 7, value: 7, name: 'Settebello' },
  { id: 'cuori_7', suit: 'cuori', rank: 7, value: 7, name: 'La Matta' },
  { id: 'cuori_9', suit: 'cuori', rank: 9, value: 9, name: 'Donna di Cuori' },
  { id: 'cuori_10', suit: 'cuori', rank: 10, value: 10, name: 'Re di Cuori' },
];

export const DeckSkinsModal: React.FC<DeckSkinsModalProps> = ({
  visible,
  onClose,
  currentSkinId = DEFAULT_DECK_SKIN_ID,
  onSelectSkin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DeckCategory>('tutti');
  const [installedIds, setInstalledIds] = useState<DeckSkinId[]>([...BUNDLED_DECK_IDS]);
  const [downloadingId, setDownloadingId] = useState<DeckSkinId | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Sync installed decks whenever modal opens
  useEffect(() => {
    if (visible) {
      getInstalledDeckIds().then((ids) => {
        setInstalledIds(ids);
      });
    }
  }, [visible]);

  const filteredSkins = useMemo(() => {
    if (selectedCategory === 'tutti') return ALL_DECK_SKINS;
    return ALL_DECK_SKINS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const categories: { id: DeckCategory; label: string; count: number }[] = useMemo(() => {
    return [
      { id: 'tutti', label: 'Tutti', count: ALL_DECK_SKINS.length },
      {
        id: 'genovesi',
        label: 'Liguri e Genovesi',
        count: ALL_DECK_SKINS.filter((s) => s.category === 'genovesi').length,
      },
      {
        id: 'regionali_italiane',
        label: 'Regionali Italiane',
        count: ALL_DECK_SKINS.filter((s) => s.category === 'regionali_italiane').length,
      },
      {
        id: 'storiche_europee',
        label: 'Storiche Europee',
        count: ALL_DECK_SKINS.filter((s) => s.category === 'storiche_europee').length,
      },
      {
        id: 'moderne',
        label: 'Moderne e Poker',
        count: ALL_DECK_SKINS.filter((s) => s.category === 'moderne').length,
      },
    ];
  }, []);

  const totalExtraUsageMB = useMemo(() => {
    return calculateInstalledDecksSizeMB(installedIds);
  }, [installedIds]);

  const optionalInstalledCount = useMemo(() => {
    return installedIds.filter((id) => !BUNDLED_DECK_IDS.includes(id)).length;
  }, [installedIds]);

  const handleDownloadDeck = useCallback(
    async (skinId: DeckSkinId) => {
      setDownloadingId(skinId);
      setDownloadProgress(0.1);
      triggerHaptic('light');

      try {
        const updated = await installDeck(skinId, (progress) => {
          setDownloadProgress(progress);
        });
        setInstalledIds(updated);
        triggerHaptic('success');
      } catch (err) {
        console.warn('Download deck error', err);
      } finally {
        setDownloadingId(null);
        setDownloadProgress(0);
      }
    },
    []
  );

  const handleDeleteDeck = useCallback(
    async (skinId: DeckSkinId, skinName: string) => {
      triggerHaptic('warning');
      const updated = await uninstallDeck(skinId);
      setInstalledIds(updated);

      // If user was using this deck, fallback to the default Dal Negro deck
      if (currentSkinId === skinId) {
        onSelectSkin(DEFAULT_DECK_SKIN_ID);
      }
    },
    [currentSkinId, onSelectSkin]
  );

  const handleDeleteAllOptional = useCallback(async () => {
    triggerHaptic('heavy');
    const updated = await uninstallAllOptionalDecks();
    setInstalledIds(updated);
    if (!BUNDLED_DECK_IDS.includes(currentSkinId)) {
      onSelectSkin(DEFAULT_DECK_SKIN_ID);
    }
  }, [currentSkinId, onSelectSkin]);

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Collezione Mazzi e Skin"
      subtitle="Scarica solo le skin che desideri usare e cancellale in qualsiasi momento per non appesantire l'app."
      icon="color-palette-outline"
      iconColor={theme.colors.accentGoldLight}
      badge={<AppBadge label="Download On-Demand" variant="gold" size="sm" />}
      maxWidth={600}
      scrollable={false}
      contentContainerStyle={styles.modalContent}
    >
      {/* Storage & Memory Management Banner */}
      <View style={styles.storageBanner}>
        <View style={styles.storageInfoLeft}>
          <View style={styles.storageIconWrapper}>
            <Ionicons name="hardware-chip-outline" size={18} color={theme.colors.accentGold} />
          </View>
          <View style={styles.storageTexts}>
            <View style={styles.storageTitleRow}>
              <Text style={styles.storageTitle}>Spazio Mazzi Extra: {totalExtraUsageMB} MB</Text>
              <AppBadge
                label={optionalInstalledCount === 0 ? 'Leggerissima' : `${optionalInstalledCount} scaricati`}
                variant={optionalInstalledCount === 0 ? 'success' : 'primary'}
                size="sm"
              />
            </View>
            <Text style={styles.storageSubtitle}>
              {optionalInstalledCount === 0
                ? 'Solo il mazzo Genovese Dal Negro è incorporato. Zero memoria occupata da altre skin.'
                : 'Puoi liberare memoria cancellando i mazzi non utilizzati con un tocco.'}
            </Text>
          </View>
        </View>

        {optionalInstalledCount > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.cleanAllBtn,
              pressed && styles.cleanAllBtnPressed,
            ]}
            onPress={handleDeleteAllOptional}
            hitSlop={theme.touch.hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Elimina tutti i mazzi scaricati per liberare memoria"
          >
            <Ionicons name="trash-outline" size={14} color="#fca5a5" />
            <Text style={styles.cleanAllBtnText}>Libera spazio</Text>
          </Pressable>
        )}
      </View>

      {/* Category Filter Pills */}
      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <PillButton
              key={cat.id}
              label={cat.label}
              count={cat.count}
              isActive={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Skins List */}
      <ScrollView
        style={styles.skinsScroll}
        contentContainerStyle={styles.skinsListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredSkins.map((skin) => {
          const isCurrent = currentSkinId === skin.id;
          const isBundled = BUNDLED_DECK_IDS.includes(skin.id);
          const isInstalled = isBundled || installedIds.includes(skin.id);
          const isDownloading = downloadingId === skin.id;
          const sizeMB = DECK_SIZE_MAP[skin.id] ?? 1.8;

          return (
            <View
              key={skin.id}
              style={[
                styles.skinCard,
                isCurrent && styles.skinCardActive,
              ]}
            >
              {/* Header card with badges & Action */}
              <View style={styles.skinCardHeader}>
                <View style={styles.skinTitleWrap}>
                  <View style={styles.tagsRow}>
                    <AppBadge label={skin.origin} variant="default" size="sm" />
                    <AppBadge label={skin.historyBadge} variant="outline" size="sm" />

                    {isBundled ? (
                      <AppBadge
                        label="Predefinito Integrato"
                        variant="gold"
                        icon="shield-checkmark"
                        size="sm"
                      />
                    ) : isInstalled ? (
                      <AppBadge
                        label={`Scaricato (${sizeMB} MB)`}
                        variant="success"
                        icon="cloud-done-outline"
                        size="sm"
                      />
                    ) : (
                      <AppBadge
                        label={`Disponibile (${sizeMB} MB)`}
                        variant="default"
                        icon="cloud-download-outline"
                        size="sm"
                      />
                    )}

                    {isCurrent && (
                      <AppBadge
                        label="In uso"
                        variant="primary"
                        icon="checkmark-circle"
                        size="sm"
                      />
                    )}
                  </View>

                  <Text style={styles.skinName}>{skin.name}</Text>
                  <Text style={styles.skinManufacturer}>
                    {skin.manufacturer} • {skin.suitType === 'francesi' ? 'Semi francesi' : 'Semi italiani'}
                  </Text>
                </View>

                {/* Action Buttons Row */}
                <View style={styles.actionsRow}>
                  {/* Delete button (if downloaded and not bundled) */}
                  {isInstalled && !isBundled && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.deleteBtn,
                        pressed && styles.deleteBtnPressed,
                      ]}
                      onPress={() => handleDeleteDeck(skin.id, skin.name)}
                      hitSlop={theme.touch.hitSlop}
                      accessibilityRole="button"
                      accessibilityLabel={`Elimina mazzo ${skin.name} per liberare ${sizeMB} MB`}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                    </Pressable>
                  )}

                  {/* Install OR Select Button */}
                  {!isInstalled ? (
                    <Pressable
                      style={({ pressed }) => [
                        styles.downloadBtn,
                        isDownloading && styles.downloadBtnActive,
                        pressed && !isDownloading && styles.downloadBtnPressed,
                      ]}
                      disabled={isDownloading}
                      onPress={() => handleDownloadDeck(skin.id)}
                      hitSlop={theme.touch.hitSlop}
                      accessibilityRole="button"
                      accessibilityLabel={`Scarica mazzo ${skin.name}, dimensione ${sizeMB} megabyte`}
                    >
                      {isDownloading ? (
                        <>
                          <ActivityIndicator size="small" color="#ffffff" style={styles.btnSpinner} />
                          <Text style={styles.downloadBtnText}>
                            {Math.round(downloadProgress * 100)}%
                          </Text>
                        </>
                      ) : (
                        <>
                          <Ionicons
                            name="cloud-download-outline"
                            size={16}
                            color="#ffffff"
                            style={styles.selectBtnIcon}
                          />
                          <Text style={styles.downloadBtnText}>
                            Scarica ({sizeMB} MB)
                          </Text>
                        </>
                      )}
                    </Pressable>
                  ) : (
                    <Pressable
                      style={({ pressed }) => [
                        styles.selectBtn,
                        isCurrent ? styles.selectBtnActive : styles.selectBtnNormal,
                        pressed && !isCurrent && styles.selectBtnPressed,
                      ]}
                      disabled={isCurrent}
                      onPress={() => onSelectSkin(skin.id)}
                      hitSlop={theme.touch.hitSlop}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isCurrent
                          ? `Mazzo ${skin.name} attualmente in uso`
                          : `Usa mazzo ${skin.name}`
                      }
                    >
                      <Ionicons
                        name={isCurrent ? 'checkmark-circle' : 'play-outline'}
                        size={16}
                        color={isCurrent ? theme.colors.success : '#ffffff'}
                        style={styles.selectBtnIcon}
                      />
                      <Text
                        style={[
                          styles.selectBtnText,
                          isCurrent && styles.selectBtnTextActive,
                        ]}
                      >
                        {isCurrent ? 'In Uso' : 'Usa skin'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>

              {/* Description */}
              <Text style={styles.skinDesc}>{skin.description}</Text>

              {/* Key Cards Preview Row */}
              <View style={styles.previewContainer}>
                <View style={styles.previewHeaderRow}>
                  <Text style={styles.previewTitle}>Anteprima carte:</Text>
                  {!isInstalled && (
                    <Text style={styles.previewHint}>
                      Scarica per abilitare in partita
                    </Text>
                  )}
                </View>

                <View style={styles.previewCardsRow}>
                  {SAMPLE_CARDS.map((card) => (
                    <View key={`${skin.id}-${card.id}`} style={styles.previewCardItem}>
                      <CardView
                        card={card}
                        deckSkinId={skin.id}
                        width={52}
                        height={76}
                      />
                      <Text style={styles.previewCardLabel} numberOfLines={1}>
                        {card.rank === 1
                          ? 'Asso'
                          : card.rank === 7 && card.suit === 'denari'
                          ? '7 Bello'
                          : card.rank === 7 && card.suit === 'cuori'
                          ? 'Matta'
                          : card.rank === 9
                          ? 'Donna (9)'
                          : 'Re (10)'}
                      </Text>
                    </View>
                  ))}

                  {/* Card Back */}
                  <View style={styles.previewCardItem}>
                    <CardView
                      faceDown
                      deckSkinId={skin.id}
                      width={52}
                      height={76}
                    />
                    <Text style={styles.previewCardLabel} numberOfLines={1}>
                      Dorso
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 0,
    flex: 1,
  },
  storageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceSubtle,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    gap: theme.spacing.md,
  },
  storageInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  storageIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageTexts: {
    flex: 1,
  },
  storageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  storageTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  storageSubtitle: {
    fontSize: 11.5,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  cleanAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    minHeight: 34,
  },
  cleanAllBtnPressed: {
    opacity: 0.7,
  },
  cleanAllBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#fca5a5',
  },
  categoryBar: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  categoryScroll: {
    gap: theme.spacing.sm,
  },
  skinsScroll: {
    flex: 1,
  },
  skinsListContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  skinCard: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
  },
  skinCardActive: {
    borderColor: theme.colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
  },
  skinCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  skinTitleWrap: {
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.xs,
  },
  skinName: {
    fontSize: 16.5,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  skinManufacturer: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    minHeight: 38,
  },
  selectBtnNormal: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryLight,
  },
  selectBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: theme.colors.success,
  },
  selectBtnPressed: {
    opacity: 0.85,
  },
  selectBtnIcon: {
    marginRight: 6,
  },
  selectBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  selectBtnTextActive: {
    color: theme.colors.success,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accentGold,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radii.full,
    minHeight: 38,
  },
  downloadBtnActive: {
    backgroundColor: '#b45309',
  },
  downloadBtnPressed: {
    opacity: 0.85,
  },
  downloadBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  btnSpinner: {
    marginRight: 6,
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: theme.radii.full,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  deleteBtnPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  skinDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  previewContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  previewTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewHint: {
    fontSize: 10.5,
    color: theme.colors.accentGoldLight,
    fontStyle: 'italic',
  },
  previewCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
  },
  previewCardItem: {
    alignItems: 'center',
    flex: 1,
  },
  previewCardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
