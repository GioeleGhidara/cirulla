import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CIRULLA_GUIDE } from '../constants/rules';
import { AppModal } from './common/AppModal';
import { AppBadge } from './common/AppBadge';
import { PillButton } from './common/PillButton';
import { theme } from '../theme/tokens';

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }) => {
  const [selectedBadge, setSelectedBadge] = useState<string>('TUTTE');

  const badges = ['TUTTE', 'TRADIZIONE', 'LE CARTE', 'IL MONTE', 'LE BUSSATE', 'PRESE', 'PUNTEGGI'];

  const filteredGuide =
    selectedBadge === 'TUTTE'
      ? CIRULLA_GUIDE
      : CIRULLA_GUIDE.filter((g) => g.badge === selectedBadge);

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Regolamento Cirulla"
      subtitle="Tradizione ligure, valori delle figure, prese e conteggio punti"
      icon="book-outline"
      iconColor={theme.colors.primaryLight}
      maxWidth={580}
      scrollable={false}
      contentContainerStyle={styles.modalContent}
    >
      {/* Category Pills Bar */}
      <View style={styles.badgesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesRow}
        >
          {badges.map((b) => (
            <PillButton
              key={b}
              label={b}
              isActive={selectedBadge === b}
              onPress={() => setSelectedBadge(b)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Figure Values Cheat Sheet */}
        <View style={styles.valuesCheatSheet}>
          <View style={styles.valuesHeaderRow}>
            <Ionicons name="information-circle-outline" size={16} color={theme.colors.accentGoldLight} />
            <Text style={styles.valuesTitle}>Valori delle Figure in Cirulla</Text>
          </View>
          <View style={styles.valuesGrid}>
            <View style={styles.valueItem}>
              <Text style={styles.valueName}>FANTE (JACK)</Text>
              <Text style={styles.valueNumber}>8</Text>
            </View>
            <View style={styles.valueItem}>
              <Text style={styles.valueName}>DONNA (CAVALLO)</Text>
              <Text style={styles.valueNumber}>9</Text>
            </View>
            <View style={styles.valueItem}>
              <Text style={styles.valueName}>RE</Text>
              <Text style={styles.valueNumber}>10</Text>
            </View>
          </View>
        </View>

        {/* Rules Cards */}
        {filteredGuide.map((item, index) => (
          <View key={`rule-${index}`} style={styles.ruleCard}>
            <View style={styles.ruleCardHeader}>
              <AppBadge label={item.badge} variant="primary" size="sm" />
            </View>

            <Text style={styles.ruleTitle}>{item.title}</Text>
            <Text style={styles.ruleContent}>{item.content}</Text>

            {item.curiosity && (
              <View style={styles.curiosityBox}>
                <View style={styles.curiosityHeader}>
                  <Ionicons name="sparkles-outline" size={14} color={theme.colors.accentGoldLight} />
                  <Text style={styles.curiosityLabel}>Curiosità e Tradizione</Text>
                </View>
                <Text style={styles.curiosityText}>{item.curiosity}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 0,
    flex: 1,
  },
  badgesWrapper: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  badgesRow: {
    gap: theme.spacing.sm,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  valuesCheatSheet: {
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  valuesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  valuesTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: theme.colors.accentGoldLight,
    letterSpacing: 0.3,
  },
  valuesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  valueItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  valueName: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.4,
  },
  valueNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
  },
  ruleCard: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  ruleCardHeader: {
    marginBottom: theme.spacing.sm,
  },
  ruleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  ruleContent: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.textSecondary,
  },
  curiosityBox: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  curiosityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  curiosityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.accentGoldLight,
  },
  curiosityText: {
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});
