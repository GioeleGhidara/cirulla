import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import { CardView } from './CardView';
import { Card, DeckStyle, DeckSkinId, PlayerSide } from '../types/card';
import { playSound } from '../services/audio';
import { theme } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

const useNativeDriver = Platform.OS !== 'web';

export interface DealAnimationOverlayProps {
  visible: boolean;
  isInitialDeal: boolean; // true on Hand 1 (includes shuffle + 4 table cards + hand cards)
  handIndex?: number;
  dealer: PlayerSide;
  deckStyle: DeckStyle;
  deckSkinId?: DeckSkinId;
  tableCards: Card[];
  playerHand: Card[];
  aiHand: Card[];
  onAnimationComplete: () => void;
  soundEnabled?: boolean;
  hapticsEnabled?: boolean;
}

export const DealAnimationOverlay: React.FC<DealAnimationOverlayProps> = ({
  visible,
  isInitialDeal,
  handIndex = 1,
  dealer,
  deckStyle,
  deckSkinId,
  tableCards,
  playerHand,
  onAnimationComplete,
  soundEnabled = true,
  hapticsEnabled = true,
}) => {
  const isTablet = Dimensions.get('window').width > 600;
  const cardWidth = isTablet ? 72 : 58;
  const cardHeight = isTablet ? 104 : 84;
  const deckWidth = cardWidth;
  const deckHeight = cardHeight;

  // Master opacity of the animation overlay
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  // SHUFFLE ANIMATION VALUES
  const leftPackX = useRef(new Animated.Value(0)).current;
  const leftPackRot = useRef(new Animated.Value(0)).current;
  const rightPackX = useRef(new Animated.Value(0)).current;
  const rightPackRot = useRef(new Animated.Value(0)).current;
  const cutPackY = useRef(new Animated.Value(0)).current;
  const cutPackX = useRef(new Animated.Value(0)).current;
  const riffleCard1 = useRef(new Animated.Value(0)).current;
  const riffleCard2 = useRef(new Animated.Value(0)).current;
  const riffleCard3 = useRef(new Animated.Value(0)).current;

  // TABLE CARDS (4 cards) ANIMATION VALUES
  // x, y travel, scale, and flip
  const tableCardAnims = useRef(
    [0, 1, 2, 3].map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(0.8),
      opacity: new Animated.Value(0),
      flip: new Animated.Value(0), // 0: face down, 1: face up
    }))
  ).current;

  // PLAYER CARDS (3 cards) ANIMATION VALUES
  const playerCardAnims = useRef(
    [0, 1, 2].map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rot: new Animated.Value(0),
      opacity: new Animated.Value(0),
      flip: new Animated.Value(0),
    }))
  ).current;

  // AI CARDS (3 cards) ANIMATION VALUES
  const aiCardAnims = useRef(
    [0, 1, 2].map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rot: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Flip state tracker for table cards so we switch faceDown dynamically
  const [tableFlipped, setTableFlipped] = useState<boolean[]>([false, false, false, false]);
  const [playerFlipped, setPlayerFlipped] = useState<boolean[]>([false, false, false]);
  const [animPhase, setAnimPhase] = useState<'shuffle' | 'table' | 'hands' | 'done'>('shuffle');

  const isCompletedRef = useRef(false);
  const timeoutsRef = useRef<any[]>([]);

  const addTimeout = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  };

  const handleSkip = () => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    timeoutsRef.current.forEach(clearTimeout);
    onAnimationComplete();
  };

  useEffect(() => {
    if (!visible) return;
    isCompletedRef.current = false;
    overlayOpacity.setValue(1);
    setTableFlipped([false, false, false, false]);
    setPlayerFlipped([false, false, false]);

    // Coordinates for table cards (relative to center deck)
    const tableTargets = [
      { x: -105, y: -2 },
      { x: -35, y: -2 },
      { x: 35, y: -2 },
      { x: 105, y: -2 },
    ];

    // Coordinates for hands
    const aiTargets = [
      { x: -44, y: -160, rot: -6 },
      { x: 0, y: -164, rot: 0 },
      { x: 44, y: -160, rot: 6 },
    ];

    const playerTargets = [
      { x: -52, y: 160, rot: -5 },
      { x: 0, y: 165, rot: 0 },
      { x: 52, y: 160, rot: 5 },
    ];

    if (isInitialDeal) {
      // ══════════════════════════════════════════════════════════
      // SCENARIO 1: MANO 1/6 (Shuffle + 4 Table Cards + 6 Hand Cards)
      // ══════════════════════════════════════════════════════════
      setAnimPhase('shuffle');
      playSound('shuffle', soundEnabled, hapticsEnabled);

      // Phase 1: Riffle Shuffle & Cut (0ms - 900ms)
      Animated.sequence([
        // Step 1: Split packets
        Animated.parallel([
          Animated.timing(leftPackX, {
            toValue: -38,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver,
          }),
          Animated.timing(leftPackRot, {
            toValue: -8,
            duration: 220,
            useNativeDriver,
          }),
          Animated.timing(rightPackX, {
            toValue: 38,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver,
          }),
          Animated.timing(rightPackRot, {
            toValue: 8,
            duration: 220,
            useNativeDriver,
          }),
        ]),
        // Step 2: Riffle flutter
        Animated.stagger(60, [
          Animated.timing(riffleCard1, { toValue: 1, duration: 120, useNativeDriver }),
          Animated.timing(riffleCard2, { toValue: 1, duration: 120, useNativeDriver }),
          Animated.timing(riffleCard3, { toValue: 1, duration: 120, useNativeDriver }),
        ]),
        // Step 3: Snap packs back together
        Animated.parallel([
          Animated.timing(leftPackX, { toValue: 0, duration: 180, useNativeDriver }),
          Animated.timing(leftPackRot, { toValue: 0, duration: 180, useNativeDriver }),
          Animated.timing(rightPackX, { toValue: 0, duration: 180, useNativeDriver }),
          Animated.timing(rightPackRot, { toValue: 0, duration: 180, useNativeDriver }),
        ]),
        // Step 4: The Cut (taglio)
        Animated.sequence([
          Animated.parallel([
            Animated.timing(cutPackY, { toValue: -20, duration: 110, useNativeDriver }),
            Animated.timing(cutPackX, { toValue: 26, duration: 110, useNativeDriver }),
          ]),
          Animated.parallel([
            Animated.timing(cutPackY, { toValue: 0, duration: 110, useNativeDriver }),
            Animated.timing(cutPackX, { toValue: 0, duration: 110, useNativeDriver }),
          ]),
        ]),
      ]).start();

      // Phase 2: Deal 4 cards to central table (Starts at 950ms)
      addTimeout(() => {
        if (isCompletedRef.current) return;
        setAnimPhase('table');

        tableCardAnims.forEach((anim, idx) => {
          const target = tableTargets[idx];
          addTimeout(() => {
            if (isCompletedRef.current) return;
            anim.opacity.setValue(1);
            playSound('card', soundEnabled, hapticsEnabled);

            Animated.parallel([
              Animated.timing(anim.x, {
                toValue: target.x,
                duration: 320,
                easing: Easing.out(Easing.cubic),
                useNativeDriver,
              }),
              Animated.timing(anim.y, {
                toValue: target.y,
                duration: 320,
                easing: Easing.out(Easing.cubic),
                useNativeDriver,
              }),
              Animated.spring(anim.scale, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver,
              }),
            ]).start(() => {
              // Flip to reveal face
              Animated.timing(anim.flip, {
                toValue: 1,
                duration: 180,
                useNativeDriver,
              }).start();

              addTimeout(() => {
                setTableFlipped((prev) => {
                  const next = [...prev];
                  next[idx] = true;
                  return next;
                });
              }, 90);
            });
          }, idx * 130);
        });
      }, 950);

      // Phase 3: Deal 3 to AI and 3 to Player (Starts at 1700ms)
      addTimeout(() => {
        if (isCompletedRef.current) return;
        setAnimPhase('hands');

        // Alternated dealing ("una a te, una a me")
        [0, 1, 2].forEach((idx) => {
          // AI Card
          addTimeout(() => {
            if (isCompletedRef.current) return;
            const aiAnim = aiCardAnims[idx];
            const aiTarget = aiTargets[idx];
            aiAnim.opacity.setValue(1);
            playSound('card', soundEnabled, hapticsEnabled);

            Animated.parallel([
              Animated.timing(aiAnim.x, {
                toValue: aiTarget.x,
                duration: 280,
                easing: Easing.out(Easing.cubic),
                useNativeDriver,
              }),
              Animated.timing(aiAnim.y, {
                toValue: aiTarget.y,
                duration: 280,
                easing: Easing.out(Easing.cubic),
                useNativeDriver,
              }),
              Animated.timing(aiAnim.rot, {
                toValue: aiTarget.rot,
                duration: 280,
                useNativeDriver,
              }),
            ]).start();
          }, idx * 160);

          // Player Card
          addTimeout(() => {
            if (isCompletedRef.current) return;
            const pAnim = playerCardAnims[idx];
            const pTarget = playerTargets[idx];
            pAnim.opacity.setValue(1);
            playSound('card', soundEnabled, hapticsEnabled);

            Animated.parallel([
              Animated.timing(pAnim.x, {
                toValue: pTarget.x,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver,
              }),
              Animated.timing(pAnim.y, {
                toValue: pTarget.y,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver,
              }),
              Animated.timing(pAnim.rot, {
                toValue: pTarget.rot,
                duration: 300,
                useNativeDriver,
              }),
            ]).start(() => {
              Animated.timing(pAnim.flip, {
                toValue: 1,
                duration: 160,
                useNativeDriver,
              }).start();

              addTimeout(() => {
                setPlayerFlipped((prev) => {
                  const next = [...prev];
                  next[idx] = true;
                  return next;
                });
              }, 80);
            });
          }, idx * 160 + 80);
        });
      }, 1650);

      // Finish at 2400ms
      addTimeout(() => {
        if (isCompletedRef.current) return;
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver,
        }).start(() => {
          isCompletedRef.current = true;
          onAnimationComplete();
        });
      }, 2350);
    } else {
      // ══════════════════════════════════════════════════════════
      // SCENARIO 2: MANI 2-6 (Quick deal of 3+3 cards to hands)
      // ══════════════════════════════════════════════════════════
      setAnimPhase('hands');

      [0, 1, 2].forEach((idx) => {
        addTimeout(() => {
          if (isCompletedRef.current) return;
          const aiAnim = aiCardAnims[idx];
          const aiTarget = aiTargets[idx];
          aiAnim.opacity.setValue(1);
          playSound('card', soundEnabled, hapticsEnabled);

          Animated.parallel([
            Animated.timing(aiAnim.x, {
              toValue: aiTarget.x,
              duration: 260,
              easing: Easing.out(Easing.cubic),
              useNativeDriver,
            }),
            Animated.timing(aiAnim.y, {
              toValue: aiTarget.y,
              duration: 260,
              easing: Easing.out(Easing.cubic),
              useNativeDriver,
            }),
            Animated.timing(aiAnim.rot, {
              toValue: aiTarget.rot,
              duration: 260,
              useNativeDriver,
            }),
          ]).start();
        }, idx * 130);

        addTimeout(() => {
          if (isCompletedRef.current) return;
          const pAnim = playerCardAnims[idx];
          const pTarget = playerTargets[idx];
          pAnim.opacity.setValue(1);
          playSound('card', soundEnabled, hapticsEnabled);

          Animated.parallel([
            Animated.timing(pAnim.x, {
              toValue: pTarget.x,
              duration: 280,
              easing: Easing.out(Easing.cubic),
              useNativeDriver,
            }),
            Animated.timing(pAnim.y, {
              toValue: pTarget.y,
              duration: 280,
              easing: Easing.out(Easing.cubic),
              useNativeDriver,
            }),
            Animated.timing(pAnim.rot, {
              toValue: pTarget.rot,
              duration: 280,
              useNativeDriver,
            }),
          ]).start(() => {
            Animated.timing(pAnim.flip, {
              toValue: 1,
              duration: 160,
              useNativeDriver,
            }).start();

            addTimeout(() => {
              setPlayerFlipped((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, 80);
          });
        }, idx * 130 + 70);
      });

      addTimeout(() => {
        if (isCompletedRef.current) return;
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver,
        }).start(() => {
          isCompletedRef.current = true;
          onAnimationComplete();
        });
      }, 1250);
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [visible, isInitialDeal]);

  if (!visible) return null;

  const dealerLabel = dealer === 'player' ? 'Tu distribuisci le carte' : "L'avversario mescola e distribuisce";
  const actionStatus =
    animPhase === 'shuffle'
      ? 'Taglio e mescolamento...'
      : animPhase === 'table'
      ? 'Distribuzione 4 carte a terra...'
      : `Distribuzione mano ${handIndex}/6...`;

  return (
    <Animated.View style={[styles.overlayContainer, { opacity: overlayOpacity }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleSkip}>
        {/* Subtle dark backdrop over the felt */}
        <View style={styles.darkFeltTint} />

        {/* Top Header Badge */}
        <View style={styles.topStatusPill}>
          <Ionicons name="shuffle-outline" size={14} color={theme.colors.accentGoldLight} />
          <Text style={styles.topStatusDealer}>{dealerLabel}:</Text>
          <Text style={styles.topStatusAction}>{actionStatus}</Text>
        </View>

        {/* Center Area: Shuffling Deck & Animated Flight Stage */}
        <View style={styles.stageCenter}>
          {/* 1. THE DECK AT CENTER (Visible during shuffle & dealing) */}
          <View style={[styles.deckCenterAnchor, { width: deckWidth, height: deckHeight }]}>
            {/* Left pack */}
            <Animated.View
              style={[
                styles.splitPack,
                {
                  transform: [
                    { translateX: leftPackX },
                    {
                      rotate: leftPackRot.interpolate({
                        inputRange: [-10, 10],
                        outputRange: ['-10deg', '10deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <CardView
                faceDown={true}
                deckStyle={deckStyle}
                deckSkinId={deckSkinId}
                width={deckWidth}
                height={deckHeight}
              />
            </Animated.View>

            {/* Right pack */}
            <Animated.View
              style={[
                styles.splitPack,
                {
                  transform: [
                    { translateX: rightPackX },
                    {
                      rotate: rightPackRot.interpolate({
                        inputRange: [-10, 10],
                        outputRange: ['-10deg', '10deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <CardView
                faceDown={true}
                deckStyle={deckStyle}
                deckSkinId={deckSkinId}
                width={deckWidth}
                height={deckHeight}
              />
            </Animated.View>

            {/* The Cut Packet (moves up and slides) */}
            <Animated.View
              style={[
                styles.splitPack,
                {
                  transform: [{ translateX: cutPackX }, { translateY: cutPackY }],
                },
              ]}
            >
              <CardView
                faceDown={true}
                deckStyle={deckStyle}
                deckSkinId={deckSkinId}
                width={deckWidth}
                height={deckHeight}
              />
            </Animated.View>
          </View>

          {/* 2. FLYING TABLE CARDS (4 CARTE SUL PANNO VERDE) */}
          {isInitialDeal &&
            tableCards.slice(0, 4).map((card, idx) => {
              const anim = tableCardAnims[idx];
              const isFlipped = tableFlipped[idx];

              // Smooth scaleX flip effect (1 -> 0 -> 1)
              const scaleX = anim.flip.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0.05, 1],
              });

              return (
                <Animated.View
                  key={`flight-table-${card.id}-${idx}`}
                  style={[
                    styles.flyingCard,
                    {
                      width: cardWidth,
                      height: cardHeight,
                      opacity: anim.opacity,
                      transform: [
                        { translateX: anim.x },
                        { translateY: anim.y },
                        { scale: anim.scale },
                        { scaleX },
                      ],
                    },
                  ]}
                >
                  <CardView
                    card={card}
                    faceDown={!isFlipped}
                    deckStyle={deckStyle}
                    deckSkinId={deckSkinId}
                    width={cardWidth}
                    height={cardHeight}
                  />
                </Animated.View>
              );
            })}

          {/* 3. FLYING CARDS TO OPPONENT HAND (UP) */}
          {[0, 1, 2].map((idx) => {
            const anim = aiCardAnims[idx];
            return (
              <Animated.View
                key={`flight-ai-${idx}`}
                style={[
                  styles.flyingCard,
                  {
                    width: cardWidth,
                    height: cardHeight,
                    opacity: anim.opacity,
                    transform: [
                      { translateX: anim.x },
                      { translateY: anim.y },
                      {
                        rotate: anim.rot.interpolate({
                          inputRange: [-10, 10],
                          outputRange: ['-10deg', '10deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <CardView
                  faceDown={true}
                  deckStyle={deckStyle}
                  deckSkinId={deckSkinId}
                  width={cardWidth}
                  height={cardHeight}
                />
              </Animated.View>
            );
          })}

          {/* 4. FLYING CARDS TO PLAYER HAND (DOWN) */}
          {playerHand.slice(0, 3).map((card, idx) => {
            const anim = playerCardAnims[idx];
            const isFlipped = playerFlipped[idx];

            const scaleX = anim.flip.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0.05, 1],
            });

            return (
              <Animated.View
                key={`flight-player-${card.id}-${idx}`}
                style={[
                  styles.flyingCard,
                  {
                    width: cardWidth,
                    height: cardHeight,
                    opacity: anim.opacity,
                    transform: [
                      { translateX: anim.x },
                      { translateY: anim.y },
                      {
                        rotate: anim.rot.interpolate({
                          inputRange: [-10, 10],
                          outputRange: ['-10deg', '10deg'],
                        }),
                      },
                      { scaleX },
                    ],
                  },
                ]}
              >
                <CardView
                  card={card}
                  faceDown={!isFlipped}
                  deckStyle={deckStyle}
                  deckSkinId={deckSkinId}
                  width={cardWidth}
                  height={cardHeight}
                />
              </Animated.View>
            );
          })}
        </View>

        {/* Skip hint */}
        <View style={styles.skipHintRow}>
          <Text style={styles.skipHintText}>Tocca per saltare</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkFeltTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 20, 12, 0.45)',
  },
  topStatusPill: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.4)',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)',
    elevation: 8,
  },
  topStatusDealer: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  topStatusAction: {
    fontSize: 12,
    color: theme.colors.accentGoldLight,
    fontWeight: '800',
  },
  stageCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  deckCenterAnchor: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitPack: {
    position: 'absolute',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.45)',
    elevation: 8,
  },
  flyingCard: {
    position: 'absolute',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.55)',
    elevation: 12,
  },
  skipHintRow: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.radii.full,
  },
  skipHintText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
