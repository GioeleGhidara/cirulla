import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  CaptureMove,
  DealScores,
  GameSettings,
  GameStats,
  PlayerSide,
} from '../types/card';
import { createDeck, shuffleDeck } from '../engine/deck';
import {
  getCaptureMoves,
  checkMonte,
  evaluateAccusa,
  evaluateDeal,
} from '../engine/rules';
import { chooseAIMove } from '../engine/ai';
import {
  loadSettings,
  saveSettings,
  loadStats,
  saveStats,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
} from '../services/storage';
import { playSound } from '../services/audio';
import { GAME_CONFIG } from '../constants/gameConfig';

export interface BannerState<T> {
  readonly visible: boolean;
  readonly data: T;
}

export function useCirullaGame() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);

  const [playerTotalScore, setPlayerTotalScore] = useState<number>(0);
  const [aiTotalScore, setAiTotalScore] = useState<number>(0);
  const [dealer, setDealer] = useState<PlayerSide>('ai');

  const [deck, setDeck] = useState<Card[]>([]);
  const [handIndex, setHandIndex] = useState<number>(1);
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
  const [lastCapturingPlayer, setLastCapturingPlayer] = useState<PlayerSide | null>(null);

  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [lastActionMessage, setLastActionMessage] = useState<string>(
    'Benvenuto a Cirulla! Seleziona una carta per iniziare.'
  );

  const [choiceMoves, setChoiceMoves] = useState<CaptureMove[]>([]);
  const [isChoiceModalVisible, setIsChoiceModalVisible] = useState<boolean>(false);
  const [dealSummary, setDealSummary] = useState<DealScores | null>(null);
  const [isDealSummaryVisible, setIsDealSummaryVisible] = useState<boolean>(false);
  const [isGameOverVisible, setIsGameOverVisible] = useState<boolean>(false);

  const [scopaBanner, setScopaBanner] = useState<{
    visible: boolean;
    who: PlayerSide;
    count: number;
  }>({ visible: false, who: 'player', count: 1 });

  const [accusaBanner, setAccusaBanner] = useState<{
    visible: boolean;
    who: PlayerSide;
    title: string;
    points: number;
    cards: Card[];
    usedMatta?: boolean;
  }>({ visible: false, who: 'player', title: '', points: 0, cards: [] });

  const [monteBanner, setMonteBanner] = useState<{
    visible: boolean;
    who: PlayerSide;
    sum: number;
    scopeCount: number;
  }>({ visible: false, who: 'player', sum: 0, scopeCount: 0 });

  const triggerScopaBanner = useCallback((who: PlayerSide, count = 1) => {
    setScopaBanner({ visible: true, who, count });
    playSound('scopa', settings.soundEnabled, settings.hapticsEnabled);
    setTimeout(() => {
      setScopaBanner((prev) => ({ ...prev, visible: false }));
    }, GAME_CONFIG.TIMINGS.BANNER_DURATION_MS);
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  const triggerAccusaBanner = useCallback((
    who: PlayerSide,
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
    }, GAME_CONFIG.TIMINGS.BANNER_DURATION_MS + 400);
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  const checkAndApplyAccuse = useCallback((
    pHand: Card[],
    aHand: Card[],
    currentSettings: GameSettings
  ) => {
    const pAccusa = evaluateAccusa(pHand);
    if (pAccusa.type !== 'nessuna') {
      setPlayerAccusePts((prev) => prev + pAccusa.points);
      triggerAccusaBanner('player', pAccusa.description, pAccusa.points, pHand, pAccusa.usedMatta);

      setStats((prev) => {
        const isTre = pAccusa.type === 'tre';
        const updated: GameStats = {
          ...prev,
          accuseTreMade: prev.accuseTreMade + (isTre ? 1 : 0),
          accuseDieciMade: prev.accuseDieciMade + (!isTre ? 1 : 0),
        };
        saveStats(updated);
        return updated;
      });
    }

    const aAccusa = evaluateAccusa(aHand);
    if (aAccusa.type !== 'nessuna') {
      const delay = pAccusa.type !== 'nessuna' ? 2400 : 400;
      setTimeout(() => {
        setAiAccusePts((prev) => prev + aAccusa.points);
        triggerAccusaBanner('ai', aAccusa.description, aAccusa.points, aHand, aAccusa.usedMatta);
      }, delay);
    }
  }, [triggerAccusaBanner]);

  const startNewDeal = useCallback((currentDealer: PlayerSide, currentSettings = settings) => {
    const fullDeck = shuffleDeck(createDeck());
    const initialTable = fullDeck.slice(0, GAME_CONFIG.DEAL.INITIAL_TABLE_CARDS);
    let remainingDeck = fullDeck.slice(GAME_CONFIG.DEAL.INITIAL_TABLE_CARDS);

    let initialPlayerCaptured: Card[] = [];
    let initialAICaptured: Card[] = [];
    let initialPlayerScope = 0;
    let initialAIScope = 0;
    let currentTable = [...initialTable];

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
      playSound('scopa', currentSettings.soundEnabled, currentSettings.hapticsEnabled);
      setTimeout(() => {
        setMonteBanner((prev) => ({ ...prev, visible: false }));
      }, GAME_CONFIG.TIMINGS.BANNER_DURATION_MS);
    }

    const pHand = remainingDeck.slice(0, GAME_CONFIG.DEAL.HAND_SIZE);
    const aHand = remainingDeck.slice(
      GAME_CONFIG.DEAL.HAND_SIZE,
      GAME_CONFIG.DEAL.HAND_SIZE * 2
    );
    remainingDeck = remainingDeck.slice(GAME_CONFIG.DEAL.HAND_SIZE * 2);

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

    const playerStarts = currentDealer === 'ai';
    setIsPlayerTurn(playerStarts);
    setLastActionMessage(
      playerStarts
        ? 'Nuova smazzata: tocca a te giocare!'
        : "Nuova smazzata: l'avversario apre il gioco."
    );

    checkAndApplyAccuse(pHand, aHand, currentSettings);
  }, [settings, checkAndApplyAccuse]);

  const startNewMatch = useCallback((cfg = settings) => {
    setPlayerTotalScore(0);
    setAiTotalScore(0);
    setDealer('ai');
    setIsGameOverVisible(false);
    setIsDealSummaryVisible(false);
    startNewDeal('ai', cfg);
  }, [settings, startNewDeal]);

  useEffect(() => {
    async function init() {
      const loadedSettings = await loadSettings();
      const loadedStats = await loadStats();
      setSettings(loadedSettings);
      setStats(loadedStats);
      startNewMatch(loadedSettings);
    }
    init();
  }, [startNewMatch]);

  const finalizeDeal = useCallback(() => {
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
  }, [
    playerCaptured,
    aiCaptured,
    tableCards,
    lastCapturingPlayer,
    playerScope,
    aiScope,
    playerAccusePts,
    aiAccusePts,
    playerTotalScore,
    aiTotalScore,
  ]);

  const checkHandEnd = useCallback((pHand: Card[], aHand: Card[]) => {
    if (pHand.length === 0 && aHand.length === 0) {
      if (deck.length > 0) {
        const nextHandIndex = handIndex + 1;
        const nextPHand = deck.slice(0, GAME_CONFIG.DEAL.HAND_SIZE);
        const nextAHand = deck.slice(
          GAME_CONFIG.DEAL.HAND_SIZE,
          GAME_CONFIG.DEAL.HAND_SIZE * 2
        );
        const nextDeck = deck.slice(GAME_CONFIG.DEAL.HAND_SIZE * 2);

        setTimeout(() => {
          setHandIndex(nextHandIndex);
          setPlayerHand(nextPHand);
          setAiHand(nextAHand);
          setDeck(nextDeck);

          setIsPlayerTurn(dealer === 'ai');
          setLastActionMessage(`Mano ${nextHandIndex}/6 distribuita.`);
          checkAndApplyAccuse(nextPHand, nextAHand, settings);
        }, GAME_CONFIG.TIMINGS.DEAL_TRANSITION_DELAY_MS);
      } else {
        setTimeout(() => {
          finalizeDeal();
        }, GAME_CONFIG.TIMINGS.DEAL_FINALIZE_DELAY_MS);
      }
    } else {
      setIsPlayerTurn((prev) => !prev);
    }
  }, [deck, handIndex, dealer, settings, checkAndApplyAccuse, finalizeDeal]);

  const executeAITurn = useCallback(() => {
    const isLastPlay =
      deck.length === 0 &&
      handIndex === GAME_CONFIG.DEAL.TOTAL_HANDS_PER_DEAL &&
      aiHand.length === 1 &&
      playerHand.length === 0;

    const decision = chooseAIMove(aiHand, tableCards, isLastPlay, settings.aiDifficulty);
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
        triggerScopaBanner('ai', 1);
        desc += ' (SCOPA!)';
      } else {
        playSound('capture', settings.soundEnabled, settings.hapticsEnabled);
      }

      setLastActionMessage(desc);
    } else {
      setTableCards((prev) => [...prev, decision.cardToPlay]);
      setLastActionMessage(`L'avversario cala ${decision.cardToPlay.name} a terra.`);
    }

    checkHandEnd(playerHand, remainingAIHand);
  }, [
    deck.length,
    handIndex,
    aiHand,
    playerHand,
    tableCards,
    settings.aiDifficulty,
    settings.soundEnabled,
    settings.hapticsEnabled,
    triggerScopaBanner,
    checkHandEnd,
  ]);

  useEffect(() => {
    if (!isPlayerTurn && aiHand.length > 0) {
      const timer = setTimeout(() => {
        executeAITurn();
      }, GAME_CONFIG.TIMINGS.AI_TURN_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, aiHand.length, executeAITurn]);

  const executePlayerMove = useCallback((card: Card, move?: CaptureMove) => {
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
        triggerScopaBanner('player', 1);
        desc += ' (SCOPA!)';

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
      setTableCards((prev) => [...prev, card]);
      setLastActionMessage(`Hai calato ${card.name} a terra.`);
    }

    checkHandEnd(remainingHand, aiHand);
  }, [
    playerHand,
    aiHand,
    tableCards,
    settings.soundEnabled,
    settings.hapticsEnabled,
    triggerScopaBanner,
    checkHandEnd,
  ]);

  const availableMovesForSelected = useMemo(() => {
    if (!selectedCard) return [];
    const isLastPlay =
      deck.length === 0 &&
      handIndex === GAME_CONFIG.DEAL.TOTAL_HANDS_PER_DEAL &&
      playerHand.length === 1 &&
      aiHand.length === 0;

    return getCaptureMoves(selectedCard, tableCards, isLastPlay);
  }, [selectedCard, deck.length, handIndex, playerHand.length, aiHand.length, tableCards]);

  const selectPlayerCard = useCallback((card: Card) => {
    if (selectedCard?.id === card.id) {
      confirmPlayCard();
    } else {
      setSelectedCard(card);
      playSound('card', settings.soundEnabled, settings.hapticsEnabled);
    }
  }, [selectedCard, settings.soundEnabled, settings.hapticsEnabled]);

  const confirmPlayCard = useCallback(() => {
    if (!selectedCard || !isPlayerTurn) return;

    if (availableMovesForSelected.length === 0) {
      executePlayerMove(selectedCard, undefined);
    } else if (availableMovesForSelected.length === 1 || settings.autoSelectBestCapture) {
      executePlayerMove(selectedCard, availableMovesForSelected[0]);
    } else {
      setChoiceMoves(availableMovesForSelected);
      setIsChoiceModalVisible(true);
    }
  }, [
    selectedCard,
    isPlayerTurn,
    availableMovesForSelected,
    settings.autoSelectBestCapture,
    executePlayerMove,
  ]);

  const proceedToNextDealOrEnd = useCallback(() => {
    setIsDealSummaryVisible(false);

    if (playerTotalScore >= settings.targetScore || aiTotalScore >= settings.targetScore) {
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
      const nextDealer: PlayerSide = dealer === 'player' ? 'ai' : 'player';
      setDealer(nextDealer);
      startNewDeal(nextDealer);
    }
  }, [
    playerTotalScore,
    aiTotalScore,
    settings.targetScore,
    settings.soundEnabled,
    settings.hapticsEnabled,
    dealer,
    startNewDeal,
  ]);

  const updateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    saveStats(DEFAULT_STATS);
  }, []);

  return {
    settings,
    stats,
    playerTotalScore,
    aiTotalScore,
    dealer,
    deckCount: deck.length,
    handIndex,
    playerHand,
    aiHand,
    aiHandRevealed,
    tableCards,
    playerCaptured,
    aiCaptured,
    playerScope,
    aiScope,
    isPlayerTurn,
    selectedCard,
    availableMovesForSelected,
    lastActionMessage,
    dealSummary,
    isDealSummaryVisible,
    isGameOverVisible,
    choiceMoves,
    isChoiceModalVisible,
    scopaBanner,
    accusaBanner,
    monteBanner,
    selectPlayerCard,
    confirmPlayCard,
    executeChosenCapture: (move: CaptureMove) => {
      setIsChoiceModalVisible(false);
      if (selectedCard) executePlayerMove(selectedCard, move);
    },
    cancelChoiceModal: () => setIsChoiceModalVisible(false),
    proceedToNextDealOrEnd,
    restartMatch: () => startNewMatch(),
    updateSettings,
    resetStats,
  };
}
