import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { CardView } from './CardView';
import { Card, DeckStyle, CardGraphicStyle, CaptureMove } from '../types/card';
import { Ionicons } from '@expo/vector-icons';

interface GameTableProps {
  deckStyle: DeckStyle;
  graphicStyle?: CardGraphicStyle;
  playerHand: Card[];
  aiHand: Card[];
  aiHandRevealed: boolean;
  tableCards: Card[];
  selectedCard: Card | null;
  selectedMove: CaptureMove | null;
  onSelectPlayerCard: (card: Card) => void;
  onSelectCaptureMove: (move: CaptureMove) => void;
  onToggleTableCard: (card: Card) => void;
  onOpenChoiceModal: () => void;
  onConfirmPlayCard: () => void;
  availableMovesForSelected: CaptureMove[];
  isPlayerTurn: boolean;
  playerCaptured: Card[];
  aiCaptured: Card[];
  lastActionMessage: string;
}

export const GameTable: React.FC<GameTableProps> = ({
  deckStyle,
  graphicStyle,
  playerHand,
  aiHand,
  aiHandRevealed,
  tableCards,
  selectedCard,
  selectedMove,
  onSelectPlayerCard,
  onSelectCaptureMove,
  onToggleTableCard,
  onOpenChoiceModal,
  onConfirmPlayCard,
  availableMovesForSelected,
  isPlayerTurn,
  playerCaptured,
  aiCaptured,
  lastActionMessage,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 600;

  // Responsive card dimensions
  const cardWidth = isTablet ? 88 : 72;
  const cardHeight = isTablet ? 126 : 104;
  const smallCardWidth = isTablet ? 56 : 46;
  const smallCardHeight = isTablet ? 80 : 66;

  // All cards that participate in ANY valid capture move
  const candidateCardIds = new Set<string>();
  if (selectedCard && availableMovesForSelected.length > 0) {
    for (const move of availableMovesForSelected) {
      for (const c of move.capturedCards) {
        candidateCardIds.add(c.id);
      }
    }
  }

  // Cards currently targeted by the ACTIVE selected move
  const activeSelectedCardIds = new Set<string>(
    selectedMove ? selectedMove.capturedCards.map((c) => c.id) : []
  );

  const lastPlayerCard = playerCaptured[playerCaptured.length - 1];
  const lastAICard = aiCaptured[aiCaptured.length - 1];

  return (
    <View style={styles.tableFelt}>
      {/* Top: AI Area */}
      <View style={styles.aiArea}>
        <View style={styles.aiHeader}>
          <View style={styles.avatarMini}>
            <Ionicons name="hardware-chip" size={14} color="#f87171" />
          </View>
          <Text style={styles.aiNameText}>Avversario</Text>
          <Text style={styles.cardsInHandCount}>({aiHand.length} carte)</Text>
        </View>

        <View style={styles.handRow}>
          {aiHand.map((card, idx) => (
            <CardView
              key={`ai-hand-${card.id}-${idx}`}
              card={card}
              faceDown={!aiHandRevealed}
              deckStyle={deckStyle}
              graphicStyle={graphicStyle}
              width={smallCardWidth}
              height={smallCardHeight}
              style={{ marginHorizontal: -4 }}
            />
          ))}
        </View>
      </View>

      {/* Middle: The Table (Il Tavolo) */}
      <View style={styles.centerTable}>
        <View style={styles.feltSurface}>
          {/* Status Message Pill */}
          <View style={styles.actionPill}>
            <Text style={styles.actionPillText} numberOfLines={1}>
              {lastActionMessage}
            </Text>
          </View>

          {/* Cards on the table */}
          {tableCards.length === 0 ? (
            <View style={styles.emptyTablePlaceholder}>
              <Text style={styles.emptyTableText}>Tavolo Vuoto</Text>
              <Text style={styles.emptyTableSub}>Nessuna carta a terra</Text>
            </View>
          ) : (
            <View style={styles.tableCardsGrid}>
              {tableCards.map((card) => {
                const isSelectedInMove = activeSelectedCardIds.has(card.id);
                const isCandidate = candidateCardIds.has(card.id);

                return (
                  <CardView
                    key={`table-${card.id}`}
                    card={card}
                    deckStyle={deckStyle}
                    graphicStyle={graphicStyle}
                    width={cardWidth}
                    height={cardHeight}
                    isSelected={isSelectedInMove}
                    isHighlighted={isSelectedInMove}
                    isPlayable={isCandidate && !isSelectedInMove}
                    onPress={
                      isPlayerTurn && selectedCard && isCandidate
                        ? () => onToggleTableCard(card)
                        : undefined
                    }
                    style={styles.tableCardItem}
                  />
                );
              })}
            </View>
          )}

          {/* Decks on table sides */}
          <View style={styles.decksSideRow}>
            {/* AI captured pile */}
            <View style={styles.pileContainer}>
              <Text style={styles.pileLabel}>Prese Avv.</Text>
              {aiCaptured.length > 0 ? (
                <CardView
                  card={lastAICard}
                  faceDown={true}
                  deckStyle={deckStyle}
                  width={smallCardWidth}
                  height={smallCardHeight}
                />
              ) : (
                <View
                  style={[
                    styles.emptyPile,
                    { width: smallCardWidth, height: smallCardHeight },
                  ]}
                />
              )}
              <Text style={styles.pileCount}>{aiCaptured.length}</Text>
            </View>

            {/* Player captured pile */}
            <View style={styles.pileContainer}>
              <Text style={styles.pileLabel}>Tue Prese</Text>
              {playerCaptured.length > 0 ? (
                <CardView
                  card={lastPlayerCard}
                  deckStyle={deckStyle}
                  graphicStyle={graphicStyle}
                  width={smallCardWidth}
                  height={smallCardHeight}
                />
              ) : (
                <View
                  style={[
                    styles.emptyPile,
                    { width: smallCardWidth, height: smallCardHeight },
                  ]}
                />
              )}
              <Text style={styles.pileCount}>{playerCaptured.length}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom: Player Area */}
      <View style={styles.playerArea}>
        {/* Quick capture selector pills if multiple moves are possible */}
        {selectedCard && isPlayerTurn && availableMovesForSelected.length > 1 && (
          <View style={styles.choicesBar}>
            <View style={styles.choicesHeaderRow}>
              <Text style={styles.choicesBarTitle}>Scegli cosa prendere:</Text>
              <TouchableOpacity
                onPress={onOpenChoiceModal}
                style={styles.viewAllChoicesBtn}
                accessibilityLabel="Apri dettagli combinazioni"
              >
                <Ionicons name="list" size={14} color="#38bdf8" />
                <Text style={styles.viewAllChoicesText}>Tutte le opzioni</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.choicesRow}
            >
              {availableMovesForSelected.map((move, idx) => {
                const isCurrent =
                  selectedMove &&
                  selectedMove.capturedCards.map((c) => c.id).sort().join(',') ===
                    move.capturedCards.map((c) => c.id).sort().join(',');

                const cardsText = move.capturedCards.map((c) => c.name).join(' + ');
                let label = '';
                if (move.isAceSweep) label = 'Asso spazza tutto';
                else if (move.is15Sum) label = `${cardsText} (Somma 15)`;
                else if (move.isDirectMatch) label = `${cardsText} (Uguale)`;
                else label = `${cardsText} (Somma ${move.cardPlayed.value})`;

                return (
                  <TouchableOpacity
                    key={`quick-choice-${idx}`}
                    style={[
                      styles.choicePill,
                      isCurrent && styles.choicePillActive,
                      move.isScopa && styles.choicePillScopa,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => onSelectCaptureMove(move)}
                  >
                    <Ionicons
                      name={isCurrent ? 'radio-button-on' : 'radio-button-off'}
                      size={14}
                      color={isCurrent ? '#ffffff' : '#94a3b8'}
                    />
                    <Text
                      style={[
                        styles.choicePillText,
                        isCurrent && styles.choicePillTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                    {move.isScopa && (
                      <View style={styles.scopaPillBadge}>
                        <Text style={styles.scopaPillText}>★ SCOPA</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Play card confirmation action bar */}
        {selectedCard && isPlayerTurn && (
          <View style={styles.playActionWrapper}>
            <TouchableOpacity
              style={[
                styles.confirmPlayBtn,
                availableMovesForSelected.length > 1 && styles.confirmPlayMultiBtn,
              ]}
              activeOpacity={0.8}
              onPress={onConfirmPlayCard}
            >
              <Ionicons
                name={
                  selectedMove || availableMovesForSelected.length > 0
                    ? 'flash-outline'
                    : 'arrow-up-circle-outline'
                }
                size={18}
                color="#ffffff"
              />
              <Text style={styles.confirmPlayText} numberOfLines={1}>
                {selectedMove
                  ? `CONFERMA: PRENDI ${selectedMove.capturedCards.map((c) => c.name).join(' e ')}`
                  : availableMovesForSelected.length > 0
                  ? `SCEGLI PRESA CON (${selectedCard.name})`
                  : `CALA A TERRA (${selectedCard.name})`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.playerHeader}>
          <Text style={styles.playerSectionTitle}>Le Tue Carte</Text>
          {isPlayerTurn && (
            <View style={styles.turnBadge}>
              <Text style={styles.turnBadgeText}>È IL TUO TURNO</Text>
            </View>
          )}
        </View>

        {/* Player hand cards */}
        <View style={styles.playerHandRow}>
          {playerHand.map((card) => {
            const isSelected = selectedCard?.id === card.id;
            return (
              <CardView
                key={`player-hand-${card.id}`}
                card={card}
                deckStyle={deckStyle}
                graphicStyle={graphicStyle}
                isSelected={isSelected}
                isPlayable={isPlayerTurn}
                onPress={() => isPlayerTurn && onSelectPlayerCard(card)}
                width={cardWidth}
                height={cardHeight}
                style={styles.playerHandCard}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableFelt: {
    flex: 1,
    backgroundColor: '#0a3622',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#062617',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  aiArea: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  avatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiNameText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  cardsInHandCount: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  handRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTable: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 4,
  },
  feltSurface: {
    backgroundColor: '#0f442a',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
    minHeight: 180,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionPillText: {
    color: '#fef08a',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyTablePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyTableText: {
    color: '#34d399',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emptyTableSub: {
    color: '#059669',
    fontSize: 11,
    marginTop: 2,
  },
  tableCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  tableCardItem: {
    margin: 2,
  },
  decksSideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  pileContainer: {
    alignItems: 'center',
  },
  pileLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  emptyPile: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  pileCount: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  playerArea: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  choicesBar: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  choicesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  choicesBarTitle: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
  },
  viewAllChoicesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllChoicesText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  choicesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  choicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#475569',
  },
  choicePillActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  choicePillScopa: {
    borderColor: '#eab308',
  },
  choicePillText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  choicePillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  scopaPillBadge: {
    backgroundColor: '#eab308',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  scopaPillText: {
    color: '#0f172a',
    fontSize: 8.5,
    fontWeight: '900',
  },
  playActionWrapper: {
    marginBottom: 6,
    width: '100%',
    paddingHorizontal: 8,
  },
  confirmPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  confirmPlayMultiBtn: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  confirmPlayText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  playerSectionTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  turnBadge: {
    backgroundColor: '#16a34a',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  turnBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  playerHandRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 10,
    minHeight: 112,
  },
  playerHandCard: {
    marginHorizontal: 2,
  },
});
