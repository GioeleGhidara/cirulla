import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CIRULLA_GUIDE } from '../constants/rules';

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerTitleGroup}>
              <Ionicons name="book" size={22} color="#38bdf8" />
              <Text style={styles.headerTitle}>Regole della Cirulla</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent}>
            <View style={styles.introBox}>
              <Text style={styles.introText}>
                La Cirulla è la celebre variante ligure della Scopa. Vivace e
                ricca di ribaltamenti, si gioca con 40 carte e premia sia il colpo
                d'occhio nel calcolare le somme a 15, sia la tattica nell'accumulare
                Denari e Scope.
              </Text>
            </View>

            {CIRULLA_GUIDE.map((item, index) => (
              <View key={`rule-${index}`} style={styles.ruleCard}>
                <Text style={styles.ruleTitle}>{item.title}</Text>
                <Text style={styles.ruleContent}>{item.content}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.okBtn} activeOpacity={0.8} onPress={onClose}>
            <Text style={styles.okBtnText}>Ho Capito, Giochiamo!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    width: '100%',
    maxWidth: 440,
    maxHeight: '88%',
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  closeBtn: {
    padding: 4,
  },
  scrollList: {
    maxHeight: 460,
  },
  scrollContent: {
    gap: 12,
  },
  introBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  introText: {
    color: '#bae6fd',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  ruleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ruleTitle: {
    color: '#facc15',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  ruleContent: {
    color: '#cbd5e1',
    fontSize: 12.5,
    lineHeight: 18,
  },
  okBtn: {
    marginTop: 14,
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
