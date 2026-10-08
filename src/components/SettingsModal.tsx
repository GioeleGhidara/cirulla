import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeckStyle, AIDifficulty, GameSettings, CardGraphicStyle } from '../types/card';
import { AppModal } from './common/AppModal';
import { PillButton } from './common/PillButton';
import { theme } from '../theme/tokens';

interface SettingsModalProps {
  visible: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
  onRestartMatch: () => void;
  onOpenDeckGallery?: () => void;
  onOpenDeckSkins?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  settings,
  onUpdateSettings,
  onClose,
  onRestartMatch,
  onOpenDeckGallery,
  onOpenDeckSkins,
}) => {
  const update = (partial: Partial<GameSettings>) => {
    onUpdateSettings({ ...settings, ...partial });
  };

  const deckStyles: { id: DeckStyle; label: string }[] = [
    { id: 'genovesi', label: 'Genovesi' },
    { id: 'piacentine', label: 'Piacentine' },
    { id: 'napoletane', label: 'Napoletane' },
  ];

  const graphicStyles: { id: CardGraphicStyle; label: string }[] = [
    { id: 'genovesi_autentiche', label: 'Genovesi Storiche' },
    { id: 'moderno', label: 'Vettoriale Cirulla' },
    { id: 'classico', label: 'Francesi Poker' },
  ];

  const difficulties: { id: AIDifficulty; label: string }[] = [
    { id: 'facile', label: 'Facile' },
    { id: 'normale', label: 'Normale' },
    { id: 'campione', label: 'Campione' },
  ];

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      title="Impostazioni"
      subtitle="Mazzo di gioco, grafica, difficoltà e preferenze"
      icon="settings-outline"
      iconColor={theme.colors.primaryLight}
      maxWidth={520}
      contentContainerStyle={styles.content}
    >
      {/* Traditional Deck Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mazzo Regionale</Text>
        <View style={styles.pillRow}>
          {deckStyles.map((item) => (
            <PillButton
              key={item.id}
              label={item.label}
              isActive={settings.deckStyle === item.id}
              onPress={() => update({ deckStyle: item.id })}
            />
          ))}
        </View>
        <Text style={styles.sectionHint}>
          {settings.deckStyle === 'genovesi'
            ? 'Regole liguri: semi francesi (Cuori, Denari, Picche, Fiori).'
            : 'Semi regionali italiani tradizionali (Coppe, Denari, Spade, Bastoni).'}
        </Text>
      </View>

      {/* Skin & Altervista Browser Nav Button */}
      {onOpenDeckSkins && (
        <Pressable
          style={({ pressed }) => [
            styles.skinsNavBtn,
            pressed && styles.navBtnPressed,
          ]}
          onPress={() => {
            onClose();
            onOpenDeckSkins();
          }}
          accessibilityRole="button"
          accessibilityLabel="Apri catalogo skin mazzi"
        >
          <View style={styles.skinsNavIconBox}>
            <Ionicons name="color-palette-outline" size={20} color={theme.colors.accentGoldLight} />
          </View>
          <View style={styles.skinsNavTextWrap}>
            <Text style={styles.skinsNavTitle}>Scegli Skin del Mazzo</Text>
            <Text style={styles.skinsNavSubtitle}>
              Attivo: {settings.deckSkinId === 'genovesi_dal_negro' || !settings.deckSkinId ? 'Genovesi Dal Negro (Predefinito)' : settings.deckSkinId}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </Pressable>
      )}

      {/* Card Visual Style for Genovesi */}
      {settings.deckStyle === 'genovesi' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stile Grafico Carte</Text>
          <View style={styles.pillRow}>
            {graphicStyles.map((item) => (
              <PillButton
                key={item.id}
                label={item.label}
                isActive={(settings.cardGraphicStyle ?? 'genovesi_autentiche') === item.id}
                onPress={() => update({ cardGraphicStyle: item.id })}
              />
            ))}
          </View>
        </View>
      )}

      {/* Gallery Nav Button */}
      {onOpenDeckGallery && (
        <Pressable
          style={({ pressed }) => [
            styles.galleryNavBtn,
            pressed && styles.navBtnPressed,
          ]}
          onPress={() => {
            onClose();
            onOpenDeckGallery();
          }}
          accessibilityRole="button"
          accessibilityLabel="Mostra tutti i 40 layout delle carte"
        >
          <Ionicons name="images-outline" size={18} color={theme.colors.primaryLight} />
          <Text style={styles.galleryNavText}>Mostra tutti i 40 layout delle carte</Text>
        </Pressable>
      )}

      {/* Target Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Punteggio Vittoria</Text>
        <View style={styles.pillRow}>
          <PillButton
            label="51 Punti (Classico)"
            isActive={settings.targetScore === 51}
            onPress={() => update({ targetScore: 51 })}
          />
          <PillButton
            label="31 Punti (Rapido)"
            isActive={settings.targetScore === 31}
            onPress={() => update({ targetScore: 31 })}
          />
        </View>
      </View>

      {/* AI Difficulty */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Livello Avversario</Text>
        <View style={styles.pillRow}>
          {difficulties.map((diff) => (
            <PillButton
              key={diff.id}
              label={diff.label}
              isActive={settings.aiDifficulty === diff.id}
              onPress={() => update({ aiDifficulty: diff.id })}
            />
          ))}
        </View>
      </View>

      {/* Toggles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Esperienza di Gioco</Text>

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Suoni ed Effetti Audio</Text>
            <Text style={styles.toggleSub}>Feedback sonoro alla presa e alle scope</Text>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(val) => update({ soundEnabled: val })}
            trackColor={{ false: theme.colors.surfaceSubtle, true: theme.colors.primary }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Vibrazione (Feedback Aptico)</Text>
            <Text style={styles.toggleSub}>Vibrazione durante prese e smazzate</Text>
          </View>
          <Switch
            value={settings.hapticsEnabled}
            onValueChange={(val) => update({ hapticsEnabled: val })}
            trackColor={{ false: theme.colors.surfaceSubtle, true: theme.colors.primary }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Selezione Rapida Presa Migliore</Text>
            <Text style={styles.toggleSub}>Pre-seleziona la presa ottimale</Text>
          </View>
          <Switch
            value={settings.autoSelectBestCapture}
            onValueChange={(val) => update({ autoSelectBestCapture: val })}
            trackColor={{ false: theme.colors.surfaceSubtle, true: theme.colors.primary }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Restart match */}
      <Pressable
        style={({ pressed }) => [
          styles.restartBtn,
          pressed && styles.restartBtnPressed,
        ]}
        onPress={() => {
          onClose();
          onRestartMatch();
        }}
        accessibilityRole="button"
        accessibilityLabel="Ricomincia partita"
      >
        <Ionicons name="refresh" size={16} color={theme.colors.danger} />
        <Text style={styles.restartBtnText}>Ricomincia nuova partita</Text>
      </Pressable>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: 0.3,
  },
  sectionHint: {
    fontSize: 11.5,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  skinsNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
    gap: theme.spacing.md,
  },
  skinsNavIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.md,
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skinsNavTextWrap: {
    flex: 1,
  },
  skinsNavTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  skinsNavSubtitle: {
    fontSize: 11.5,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  galleryNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceSubtle,
    paddingVertical: 11,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  galleryNavText: {
    color: theme.colors.primaryLight,
    fontSize: 12.5,
    fontWeight: '700',
  },
  navBtnPressed: {
    opacity: 0.8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  toggleSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    minHeight: 44,
  },
  restartBtnPressed: {
    opacity: 0.75,
  },
  restartBtnText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
