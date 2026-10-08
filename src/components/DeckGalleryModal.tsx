import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CardView } from './CardView';
import { createDeck } from '../engine/deck';
import { PRIMIERA_VALUES } from '../constants/rules';
import { isMatta, isSettebello } from '../engine/rules';
import { Card, CardGraphicStyle, DeckSkinId, DeckStyle } from '../types/card';
import { AppModal } from './common/AppModal';
import { AppBadge } from './common/AppBadge';
import { PillButton } from './common/PillButton';
import { theme } from '../theme/tokens';

interface DeckGalleryModalProps {
  visible: boolean;
  onClose: () => void;
  currentDeckStyle?: DeckStyle;
  currentGraphicStyle?: CardGraphicStyle;
  currentSkinId?: DeckSkinId;
  onSelectGraphicStyle?: (style: CardGraphicStyle) => void;
  onSelectDeckStyle?: (style: DeckStyle) => void;
}

type FilterCategory = 'tutti' | 'denari' | 'cuori' | 'picche' | 'fiori' | 'coppe' | 'spade' | 'bastoni';

export const DeckGalleryModal: React.FC<DeckGalleryModalProps> = ({
  visible,
  onClose,
  currentDeckStyle = 'genovesi',
  currentGraphicStyle = 'genovesi_autentiche',
  currentSkinId,
  onSelectGraphicStyle,
  onSelectDeckStyle,
}) => {
  const [selectedDeckStyle, setSelectedDeckStyle] = useState<DeckStyle>(currentDeckStyle);
  const [selectedGraphicStyle, setSelectedGraphicStyle] = useState<CardGraphicStyle>(currentGraphicStyle);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('tutti');

  const deck = useMemo(() => {
    return createDeck(selectedDeckStyle);
  }, [selectedDeckStyle]);

  const filteredCards = useMemo(() => {
    if (selectedFilter === 'tutti') return deck;
    return deck.filter((c) => {
      const s = c.suit.toLowerCase();
      if (selectedFilter === 'denari') return s === 'denari' || s === 'quadri';
      return s === selectedFilter;
    });
  }, [deck, selectedFilter]);

  const handleDeckStyleChange = (ds: DeckStyle) => {
    setSelectedDeckStyle(ds);
    setSelectedFilter('tutti');
    onSelectDeckStyle?.(ds);
  };

  const handleGraphicStyleChange = (gs: CardGraphicStyle) => {
    setSelectedGraphicStyle(gs);
    onSelectGraphicStyle?.(gs);
  };

  const getSpecialBadge = (card: Card) => {
    if (isSettebello(card)) {
      return <AppBadge label="Settebello" variant="gold" size="sm" icon="star" />;
    }
    if (isMatta(card)) {
      return <AppBadge label="La Matta" variant="primary" size="sm" icon="sparkles" />;
    }
    if (card.suit === 'denari' || card.suit === 'quadri') {
      if (card.rank >= 1 && card.rank <= 3) {
        return <AppBadge label="Piccola" variant="success" size="sm" />;
      }
      if (card.rank >= 8 && card.rank <= 10) {
        return <AppBadge label="Grande" variant="gold" size="sm" />;
      }
    }
    if (card.rank === 1) {
      return <AppBadge label="Asso" variant="default" size="sm" />;
    }
    return null;
  };

  const deckStyles: { id: DeckStyle; label: string }[] = [
    { id: 'genovesi', label: 'Genovesi' },
    { id: 'piacentine', label: 'Piacentine' },
    { id: 'napoletane', label: 'Napoletane' },
  ];

  const graphicStyles: { id: CardGraphicStyle; label: string }[] = [
    { id: 'genovesi_autentiche', label: 'Genovesi Baccarat' },
    { id: 'moderno', label: 'Vettoriale' },
    { id: 'classico', label: 'Poker' },
  ];

  const suitFilters: { id: FilterCategory; label: string }[] =
    selectedDeckStyle === 'genovesi'
      ? [
          { id: 'tutti', label: 'Tutti (40)' },
          { id: 'denari', label: 'Denari (10)' },
          { id: 'cuori', label: 'Cuori (10)' },
          { id: 'picche', label: 'Picche (10)' },
          { id: 'fiori', label: 'Fiori (10)' },
        ]
      : [
          { id: 'tutti', label: 'Tutti (40)' },
          { id: 'denari', label: 'Denari (10)' },
          { id: 'coppe', label: 'Coppe (10)' },
          { id: 'spade', label: 'Spade (10)' },
          { id: 'bastoni', label: 'Bastoni (10)' },
        ];

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Campionario Carte"
      subtitle={`Tutti i 40 layout di carte della Cirulla (${selectedDeckStyle.toUpperCase()})`}
      icon="images-outline"
      iconColor={theme.colors.primaryLight}
      maxWidth={600}
      scrollable={false}
      contentContainerStyle={styles.modalContent}
    >
      {/* Top Filter Controls */}
      <View style={styles.controlsBar}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Mazzo:</Text>
          <View style={styles.pillsRow}>
            {deckStyles.map((ds) => (
              <PillButton
                key={ds.id}
                label={ds.label}
                isActive={selectedDeckStyle === ds.id}
                onPress={() => handleDeckStyleChange(ds.id)}
              />
            ))}
          </View>
        </View>

        {selectedDeckStyle === 'genovesi' && (
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Grafica:</Text>
            <View style={styles.pillsRow}>
              {graphicStyles.map((gs) => (
                <PillButton
                  key={gs.id}
                  label={gs.label}
                  isActive={selectedGraphicStyle === gs.id}
                  onPress={() => handleGraphicStyleChange(gs.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Suits filter row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suitFilterScroll}
        >
          {suitFilters.map((sf) => (
            <PillButton
              key={sf.id}
              label={sf.label}
              isActive={selectedFilter === sf.id}
              onPress={() => setSelectedFilter(sf.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Cards Grid */}
      <ScrollView style={styles.cardsScroll} contentContainerStyle={styles.cardsGrid}>
        {filteredCards.map((card) => {
          const badge = getSpecialBadge(card);
          const primieraVal = PRIMIERA_VALUES[card.rank] || 10;

          return (
            <View key={`gallery-${card.id}`} style={styles.cardItemBox}>
              <CardView
                card={card}
                deckStyle={selectedDeckStyle}
                graphicStyle={selectedGraphicStyle}
                deckSkinId={currentSkinId}
                width={68}
                height={98}
              />
              <Text style={styles.cardItemName} numberOfLines={1}>
                {card.name}
              </Text>
              <View style={styles.cardMetaRow}>
                <Text style={styles.cardItemValue}>Valore: {card.value}</Text>
                <Text style={styles.cardItemPrimiera}>P: {primieraVal}pt</Text>
              </View>
              {badge && <View style={styles.cardBadgeWrap}>{badge}</View>}
            </View>
          );
        })}
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.legendBox}>
        <Text style={styles.legendText}>
          Valore figure: Fante = 8 • Donna = 9 • Re = 10 • Settebello = 7 Denari
        </Text>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 0,
    flex: 1,
  },
  controlsBar: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
    gap: theme.spacing.sm,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    minWidth: 50,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suitFilterScroll: {
    gap: 6,
    paddingTop: 4,
  },
  cardsScroll: {
    flex: 1,
  },
  cardsGrid: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: theme.spacing.md,
  },
  cardItemBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    width: 104,
  },
  cardItemName: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 6,
    textAlign: 'center',
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 3,
  },
  cardItemValue: {
    fontSize: 9.5,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  cardItemPrimiera: {
    fontSize: 9.5,
    color: theme.colors.accentGoldLight,
    fontWeight: '700',
  },
  cardBadgeWrap: {
    marginTop: 4,
  },
  legendBox: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceSubtle,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
});
