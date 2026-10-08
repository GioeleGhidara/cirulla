import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardView } from './CardView';
import { Card, DeckStyle } from '../types/card';
import { theme } from '../theme/tokens';
import { AppBadge } from './common/AppBadge';

interface ScopaBannerProps {
  visible: boolean;
  who: 'player' | 'ai';
  count?: number;
}

export const ScopaBanner: React.FC<ScopaBannerProps> = ({ visible, who, count = 1 }) => {
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.3);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const isPlayer = who === 'player';
  const title = isPlayer ? 'SCOPA' : "SCOPA DELL'AVVERSARIO";
  const sub = count > 1 ? `+${count} Punti` : '+1 Punto';

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.scopaBox,
          isPlayer ? styles.playerScopaBg : styles.aiScopaBg,
          { transform: [{ scale }], opacity },
        ]}
      >
        <View style={styles.scopaIconRow}>
          <Ionicons name="sparkles" size={18} color="#ffffff" />
          <Text style={styles.scopaTitle}>{title}</Text>
          <Ionicons name="sparkles" size={18} color="#ffffff" />
        </View>
        <Text style={styles.scopaSub}>{sub}</Text>
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
  usedMatta,
  deckStyle,
}) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateY.setValue(-50);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const actor = who === 'player' ? 'Hai dichiarato:' : "L'avversario ha dichiarato:";

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.accusaBox,
          { transform: [{ translateY }], opacity },
        ]}
      >
        <Text style={styles.accusaActor}>{actor}</Text>
        <Text style={styles.accusaTitle}>{title}</Text>
        <View style={styles.accusaBadgeWrap}>
          <AppBadge label={`+${points} punti subito`} variant="gold" icon="flash" size="md" />
        </View>

        {usedMatta && (
          <View style={styles.mattaRow}>
            <Ionicons name="sparkles-outline" size={12} color={theme.colors.accentGoldLight} />
            <Text style={styles.mattaUsedText}>Matta utilizzata nella combinazione</Text>
          </View>
        )}

        <View style={styles.accusaCardsRow}>
          {cards.map((card, idx) => (
            <CardView
              key={`accusa-${card.id}-${idx}`}
              card={card}
              deckStyle={deckStyle}
              width={54}
              height={78}
            />
          ))}
        </View>
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
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.3);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const message = who === 'player' ? `Hai fatto ${sum}` : `L'avversario ha fatto ${sum}`;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.monteBox,
          { transform: [{ scale }], opacity },
        ]}
      >
        <Text style={styles.monteTitle}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  scopaBox: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.radii.xl,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    borderWidth: 1.5,
  },
  playerScopaBg: {
    backgroundColor: theme.colors.feltGreen,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  aiScopaBg: {
    backgroundColor: theme.colors.danger,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  scopaIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scopaTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  scopaSub: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  accusaBox: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radii.xl,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    maxWidth: 380,
  },
  accusaActor: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accusaTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginTop: 2,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  accusaBadgeWrap: {
    marginVertical: 4,
  },
  mattaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  mattaUsedText: {
    fontSize: 11,
    color: theme.colors.accentGoldLight,
    fontWeight: '600',
  },
  accusaCardsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: theme.spacing.md,
  },
  monteBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.accentGold,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 20,
  },
  monteTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
});
