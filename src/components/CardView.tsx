import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Card, DeckStyle, Suit } from '../types/card';
import { isMatta } from '../engine/rules';

interface CardViewProps {
  card?: Card;
  faceDown?: boolean;
  deckStyle?: DeckStyle;
  isSelected?: boolean;
  isPlayable?: boolean;
  isHighlighted?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const SuitIcon: React.FC<{ suit: Suit; size?: number }> = ({ suit, size = 18 }) => {
  switch (suit) {
    case 'denari':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#fde047" />
              <Stop offset="50%" stopColor="#eab308" />
              <Stop offset="100%" stopColor="#ca8a04" />
            </LinearGradient>
          </Defs>
          <Circle cx="12" cy="12" r="10" fill="url(#goldGrad)" stroke="#854d0e" strokeWidth="1.5" />
          <Circle cx="12" cy="12" r="6" fill="none" stroke="#713f12" strokeWidth="1" strokeDasharray="2,2" />
          <Circle cx="12" cy="12" r="3" fill="#ca8a04" />
        </Svg>
      );
    case 'coppe':
      return (
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
    case 'spade':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="swordGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#60a5fa" />
              <Stop offset="100%" stopColor="#1e3a8a" />
            </LinearGradient>
          </Defs>
          {/* Curved Genoese scimitar */}
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
    case 'bastoni':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="stickGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#22c55e" />
              <Stop offset="100%" stopColor="#15803d" />
            </LinearGradient>
          </Defs>
          {/* Ceremonial knotted baton */}
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
  }
};

const FigureArtwork: React.FC<{ rank: number; suit: Suit; size: number }> = ({
  rank,
  suit,
  size,
}) => {
  const label = rank === 8 ? 'FANTE' : rank === 9 ? 'CAVALLO' : 'RE';
  const subLabel = rank === 8 ? '8' : rank === 9 ? '9' : '10';

  return (
    <View style={[styles.figureContainer, { width: size, height: size * 1.3 }]}>
      <View style={styles.figureBadge}>
        <Text style={styles.figureText}>{label}</Text>
      </View>
      <View style={styles.figureIconWrapper}>
        <SuitIcon suit={suit} size={size * 0.45} />
      </View>
      <Text style={styles.figureNumber}>{subLabel}</Text>
    </View>
  );
};

export const CardView: React.FC<CardViewProps> = ({
  card,
  faceDown = false,
  deckStyle = 'genovesi',
  isSelected = false,
  isPlayable = false,
  isHighlighted = false,
  onPress,
  width = 72,
  height = 104,
  style,
}) => {
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
  const isSettebello = card.suit === 'denari' && card.rank === 7;
  const cardIsMatta = isMatta(card);

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
      {/* Top Left Rank & Suit */}
      <View style={styles.cornerTopLeft}>
        <Text
          style={[
            styles.rankText,
            card.suit === 'denari' || card.suit === 'coppe'
              ? styles.redText
              : styles.blackText,
          ]}
        >
          {card.rank}
        </Text>
        <SuitIcon suit={card.suit} size={width * 0.18} />
      </View>

      {/* Center artwork */}
      <View style={styles.centerArea}>
        {isFigure ? (
          <FigureArtwork rank={card.rank} suit={card.suit} size={width * 0.65} />
        ) : (
          <View style={styles.pipsContainer}>
            <SuitIcon suit={card.suit} size={width * 0.36} />
            {card.rank > 1 && (
              <Text style={styles.centerRankText}>{card.rank}</Text>
            )}
          </View>
        )}
      </View>

      {/* Badges for special cards: Settebello & Matta */}
      {isSettebello && (
        <View style={styles.settebelloBadge}>
          <Text style={styles.badgeText}>★ 7 BELLO</Text>
        </View>
      )}

      {cardIsMatta && (
        <View style={styles.mattaBadge}>
          <Text style={styles.mattaBadgeText}>🃏 MATTA</Text>
        </View>
      )}

      {/* Bottom Right Rank & Suit (Inverted) */}
      <View style={styles.cornerBottomRight}>
        <Text
          style={[
            styles.rankText,
            card.suit === 'denari' || card.suit === 'coppe'
              ? styles.redText
              : styles.blackText,
          ]}
        >
          {card.rank}
        </Text>
        <SuitIcon suit={card.suit} size={width * 0.18} />
      </View>
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
  pipsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRankText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2,
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
