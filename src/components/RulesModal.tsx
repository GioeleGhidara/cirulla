import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CIRULLA_GUIDE } from '../constants/rules';

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }) => {
  const [selectedBadge, setSelectedBadge] = useState<string>('TUTTE');

  if (!visible) return null;

  const badges = ['TUTTE', 'TRADIZIONE', 'LE CARTE', 'IL MONTE', 'LE BUSSATE', 'PRESE', 'PUNTEGGI'];

  const filteredGuide =
    selectedBadge === 'TUTTE'
      ? CIRULLA_GUIDE
      : CIRULLA_GUIDE.filter((g) => g.badge === selectedBadge);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerTitleGroup}>
              <Ionicons name="book" size={22} color="#38bdf8" />
              <Text style={styles.headerTitle}>Regolamento Ufficiale Cirulla</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Chiudi">
              <Ionicons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Filter badges row */}
          <View style={styles.badgesWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesRow}>
              {badges.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.badgeFilterBtn, selectedBadge === b && styles.badgeFilterBtnActive]}
                  onPress={() => setSelectedBadge(b)}
                >
                  <Text style={[styles.badgeFilterText, selectedBadge === b && styles.badgeFilterTextActive]}>
                    {b}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent}>
            {/* Value cheat sheet alert */}
            <View style={styles.valuesCheatSheet}>
              <View style={styles.valuesHeaderRow}>
                <Ionicons name="sparkles" size={16} color="#facc15" />
                <Text style={styles.valuesTitle}>Valori Chiave delle Figure</Text>
              </View>
              <View style={styles.valuesGrid}>
                <View style={styles.valueItem}>
                  <Text style={styles.valueName}>JACK</Text>
                  <Text style={styles.valueNumber}>8</Text>
                </View>
                <View style={styles.valueItem}>
                  <Text style={styles.valueName}>DONNA</Text>
                  <Text style={styles.valueNumber}>9</Text>
                </View>
                <View style={styles.valueItem}>
                  <Text style={styles.valueName}>RE</Text>
                  <Text style={styles.valueNumber}>10</Text>
                </View>
              </View>
            </View>

            {filteredGuide.map((item, index) => (
              <View key={`rule-${index}`} style={styles.ruleCard}>
                <View style={styles.ruleCardHeader}>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{item.badge}</Text>
                  </View>
                </View>

                <Text style={styles.ruleTitle}>{item.title}</Text>
                <Text style={styles.ruleContent}>{item.content}</Text>

                {item.curiosity && (
                  <View style={styles.curiosityBox}>
                    <View style={styles.curiosityHeader}>
                      <Ionicons name="bulb-outline" size={14} color="#f59e0b" />
                      <Text style={styles.curiosityLabel}>Curiosità & Tradizione Ligure</Text>
                    </View>
                    <Text style={styles.curiosityText}>{item.curiosity}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.okBtn} activeOpacity={0.8} onPress={onClose}>
            <Text style={styles.okBtnText}>Torna alla Partita</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
  },
  closeBtn: {
    padding: 4,
  },
  badgesWrapper: {
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badgeFilterBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeFilterBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  badgeFilterText: {
    color: '#94a3b8',
    fontSize: 10.5,
    fontWeight: '800',
  },
  badgeFilterTextActive: {
    color: '#ffffff',
  },
  scrollList: {
    maxHeight: 460,
  },
  scrollContent: {
    gap: 12,
  },
  valuesCheatSheet: {
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.35)',
    padding: 12,
  },
  valuesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  valuesTitle: {
    color: '#fef08a',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  valuesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  valueItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  valueName: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '800',
  },
  valueNumber: {
    color: '#facc15',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  ruleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ruleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tagBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  tagBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  ruleTitle: {
    color: '#facc15',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },
  ruleContent: {
    color: '#cbd5e1',
    fontSize: 12.5,
    lineHeight: 18,
  },
  curiosityBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: 10,
    marginTop: 10,
  },
  curiosityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  curiosityLabel: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  curiosityText: {
    color: '#fde68a',
    fontSize: 11.5,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  okBtn: {
    marginTop: 12,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  okBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
