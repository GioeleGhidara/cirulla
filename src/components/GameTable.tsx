import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { CardView } from './CardView';
import { Card, DeckStyle, CardGraphicStyle, DeckSkinId, PlayerSide } from '../types/card';
import { Ionicons } from '@expo/vector-icons';
import { AppBadge } from './common/AppBadge';
import { theme } from '../theme/tokens';
import { getSkinCardBack } from '../assets/deckSkinsRegistry';

interface GameTableProps {
  deckStyle: DeckStyle;
  graphicStyle?: CardGraphicStyle;
  deckSkinId?: DeckSkinId;
  playerHand: Card[];
  aiHand: Card[];
  aiHandRevealed: boolean;
  tableCards: Card[];
  selectedCard: Card | null;
  selectedTableCardIds: string[];
  lastPlayedCardByAI?: Card | null;
  aiTargetCardIds?: string[];
  isShufflingOrDealing?: boolean;
  dealingMessage?: string | null;
  deckCount: number;
  dealer: PlayerSide;
  onSelectPlayerCard: (card: Card) => void;
  onToggleTableCard: (card: Card) => void;
  onClearTableSelection: () => void;
  onConfirmPlayCard: () => void;
  isPlayerTurn: boolean;
  playerCaptured: Card[];
  aiCaptured: Card[];
  lastActionMessage: string;
}

