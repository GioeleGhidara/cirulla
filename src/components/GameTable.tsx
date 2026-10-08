import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { CardView } from './CardView';
import { Card, DeckStyle, CardGraphicStyle, DeckSkinId, PlayerSide } from '../types/card';
import { Ionicons } from '@expo/vector-icons';
import { AppBadge } from './common/AppBadge';
import { theme } from '../theme/tokens';

const isNativeDriver = Platform.OS !== 'web';

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
  lastActionMessage?: string;
  playerName?: string;
  playerAvatarIcon?: string;
  playerAvatarColor?: string;
}

/**
 * Pila di carte fisiche (dorso rivolto verso l'alto con effetto spessore 3D)
 * Nessuna etichetta testuale invadente.
 */
const PhysicalCardPile: React.FC<{
  cards: Card[];
  deckStyle: DeckStyle;
  deckSkinId?: DeckSkinId;
  width: number;
  height: number;
}> = ({ cards, deckStyle, deckSkinId, width, height }) => {
  if (cards.length === 0) {
    return <View style={[styles.emptyPile, { width, height }]} />;
  }

  const topCard = cards[cards.length - 1];

  return (
    <View style={[styles.pileStack, { width, height }]}>
      {cards.length > 6 && (
        <View style={[styles.pileLayer2, { width, height }]} />
      )}
      {cards.length > 2 && (
        <View style={[styles.pileLayer1, { width, height }]} />
      )}
      <CardView
        card={topCard}
        faceDown={true}
        deckStyle={deckStyle}
        deckSkinId={deckSkinId}
        width={width}
        height={height}
      />
    </View>
  );
};

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
  playerName,
  playerAvatarIcon,
  playerAvatarColor,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 600;

  // Dimensioni responsive per carte autentiche
  const cardWidth = isTablet ? 84 : 68;
  const cardHeight = isTablet ? 122 : 98;
  const smallCardWidth = isTablet ? 54 : 42;
  const smallCardHeight = isTablet ? 78 : 60;
  const opponentCardWidth = isTablet ? 66 : 54;
  const opponentCardHeight = isTablet ? 94 : 76;

  const hasSelectedTableCards = selectedTableCardIds.length > 0;
  const targetIdsSet = new Set(aiTargetCardIds);
  const selectedIdsSet = new Set(selectedTableCardIds);

  // Animazione giocata avversario: scivola dalla mano in alto verso il tavolo
  const aiAnimY = useRef(new Animated.Value(-80)).current;
  const aiAnimOpacity = useRef(new Animated.Value(0)).current;
  const aiAnimScale = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    if (lastPlayedCardByAI) {
      aiAnimY.setValue(-70);
      aiAnimOpacity.setValue(0);
      aiAnimScale.setValue(0.75);

      Animated.parallel([
        Animated.timing(aiAnimY, {
          toValue: 20,
          duration: 360,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: isNativeDriver,
        }),
        Animated.timing(aiAnimOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: isNativeDriver,
        }),
        Animated.spring(aiAnimScale, {
          toValue: 1.05,
          friction: 6,
          tension: 40,
          useNativeDriver: isNativeDriver,
        }),
      ]).start();
    }
  }, [lastPlayedCardByAI]);

  return (
    <View style={styles.tableFelt}>
      {/* 1. In Alto: Area Avversario (seduto di fronte a noi) */}
      <View style={styles.aiArea}>
        {/* Sinistra: Dettaglio discreto Mazziere / Avatar */}
        <View style={styles.aiInfoSlot}>
          <View style={styles.avatarMini}>
            <Ionicons name="hardware-chip" size={13} color="#f87171" />
          </View>
          {dealer === 'ai' && (
            <AppBadge label="Mazziere" variant="gold" size="sm" />
          )}
        </View>

        {/* Centro: Mano dell'Avversario vista dal dorso (diminuisce quando gioca) */}
        <View style={styles.aiHandCenter}>
          {aiHand.map((card, idx) => {
            const rotDeg = (idx - (aiHand.length - 1) / 2) * 2;
            const offsetY = Math.abs(idx - (aiHand.length - 1) / 2) * 1;

            return (
              <View
                key={`ai-hand-${card.id}-${idx}`}
                style={[
                  styles.aiCardWrapper,
                  {
                    transform: [{ rotate: `${rotDeg}deg` }, { translateY: offsetY }],
                  },
                ]}
              >
                <CardView
                  card={card}
                  faceDown={!aiHandRevealed}
                  deckStyle={deckStyle}
                  graphicStyle={graphicStyle}
                  deckSkinId={deckSkinId}
                  width={opponentCardWidth}
                  height={opponentCardHeight}
                />
              </View>
            );
          })}
        </View>

        {/* Destra: Pila delle prese dell'Avversario (vicino a lui, senza etichette) */}
        <View style={styles.aiPileSlot}>
          <PhysicalCardPile
            cards={aiCaptured}
            deckStyle={deckStyle}
            deckSkinId={deckSkinId}
            width={smallCardWidth}
            height={smallCardHeight}
          />
        </View>
      </View>

      {/* 2. Al Centro: Tavolo da Gioco in Panno Verde Feltro */}
      <View style={styles.centerTable}>
        <View style={styles.feltSurface}>
          {/* Banner discreto di mescolamento/distribuzione (solo quando avviene) */}
          {isShufflingOrDealing && dealingMessage && (
            <View style={styles.dealingOverlayBanner}>
              <Ionicons name="shuffle" size={16} color={theme.colors.accentGoldLight} />
              <Text style={styles.dealingOverlayText}>{dealingMessage}</Text>
            </View>
          )}

          {/* Mazzo (Tallone) sul tavolo: posizionato sul feltro verde a sinistra */}
          <View style={styles.tableCenterRow}>
            <View style={styles.talloneSlot}>
              {deckCount > 0 ? (
                <View style={[styles.pileStack, { width: smallCardWidth, height: smallCardHeight }]}>
                  {deckCount > 10 && (
                    <View style={[styles.pileLayer2, { width: smallCardWidth, height: smallCardHeight }]} />
                  )}
                  {deckCount > 4 && (
                    <View style={[styles.pileLayer1, { width: smallCardWidth, height: smallCardHeight }]} />
                  )}
                  <CardView
                    faceDown={true}
                    deckStyle={deckStyle}
                    deckSkinId={deckSkinId}
                    width={smallCardWidth}
                    height={smallCardHeight}
                  />
                </View>
              ) : (
                <View style={[styles.emptyPile, { width: smallCardWidth, height: smallCardHeight }]} />
              )}
            </View>

            {/* Carte sul Tavolo (posate a terra) */}
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
                    {isSelectedByUser && (
                      <View style={styles.userSelectedBadge}>
                        <Ionicons name="checkmark" size={11} color="#0f172a" />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Carta giocata dall'avversario animata che atterra sul tavolo */}
          {lastPlayedCardByAI && (
            <Animated.View
              style={[
                styles.aiAnimatedSlot,
                {
                  transform: [{ translateY: aiAnimY }, { scale: aiAnimScale }],
                  opacity: aiAnimOpacity,
                  pointerEvents: 'none',
                },
              ]}
            >
              <CardView
                card={lastPlayedCardByAI}
                deckStyle={deckStyle}
                graphicStyle={graphicStyle}
                deckSkinId={deckSkinId}
                width={cardWidth}
                height={cardHeight}
                style={styles.aiPlayedCardGlow}
              />
            </Animated.View>
          )}
        </View>
      </View>

      {/* 3. In Basso: Area Giocatore (Tu) */}
      <View style={styles.playerArea}>
        {/* Barra di azione minimalista quando una carta è selezionata */}
        {selectedCard && isPlayerTurn && (
          <View style={styles.actionToolbar}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                hasSelectedTableCards ? styles.actionBtnCapture : styles.actionBtnPlay,
              ]}
              activeOpacity={0.85}
              onPress={onConfirmPlayCard}
            >
              <Ionicons
                name={hasSelectedTableCards ? 'checkmark' : 'arrow-up'}
                size={18}
                color="#ffffff"
              />
              <Text style={styles.actionBtnText}>
                {hasSelectedTableCards ? 'Prendi' : 'Gioca'}
              </Text>
            </TouchableOpacity>

            {hasSelectedTableCards && (
              <TouchableOpacity
                style={styles.actionBtnCancel}
                activeOpacity={0.8}
                onPress={onClearTableSelection}
              >
                <Ionicons name="close" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Fila Mano Giocatore + Pila Prese accanto */}
        <View style={styles.playerBottomRow}>
          {/* Spazio informativo sinistro: Mini Avatar Giocatore + Mazziere */}
          <View style={styles.playerInfoSlot}>
            <View
              style={[
                styles.avatarMini,
                {
                  backgroundColor: playerAvatarColor ? `${playerAvatarColor}22` : '#1e293b',
                  borderColor: playerAvatarColor || '#334155',
                },
              ]}
            >
              <Ionicons
                name={(playerAvatarIcon as any) || 'person'}
                size={12}
                color={playerAvatarColor || theme.colors.primaryLight}
              />
            </View>
            {dealer === 'player' && (
              <AppBadge label="Mazziere" variant="gold" size="sm" />
            )}
          </View>

          {/* Mano del Giocatore (carte grandi ben visibili) */}
          <View style={[styles.playerHandRow, !isPlayerTurn && styles.playerHandRowWaiting]}>
            {playerHand.map((card) => {
              const isSelected = selectedCard?.id === card.id;

              return (
                <View
                  key={`player-hand-${card.id}`}
                  style={[
                    styles.playerHandCard,
                    isSelected && styles.playerHandCardSelected,
                  ]}
                >
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

          {/* Destra: Pila delle tue prese (vicino a te, senza etichette) */}
          <View style={styles.playerPileSlot}>
            <PhysicalCardPile
              cards={playerCaptured}
              deckStyle={deckStyle}
              deckSkinId={deckSkinId}
              width={smallCardWidth}
              height={smallCardHeight}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableFelt: {
    flex: 1,
    backgroundColor: '#070b12',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },

  /* Area Avversario */
  aiArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    minHeight: 76,
  },
  aiInfoSlot: {
    width: 60,
    alignItems: 'flex-start',
    gap: 4,
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHandCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCardWrapper: {
    marginHorizontal: 3,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.35)',
    elevation: 3,
  },
  aiPileSlot: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  /* Tavolo Centrale in Feltro */
  centerTable: {
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#14532d',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
    elevation: 8,
  },
  feltSurface: {
    flex: 1,
    backgroundColor: '#15803d',
    padding: 8,
    justifyContent: 'center',
  },
  tableCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 12,
  },
  talloneSlot: {
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    maxWidth: 380,
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
    transform: [{ translateY: -6 }],
    boxShadow: '0px 4px 8px rgba(234, 179, 8, 0.6)',
    elevation: 10,
  },
  tableCardTargetedByAI: {
    borderColor: '#ef4444',
    borderWidth: 3,
    boxShadow: '0px 4px 8px rgba(239, 68, 68, 0.7)',
    elevation: 10,
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

  /* Overlay animato giocata IA */
  aiAnimatedSlot: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 20,
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.6)',
    elevation: 12,
  },
  aiPlayedCardGlow: {
    borderColor: '#ef4444',
    borderWidth: 2.5,
  },

  /* Pile Fisiche di Carte */
  pileStack: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pileLayer1: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569',
  },
  pileLayer2: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyPile: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
  },

  /* Banner Distribuzione */
  dealingOverlayBanner: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    zIndex: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: theme.radii.full,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  dealingOverlayText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '600',
  },

  /* Area Giocatore */
  playerArea: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  actionToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    minHeight: 38,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 4,
  },
  actionBtnCapture: {
    backgroundColor: '#059669',
  },
  actionBtnPlay: {
    backgroundColor: '#0284c7',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionBtnCancel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderWidth: 1,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerInfoSlot: {
    width: 60,
    alignItems: 'flex-start',
  },
  playerHandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  playerHandRowWaiting: {
    opacity: 0.88,
  },
  playerHandCard: {
    marginHorizontal: 1,
  },
  playerHandCardSelected: {
    transform: [{ translateY: -14 }],
    zIndex: 10,
  },
  playerPileSlot: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
