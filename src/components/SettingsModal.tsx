import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeckStyle, AIDifficulty, GameSettings } from '../types/card';

interface SettingsModalProps {
  visible: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
  onRestartMatch: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  settings,
  onUpdateSettings,
  onClose,
  onRestartMatch,
}) => {
  if (!visible) return null;

  const update = (partial: Partial<GameSettings>) => {
    onUpdateSettings({ ...settings, ...partial });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Impostazioni</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent}>
            {/* Stile Mazzo di Carte */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mazzo Tradizionale</Text>
              <View style={styles.pillRow}>
                {(['genovesi', 'piacentine', 'napoletane'] as DeckStyle[]).map((ds) => (
                  <TouchableOpacity
                    key={ds}
                    style={[
                      styles.pillBtn,
                      settings.deckStyle === ds && styles.pillBtnActive,
                    ]}
                    onPress={() => update({ deckStyle: ds })}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        settings.deckStyle === ds && styles.pillTextActive,
                      ]}
                    >
                      {ds.charAt(0).toUpperCase() + ds.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.deckHintText}>
                {settings.deckStyle === 'genovesi'
                  ? 'Base tradizionale: segni francesi (Cuori ♥, Denari ♦, Picche ♠, Fiori ♣).'
                  : 'Semi regionali italiani: Coppe 🏆, Denari 🪙, Spade ⚔, Bastoni 🪵.'}
              </Text>
            </View>

            {/* Punteggio Obiettivo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Punteggio Vittoria</Text>
              <View style={styles.pillRow}>
                <TouchableOpacity
                  style={[
                    styles.pillBtn,
                    settings.targetScore === 51 && styles.pillBtnActive,
                  ]}
                  onPress={() => update({ targetScore: 51 })}
                >
                  <Text
                    style={[
                      styles.pillText,
                      settings.targetScore === 51 && styles.pillTextActive,
                    ]}
                  >
                    51 Punti (Classico)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pillBtn,
                    settings.targetScore === 31 && styles.pillBtnActive,
                  ]}
                  onPress={() => update({ targetScore: 31 })}
                >
                  <Text
                    style={[
                      styles.pillText,
                      settings.targetScore === 31 && styles.pillTextActive,
                    ]}
                  >
                    31 Punti (Rapido)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Difficoltà IA */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Abilità Avversario (IA)</Text>
              <View style={styles.pillRow}>
                {(['facile', 'normale', 'campione'] as AIDifficulty[]).map((diff) => (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.pillBtn,
                      settings.aiDifficulty === diff && styles.pillBtnActive,
                    ]}
                    onPress={() => update({ aiDifficulty: diff })}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        settings.aiDifficulty === diff && styles.pillTextActive,
                      ]}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Toggle Suoni e Aptica */}
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Effetti Sonori</Text>
                <Text style={styles.toggleSub}>Suoni carte, prese e fanfara</Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(val) => update({ soundEnabled: val })}
                trackColor={{ false: '#334155', true: '#0284c7' }}
                thumbColor={settings.soundEnabled ? '#38bdf8' : '#94a3b8'}
              />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Feedback Aptico (Vibrazione)</Text>
                <Text style={styles.toggleSub}>Vibrazione su giocata e scopa</Text>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(val) => update({ hapticsEnabled: val })}
                trackColor={{ false: '#334155', true: '#0284c7' }}
                thumbColor={settings.hapticsEnabled ? '#38bdf8' : '#94a3b8'}
              />
            </View>

            {/* Reset / Nuova Partita */}
            <TouchableOpacity
              style={styles.restartBtn}
              activeOpacity={0.8}
              onPress={() => {
                onRestartMatch();
                onClose();
              }}
            >
              <Ionicons name="refresh-outline" size={18} color="#fca5a5" />
              <Text style={styles.restartBtnText}>Ricomincia Partita da Zero</Text>
            </TouchableOpacity>
          </ScrollView>
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
    maxWidth: 420,
    maxHeight: '85%',
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
  },
  closeBtn: {
    padding: 4,
  },
  scrollList: {
    maxHeight: 460,
  },
  scrollContent: {
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillBtn: {
    flex: 1,
    minWidth: 90,
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  pillText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  deckHintText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  toggleLabel: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  toggleSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  restartBtnText: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '800',
  },
});
