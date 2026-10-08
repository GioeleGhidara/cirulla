import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import {
  Card,
  CaptureMove,
  DealScores,
  GameSettings,
  GameStats,
} from './src/types/card';
import { createDeck, shuffleDeck } from './src/engine/deck';
import {
  getCaptureMoves,
  checkMonte,
  evaluateAccusa,
  evaluateDeal,
} from './src/engine/rules';
import { chooseAIMove } from './src/engine/ai';
import {
  loadSettings,
  saveSettings,
  loadStats,
  saveStats,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
} from './src/services/storage';
import { playSound } from './src/services/audio';

import { ScoreHeader } from './src/components/ScoreHeader';
import { GameTable } from './src/components/GameTable';
import { ScopaBanner, AccusaBanner, MonteBanner } from './src/components/Banners';
import { CaptureChoiceModal } from './src/components/CaptureChoiceModal';
import { DealSummaryModal } from './src/components/DealSummaryModal';
import { GameOverModal } from './src/components/GameOverModal';
import { SettingsModal } from './src/components/SettingsModal';
import { RulesModal } from './src/components/RulesModal';
import { StatsModal } from './src/components/StatsModal';

export default function App() {
  // Persistence & Settings
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);

  // Overall Match State
  const [playerTotalScore, setPlayerTotalScore] = useState<number>(0);
  const [aiTotalScore, setAiTotalScore] = useState<number>(0);
  const [dealer, setDealer] = useState<'player' | 'ai'>('ai');

  // Current Deal (Smazzata) State
  const [deck, setDeck] = useState<Card[]>([]);
  const [handIndex, setHandIndex] = useState<number>(1); // 1 to 6
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [aiHand, setAiHand] = useState<Card[]>([]);
  const [aiHandRevealed, setAiHandRevealed] = useState<boolean>(false);
  const [tableCards, setTableCards] = useState<Card[]>([]);
  const [playerCaptured, setPlayerCaptured] = useState<Card[]>([]);
  const [aiCaptured, setAiCaptured] = useState<Card[]>([]);
  const [playerScope, setPlayerScope] = useState<number>(0);
  const [aiScope, setAiScope] = useState<number>(0);
  const [playerAccusePts, setPlayerAccusePts] = useState<number>(0);
  const [aiAccusePts, setAiAccusePts] = useState<number>(0);
  const [lastCapturingPlayer, setLastCapturingPlayer] = useState<'player' | 'ai' | null>(null);

  // Turn State
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [lastActionMessage, setLastActionMessage] = useState<string>(
    'Benvenuto a Cirulla! Tocca una carta per iniziare.'
  );

  // Modals & Banners State
  const [choiceMoves, setChoiceMoves] = useState<CaptureMove[]>([]);
  const [isChoiceModalVisible, setIsChoiceModalVisible] = useState<boolean>(false);
  const [dealSummary, setDealSummary] = useState<DealScores | null>(null);
  const [isDealSummaryVisible, setIsDealSummaryVisible] = useState<boolean>(false);
  const [isGameOverVisible, setIsGameOverVisible] = useState<boolean>(false);

  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);
  const [isRulesVisible, setIsRulesVisible] = useState<boolean>(false);
  const [isStatsVisible, setIsStatsVisible] = useState<boolean>(false);

  // Floating Banners
  const [scopaBanner, setScopaBanner] = useState<{
    visible: boolean;
    who: 'player' | 'ai';
    count: number;
  }>({ visible: false, who: 'player', count: 1 });

  const [accusaBanner, setAccusaBanner] = useState<{
    visible: boolean;
    who: 'player' | 'ai';
    title: string;
    points: number;
    cards: Card[];
    usedMatta?: boolean;
  }>({ visible: false, who: 'player', title: '', points: 0, cards: [] });

  const [monteBanner, setMonteBanner] = useState<{
    visible: boolean;
    who: 'player' | 'ai';
    sum: number;
    scopeCount: number;
  }>({ visible: false, who: 'player', sum: 0, scopeCount: 0 });

  // Initial load
  useEffect(() => {
    async function init() {
      const loadedSettings = await loadSettings();
      const loadedStats = await loadStats();
      setSettings(loadedSettings);
      setStats(loadedStats);
      startNewMatch(loadedSettings);
    }
    init();
  }, []);

  const showScopaBanner = (who: 'player' | 'ai', count = 1) => {
    setScopaBanner({ visible: true, who, count });
    playSound('scopa', settings.soundEnabled, settings.hapticsEnabled);
    setTimeout(() => {
      setScopaBanner((prev) => ({ ...prev, visible: false }));
    }, 2200);
  };

  const showAccusaBanner = (
    who: 'player' | 'ai',
    title: string,
    points: number,
    cards: Card[],
    usedMatta?: boolean
  ) => {
    setAccusaBanner({ visible: true, who, title, points, cards, usedMatta });
    playSound('accusa', settings.soundEnabled, settings.hapticsEnabled);
    if (who === 'ai') {
      setAiHandRevealed(true);
      setTimeout(() => setAiHandRevealed(false), 3000);
    }
    setTimeout(() => {
      setAccusaBanner((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  const startNewMatch = (cfg = settings) => {
    setPlayerTotalScore(0);
    setAiTotalScore(0);
    setDealer('ai');
    setIsGameOverVisible(false);
    setIsDealSummaryVisible(false);
    startNewDeal('ai', cfg);
  };

  const startNewDeal = (currentDealer: 'player' | 'ai', cfg = settings) => {
    const fullDeck = shuffleDeck(createDeck());
    const initialTable = fullDeck.slice(0, 4);
    let remainingDeck = fullDeck.slice(4);

    let initialPlayerCaptured: Card[] = [];
    let initialAICaptured: Card[] = [];
    let initialPlayerScope = 0;
    let initialAIScope = 0;
    let currentTable = [...initialTable];

    // Check Monte: sum == 15 or 30
    const monte = checkMonte(initialTable);
    if (monte.scopeCount > 0) {
      if (currentDealer === 'player') {
        initialPlayerCaptured = [...initialTable];
        initialPlayerScope += monte.scopeCount;
      } else {
        initialAICaptured = [...initialTable];
        initialAIScope += monte.scopeCount;
      }
      currentTable = [];
      setMonteBanner({
        visible: true,
        who: currentDealer,
        sum: monte.sum,
        scopeCount: monte.scopeCount,
      });
      playSound('scopa', cfg.soundEnabled, cfg.hapticsEnabled);
      setTimeout(() => {
        setMonteBanner((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }

    // Deal first 3 cards to Player and AI
    const pHand = remainingDeck.slice(0, 3);
    const aHand = remainingDeck.slice(3, 6);
    remainingDeck = remainingDeck.slice(6);

    setDeck(remainingDeck);
    setHandIndex(1);
    setTableCards(currentTable);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setPlayerCaptured(initialPlayerCaptured);
    setAiCaptured(initialAICaptured);
    setPlayerScope(initialPlayerScope);
    setAiScope(initialAIScope);
    setPlayerAccusePts(0);
    setAiAccusePts(0);
    setSelectedCard(null);
    setLastCapturingPlayer(null);

    // First player is non-dealer
    const playerStarts = currentDealer === 'ai';
    setIsPlayerTurn(playerStarts);
    setLastActionMessage(
      playerStarts
        ? 'Nuova smazzata: tocca a te giocare!'
        : "Nuova smazzata: l'avversario apre il gioco."
    );

    // Check Accuse for both players
    checkAndApplyAccuse(pHand, aHand, cfg);
  };

  const checkAndApplyAccuse = (pHand: Card[], aHand: Card[], cfg = settings) => {
    const pAccusa = evaluateAccusa(pHand);
    if (pAccusa.type !== 'nessuna') {
      setPlayerAccusePts((prev) => prev + pAccusa.points);
      showAccusaBanner('player', pAccusa.description, pAccusa.points, pHand, pAccusa.usedMatta);
      // Update stats
      if (pAccusa.type === 'tre') {
        setStats((prev) => {
          const updated = { ...prev, accuseTreMade: prev.accuseTreMade + 1 };
          saveStats(updated);
          return updated;
        });
      } else if (pAccusa.type === 'dieci') {
        setStats((prev) => {
          const updated = { ...prev, accuseDieciMade: prev.accuseDieciMade + 1 };
          saveStats(updated);
          return updated;
        });
      }
    }

    const aAccusa = evaluateAccusa(aHand);
    if (aAccusa.type !== 'nessuna') {
      setTimeout(() => {
        setAiAccusePts((prev) => prev + aAccusa.points);
        showAccusaBanner('ai', aAccusa.description, aAccusa.points, aHand, aAccusa.usedMatta);
      }, pAccusa.type !== 'nessuna' ? 2500 : 400);
    }
  };

  // Turn management: Trigger AI play if isPlayerTurn is false
  useEffect(() => {
    if (!isPlayerTurn && playerHand.length >= 0 && aiHand.length > 0) {
      const timer = setTimeout(() => {
        executeAITurn();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, aiHand, tableCards]);

  const executeAITurn = () => {
    const isLastPlay = deck.length === 0 && handIndex === 6 && aiHand.length === 1 && playerHand.length === 0;
    const decision = chooseAIMove(aiHand, tableCards, isLastPlay, settings.aiDifficulty);

    // Remove played card from AI hand
    const remainingAIHand = aiHand.filter((c) => c.id !== decision.cardToPlay.id);
    setAiHand(remainingAIHand);

    playSound('card', settings.soundEnabled, settings.hapticsEnabled);

    if (decision.captureMove) {
      const move = decision.captureMove;
      const capturedIds = new Set(move.capturedCards.map((c) => c.id));
      const newTable = tableCards.filter((c) => !capturedIds.has(c.id));

      setTableCards(newTable);
      setAiCaptured((prev) => [...prev, decision.cardToPlay, ...move.capturedCards]);
      setLastCapturingPlayer('ai');

      let desc = `L'avversario gioca ${decision.cardToPlay.name} e prende ${move.capturedCards.length} carta/e`;
      if (move.isAceSweep) desc = `L'avversario gioca l'Asso e spazza il tavolo!`;

      if (move.isScopa) {
        setAiScope((prev) => prev + 1);
        showScopaBanner('ai', 1);
        desc += ' (SCOPA!)';
      } else {
        playSound('capture', settings.soundEnabled, settings.hapticsEnabled);
      }

      setLastActionMessage(desc);
    } else {
      // Discard to table
      setTableCards((prev) => [...prev, decision.cardToPlay]);
      setLastActionMessage(`L'avversario cala ${decision.cardToPlay.name} a terra.`);
    }

    // Check if hand or deal is completed
    checkHandEnd(playerHand, remainingAIHand);
  };

  const handleSelectPlayerCard = (card: Card) => {
    if (selectedCard?.id === card.id) {
      // Tapping same card confirms play
      handleConfirmPlayCard();
    } else {
      setSelectedCard(card);
      playSound('card', settings.soundEnabled, settings.hapticsEnabled);
    }
  };

  const handleConfirmPlayCard = () => {
    if (!selectedCard || !isPlayerTurn) return;

    const isLastPlay = deck.length === 0 && handIndex === 6 && playerHand.length === 1 && aiHand.length === 0;
    const moves = getCaptureMoves(selectedCard, tableCards, isLastPlay);

    if (moves.length === 0) {
      // No capture: discard to table
      executePlayerMove(selectedCard, undefined);
    } else if (moves.length === 1 || settings.autoSelectBestCapture) {
      // Single capture or auto-select best
      executePlayerMove(selectedCard, moves[0]);
    } else {
      // Multiple options available: let player choose via modal
      setChoiceMoves(moves);
      setIsChoiceModalVisible(true);
    }
  };

  const executePlayerMove = (card: Card, move?: CaptureMove) => {
    const remainingHand = playerHand.filter((c) => c.id !== card.id);
    setPlayerHand(remainingHand);
    setSelectedCard(null);

    playSound('card', settings.soundEnabled, settings.hapticsEnabled);

    if (move) {
      const capturedIds = new Set(move.capturedCards.map((c) => c.id));
      const newTable = tableCards.filter((c) => !capturedIds.has(c.id));

      setTableCards(newTable);
      setPlayerCaptured((prev) => [...prev, card, ...move.capturedCards]);
      setLastCapturingPlayer('player');

      let desc = `Hai giocato ${card.name} e preso ${move.capturedCards.length} carta/e!`;
      if (move.isAceSweep) desc = `Asso pigliatutto! Tavolo ripulito!`;

      if (move.isScopa) {
        setPlayerScope((prev) => prev + 1);
        showScopaBanner('player', 1);
        desc += ' (SCOPA!)';

        // Update stats
        setStats((prev) => {
          const updated = { ...prev, totalScope: prev.totalScope + 1 };
          saveStats(updated);
          return updated;
        });
      } else {
        playSound('capture', settings.soundEnabled, settings.hapticsEnabled);
      }

      setLastActionMessage(desc);
    } else {
      // Place on table
      setTableCards((prev) => [...prev, card]);
      setLastActionMessage(`Hai calato ${card.name} a terra.`);
    }

    // Switch turn or end hand
    checkHandEnd(remainingHand, aiHand);
  };

  const checkHandEnd = (pHand: Card[], aHand: Card[]) => {
    if (pHand.length === 0 && aHand.length === 0) {
      // Both hands empty!
      if (deck.length > 0) {
        // Deal next 3 cards to each player
        const nextHandIndex = handIndex + 1;
        const nextPHand = deck.slice(0, 3);
        const nextAHand = deck.slice(3, 6);
        const nextDeck = deck.slice(6);

        setTimeout(() => {
          setHandIndex(nextHandIndex);
          setPlayerHand(nextPHand);
          setAiHand(nextAHand);
          setDeck(nextDeck);

          // In Cirulla, play order alternates or follows who was non-dealer
          setIsPlayerTurn(dealer === 'ai');
          setLastActionMessage(`Mano ${nextHandIndex}/6 distribuita.`);
          checkAndApplyAccuse(nextPHand, nextAHand, settings);
        }, 800);
      } else {
        // End of Deal (all 40 cards played!)
        setTimeout(() => {
          finalizeDeal();
        }, 1200);
      }
    } else {
      // Normal turn switch
      setIsPlayerTurn((prev) => !prev);
    }
  };

  const finalizeDeal = () => {
    // Remaining table cards go to last capturing player (no scopa awarded)
    let finalPlayerCaptured = [...playerCaptured];
    let finalAICaptured = [...aiCaptured];

    if (tableCards.length > 0) {
      if (lastCapturingPlayer === 'player') {
        finalPlayerCaptured = [...finalPlayerCaptured, ...tableCards];
      } else if (lastCapturingPlayer === 'ai') {
        finalAICaptured = [...finalAICaptured, ...tableCards];
      }
      setTableCards([]);
    }

    const scores = evaluateDeal(
      finalPlayerCaptured,
      finalAICaptured,
      playerScope,
      aiScope,
      playerAccusePts,
      aiAccusePts
    );

    const newPlayerTotal = playerTotalScore + scores.totalDealPlayer;
    const newAITotal = aiTotalScore + scores.totalDealAI;

    setPlayerTotalScore(newPlayerTotal);
    setAiTotalScore(newAITotal);
    setDealSummary(scores);
    setIsDealSummaryVisible(true);

    // Update stats
    setStats((prev) => {
      const updated: GameStats = {
        ...prev,
        piccoleMade: prev.piccoleMade + (scores.piccolaPlayerPoints > 0 ? 1 : 0),
        grandiMade: prev.grandiMade + (scores.grandePlayerPoints > 0 ? 1 : 0),
        bestScoreInGame: Math.max(prev.bestScoreInGame, newPlayerTotal),
      };
      saveStats(updated);
      return updated;
    });
  };

  const handleNextDealOrEnd = () => {
    setIsDealSummaryVisible(false);

    if (playerTotalScore >= settings.targetScore || aiTotalScore >= settings.targetScore) {
      // Match concluded!
      setIsGameOverVisible(true);
      const playerWon = playerTotalScore >= settings.targetScore && playerTotalScore > aiTotalScore;

      if (playerWon) {
        playSound('victory', settings.soundEnabled, settings.hapticsEnabled);
      }

      setStats((prev) => {
        const updated: GameStats = {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: prev.gamesWon + (playerWon ? 1 : 0),
          gamesLost: prev.gamesLost + (!playerWon ? 1 : 0),
        };
        saveStats(updated);
        return updated;
      });
    } else {
      // Continue to next deal: alternate dealer!
      const nextDealer = dealer === 'player' ? 'ai' : 'player';
      setDealer(nextDealer);
      startNewDeal(nextDealer);
    }
  };

  const availableMovesForSelected = selectedCard
    ? getCaptureMoves(
        selectedCard,
        tableCards,
        deck.length === 0 && handIndex === 6 && playerHand.length === 1 && aiHand.length === 0
      )
    : [];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Main Score Header */}
      <ScoreHeader
        playerScore={playerTotalScore}
        aiScore={aiTotalScore}
        targetScore={settings.targetScore}
        deckCount={deck.length}
        playerCaptured={playerCaptured}
        aiCaptured={aiCaptured}
        playerScope={playerScope}
        aiScope={aiScope}
        currentHandIndex={handIndex}
        aiDifficulty={settings.aiDifficulty}
        onOpenSettings={() => setIsSettingsVisible(true)}
        onOpenRules={() => setIsRulesVisible(true)}
        onOpenStats={() => setIsStatsVisible(true)}
      />

      {/* Felt Gaming Table */}
      <GameTable
        deckStyle={settings.deckStyle}
        playerHand={playerHand}
        aiHand={aiHand}
        aiHandRevealed={aiHandRevealed}
        tableCards={tableCards}
        selectedCard={selectedCard}
        onSelectPlayerCard={handleSelectPlayerCard}
        onConfirmPlayCard={handleConfirmPlayCard}
        availableMovesForSelected={availableMovesForSelected}
        isPlayerTurn={isPlayerTurn}
        playerCaptured={playerCaptured}
        aiCaptured={aiCaptured}
        lastActionMessage={lastActionMessage}
      />

      {/* Interactive Choice Modal */}
      <CaptureChoiceModal
        visible={isChoiceModalVisible}
        moves={choiceMoves}
        onSelectMove={(move) => {
          setIsChoiceModalVisible(false);
          if (selectedCard) executePlayerMove(selectedCard, move);
        }}
        onCancel={() => setIsChoiceModalVisible(false)}
      />

      {/* Deal Summary Scoreboard */}
      <DealSummaryModal
        visible={isDealSummaryVisible}
        scores={dealSummary}
        playerTotal={playerTotalScore}
        aiTotal={aiTotalScore}
        targetScore={settings.targetScore}
        onNextDeal={handleNextDealOrEnd}
      />

      {/* Game Over Modal */}
      <GameOverModal
        visible={isGameOverVisible}
        playerTotal={playerTotalScore}
        aiTotal={aiTotalScore}
        targetScore={settings.targetScore}
        onNewGame={() => startNewMatch()}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={isSettingsVisible}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          saveSettings(newSettings);
        }}
        onClose={() => setIsSettingsVisible(false)}
        onRestartMatch={() => startNewMatch()}
      />

      {/* Rules Modal */}
      <RulesModal
        visible={isRulesVisible}
        onClose={() => setIsRulesVisible(false)}
      />

      {/* Career Stats Modal */}
      <StatsModal
        visible={isStatsVisible}
        stats={stats}
        onClose={() => setIsStatsVisible(false)}
        onResetStats={() => {
          setStats(DEFAULT_STATS);
          saveStats(DEFAULT_STATS);
        }}
      />

      {/* In-Game Animated Banners */}
      <ScopaBanner
        visible={scopaBanner.visible}
        who={scopaBanner.who}
        count={scopaBanner.count}
      />
      <AccusaBanner
        visible={accusaBanner.visible}
        who={accusaBanner.who}
        title={accusaBanner.title}
        points={accusaBanner.points}
        cards={accusaBanner.cards}
        usedMatta={accusaBanner.usedMatta}
      />
      <MonteBanner
        visible={monteBanner.visible}
        who={monteBanner.who}
        sum={monteBanner.sum}
        scopeCount={monteBanner.scopeCount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
