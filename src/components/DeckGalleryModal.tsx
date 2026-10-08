import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardView } from './CardView';
import { createDeck } from '../engine/deck';
import { PRIMIERA_VALUES } from '../constants/rules';
import { isMatta, isSettebello } from '../engine/rules';
import { Card, CardGraphicStyle, DeckStyle, Suit } from '../types/card';

interface DeckGalleryModalProps {
  visible: boolean;
  onClose: () => void;
  currentDeckStyle?: DeckStyle;
  currentGraphicStyle?: CardGraphicStyle;
  onSelectGraphicStyle?: (style: CardGraphicStyle) => void;
  onSelectDeckStyle?: (style: DeckStyle) => void;
}

type FilterCategory = 'tutti' | 'denari' | 'cuori' | 'picche' | 'fiori' | 'coppe' | 'spade' | 'bastoni';

export const DeckGalleryModal: React.FC<DeckGalleryModalProps> = ({
  visible,
  onClose,
  currentDeckStyle = 'genovesi',
  currentGraphicStyle = 'moderno',
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
      return { text: '★ SETTEBELLO', color: '#f59e0b', sub: '+1 pt mazzo' };
    }
    if (isMatta(card)) {
      return { text: '🃏 LA MATTA', color: '#3b82f6', sub: 'Jolly bussate' };
    }
    if (card.suit === 'denari' || card.suit === 'quadri') {
      if (card.rank >= 1 && card.rank <= 3) {
        return { text: 'PICCOLA', color: '#10b981', sub: 'Combinazione 3-7 pt' };
      }
      if (card.rank >= 8 && card.rank <= 10) {
        return { text: 'GRANDE', color: '#ec4899', sub: 'Combinazione 5 pt' };
      }
    }
    if (card.rank === 1) {
      return { text: 'ASSO PIGLIATUTTO', color: '#8b5cf6', sub: '+1 Scopa a terra vuota' };
    }
    return null;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Campionario Carte</Text>
              <Text style={styles.headerSub}>
                Tutti i 40 layout di carte della Cirulla ({selectedDeckStyle.toUpperCase()})
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Chiudi">
              <Ionicons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Controls Bar 1: Mazzo */}
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Mazzo:</Text>
            <View style={styles.pillsRow}>
              {(['genovesi', 'piacentine', 'napoletane'] as DeckStyle[]).map((ds) => (
                <TouchableOpacity
                  key={`deck-${ds}`}
                  style={[
                    styles.pillOption,
                    selectedDeckStyle === ds && styles.pillOptionActive,
                  ]}
                  onPress={() => handleDeckStyleChange(ds)}
                >
                  <Text
                    style={[
                      styles.pillOptionText,
                      selectedDeckStyle === ds && styles.pillOptionTextActive,
                    ]}
                  >
                    {ds === 'genovesi' ? 'Genovesi (Francesi)' : ds.charAt(0).toUpperCase() + ds.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Controls Bar 2: Stile Grafica */}
          {selectedDeckStyle === 'genovesi' && (
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Stile Grafico:</Text>
              <View style={styles.pillsRow}>
                <TouchableOpacity
                  style={[
                    styles.pillOption,
                    selectedGraphicStyle === 'moderno' && styles.pillOptionActive,
                  ]}
                  onPress={() => handleGraphicStyleChange('moderno')}
                >
                  <Text
                    style={[
                      styles.pillOptionText,
                      selectedGraphicStyle === 'moderno' && styles.pillOptionTextActive,
                    ]}
                  >
                    Vettoriale Moderno
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pillOption,
                    selectedGraphicStyle === 'classico' && styles.pillOptionActive,
                  ]}
                  onPress={() => handleGraphicStyleChange('classico')}
                >
                  <Text
                    style={[
                      styles.pillOptionText,
                      selectedGraphicStyle === 'classico' && styles.pillOptionTextActive,
                    ]}
                  >
                    Classico Illustrato
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedFilter === 'tutti' && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter('tutti')}
            >
              <Text style={[styles.filterText, selectedFilter === 'tutti' && styles.filterTextActive]}>
                Tutti (40)
              </Text>
            </TouchableOpacity>

            {selectedDeckStyle === 'genovesi' ? (
              <>
                <TouchableOpacity
                  style={[styles.filterPill, selectedFilter === 'denari' && styles.filterPillActive]}
                  onPress={() => setSelectedFilter('denari')}
                >
                  <Text style={[styles.filterText, selectedFilter === 'denari' && styles.filterTextActive]}>
                    ♦ Denari (10)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterPill, selectedFilter === 'cuori' && styles.filterPillActive]}
                  onPress={() => setSelectedFilter('cuori')}
                >
                  <Text style={[styles.filterText, selectedFilter === 'cuori' && styles.filterTextActive]}>
                    ♥ Cuori (10)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterPill, selectedFilter === 'picche' && styles.filterPillActive]}
                  onPress={() => setSelectedFilter('picche')}
                >
                  <Text style={[styles.filterText, selectedFilter === 'picche' && styles.filterTextActive]}>
                    ♠ Picche (10)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterPill, selectedFilter === 'fiori' && styles.filterPillActive]}
                  onPress={() => setSelectedFilter('fiori')}
                >
                  <Text style={[styles.filterText, selectedFilter === 'fiori' && styles.filterTextActive]}>
                    ♣ Fiori (10)
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.filterPill, selectedFilter === 'denari' && styles.filterPillActive]}
                  onPress={() => setSelectedFilter('denari')}
                >
                  <Text style={[styles.filterText, selectedFilter === 'denari' && styles.filterTextActive]}>
                    🪙 Denari (10)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterPill, selectedFilter === 'coppe' && styles.filterPillActive]}
                  onPress={() => setSelectedFilter('coppe')}
                >
                  <Text style={[styles.filterText, selectedFilter === 'coppe' && styles.filterTextActive]}>
                    🏆 Coppe (10)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterPill, selectedFilter === 'spade' && styles.filterPillActive]}
                  onPress={() => setSelectedFilter('spade')}
                >
                  <Text style={[styles.filterText, selectedFilter === 'spade' && styles.filterTextActive]}>
                    ⚔ Spade (10)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterPill, selectedFilter === 'bastoni' && styles.filterPillActive]}
                  onPress={() => setSelectedFilter('bastoni')}
                >
                  <Text style={[styles.filterText, selectedFilter === 'bastoni' && styles.filterTextActive]}>
                    🪵 Bastoni (10)
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

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
                    width={70}
                    height={100}
                  />
                  <Text style={styles.cardItemName} numberOfLines={1}>
                    {card.name}
                  </Text>
                  <View style={styles.cardMetaRow}>
                    <Text style={styles.cardItemValue}>
                      Valore: {card.value}
                    </Text>
                    <Text style={styles.cardItemPrimiera}>
                      P: {primieraVal}pt
                    </Text>
                  </View>
                  {badge && (
                    <View style={[styles.badgePill, { backgroundColor: badge.color }]}>
                      <Text style={styles.badgePillText}>{badge.text}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Legend Banner */}
          <View style={styles.legendBox}>
            <Text style={styles.legendTitle}>Regola delle Figure in Cirulla:</Text>
            <Text style={styles.legendText}>
              • Jack (Fante) = vale 8  |  Donna (Cavallo) = vale 9  |  Re = vale 10
            </Text>
            <Text style={styles.legendCuriosity}>
              Carte Genovesi: i semi usano i simboli francesi (♦, ♥, ♠, ♣) dove i quadri sono chiamati "Denari".
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 22,
    width: '100%',
    maxWidth: 500,
    maxHeight: '92%',
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  controlLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '800',
    width: 75,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  pillOption: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillOptionActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  pillOptionText: {
    color: '#94a3b8',
    fontSize: 10.5,
    fontWeight: '700',
  },
  pillOptionTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  filterScroll: {
    marginVertical: 8,
    maxHeight: 34,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    backgroundColor: '#1e293b',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterPillActive: {
    backgroundColor: '#ca8a04',
    borderColor: '#fde047',
  },
  filterText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#0f172a',
    fontWeight: '900',
  },
  cardsScroll: {
    maxHeight: 380,
    marginVertical: 4,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  cardItemBox: {
    width: '24%',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 3,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardItemName: {
    color: '#f8fafc',
    fontSize: 9.5,
    fontWeight: '800',
    marginTop: 5,
    textAlign: 'center',
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 2,
  },
  cardItemValue: {
    color: '#fbbf24',
    fontSize: 8.5,
    fontWeight: '800',
  },
  cardItemPrimiera: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: '700',
  },
  badgePill: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 3,
  },
  badgePillText: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  legendBox: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  legendTitle: {
    color: '#fef08a',
    fontSize: 10.5,
    fontWeight: '800',
  },
  legendText: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  legendCuriosity: {
    color: '#94a3b8',
    fontSize: 9.5,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
