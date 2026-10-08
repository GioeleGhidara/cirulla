import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/tokens';

export interface PillButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  count?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

export const PillButton: React.FC<PillButtonProps> = ({
  label,
  isActive,
  onPress,
  icon,
  count,
  disabled = false,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={theme.touch.hitSlop}
      style={({ pressed }) => [
        styles.pill,
        isActive ? styles.pillActive : styles.pillInactive,
        pressed && !disabled && styles.pillPressed,
        disabled && styles.pillDisabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive, disabled }}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={isActive ? theme.colors.textPrimary : theme.colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          isActive ? styles.textActive : styles.textInactive,
        ]}
      >
        {label}
        {count !== undefined ? ` (${count})` : ''}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    minHeight: 34,
  },
  pillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryLight,
  },
  pillInactive: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderColor: theme.colors.cardBorder,
  },
  pillPressed: {
    opacity: 0.8,
  },
  pillDisabled: {
    opacity: 0.45,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  textActive: {
    color: '#ffffff',
  },
  textInactive: {
    color: theme.colors.textSecondary,
  },
});
