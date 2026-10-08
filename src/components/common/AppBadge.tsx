import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/tokens';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'gold' | 'danger' | 'outline';

export interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = 'default',
  icon,
  size = 'md',
  style,
}) => {
  const isSmall = size === 'sm';

  const variantStyles = {
    default: {
      bg: theme.colors.surfaceSubtle,
      border: theme.colors.cardBorder,
      text: theme.colors.textSecondary,
      iconColor: theme.colors.textSecondary,
    },
    primary: {
      bg: 'rgba(2, 132, 199, 0.15)',
      border: 'rgba(56, 189, 248, 0.35)',
      text: theme.colors.primaryLight,
      iconColor: theme.colors.primaryLight,
    },
    success: {
      bg: theme.colors.successMuted,
      border: 'rgba(16, 185, 129, 0.35)',
      text: theme.colors.success,
      iconColor: theme.colors.success,
    },
    gold: {
      bg: 'rgba(217, 119, 6, 0.16)',
      border: 'rgba(245, 158, 11, 0.4)',
      text: theme.colors.accentGoldLight,
      iconColor: theme.colors.accentGoldLight,
    },
    danger: {
      bg: theme.colors.dangerMuted,
      border: 'rgba(239, 68, 68, 0.35)',
      text: theme.colors.danger,
      iconColor: theme.colors.danger,
    },
    outline: {
      bg: 'transparent',
      border: theme.colors.cardBorder,
      text: theme.colors.textSecondary,
      iconColor: theme.colors.textSecondary,
    },
  }[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 6 : 8,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={isSmall ? 10 : 12}
          color={variantStyles.iconColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: variantStyles.text,
            fontSize: isSmall ? 10 : 11,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
