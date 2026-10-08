import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Image } from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Card, CardGraphicStyle, DeckStyle, Suit } from '../types/card';
import { isMatta, isSettebello } from '../engine/rules';

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
  isSelected?: boolean;
  isPlayable?: boolean;
  isHighlighted?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export interface SuitIconProps {
  suit: Suit;
  size?: number;
  deckStyle?: DeckStyle;
}

const FrenchDiamondIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="diamondGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#ef4444" />
        <Stop offset="100%" stopColor="#b91c1c" />
      </LinearGradient>
    </Defs>
    <Path
      d="M12 2.2 L20 12 L12 21.8 L4 12 Z"
      fill="url(#diamondGrad)"
      stroke="#991b1b"
      strokeWidth="0.8"
    />
  </Svg>
);

const FrenchHeartIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#ef4444" />
        <Stop offset="100%" stopColor="#b91c1c" />
      </LinearGradient>
    </Defs>
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="url(#heartGrad)"
      stroke="#991b1b"
      strokeWidth="0.6"
    />
  </Svg>
);

const FrenchSpadeIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="spadeGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#334155" />
        <Stop offset="100%" stopColor="#0f172a" />
      </LinearGradient>
    </Defs>
    <Path
      d="M12 2 C11.3 3.5 5 10.2 5 14.2 C5 17.2 7.3 18.5 9.7 18.5 C10.8 18.5 11.6 18 12 17.3 C12.4 18 13.2 18.5 14.3 18.5 C16.7 18.5 19 17.2 19 14.2 C19 10.2 12.7 3.5 12 2 Z"
      fill="url(#spadeGrad)"
    />
    <Path
      d="M11 16.5 C11 18.8 9.8 20.8 8.8 22 L15.2 22 C14.2 20.8 13 18.8 13 16.5 Z"
      fill="url(#spadeGrad)"
    />
  </Svg>
);

const FrenchClubIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="clubGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#334155" />
        <Stop offset="100%" stopColor="#0f172a" />
      </LinearGradient>
    </Defs>
    <Circle cx="12" cy="7.2" r="4.2" fill="url(#clubGrad)" />
    <Circle cx="7.8" cy="14" r="4.2" fill="url(#clubGrad)" />
    <Circle cx="16.2" cy="14" r="4.2" fill="url(#clubGrad)" />
    <Circle cx="12" cy="12.2" r="3.8" fill="url(#clubGrad)" />
    <Path
      d="M11 13.5 C11 16.5 9.8 19.5 8.5 22 L15.5 22 C14.2 19.5 13 16.5 13 13.5 Z"
      fill="url(#clubGrad)"
    />
  </Svg>
);

const ItalianDenariIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#fde047" />
        <Stop offset="50%" stopColor="#eab308" />
        <Stop offset="100%" stopColor="#ca8a04" />
      </LinearGradient>
    </Defs>
    <Circle cx="12" cy="12" r="10" fill="url(#goldCoinGrad)" stroke="#854d0e" strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="6" fill="none" stroke="#713f12" strokeWidth="1" strokeDasharray="2,2" />
    <Circle cx="12" cy="12" r="3" fill="#ca8a04" />
    <Path d="M12 9v6 M9 12h6" stroke="#854d0e" strokeWidth="1" />
  </Svg>
);

const ItalianCoppeIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#ef4444" />
        <Stop offset="100%" stopColor="#b91c1c" />
      </LinearGradient>
    </Defs>
    <Path
      d="M5 4h14v5c0 3.87-3.13 7-7 7s-7-3.13-7-7V4z"
      fill="url(#cupGrad)"
      stroke="#7f1d1d"
      strokeWidth="1.2"
    />
    <Path d="M11 16h2v4h-2z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
    <Path d="M7 20h10v2H7z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
    <Circle cx="12" cy="8" r="2" fill="#fde047" />
  </Svg>
);

const ItalianSpadeIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="swordGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#60a5fa" />
        <Stop offset="100%" stopColor="#1e3a8a" />
      </LinearGradient>
    </Defs>
    <Path
      d="M6 18c3-4 6-9 12-14 0 5-5 11-9 14l-3 0z"
      fill="url(#swordGrad)"
      stroke="#1e3a8a"
      strokeWidth="1"
    />
    <Path d="M4 19l4-4" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="4" cy="20" r="1.5" fill="#b45309" />
  </Svg>
);

