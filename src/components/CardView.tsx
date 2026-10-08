import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, Image, Pressable } from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Card, CardGraphicStyle, DeckSkinId, DeckStyle, Suit } from '../types/card';
import { isMatta, isSettebello } from '../engine/rules';
import { getSkinCardImage, getSkinCardBack } from '../assets/deckSkinsRegistry';

export function getDeckOfCardsApiUrl(card: Card): string {
  const normSuit = (card.suit || '').toLowerCase();
  const suitLetter =
    normSuit === 'denari' || normSuit === 'quadri'
      ? 'D'
      : normSuit === 'cuori'
      ? 'H'
      : normSuit === 'picche'
      ? 'S'
      : normSuit === 'fiori'
      ? 'C'
      : '';
  if (!suitLetter) return '';

  const rankLetter =
    card.rank === 1
      ? 'A'
      : card.rank === 8
      ? 'J'
      : card.rank === 9
      ? 'Q'
      : card.rank === 10
      ? 'K'
      : String(card.rank);

  return `https://deckofcardsapi.com/static/img/${rankLetter}${suitLetter}.png`;
}

interface CardViewProps {
  card?: Card;
  faceDown?: boolean;
  deckStyle?: DeckStyle;
  graphicStyle?: CardGraphicStyle;
  deckSkinId?: DeckSkinId;
  isSelected?: boolean;
  isPlayable?: boolean;
  isHighlighted?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}
import { SuitSymbol } from './common/SuitSymbol';

export interface SuitIconProps {
  suit: Suit;
  size?: number;
  deckStyle?: DeckStyle;
}

export const SuitIcon: React.FC<SuitIconProps> = ({
  suit,
  size = 18,
}) => {
  return <SuitSymbol suit={suit} size={size} />;
};


const FigureArtwork: React.FC<{
  rank: number;
  suit: Suit;
  deckStyle?: DeckStyle;
  size: number;
}> = ({ rank, suit, deckStyle = 'genovesi', size }) => {
  const label = rank === 8 ? 'JACK' : rank === 9 ? 'DONNA' : 'RE';
  const subLabel = rank === 8 ? '8' : rank === 9 ? '9' : '10';

  return (
    <View style={[styles.figureContainer, { width: size, height: size * 1.3 }]}>
      <View style={styles.figureBadge}>
        <Text style={styles.figureText}>{label}</Text>
      </View>
      <View style={styles.figureIconWrapper}>
        <SuitIcon suit={suit} deckStyle={deckStyle} size={size * 0.45} />
      </View>
      <Text style={styles.figureNumber}>{subLabel}</Text>
    </View>
  );
};

const PipLayout: React.FC<{
  rank: number;
  suit: Suit;
  deckStyle?: DeckStyle;
  cardWidth: number;
  cardHeight: number;
}> = ({ rank, suit, deckStyle, cardWidth, cardHeight }) => {
  const pipSize = Math.max(9, Math.min(15, cardWidth * 0.18));
  const largePipSize = Math.max(22, cardWidth * 0.36);

  if (rank === 1) {
    return (
      <View style={styles.centerPipSingle}>
        <SuitIcon suit={suit} deckStyle={deckStyle} size={largePipSize} />
      </View>
    );
  }

  if (rank === 2) {
    return (
      <View style={[styles.pipSingleCol, { height: cardHeight * 0.48 }]}>
        <SuitIcon suit={suit} deckStyle={deckStyle} size={pipSize} />
        <SuitIcon suit={suit} deckStyle={deckStyle} size={pipSize} />
      </View>
    );
  }

  if (rank === 3) {
    return (
      <View style={[styles.pipSingleCol, { height: cardHeight * 0.54 }]}>
        <SuitIcon suit={suit} deckStyle={deckStyle} size={pipSize} />
        <SuitIcon suit={suit} deckStyle={deckStyle} size={pipSize} />
        <SuitIcon suit={suit} deckStyle={deckStyle} size={pipSize} />
      </View>
    );
  }

  const leftPips = rank >= 6 ? 3 : 2;
  const rightPips = rank >= 6 ? 3 : 2;
  const hasCenterPip = rank === 5 || rank === 7;

  return (
    <View style={[styles.pipGrid, { width: cardWidth * 0.54, height: cardHeight * 0.54 }]}>
      <View style={styles.pipColumn}>
        {Array.from({ length: leftPips }).map((_, i) => (
          <SuitIcon key={`left-${i}`} suit={suit} deckStyle={deckStyle} size={pipSize} />
        ))}
      </View>

      {hasCenterPip && (
        <View style={styles.pipCenterColumn}>
          <SuitIcon suit={suit} deckStyle={deckStyle} size={pipSize} />
        </View>
      )}

      <View style={styles.pipColumn}>
        {Array.from({ length: rightPips }).map((_, i) => (
          <SuitIcon key={`right-${i}`} suit={suit} deckStyle={deckStyle} size={pipSize} />
        ))}
      </View>
    </View>
  );
};

