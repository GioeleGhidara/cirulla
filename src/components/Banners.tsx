import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CardView } from './CardView';
import { Card, DeckStyle } from '../types/card';
import { theme } from '../theme/tokens';

interface ScopaBannerProps {
  visible: boolean;
  who: 'player' | 'ai';
  count?: number;
}

export const ScopaBanner: React.FC<ScopaBannerProps> = ({ visible, who, count = 1 }) => {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.85);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const isPlayer = who === 'player';
  const label = isPlayer
    ? count > 1
      ? `SCOPA (+${count})`
      : 'SCOPA (+1)'
    : count > 1
    ? `SCOPA AVVERSARIO (+${count})`
    : "SCOPA DELL'AVVERSARIO (+1)";

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.scopaPill,
          isPlayer ? styles.playerScopaPill : styles.aiScopaPill,
          { transform: [{ scale }], opacity },
        ]}
      >
        <Text style={styles.scopaPillText}>{label}</Text>
      </Animated.View>
    </View>
  );
};

interface AccusaBannerProps {
  visible: boolean;
  who: 'player' | 'ai';
  title: string;
  points: number;
  cards: Card[];
  usedMatta?: boolean;
  deckStyle?: DeckStyle;
}

export const AccusaBanner: React.FC<AccusaBannerProps> = ({
  visible,
  who,
  title,
  points,
  cards,
  deckStyle,
}) => {
  const translateY = useRef(new Animated.Value(-16)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateY.setValue(-16);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const actorLabel = who === 'player' ? 'Hai accusato' : "L'avversario accusa";

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.accusaPill,
          { transform: [{ translateY }], opacity },
        ]}
      >
        <View style={styles.accusaTopRow}>
          <Text style={styles.accusaActorText}>{actorLabel}:</Text>
          <Text style={styles.accusaTitleText}>{title}</Text>
          <Text style={styles.accusaPtsText}>+{points} pt</Text>
        </View>

        {cards && cards.length > 0 && (
          <View style={styles.accusaCardsMiniRow}>
            {cards.map((card, idx) => (
              <CardView
                key={`accusa-${card.id}-${idx}`}
                card={card}
                deckStyle={deckStyle}
                width={38}
                height={54}
              />
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

interface MonteBannerProps {
  visible: boolean;
  who: 'player' | 'ai';
  sum: number;
  scopeCount?: number;
}

export const MonteBanner: React.FC<MonteBannerProps> = ({
  visible,
  who,
  sum,
}) => {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.85);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const message = who === 'player' ? `Hai fatto ${sum}` : `L'avversario ha fatto ${sum}`;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.montePill,
          { transform: [{ scale }], opacity },
        ]}
      >
        <Text style={styles.montePillText}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  scopaPill: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: theme.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  playerScopaPill: {
    backgroundColor: '#0f291e',
    borderColor: '#10b981',
  },
  aiScopaPill: {
    backgroundColor: '#1e1b2e',
    borderColor: '#a855f7',
  },
  scopaPillText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.8,
  },
  accusaPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1.5,
    borderColor: theme.colors.accentGold,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
  },
  accusaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accusaActorText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  accusaTitleText: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '800',
  },
  accusaPtsText: {
    fontSize: 14,
    color: theme.colors.accentGoldLight,
    fontWeight: '800',
  },
  accusaCardsMiniRow: {
    flexDirection: 'row',
    gap: 6,
  },
  montePill: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: theme.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.accentGold,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  montePillText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
});
