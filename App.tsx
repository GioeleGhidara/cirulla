import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

import { useCirullaGame } from './src/hooks/useCirullaGame';
import { ScoreHeader } from './src/components/ScoreHeader';
import { GameTable } from './src/components/GameTable';
import { ScopaBanner, AccusaBanner, MonteBanner } from './src/components/Banners';
import { CaptureChoiceModal } from './src/components/CaptureChoiceModal';
import { DealSummaryModal } from './src/components/DealSummaryModal';
import { GameOverModal } from './src/components/GameOverModal';
import { SettingsModal } from './src/components/SettingsModal';
import { RulesModal } from './src/components/RulesModal';
import { StatsModal } from './src/components/StatsModal';
import { DeckGalleryModal } from './src/components/DeckGalleryModal';
import { DeckSkinsModal } from './src/components/DeckSkinsModal';

export default function App() {
  const game = useCirullaGame();

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isRulesVisible, setIsRulesVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isDeckGalleryVisible, setIsDeckGalleryVisible] = useState(false);
  const [isDeckSkinsVisible, setIsDeckSkinsVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScoreHeader
        playerScore={game.playerTotalScore}
        aiScore={game.aiTotalScore}
        targetScore={game.settings.targetScore}
        deckCount={game.deckCount}
        playerCaptured={game.playerCaptured}
        aiCaptured={game.aiCaptured}
        playerScope={game.playerScope}
        aiScope={game.aiScope}
        currentHandIndex={game.handIndex}
        aiDifficulty={game.settings.aiDifficulty}
        onOpenSettings={() => setIsSettingsVisible(true)}
        onOpenRules={() => setIsRulesVisible(true)}
        onOpenStats={() => setIsStatsVisible(true)}
        onOpenDeckGallery={() => setIsDeckGalleryVisible(true)}
        onOpenDeckSkins={() => setIsDeckSkinsVisible(true)}
      />

      <GameTable
        deckStyle={game.settings.deckStyle}
        graphicStyle={game.settings.cardGraphicStyle}
        deckSkinId={game.settings.deckSkinId}
        playerHand={game.playerHand}
        aiHand={game.aiHand}
        aiHandRevealed={game.aiHandRevealed}
        tableCards={game.tableCards}
        selectedCard={game.selectedCard}
        selectedMove={game.selectedMove}
        onSelectPlayerCard={game.selectPlayerCard}
        onSelectCaptureMove={game.selectCaptureMove}
        onToggleTableCard={game.toggleTableCard}
        onOpenChoiceModal={game.openChoiceModal}
        onConfirmPlayCard={game.confirmPlayCard}
        availableMovesForSelected={game.availableMovesForSelected}
        isPlayerTurn={game.isPlayerTurn}
        playerCaptured={game.playerCaptured}
        aiCaptured={game.aiCaptured}
        lastActionMessage={game.lastActionMessage}
      />

      <CaptureChoiceModal
        visible={game.isChoiceModalVisible}
        moves={game.choiceMoves}
        deckStyle={game.settings.deckStyle}
        deckSkinId={game.settings.deckSkinId}
        onSelectMove={game.executeChosenCapture}
        onCancel={game.cancelChoiceModal}
      />

      <DealSummaryModal
        visible={game.isDealSummaryVisible}
        scores={game.dealSummary}
        playerTotal={game.playerTotalScore}
        aiTotal={game.aiTotalScore}
        targetScore={game.settings.targetScore}
        onNextDeal={game.proceedToNextDealOrEnd}
      />

      <GameOverModal
        visible={game.isGameOverVisible}
        playerTotal={game.playerTotalScore}
        aiTotal={game.aiTotalScore}
        targetScore={game.settings.targetScore}
        onNewGame={game.restartMatch}
      />

      <SettingsModal
        visible={isSettingsVisible}
        settings={game.settings}
        onUpdateSettings={game.updateSettings}
        onClose={() => setIsSettingsVisible(false)}
        onRestartMatch={game.restartMatch}
        onOpenDeckGallery={() => setIsDeckGalleryVisible(true)}
        onOpenDeckSkins={() => setIsDeckSkinsVisible(true)}
      />

      <RulesModal
        visible={isRulesVisible}
        onClose={() => setIsRulesVisible(false)}
      />

      <StatsModal
        visible={isStatsVisible}
        stats={game.stats}
        onClose={() => setIsStatsVisible(false)}
        onResetStats={game.resetStats}
      />

      <DeckGalleryModal
        visible={isDeckGalleryVisible}
        onClose={() => setIsDeckGalleryVisible(false)}
        currentDeckStyle={game.settings.deckStyle}
        currentGraphicStyle={game.settings.cardGraphicStyle}
        currentSkinId={game.settings.deckSkinId}
        onSelectGraphicStyle={(style) => game.updateSettings({ ...game.settings, cardGraphicStyle: style })}
        onSelectDeckStyle={(style) => game.updateSettings({ ...game.settings, deckStyle: style })}
      />

      <DeckSkinsModal
        visible={isDeckSkinsVisible}
        onClose={() => setIsDeckSkinsVisible(false)}
        currentSkinId={game.settings.deckSkinId ?? 'genovesi_dal_negro'}
        onSelectSkin={(skinId) => {
          game.updateSettings({ ...game.settings, deckSkinId: skinId });
        }}
      />

      <ScopaBanner
        visible={game.scopaBanner.visible}
        who={game.scopaBanner.who}
        count={game.scopaBanner.count}
      />

      <AccusaBanner
        visible={game.accusaBanner.visible}
        who={game.accusaBanner.who}
        title={game.accusaBanner.title}
        points={game.accusaBanner.points}
        cards={game.accusaBanner.cards}
        usedMatta={game.accusaBanner.usedMatta}
        deckStyle={game.settings.deckStyle}
      />

      <MonteBanner
        visible={game.monteBanner.visible}
        who={game.monteBanner.who}
        sum={game.monteBanner.sum}
        scopeCount={game.monteBanner.scopeCount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