const ItalianBastoniIcon: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="stickGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#22c55e" />
        <Stop offset="100%" stopColor="#15803d" />
      </LinearGradient>
    </Defs>
    <Path
      d="M5 19l14-14c.7.7.7 1.8 0 2.5l-14 14c-.7-.7-.7-1.8 0-2.5z"
      fill="url(#stickGrad)"
      stroke="#166534"
      strokeWidth="1.2"
    />
    <Circle cx="8" cy="14" r="1.5" fill="#f59e0b" />
    <Circle cx="12" cy="10" r="1.5" fill="#f59e0b" />
    <Circle cx="16" cy="6" r="1.5" fill="#f59e0b" />
  </Svg>
);

export const SuitIcon: React.FC<SuitIconProps> = ({
  suit,
  size = 18,
  deckStyle = 'genovesi',
}) => {
  const norm = (suit || '').toLowerCase();
  const isRegional = deckStyle === 'piacentine' || deckStyle === 'napoletane';

  if (isRegional) {
    switch (norm) {
      case 'denari':
        return <ItalianDenariIcon size={size} />;
      case 'coppe':
        return <ItalianCoppeIcon size={size} />;
      case 'spade':
        return <ItalianSpadeIcon size={size} />;
      case 'bastoni':
        return <ItalianBastoniIcon size={size} />;
      default:
        break;
    }
  }

  // Base / Default deck: French suits (Carte Genovesi con segni francesi)
  // "le carte genovesi hanno i segni come quelle francesi, solo forse i quadri si chiamano denari, per il resto uguale"
  switch (norm) {
    case 'quadri':
    case 'denari':
      return <FrenchDiamondIcon size={size} />;
    case 'cuori':
      return <FrenchHeartIcon size={size} />;
    case 'picche':
      return <FrenchSpadeIcon size={size} />;
    case 'fiori':
      return <FrenchClubIcon size={size} />;
    case 'coppe':
      return <ItalianCoppeIcon size={size} />;
    case 'spade':
      return <ItalianSpadeIcon size={size} />;
    case 'bastoni':
      return <ItalianBastoniIcon size={size} />;
    default:
      return <FrenchDiamondIcon size={size} />;
  }
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

export const CardView: React.FC<CardViewProps> = ({
  card,
  faceDown = false,
  deckStyle = 'genovesi',
  graphicStyle = 'moderno',
  isSelected = false,
  isPlayable = false,
  isHighlighted = false,
  onPress,
  width = 72,
  height = 104,
  style,
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);

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

  const showClassicImage =
    graphicStyle === 'classico' && !isRegional && !imageLoadError;
  const classicImgUrl = showClassicImage ? getDeckOfCardsApiUrl(card) : '';

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
      {showClassicImage && classicImgUrl ? (
        <View style={styles.classicImageContainer}>
          <Image
            source={{ uri: classicImgUrl }}
            style={styles.classicCardImage}
            resizeMode="contain"
            onError={() => setImageLoadError(true)}
          />
          {isFigure && (
            <View style={styles.cirullaFigureValPill}>
              <Text style={styles.cirullaFigureValText}>Val: {card.value}</Text>
            </View>
          )}
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

      {/* Badges for special cards: Settebello & Matta */}
      {isSettebelloCard && (
        <View style={styles.settebelloBadge}>
          <Text style={styles.badgeText}>★ 7 BELLO</Text>
        </View>
      )}

      {cardIsMatta && (
        <View style={styles.mattaBadge}>
          <Text style={styles.mattaBadgeText}>🃏 MATTA</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={onPress}
        style={[isSelected && { transform: [{ translateY: -10 }] }]}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

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
  cirullaFigureValPill: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: '#eab308',
  },
  cirullaFigureValText: {
    color: '#fde047',
    fontSize: 7.5,
    fontWeight: '900',
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
  settebelloBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    backgroundColor: '#f59e0b',
    borderRadius: 3,
    alignItems: 'center',
    paddingVertical: 1,
    zIndex: 3,
  },
  badgeText: {
    color: '#78350f',
    fontSize: 7.5,
    fontWeight: '900',
  },
  mattaBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
    alignItems: 'center',
    paddingVertical: 1,
    zIndex: 3,
  },
  mattaBadgeText: {
    color: '#eff6ff',
    fontSize: 7.5,
    fontWeight: '900',
  },
});
