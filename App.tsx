import React, { useState, useEffect, useCallback } from 'react';
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
import { HomeScreen } from './src/components/screens/HomeScreen';
import { MatchSetupModal } from './src/components/screens/MatchSetupModal';
import { ProfileModal } from './src/components/screens/ProfileModal';

import {
  loadPlayerProfile,
  savePlayerProfile,
  DEFAULT_PROFILE,
  AVAILABLE_AVATARS,
  evaluateTrophiesEarned,
} from './src/services/profileStorage';
import { getInstalledDeckIds } from './src/services/deckStorage';
import { PlayerProfile } from './src/types/profile';
import { AIDifficulty, DeckSkinId, GameSettings, PlayerSide } from './src/types/card';

export default function App() {
  const game = useCirullaGame();

  // Root Navigation: 'home' = Menu Principale / Schermata di Benvenuto, 'game' = Tavolo da Gioco
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game'>('home');

  // Modals state
  const [isMatchSetupVisible, setIsMatchSetupVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isRulesVisible, setIsRulesVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isDeckGalleryVisible, setIsDeckGalleryVisible] = useState(false);
  const [isDeckSkinsVisible, setIsDeckSkinsVisible] = useState(false);

  // Player Profile & Skins sync
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [installedDeckCount, setInstalledDeckCount] = useState<number>(3);

  // Load player profile & installed decks on launch
  useEffect(() => {
    loadPlayerProfile().then((p) => {
      setPlayerProfile(p);
    });
    getInstalledDeckIds().then((ids) => {
      setInstalledDeckCount(ids.length);
    });
  }, []);

  // Sync profile trophies whenever game stats change
  useEffect(() => {
    if (game.stats.gamesPlayed > 0) {
      const { updatedProfile } = evaluateTrophiesEarned(playerProfile, game.stats);
      if (
        updatedProfile.xp !== playerProfile.xp ||
        updatedProfile.unlockedTrophyIds.length !== playerProfile.unlockedTrophyIds.length
      ) {
        setPlayerProfile(updatedProfile);
        savePlayerProfile(updatedProfile);
      }
    }
  }, [game.stats, playerProfile]);

  // Sync installed decks count whenever deck skins modal is closed/opened
  const refreshInstalledDecks = useCallback(() => {
    getInstalledDeckIds().then((ids) => {
      setInstalledDeckCount(ids.length);
    });
  }, []);

  // Determine if there is an ongoing match
  const hasActiveMatch =
    game.deckCount > 0 ||
    game.playerHand.length > 0 ||
    game.playerTotalScore > 0 ||
    game.aiTotalScore > 0;

  const currentAvatar =
    AVAILABLE_AVATARS.find((a) => a.id === playerProfile.avatarId) ?? AVAILABLE_AVATARS[0];

  const handleStartConfiguredMatch = (options: {
    targetScore: 31 | 51;
    aiDifficulty: AIDifficulty;
    dealer: PlayerSide;
    deckSkinId?: DeckSkinId;
  }) => {
    const updatedSettings: GameSettings = {
      ...game.settings,
      targetScore: options.targetScore,
      aiDifficulty: options.aiDifficulty,
      deckSkinId: options.deckSkinId ?? game.settings.deckSkinId,
    };

    game.updateSettings(updatedSettings);
    game.restartMatch(updatedSettings, options.dealer);
    setCurrentScreen('game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090e17" />

      {/* Screen 1: Home / Hub Principale */}
      {currentScreen === 'home' ? (
        <HomeScreen
          hasActiveMatch={hasActiveMatch}
          activeMatchInfo={
            hasActiveMatch
              ? {
                  playerScore: game.playerTotalScore,
                  aiScore: game.aiTotalScore,
                  targetScore: game.settings.targetScore,
                  handIndex: game.handIndex,
                  dealer: game.dealer,
                }
              : undefined
          }
          playerProfile={playerProfile}
          settings={game.settings}
          stats={game.stats}
          installedDeckCount={installedDeckCount}
          onResumeMatch={() => setCurrentScreen('game')}
          onOpenMatchSetup={() => setIsMatchSetupVisible(true)}
          onOpenProfile={() => setIsProfileVisible(true)}
          onOpenDeckSkins={() => {
            refreshInstalledDecks();
            setIsDeckSkinsVisible(true);
          }}
          onOpenDeckGallery={() => setIsDeckGalleryVisible(true)}
          onOpenRules={() => setIsRulesVisible(true)}
          onOpenStats={() => setIsStatsVisible(true)}
          onOpenSettings={() => setIsSettingsVisible(true)}
        />
      ) : (
        /* Screen 2: Tavolo da Gioco (Game Table) */
        <>
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
            playerName={playerProfile.name}
            playerAvatarIcon={currentAvatar.icon}
            playerAvatarColor={currentAvatar.color}
            onGoHome={() => setCurrentScreen('home')}
            onOpenSettings={() => setIsSettingsVisible(true)}
            onOpenRules={() => setIsRulesVisible(true)}
            onOpenStats={() => setIsStatsVisible(true)}
            onOpenDeckGallery={() => setIsDeckGalleryVisible(true)}
            onOpenDeckSkins={() => {
              refreshInstalledDecks();
              setIsDeckSkinsVisible(true);
            }}
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
            selectedTableCardIds={game.selectedTableCardIds}
            lastPlayedCardByAI={game.lastPlayedCardByAI}
            aiTargetCardIds={game.aiTargetCardIds}
            isShufflingOrDealing={game.isShufflingOrDealing}
            dealingMessage={game.dealingMessage}
            deckCount={game.deckCount}
            dealer={game.dealer}
            handIndex={game.handIndex}
            onFinishDealing={game.finishDealing}
            onSelectPlayerCard={game.selectPlayerCard}
            onToggleTableCard={game.toggleTableCard}
            onClearTableSelection={game.clearTableSelection}
            onConfirmPlayCard={game.confirmPlayCard}
            isPlayerTurn={game.isPlayerTurn}
            playerCaptured={game.playerCaptured}
            aiCaptured={game.aiCaptured}
            lastActionMessage={game.lastActionMessage}
            playerName={playerProfile.name}
            playerAvatarIcon={currentAvatar.icon}
            playerAvatarColor={currentAvatar.color}
          />
        </>
      )}

      {/* Match Setup Flow */}
      <MatchSetupModal
        visible={isMatchSetupVisible}
        onClose={() => setIsMatchSetupVisible(false)}
        currentSettings={game.settings}
        onStartMatch={handleStartConfiguredMatch}
        onOpenSkinsModal={() => {
          refreshInstalledDecks();
          setIsDeckSkinsVisible(true);
        }}
      />

      {/* Player Profile & Career Modal */}
      <ProfileModal
        visible={isProfileVisible}
        profile={playerProfile}
        stats={game.stats}
        onClose={() => setIsProfileVisible(false)}
        onUpdateProfile={(updated) => setPlayerProfile(updated)}
      />

      {/* Game Over Modal */}
      <GameOverModal
        visible={game.isGameOverVisible}
        playerTotal={game.playerTotalScore}
        aiTotal={game.aiTotalScore}
        targetScore={game.settings.targetScore}
        onNewGame={() => {
          setIsMatchSetupVisible(true);
        }}
      />

      {/* Choice Modal */}
      <CaptureChoiceModal
        visible={game.isChoiceModalVisible}
        moves={game.choiceMoves}
        deckStyle={game.settings.deckStyle}
        deckSkinId={game.settings.deckSkinId}
        onSelectMove={game.executeChosenCapture}
        onCancel={game.cancelChoiceModal}
      />

      {/* Deal Summary Modal */}
      <DealSummaryModal
        visible={game.isDealSummaryVisible}
        scores={game.dealSummary}
        playerTotal={game.playerTotalScore}
        aiTotal={game.aiTotalScore}
        targetScore={game.settings.targetScore}
        onNextDeal={game.proceedToNextDealOrEnd}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={isSettingsVisible}
        settings={game.settings}
        onUpdateSettings={game.updateSettings}
        onClose={() => setIsSettingsVisible(false)}
        onRestartMatch={() => {
          setIsSettingsVisible(false);
          setIsMatchSetupVisible(true);
        }}
        onOpenDeckGallery={() => setIsDeckGalleryVisible(true)}
        onOpenDeckSkins={() => {
          refreshInstalledDecks();
          setIsDeckSkinsVisible(true);
        }}
      />

      {/* Rules Modal */}
      <RulesModal
        visible={isRulesVisible}
        onClose={() => setIsRulesVisible(false)}
      />

      {/* Stats Modal */}
      <StatsModal
        visible={isStatsVisible}
        stats={game.stats}
        onClose={() => setIsStatsVisible(false)}
        onResetStats={game.resetStats}
      />

      {/* Deck Gallery Modal */}
      <DeckGalleryModal
        visible={isDeckGalleryVisible}
        onClose={() => setIsDeckGalleryVisible(false)}
        currentDeckStyle={game.settings.deckStyle}
        currentGraphicStyle={game.settings.cardGraphicStyle}
        currentSkinId={game.settings.deckSkinId}
        onSelectGraphicStyle={(style) =>
          game.updateSettings({ ...game.settings, cardGraphicStyle: style })
        }
        onSelectDeckStyle={(style) =>
          game.updateSettings({ ...game.settings, deckStyle: style })
        }
      />

      {/* Deck Skins Modal (Store & Download) */}
      <DeckSkinsModal
        visible={isDeckSkinsVisible}
        onClose={() => {
          setIsDeckSkinsVisible(false);
          refreshInstalledDecks();
        }}
        currentSkinId={game.settings.deckSkinId ?? 'genovesi_dal_negro'}
        onSelectSkin={(skinId) => {
          game.updateSettings({ ...game.settings, deckSkinId: skinId });
          refreshInstalledDecks();
        }}
      />

      {/* In-Game Gameplay Banners */}
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
    backgroundColor: '#090e17',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