const CardViewBase: React.FC<CardViewProps> = ({
  card,
  faceDown = false,
  deckStyle = 'genovesi',
  graphicStyle = 'genovesi_autentiche',
  deckSkinId,
  isSelected = false,
  isPlayable = false,
  isHighlighted = false,
  onPress,
  width = 72,
  height = 104,
  style,
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  // Determine active skin
  const activeSkinId: DeckSkinId =
    deckSkinId ??
    (graphicStyle === 'classico'
      ? 'classico_poker'
      : graphicStyle === 'moderno'
      ? 'moderno'
      : 'genovesi_dal_negro');

  const useSkinBack = activeSkinId !== 'moderno';
  const skinBack = useSkinBack ? getSkinCardBack(activeSkinId) : null;

  if (faceDown || !card) {
    return (
      <View
        style={[
          styles.card,
          styles.cardBack,
          { width, height },
          isSelected && styles.cardSelected,
          style,
        ]}
      >
        {skinBack ? (
          <View style={styles.classicImageContainer}>
            <Image
              source={skinBack}
              style={styles.classicCardImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.backPatternInner}>
            <Svg width={width - 8} height={height - 8} viewBox="0 0 60 88">
              <Defs>
                <LinearGradient id="backGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#1e293b" />
                  <Stop offset="50%" stopColor="#0f172a" />
                  <Stop offset="100%" stopColor="#020617" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="60" height="88" rx="5" fill="url(#backGrad)" />
              <Rect
                x="3"
                y="3"
                width="54"
                height="82"
                rx="4"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
              {/* Cross filigree pattern */}
              <Path d="M4 4 L56 84 M56 4 L4 84" stroke="#334155" strokeWidth="0.5" />
              <Circle cx="30" cy="44" r="14" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="1" />
              <Circle cx="30" cy="44" r="10" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
              <Path d="M30 36 L30 52 M22 44 L38 44" stroke="#fde047" strokeWidth="1.5" />
            </Svg>
          </View>
        )}
      </View>
    );
  }

  const isFigure = card.rank >= 8;
  const isSettebelloCard = isSettebello(card);
  const cardIsMatta = isMatta(card);
  const normSuit = (card.suit || '').toLowerCase();
  const isRegional = deckStyle === 'piacentine' || deckStyle === 'napoletane';
  const isRed = isRegional
    ? normSuit === 'coppe' || normSuit === 'denari'
    : normSuit === 'cuori' || normSuit === 'denari' || normSuit === 'quadri';

  const isModernSkin = activeSkinId === 'moderno';
  const isPokerSkin = activeSkinId === 'classico_poker';

  const skinImg =
    !isModernSkin && !isPokerSkin && !imageLoadError
      ? getSkinCardImage(activeSkinId, card)
      : null;

  const showClassicPoker =
    isPokerSkin && !imageLoadError;
  const classicImgUrl = showClassicPoker ? getDeckOfCardsApiUrl(card) : '';

  const cardContent = (
    <View
      style={[
        styles.card,
        styles.cardFront,
        { width, height },
        isSelected && styles.cardSelected,
        isHighlighted && styles.cardHighlighted,
        isPlayable && !isSelected && styles.cardPlayable,
        style,
      ]}
    >
      {skinImg ? (
        <View style={styles.classicImageContainer}>
          <Image
            source={skinImg}
            style={styles.classicCardImage}
            resizeMode="contain"
            onError={() => setImageLoadError(true)}
          />
        </View>
      ) : showClassicPoker && classicImgUrl ? (
        <View style={styles.classicImageContainer}>
          <Image
            source={{ uri: classicImgUrl }}
            style={styles.classicCardImage}
            resizeMode="contain"
            onError={() => setImageLoadError(true)}
          />
        </View>
      ) : (
        <>
          {/* Top Left Rank & Suit */}
          <View style={styles.cornerTopLeft}>
            <Text
              style={[
                styles.rankText,
                isRed ? styles.redText : styles.blackText,
              ]}
            >
              {card.rank}
            </Text>
            <SuitIcon suit={card.suit} deckStyle={deckStyle} size={width * 0.18} />
          </View>

          {/* Center artwork */}
          <View style={styles.centerArea}>
            {isFigure ? (
              <FigureArtwork
                rank={card.rank}
                suit={card.suit}
                deckStyle={deckStyle}
                size={width * 0.65}
              />
            ) : (
              <PipLayout
                rank={card.rank}
                suit={card.suit}
                deckStyle={deckStyle}
                cardWidth={width}
                cardHeight={height}
              />
            )}
          </View>

          {/* Bottom Right Rank & Suit (Inverted) */}
          <View style={styles.cornerBottomRight}>
            <Text
              style={[
                styles.rankText,
                isRed ? styles.redText : styles.blackText,
              ]}
            >
              {card.rank}
            </Text>
            <SuitIcon suit={card.suit} deckStyle={deckStyle} size={width * 0.18} />
          </View>
        </>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={({ pressed }) => [
          isSelected && { transform: [{ translateY: -10 }] },
          pressed && { opacity: 0.88 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${card.name}${isSettebelloCard ? ', Settebello' : ''}${cardIsMatta ? ', La Matta' : ''}`}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
};

export const CardView = React.memo(CardViewBase);

const styles = StyleSheet.create({
  card: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fffdfa',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 3,
  },
  cardFront: {
    backgroundColor: '#fffefa',
  },
  cardBack: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPatternInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: '#eab308',
    borderWidth: 2.5,
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 8,
  },
  cardPlayable: {
    borderColor: '#60a5fa',
    borderWidth: 1.5,
  },
  cardHighlighted: {
    borderColor: '#10b981',
    borderWidth: 2.5,
    backgroundColor: '#ecfdf5',
  },
  classicImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  classicCardImage: {
    width: '100%',
    height: '100%',
  },
  cornerTopLeft: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 2,
    paddingTop: 1,
  },
  cornerBottomRight: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    transform: [{ rotate: '180deg' }],
    paddingLeft: 2,
    paddingTop: 1,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 14,
    marginBottom: 1,
  },
  redText: {
    color: '#b91c1c',
  },
  blackText: {
    color: '#1e293b',
  },
  centerArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  centerPipSingle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipSingleCol: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  pipGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pipColumn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  pipCenterColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  figureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 5,
    borderWidth: 0.8,
    borderColor: '#e2e8f0',
    paddingVertical: 2,
  },
  figureBadge: {
    backgroundColor: '#0f172a',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  figureText: {
    color: '#f8fafc',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  figureIconWrapper: {
    marginVertical: 2,
  },
  figureNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
});
