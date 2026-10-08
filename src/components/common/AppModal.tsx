import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/tokens';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number;
  maxHeightRatio?: number;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  footer?: React.ReactNode;
  animationType?: 'slide' | 'fade';
  fullScreenMobile?: boolean;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  icon,
  iconColor = theme.colors.primaryLight,
  badge,
  children,
  maxWidth = 520,
  maxHeightRatio = 0.88,
  scrollable = true,
  contentContainerStyle,
  footer,
  animationType = 'slide',
  fullScreenMobile = false,
}) => {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const isSmallScreen = windowWidth < 480;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.backdrop}>
        <View
          style={[
            styles.modalCard,
            {
              maxWidth,
              maxHeight: windowHeight * maxHeightRatio,
              width: isSmallScreen && fullScreenMobile ? '96%' : '92%',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              {badge && <View style={styles.badgeRow}>{badge}</View>}
              <View style={styles.titleRow}>
                {icon && (
                  <View style={styles.iconBox}>
                    <Ionicons name={icon} size={20} color={iconColor} />
                  </View>
                )}
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
              </View>
              {subtitle && (
                <Text style={styles.subtitle} numberOfLines={2}>
                  {subtitle}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={theme.touch.hitSlop}
              accessibilityLabel="Chiudi finestra"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          {scrollable ? (
            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.staticBody, contentContainerStyle]}>{children}</View>
          )}

          {/* Optional Footer */}
          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    overflow: 'hidden',
    boxShadow: '0px 12px 18px rgba(0, 0, 0, 0.5)',
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerTitleWrap: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  badgeRow: {
    marginBottom: theme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.titleMedium,
    flex: 1,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    marginTop: theme.spacing.xs,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    flexShrink: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  staticBody: {
    padding: theme.spacing.lg,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surfaceSubtle,
  },
});