export const GameTable: React.FC<GameTableProps> = ({
  deckStyle,
  graphicStyle,
  deckSkinId,
  playerHand,
  aiHand,
  aiHandRevealed,
  tableCards,
  selectedCard,
  selectedTableCardIds,
  lastPlayedCardByAI,
  aiTargetCardIds = [],
  isShufflingOrDealing,
  dealingMessage,
  deckCount,
  dealer,
  onSelectPlayerCard,
  onToggleTableCard,
  onClearTableSelection,
  onConfirmPlayCard,
  isPlayerTurn,
  playerCaptured,
  aiCaptured,
  lastActionMessage,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 600;

  // Responsive card dimensions
  const cardWidth = isTablet ? 86 : 70;
  const cardHeight = isTablet ? 124 : 100;
  const smallCardWidth = isTablet ? 54 : 44;
  const smallCardHeight = isTablet ? 78 : 64;

  const lastPlayerCard = playerCaptured[playerCaptured.length - 1];
  const lastAICard = aiCaptured[aiCaptured.length - 1];

  const hasSelectedTableCards = selectedTableCardIds.length > 0;
  const targetIdsSet = new Set(aiTargetCardIds);
  const selectedIdsSet = new Set(selectedTableCardIds);

  return (
    <View style={styles.tableFelt}>
      {/* Top: AI Opponent Area */}
      <View style={styles.aiArea}>
        <View style={styles.aiHeader}>
          <View style={styles.avatarMini}>
            <Ionicons name="hardware-chip" size={14} color="#f87171" />
          </View>
          <Text style={styles.aiNameText}>Avversario</Text>
          <Text style={styles.cardsInHandCount}>({aiHand.length} carte)</Text>
          {dealer === 'ai' && (
            <AppBadge label="Mazziere" variant="gold" size="sm" />
          )}
        </View>

        <View style={styles.handRow}>
          {aiHand.map((card, idx) => (
            <CardView
              key={`ai-hand-${card.id}-${idx}`}
              card={card}
              faceDown={!aiHandRevealed}
              deckStyle={deckStyle}
              graphicStyle={graphicStyle}
              deckSkinId={deckSkinId}
              width={smallCardWidth}
              height={smallCardHeight}
              style={{ marginHorizontal: -4 }}
            />
          ))}
        </View>
      </View>

      {/* Middle: The Playing Table (Il Tavolo da Gioco) */}
      <View style={styles.centerTable}>
        <View style={styles.feltSurface}>
          {/* Status Message Pill */}
          <View style={styles.actionPill}>
            <Text style={styles.actionPillText} numberOfLines={1}>
              {lastActionMessage}
            </Text>
          </View>

          {/* Shuffle / Dealing Banner */}
          {isShufflingOrDealing && dealingMessage && (
            <View style={styles.dealingOverlayBanner}>
              <Ionicons name="shuffle" size={18} color={theme.colors.accentGoldLight} />
              <Text style={styles.dealingOverlayText}>{dealingMessage}</Text>
            </View>
          )}

          {/* Last Played Card by AI Floating Slot */}
          {lastPlayedCardByAI && (
            <View style={styles.aiPlayedContainer}>
              <View style={styles.aiPlayedHeader}>
                <Ionicons name="eye" size={12} color="#fca5a5" />
                <Text style={styles.aiPlayedHeaderText}>L'Avversario gioca:</Text>
              </View>
              <CardView
                card={lastPlayedCardByAI}
                deckStyle={deckStyle}
                graphicStyle={graphicStyle}
                deckSkinId={deckSkinId}
                width={cardWidth}
                height={cardHeight}
                style={styles.aiPlayedCardGlow}
              />
            </View>
          )}

          {/* Table Cards Grid */}
          {tableCards.length === 0 ? (
            <View style={styles.emptyTablePlaceholder}>
              <Text style={styles.emptyTableText}>Tavolo Vuoto</Text>
              <Text style={styles.emptyTableSub}>Nessuna carta a terra</Text>
            </View>
          ) : (
            <View style={styles.tableCardsGrid}>
              {tableCards.map((card) => {
                const isSelectedByUser = selectedIdsSet.has(card.id);
                const isTargetedByAI = targetIdsSet.has(card.id);

                return (
                  <View key={`table-${card.id}`} style={styles.tableCardWrapper}>
                    <CardView
                      card={card}
                      deckStyle={deckStyle}
                      graphicStyle={graphicStyle}
                      deckSkinId={deckSkinId}
                      width={cardWidth}
                      height={cardHeight}
                      isSelected={isSelectedByUser}
                      onPress={
                        isPlayerTurn && selectedCard
                          ? () => onToggleTableCard(card)
                          : undefined
                      }
                      style={[
                        styles.tableCardItem,
                        isSelectedByUser && styles.tableCardSelected,
                        isTargetedByAI && styles.tableCardTargetedByAI,
                      ]}
                    />
                    {isTargetedByAI && (
                      <View style={styles.aiTargetBadge}>
                        <Text style={styles.aiTargetBadgeText}>PRESA</Text>
                      </View>
                    )}
                    {isSelectedByUser && (
                      <View style={styles.userSelectedBadge}>
                        <Ionicons name="checkmark" size={10} color="#0f172a" />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Side Decks Row: AI Pile, Draw Deck (Tallone), and Player Pile */}
          <View style={styles.decksSideRow}>
            {/* AI captured pile */}
            <View style={styles.pileContainer}>
              <Text style={styles.pileLabel}>Prese Avv.</Text>
              {aiCaptured.length > 0 ? (
                <CardView
                  card={lastAICard}
                  faceDown={true}
                  deckStyle={deckStyle}
                  deckSkinId={deckSkinId}
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

            {/* DRAW DECK (IL MAZZO SUL TAVOLO) */}
            <View style={styles.drawDeckContainer}>
              <Text style={styles.drawDeckLabel}>Mazzo</Text>
              {deckCount > 0 ? (
                <View style={styles.drawDeckStack}>
                  {/* Visual 3D Stack depth */}
                  <View style={[styles.deckStackLayer2, { width: smallCardWidth, height: smallCardHeight }]} />
                  <View style={[styles.deckStackLayer1, { width: smallCardWidth, height: smallCardHeight }]} />
                  <CardView
                    faceDown={true}
                    deckStyle={deckStyle}
                    deckSkinId={deckSkinId}
                    width={smallCardWidth}
                    height={smallCardHeight}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.emptyPile,
                    { width: smallCardWidth, height: smallCardHeight },
                  ]}
                >
                  <Text style={styles.emptyDeckIcon}>Esaurito</Text>
                </View>
              )}
              <Text style={styles.drawDeckCount}>{deckCount} carte</Text>
            </View>

            {/* Player captured pile */}
            <View style={styles.pileContainer}>
              <Text style={styles.pileLabel}>Tue Prese</Text>
              {playerCaptured.length > 0 ? (
                <CardView
                  card={lastPlayerCard}
                  deckStyle={deckStyle}
                  graphicStyle={graphicStyle}
                  deckSkinId={deckSkinId}
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
        {/* Dynamic Manual Action Bar (when card in hand is chosen) */}
        {selectedCard && isPlayerTurn && (
          <View style={styles.actionToolbar}>
            <TouchableOpacity
              style={[
                styles.mainActionBtn,
                hasSelectedTableCards ? styles.captureActionBtn : styles.discardActionBtn,
              ]}
              activeOpacity={0.85}
              onPress={onConfirmPlayCard}
              accessibilityRole="button"
              accessibilityLabel={
                hasSelectedTableCards
                  ? `Conferma presa di ${selectedTableCardIds.length} carte a terra`
                  : `Cala ${selectedCard.name} sul tavolo`
              }
            >
              <Ionicons
                name={hasSelectedTableCards ? 'checkmark-circle' : 'arrow-down-circle'}
                size={18}
                color="#ffffff"
              />
              <Text style={styles.mainActionBtnText}>
                {hasSelectedTableCards
                  ? `PRENDI (${selectedTableCardIds.length} CARTE A TERRA)`
                  : `CALA A TERRA (${selectedCard.name})`}
              </Text>
            </TouchableOpacity>

            {hasSelectedTableCards && (
              <TouchableOpacity
                style={styles.cancelSelectionBtn}
                activeOpacity={0.8}
                onPress={onClearTableSelection}
                accessibilityRole="button"
                accessibilityLabel="Deseleziona carte a terra"
              >
                <Ionicons name="close-circle-outline" size={16} color="#94a3b8" />
                <Text style={styles.cancelSelectionText}>Annulla</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Player Section Header */}
        <View style={styles.playerHeader}>
          <Text style={styles.playerSectionTitle}>Le Tue Carte</Text>
          {isPlayerTurn ? (
            <AppBadge label="TUO TURNO" variant="success" icon="play" size="sm" />
          ) : (
            <AppBadge label="Turno avversario..." variant="default" size="sm" />
          )}
          {dealer === 'player' && (
            <AppBadge label="Sei Mazziere" variant="gold" size="sm" />
          )}
        </View>

        {/* Player Hand Cards */}
        <View style={styles.playerHandRow}>
          {playerHand.map((card) => {
            const isSelected = selectedCard?.id === card.id;

            return (
              <View key={`player-hand-${card.id}`} style={styles.playerHandCard}>
                <CardView
                  card={card}
                  deckStyle={deckStyle}
                  graphicStyle={graphicStyle}
                  deckSkinId={deckSkinId}
                  width={cardWidth}
                  height={cardHeight}
                  isSelected={isSelected}
                  onPress={isPlayerTurn ? () => onSelectPlayerCard(card) : undefined}
                />
              </View>
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
    backgroundColor: '#090e17',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  aiArea: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  avatarMini: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiNameText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
  },
  cardsInHandCount: {
    color: '#64748b',
    fontSize: 11,
  },
  handRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTable: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#166534',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  feltSurface: {
    flex: 1,
    backgroundColor: '#15803d',
    padding: 10,
    justifyContent: 'space-between',
  },
  actionPill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(9, 14, 23, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    maxWidth: '94%',
  },
  actionPillText: {
    color: '#fde047',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  dealingOverlayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1.5,
    borderColor: '#d97706',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 6,
  },
  dealingOverlayText: {
    color: '#fef08a',
    fontSize: 12.5,
    fontWeight: '800',
  },
  aiPlayedContainer: {
    position: 'absolute',
    top: 48,
    alignSelf: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  aiPlayedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  aiPlayedHeaderText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  aiPlayedCardGlow: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  emptyTablePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  emptyTableText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emptyTableSub: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 12,
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
  tableCardWrapper: {
    position: 'relative',
  },
  tableCardItem: {
    margin: 2,
  },
  tableCardSelected: {
    borderColor: '#eab308',
    borderWidth: 3,
    transform: [{ translateY: -8 }],
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  tableCardTargetedByAI: {
    borderColor: '#ef4444',
    borderWidth: 3,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
  },
  aiTargetBadge: {
    position: 'absolute',
    top: -6,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    zIndex: 5,
  },
  aiTargetBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  },
  userSelectedBadge: {
    position: 'absolute',
    top: -6,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#eab308',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  decksSideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  pileContainer: {
    alignItems: 'center',
  },
  pileLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 2,
  },
  emptyPile: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDeckIcon: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '700',
  },
  pileCount: {
    color: '#fde047',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  drawDeckContainer: {
    alignItems: 'center',
  },
  drawDeckLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 2,
  },
  drawDeckStack: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckStackLayer1: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569',
  },
  deckStackLayer2: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  drawDeckCount: {
    color: '#fde047',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  playerArea: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  actionToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  mainActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  captureActionBtn: {
    backgroundColor: '#059669',
  },
  discardActionBtn: {
    backgroundColor: '#0284c7',
  },
  mainActionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cancelSelectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#475569',
  },
  cancelSelectionText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  playerSectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  playerHandRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    minHeight: 106,
  },
  playerHandCard: {
    marginHorizontal: 2,
  },
});
