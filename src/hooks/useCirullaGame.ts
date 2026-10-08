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
  loadActiveMatch,
  saveActiveMatch,
  clearActiveMatch,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
} from '../services/storage';
import { playSound, triggerHaptic } from '../services/audio';
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
  const [selectedTableCardIds, setSelectedTableCardIds] = useState<string[]>([]);
  const [lastPlayedCardByAI, setLastPlayedCardByAI] = useState<Card | null>(null);
  const [aiTargetCardIds, setAiTargetCardIds] = useState<string[]>([]);
  const [isShufflingOrDealing, setIsShufflingOrDealing] = useState<boolean>(false);
  const [dealingMessage, setDealingMessage] = useState<string | null>(null);
  const [lastActionMessage, setLastActionMessage] = useState<string>(
    'Benvenuto a Cirulla! Seleziona una carta in mano e poi clicca sulle carte a terra per prenderle.'
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
    const fullDeck = shuffleDeck(createDeck(currentSettings.deckStyle));
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
    setSelectedTableCardIds([]);
    setLastPlayedCardByAI(null);
    setAiTargetCardIds([]);
    setLastCapturingPlayer(null);

    setIsShufflingOrDealing(true);
    setDealingMessage(
      currentDealer === 'player'
        ? 'Mazziere: TU mescoli il mazzo e distribuisci le carte...'
        : "Mazziere: L'AVVERSARIO mescola il mazzo e distribuisce le carte..."
    );
    playSound('card', currentSettings.soundEnabled, currentSettings.hapticsEnabled);
    setTimeout(() => {
      setIsShufflingOrDealing(false);
      setDealingMessage(null);
    }, 1600);

    const playerStarts = currentDealer === 'ai';
    setIsPlayerTurn(playerStarts);
    setLastActionMessage(
      playerStarts
        ? 'Nuova smazzata: tocca a te giocare! Seleziona una carta in mano.'
        : "Nuova smazzata: l'avversario apre il gioco."
    );

    checkAndApplyAccuse(pHand, aHand, currentSettings);
  }, [settings, checkAndApplyAccuse]);

  const startNewMatch = useCallback((cfg = settings) => {
    clearActiveMatch();
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
      const savedMatch = await loadActiveMatch();
      setSettings(loadedSettings);
      setStats(loadedStats);

      if (savedMatch && savedMatch.deck && savedMatch.deck.length > 0) {
        setPlayerTotalScore(savedMatch.playerTotalScore);
        setAiTotalScore(savedMatch.aiTotalScore);
        setDealer(savedMatch.dealer);
        setHandIndex(savedMatch.handIndex);
        setDeck([...savedMatch.deck]);
        setPlayerHand([...savedMatch.playerHand]);
        setAiHand([...savedMatch.aiHand]);
        setTableCards([...savedMatch.tableCards]);
        setPlayerCaptured([...savedMatch.playerCaptured]);
        setAiCaptured([...savedMatch.aiCaptured]);
        setPlayerScope(savedMatch.playerScope);
        setAiScope(savedMatch.aiScope);
        setPlayerAccusePts(savedMatch.playerAccusePts);
        setAiAccusePts(savedMatch.aiAccusePts);
        setIsPlayerTurn(savedMatch.isPlayerTurn);
        setLastActionMessage('Partita ripresa dal salvataggio precedente.');
      } else {
        startNewMatch(loadedSettings);
      }
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

          saveActiveMatch({
            playerTotalScore,
            aiTotalScore,
            dealer,
            handIndex: nextHandIndex,
            deck: nextDeck,
            playerHand: nextPHand,
            aiHand: nextAHand,
            tableCards,
            playerCaptured,
            aiCaptured,
            playerScope,
            aiScope,
            playerAccusePts,
            aiAccusePts,
            isPlayerTurn: dealer === 'ai',
            savedAt: Date.now(),
          });
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
    if (aiHand.length === 0) return;

    const isLastPlay =
      deck.length === 0 &&
      handIndex === GAME_CONFIG.DEAL.TOTAL_HANDS_PER_DEAL &&
      aiHand.length === 1 &&
      playerHand.length === 0;

    const decision = chooseAIMove(aiHand, tableCards, isLastPlay, settings.aiDifficulty);
    const cardPlayed = decision.cardToPlay;
    const remainingAIHand = aiHand.filter((c) => c.id !== cardPlayed.id);

    // STEP 1: Visually reveal which card the AI is playing!
    setAiHand(remainingAIHand);
    setLastPlayedCardByAI(cardPlayed);
    playSound('card', settings.soundEnabled, settings.hapticsEnabled);

    if (decision.captureMove) {
      const move = decision.captureMove;
      const targetIds = move.capturedCards.map((c) => c.id);
      setAiTargetCardIds(targetIds);

      let desc = `L'avversario gioca ${cardPlayed.name} per prendere ${move.capturedCards.length} carta/e...`;
      if (move.isAceSweep) desc = `L'avversario gioca l'Asso! Prende tutte le carte...`;
      setLastActionMessage(desc);

      // STEP 2: Give the human player 1.4s to clearly SEE the card and the capture targets
      setTimeout(() => {
        const capturedIdsSet = new Set(targetIds);
        const newTable = tableCards.filter((c) => !capturedIdsSet.has(c.id));

        setTableCards(newTable);
        setAiCaptured((prev) => [...prev, cardPlayed, ...move.capturedCards]);
        setLastCapturingPlayer('ai');
        setAiTargetCardIds([]);

        if (move.isScopa) {
          setAiScope((prev) => prev + 1);
          triggerScopaBanner('ai', 1);
          setLastActionMessage(`L'avversario fa SCOPA con ${cardPlayed.name}!`);
        } else {
          playSound('capture', settings.soundEnabled, settings.hapticsEnabled);
          setLastActionMessage(
            `L'avversario ha preso ${move.capturedCards.map((c) => c.name).join(' + ')}.`
          );
        }

        setTimeout(() => {
          setLastPlayedCardByAI(null);
          checkHandEnd(playerHand, remainingAIHand);
        }, 700);
      }, 1400);
    } else {
      // Discard onto the table
      setLastActionMessage(`L'avversario cala ${cardPlayed.name} a terra.`);
      setTimeout(() => {
        setTableCards((prev) => [...prev, cardPlayed]);
        setTimeout(() => {
          setLastPlayedCardByAI(null);
          checkHandEnd(playerHand, remainingAIHand);
        }, 500);
      }, 1000);
    }
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

  const [selectedMove, setSelectedMove] = useState<CaptureMove | null>(null);

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
      // Deselect card
      setSelectedCard(null);
      setSelectedTableCardIds([]);
      setLastActionMessage('Carta deselezionata.');
    } else {
      setSelectedCard(card);
      setSelectedTableCardIds([]);
      playSound('card', settings.soundEnabled, settings.hapticsEnabled);
      setLastActionMessage(`Hai selezionato ${card.name}. Clicca sulle carte a terra per prenderle o cala sul tavolo.`);
    }
  }, [selectedCard, settings.soundEnabled, settings.hapticsEnabled]);

  const toggleTableCard = useCallback((tableCard: Card) => {
    if (!selectedCard || !isPlayerTurn) {
      setLastActionMessage('Seleziona prima una carta dalla tua mano in basso!');
      return;
    }
    playSound('card', settings.soundEnabled, settings.hapticsEnabled);
    triggerHaptic('light', settings.hapticsEnabled);

    setSelectedTableCardIds((prev) => {
      const exists = prev.includes(tableCard.id);
      const next = exists ? prev.filter((id) => id !== tableCard.id) : [...prev, tableCard.id];
      if (next.length === 0) {
        setLastActionMessage(`Deselezionata ${tableCard.name} dal tavolo.`);
      } else {
        setLastActionMessage(`Selezionate ${next.length} carta/e a terra per la presa.`);
      }
      return next;
    });
  }, [selectedCard, isPlayerTurn, settings.soundEnabled, settings.hapticsEnabled]);

  const clearTableSelection = useCallback(() => {
    setSelectedTableCardIds([]);
    playSound('card', settings.soundEnabled, settings.hapticsEnabled);
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  const confirmPlayCard = useCallback(() => {
    if (!selectedCard || !isPlayerTurn) return;

    const isLastPlay =
      deck.length === 0 &&
      handIndex === GAME_CONFIG.DEAL.TOTAL_HANDS_PER_DEAL &&
      playerHand.length === 1 &&
      aiHand.length === 0;

    const legalMoves = getCaptureMoves(selectedCard, tableCards, isLastPlay);

    // CASE 1: Nessuna carta a terra selezionata -> Scarto o Asso pigliatutto
    if (selectedTableCardIds.length === 0) {
      const aceSweepMove = legalMoves.find((m) => m.isAceSweep);
      if (aceSweepMove) {
        executePlayerMove(selectedCard, aceSweepMove);
        setSelectedTableCardIds([]);
        return;
      }

      // Scarta la carta a terra
      executePlayerMove(selectedCard, undefined);
      setSelectedTableCardIds([]);
      return;
    }

    // CASE 2: Carte a terra selezionate manualmente -> convalida con le regole della Cirulla
    const selectedIdsSet = new Set(selectedTableCardIds);
    const matchedMove = legalMoves.find(
      (m) =>
        m.capturedCards.length === selectedTableCardIds.length &&
        m.capturedCards.every((c) => selectedIdsSet.has(c.id))
    );

    if (matchedMove) {
      // Presa valida realizzata dal giocatore!
      executePlayerMove(selectedCard, matchedMove);
      setSelectedTableCardIds([]);
    } else {
      // Presa non valida secondo le regole: nessun suggerimento regalato, deve pensare lui!
      setLastActionMessage(
        'Combinazione non valida: le carte selezionate a terra non formano una presa (somma a 15, uguale o valore della carta).'
      );
      triggerHaptic('warning', settings.hapticsEnabled);
      playSound('card', settings.soundEnabled, settings.hapticsEnabled);
    }
  }, [
    selectedCard,
    isPlayerTurn,
    selectedTableCardIds,
    deck.length,
    handIndex,
    playerHand.length,
    aiHand.length,
    tableCards,
    executePlayerMove,
    settings.hapticsEnabled,
    settings.soundEnabled,
  ]);

  const proceedToNextDealOrEnd = useCallback(() => {
    setIsDealSummaryVisible(false);

    const isCappotto = dealSummary?.isCappottoPlayer || dealSummary?.isCappottoAI;
    const reachedTarget = playerTotalScore >= settings.targetScore || aiTotalScore >= settings.targetScore;

    if (reachedTarget || isCappotto) {
      clearActiveMatch();
      setIsGameOverVisible(true);
      const playerWon = dealSummary?.isCappottoPlayer
        ? true
        : dealSummary?.isCappottoAI
        ? false
        : playerTotalScore >= settings.targetScore && playerTotalScore > aiTotalScore;

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
    selectedMove,
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
    toggleTableCard,
    openChoiceModal: () => {
      setChoiceMoves(availableMovesForSelected);
      setIsChoiceModalVisible(true);
    },
    selectedTableCardIds,
    lastPlayedCardByAI,
    aiTargetCardIds,
    isShufflingOrDealing,
    dealingMessage,
    clearTableSelection,
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
