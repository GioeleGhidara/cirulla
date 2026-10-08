import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CardView } from './CardView';
import { Card } from '../types/card';

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

  const title = who === 'player' ? 'SCOPA!' : "L'AVVERSARIO FA SCOPA!";
  const sub = count > 1 ? `+${count} Punti` : '+1 Punto';

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.scopaBox,
          who === 'player' ? styles.playerScopaBg : styles.aiScopaBg,
          { transform: [{ scale }], opacity },
        ]}
      >
        <Text style={styles.scopaStar}>✨ ⭐ ✨</Text>
        <Text style={styles.scopaTitle}>{title}</Text>
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
}

export const AccusaBanner: React.FC<AccusaBannerProps> = ({
  visible,
  who,
  title,
  points,
  cards,
  usedMatta,
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

  const actor = who === 'player' ? 'HAI DICHIARATO:' : "L'AVVERSARIO HA DICHIARATO:";

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
        <View style={styles.accusaPointsBadge}>
          <Text style={styles.accusaPointsText}>+{points} PUNTI SUBITO!</Text>
        </View>

        {usedMatta && (
          <Text style={styles.mattaUsedText}>🃏 Matta utilizzata con successo</Text>
        )}

        <View style={styles.accusaCardsRow}>
          {cards.map((card, idx) => (
            <CardView
              key={`accusa-${card.id}-${idx}`}
              card={card}
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
  scopeCount: number;
}

export const MonteBanner: React.FC<MonteBannerProps> = ({
  visible,
  who,
  sum,
  scopeCount,
}) => {
  if (!visible) return null;

  const actor = who === 'player' ? 'Sei il mazziere' : "L'avversario è il mazziere";

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.monteBox}>
        <Text style={styles.monteTag}>🎲 REGOLA DEL MONTE</Text>
        <Text style={styles.monteTitle}>
          Tavolo iniziale somma = {sum}!
        </Text>
        <Text style={styles.monteDesc}>
          {actor} e prende tutte le 4 carte a terra facendo {scopeCount}{' '}
          {scopeCount === 1 ? 'Scopa' : 'Scope'} (+{scopeCount} pt)!
        </Text>
      </View>
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
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#fef08a',
  },
  playerScopaBg: {
    backgroundColor: '#047857',
  },
  aiScopaBg: {
    backgroundColor: '#b91c1c',
  },
  scopaStar: {
    fontSize: 20,
    marginBottom: 2,
  },
  scopaTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  scopaSub: {
    color: '#fef08a',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  accusaBox: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#38bdf8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
    maxWidth: 320,
  },
  accusaActor: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  accusaTitle: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
    textAlign: 'center',
  },
  accusaPointsBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 6,
    marginBottom: 8,
  },
  accusaPointsText: {
    color: '#bae6fd',
    fontSize: 12,
    fontWeight: '800',
  },
  mattaUsedText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  accusaCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  monteBox: {
    backgroundColor: '#78350f',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
  },
  monteTag: {
    color: '#fef3c7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  monteTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  monteDesc: {
    color: '#fde68a',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});
