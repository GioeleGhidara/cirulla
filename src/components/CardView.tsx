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

export const DalNegroCardBack: React.FC<{
  width: number;
  height: number;
  color?: 'blue' | 'red';
}> = ({ width, height, color = 'blue' }) => {
  const primaryColor = color === 'blue' ? '#1e3a8a' : '#881337';
  const darkColor = color === 'blue' ? '#0f172a' : '#4c0519';
  const accentGold = '#fbbf24';
  const lightGold = '#fef08a';

  return (
    <View style={{ width, height, overflow: 'hidden', borderRadius: 6, backgroundColor: '#ffffff' }}>
      <Svg width={width} height={height} viewBox="0 0 100 148">
        <Defs>
          <LinearGradient id={`cardBackGrad-${color}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="50%" stopColor={darkColor} />
            <Stop offset="100%" stopColor={primaryColor} />
          </LinearGradient>
        </Defs>

        {/* Outer White Card Margin */}
        <Rect x="1" y="1" width="98" height="146" rx="6" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />

        {/* Colored Field */}
        <Rect x="4" y="4" width="92" height="140" rx="4" ry="4" fill={`url(#cardBackGrad-${color})`} />

        {/* Gold Outer Filigree Border */}
        <Rect x="7" y="7" width="86" height="134" rx="3" ry="3" fill="none" stroke={accentGold} strokeWidth="1.2" />

        {/* Inner Dashed Border */}
        <Rect
          x="10"
          y="10"
          width="80"
          height="128"
          rx="2"
          ry="2"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.8"
          strokeDasharray="3,2"
        />

        {/* Corner Flourishes */}
        <Path d="M12 12 L20 12 M12 12 L12 20" stroke={accentGold} strokeWidth="1.5" />
        <Path d="M88 12 L80 12 M88 12 L88 20" stroke={accentGold} strokeWidth="1.5" />
        <Path d="M12 136 L20 136 M12 136 L12 128" stroke={accentGold} strokeWidth="1.5" />
        <Path d="M88 136 L80 136 M88 136 L88 128" stroke={accentGold} strokeWidth="1.5" />

        {/* Diamond Lattice Pattern */}
        <Path
          d="M26 44 L38 56 L26 68 L14 56 Z M74 44 L86 56 L74 68 L62 56 Z M26 80 L38 92 L26 104 L14 92 Z M74 80 L86 92 L74 104 L62 92 Z"
          fill="none"
          stroke="rgba(251, 191, 36, 0.45)"
          strokeWidth="0.9"
        />
        <Circle cx="26" cy="56" r="1.5" fill={lightGold} />
        <Circle cx="74" cy="56" r="1.5" fill={lightGold} />
        <Circle cx="26" cy="92" r="1.5" fill={lightGold} />
        <Circle cx="74" cy="92" r="1.5" fill={lightGold} />

        {/* Central Medallion */}
        <Circle cx="50" cy="74" r="21" fill={darkColor} stroke={accentGold} strokeWidth="1.6" />
        <Circle cx="50" cy="74" r="17" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" strokeDasharray="2,2" />

        {/* Symmetrical 8-point Star */}
        <Path
          d="M50 59 L53 69 L63 66 L57 74 L63 82 L53 79 L50 89 L47 79 L37 82 L43 74 L37 66 L47 69 Z"
          fill={accentGold}
        />
        <Circle cx="50" cy="74" r="5" fill={primaryColor} stroke={lightGold} strokeWidth="1" />
        <Circle cx="50" cy="74" r="2" fill={lightGold} />
      </Svg>
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

  const useSkinBack = activeSkinId !== 'moderno' && activeSkinId !== 'genovesi_dal_negro';
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
        {activeSkinId === 'genovesi_dal_negro' || activeSkinId === 'moderno' || !skinBack ? (
          <DalNegroCardBack width={width} height={height} color="blue" />
        ) : (
          <View style={styles.classicImageContainer}>
            <Image
              source={skinBack}
              style={styles.classicCardImage}
              resizeMode="cover"
            />
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
