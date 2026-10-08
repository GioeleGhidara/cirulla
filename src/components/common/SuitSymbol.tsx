import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Suit } from '../../types/card';
import { theme } from '../../theme/tokens';

export interface SuitSymbolProps {
  suit: Suit | string;
  size?: number;
  showLabel?: boolean;
  labelOverride?: string;
}

export const SuitSymbol: React.FC<SuitSymbolProps> = ({
  suit,
  size = 16,
  showLabel = false,
  labelOverride,
}) => {
  const norm = (suit || '').toLowerCase();

  const getGlyph = () => {
    switch (norm) {
      case 'denari':
      case 'quadri':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M12 2 L21 12 L12 22 L3 12 Z" fill="#ef4444" />
          </Svg>
        );

      case 'cuori':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#ef4444"
            />
          </Svg>
        );

      case 'picche':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M12 2 C8 7 4 10.5 4 14.5 C4 17.5 6.5 20 9.5 20 C10.5 20 11.4 19.6 12 19 C12 20.5 11 22 9.5 22 L14.5 22 C13 22 12 20.5 12 19 C12.6 19.6 13.5 20 14.5 20 C17.5 20 20 17.5 20 14.5 C20 10.5 16 7 12 2 Z"
              fill="#e2e8f0"
            />
          </Svg>
        );

      case 'fiori':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="7.5" r="4.5" fill="#e2e8f0" />
            <Circle cx="7.5" cy="14" r="4.5" fill="#e2e8f0" />
            <Circle cx="16.5" cy="14" r="4.5" fill="#e2e8f0" />
            <Path d="M10.5 22 L13.5 22 L12.5 14 L11.5 14 Z" fill="#e2e8f0" />
          </Svg>
        );

      case 'coppe':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M6 4 L18 4 L17 12 C17 15 14 17 12 17 C10 17 7 15 7 12 Z" fill="#f59e0b" />
            <Rect x="11" y="17" width="2" height="4" fill="#f59e0b" />
            <Rect x="8" y="21" width="8" height="2" rx="1" fill="#f59e0b" />
          </Svg>
        );

      case 'spade':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d="M12 2 L14 16 L10 16 Z" fill="#38bdf8" />
            <Rect x="7" y="16" width="10" height="2" rx="1" fill="#e2e8f0" />
            <Rect x="11" y="18" width="2" height="4" fill="#94a3b8" />
          </Svg>
        );

      case 'bastoni':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Rect x="10.5" y="3" width="3" height="18" rx="1.5" fill="#10b981" />
            <Circle cx="12" cy="6" r="2.5" fill="#059669" />
            <Circle cx="12" cy="18" r="2.5" fill="#059669" />
          </Svg>
        );

      default:
        return null;
    }
  };

  const getLabelText = () => {
    if (labelOverride) return labelOverride;
    switch (norm) {
      case 'denari':
        return 'Denari';
      case 'quadri':
        return 'Denari (Quadri)';
      case 'cuori':
        return 'Cuori';
      case 'picche':
        return 'Picche';
      case 'fiori':
        return 'Fiori';
      case 'coppe':
        return 'Coppe';
      case 'spade':
        return 'Spade';
      case 'bastoni':
        return 'Bastoni';
      default:
        return suit;
    }
  };

  return (
    <View style={styles.container}>
      {getGlyph()}
      {showLabel && <Text style={styles.label}>{getLabelText()}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
});
