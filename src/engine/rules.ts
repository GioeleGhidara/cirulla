import { Card, CaptureMove, AccusaInfo, DealScores, ScoringWinner, PlayerSide } from '../types/card';
import { PRIMIERA_VALUES } from '../constants/rules';
import { GAME_CONFIG } from '../constants/gameConfig';

export const isMatta = (card: Card): boolean => {
  const s = card.suit.toLowerCase();
  return (s === 'cuori' || s === 'picche' || s === 'spade') && card.rank === 7;
};

export const isQuadri = (card: Card): boolean => {
  const s = card.suit.toLowerCase();
  return s === 'quadri' || s === 'denari';
};

export const isDenari = isQuadri;

export const isSettebello = (card: Card): boolean => {
  return isQuadri(card) && card.rank === 7;
};

export const isAce = (card: Card): boolean => {
  return card.rank === 1;
};

export function checkMonte(cards: readonly Card[]): { scopeCount: number; sum: number } {
  const sum = cards.reduce((acc, c) => acc + c.value, 0);

  if (sum === GAME_CONFIG.MONTE.DOUBLE_SCOPA_SUM) {
    return { scopeCount: 2, sum };
  }
  if (sum === GAME_CONFIG.MONTE.SINGLE_SCOPA_SUM) {
    return { scopeCount: 1, sum };
  }

  return { scopeCount: 0, sum };
}

export function evaluateAccusa(hand: readonly Card[]): AccusaInfo {
  if (hand.length !== GAME_CONFIG.DEAL.HAND_SIZE) {
    return { type: 'nessuna', points: 0, description: '', cards: hand };
  }

  const mattaIndex = hand.findIndex(isMatta);
  const hasMatta = mattaIndex !== -1;

  const threeOfAKind = evaluateThreeOfAKind(hand, mattaIndex);
  if (threeOfAKind) {
    return threeOfAKind;
  }

  const sumBelowNine = evaluateSumBelowNine(hand, mattaIndex);
  if (sumBelowNine) {
    return sumBelowNine;
  }

  return { type: 'nessuna', points: 0, description: '', cards: hand };
}

function evaluateThreeOfAKind(hand: readonly Card[], mattaIndex: number): AccusaInfo | null {
  if (mattaIndex === -1) {
    if (hand[0].rank === hand[1].rank && hand[1].rank === hand[2].rank) {
      return {
        type: 'dieci',
        points: GAME_CONFIG.ACCUSA.DIECI_POINTS,
        description: 'Buona da dieci: tre carte uguali',
        cards: hand,
      };
    }
    return null;
  }

  const otherCards = hand.filter((_, i) => i !== mattaIndex);
  if (otherCards[0].rank === otherCards[1].rank) {
    return {
      type: 'dieci',
      points: GAME_CONFIG.ACCUSA.DIECI_POINTS,
      description: 'Buona da dieci: tris con la Matta',
      cards: hand,
      usedMatta: true,
    };
  }

  return null;
}

function evaluateSumBelowNine(hand: readonly Card[], mattaIndex: number): AccusaInfo | null {
  if (mattaIndex === -1) {
    const sum = hand.reduce((acc, c) => acc + c.value, 0);
    if (sum <= GAME_CONFIG.ACCUSA.TRE_MAX_SUM) {
      return {
        type: 'tre',
        points: GAME_CONFIG.ACCUSA.TRE_POINTS,
        description: `Buona da tre: somma carte = ${sum}`,
        cards: hand,
      };
    }
    return null;
  }

  // With Matta, choose value 1 to minimize the hand total
  const otherCards = hand.filter((_, i) => i !== mattaIndex);
  const sumOthers = otherCards.reduce((acc, c) => acc + c.value, 0);
  const minSum = sumOthers + 1;

  if (minSum <= GAME_CONFIG.ACCUSA.TRE_MAX_SUM) {
    return {
      type: 'tre',
      points: GAME_CONFIG.ACCUSA.TRE_POINTS,
      description: `Buona da tre con la Matta: somma = ${minSum}`,
      cards: hand,
      usedMatta: true,
    };
  }

  return null;
}

function findSubsetsWithSum(cards: readonly Card[], targetSum: number): Card[][] {
  const results: Card[][] = [];

  function backtrack(start: number, currentSubset: Card[], currentSum: number) {
    if (currentSum === targetSum) {
      results.push([...currentSubset]);
      return;
    }
    if (currentSum > targetSum) {
      return;
    }

    for (let i = start; i < cards.length; i++) {
      currentSubset.push(cards[i]);
      backtrack(i + 1, currentSubset, currentSum + cards[i].value);
      currentSubset.pop();
    }
  }

  backtrack(0, [], 0);
  return results;
}

export function getCaptureMoves(
  cardPlayed: Card,
  tableCards: readonly Card[],
  isLastPlayOfDeck: boolean
): CaptureMove[] {
  if (isAce(cardPlayed)) {
    return getAceCaptureMoves(cardPlayed, tableCards, isLastPlayOfDeck);
  }

  const moves: CaptureMove[] = [];

  // 1. Regola del 15
  const neededSum = 15 - cardPlayed.value;
  if (neededSum > 0) {
    const sum15Subsets = findSubsetsWithSum(tableCards, neededSum);
    for (const subset of sum15Subsets) {
      const isScopa = !isLastPlayOfDeck && subset.length === tableCards.length;
      moves.push({
        cardPlayed,
        capturedCards: subset,
        isAceSweep: false,
        is15Sum: true,
        isDirectMatch: false,
        isScopa,
      });
    }
  }

  // 2. Direct rank match
  const matchingCards = tableCards.filter((c) => c.rank === cardPlayed.rank);
  for (const match of matchingCards) {
    const alreadyIncluded = moves.some(
      (m) => m.capturedCards.length === 1 && m.capturedCards[0].id === match.id
    );
    if (!alreadyIncluded) {
      const isScopa = !isLastPlayOfDeck && tableCards.length === 1;
      moves.push({
        cardPlayed,
        capturedCards: [match],
        isAceSweep: false,
        is15Sum: false,
        isDirectMatch: true,
        isScopa,
      });
    }
  }

  // 3. Multi-card sum matching card rank (e.g. 6 takes 2 + 4)
  const sumRankSubsets = findSubsetsWithSum(tableCards, cardPlayed.value);
  for (const subset of sumRankSubsets) {
    if (subset.length > 1) {
      const subsetIds = subset.map((c) => c.id).sort().join(',');
      const alreadyIncluded = moves.some(
        (m) => m.capturedCards.map((c) => c.id).sort().join(',') === subsetIds
      );
      if (!alreadyIncluded) {
        const isScopa = !isLastPlayOfDeck && subset.length === tableCards.length;
        moves.push({
          cardPlayed,
          capturedCards: subset,
          isAceSweep: false,
          is15Sum: false,
          isDirectMatch: false,
          isScopa,
        });
      }
    }
  }

  return moves;
}

function getAceCaptureMoves(
  aceCard: Card,
  tableCards: readonly Card[],
  isLastPlayOfDeck: boolean
): CaptureMove[] {
  const moves: CaptureMove[] = [];
  const acesOnTable = tableCards.filter(isAce);

  // Se non ci sono Assi sul tavolo, l'Asso piglia tutto il tavolo
  if (acesOnTable.length === 0) {
    if (tableCards.length > 0) {
      moves.push({
        cardPlayed: aceCard,
        capturedCards: [...tableCards],
        isAceSweep: true,
        is15Sum: false,
        isDirectMatch: false,
        isScopa: !isLastPlayOfDeck,
      });
    }
    return moves;
  }

  // Se c'è già un Asso a terra, l'Asso non "piglia tutto", ma il giocatore
  // NON è obbligato a prendere solo l'Asso:
  // 1. Presa d'uguale: può prendere l'Asso sul tavolo
  for (const targetAce of acesOnTable) {
    moves.push({
      cardPlayed: aceCard,
      capturedCards: [targetAce],
      isAceSweep: false,
      is15Sum: false,
      isDirectMatch: true,
      isScopa: !isLastPlayOfDeck && tableCards.length === 1,
    });
  }

  // 2. Regola del 15 (Ciapachinze): con l'Asso (valore 1) può catturare combinazioni che sommano a 14 (1 + 14 = 15)
  const neededSum = 15 - aceCard.value; // 14
  const sum15Subsets = findSubsetsWithSum(tableCards, neededSum);
  for (const subset of sum15Subsets) {
    const isScopa = !isLastPlayOfDeck && subset.length === tableCards.length;
    moves.push({
      cardPlayed: aceCard,
      capturedCards: subset,
      isAceSweep: false,
      is15Sum: true,
      isDirectMatch: false,
      isScopa,
    });
  }

  return moves;
}

export function calculatePrimiera(cards: readonly Card[]): number {
  const bestBySuit: Record<string, number> = {
    denari: 0,
    cuori: 0,
    picche: 0,
    fiori: 0,
  };

  for (const card of cards) {
    const s = card.suit.toLowerCase();
    const group =
      s === 'denari' || s === 'quadri'
        ? 'denari'
        : s === 'cuori' || s === 'coppe'
        ? 'cuori'
        : s === 'picche' || s === 'spade'
        ? 'picche'
        : 'fiori';

    const pVal = PRIMIERA_VALUES[card.rank] || 0;
    if (pVal > bestBySuit[group]) {
      bestBySuit[group] = pVal;
    }
  }

  return Object.values(bestBySuit).reduce((sum, val) => sum + val, 0);
}

export function calculatePiccola(cards: readonly Card[]): number {
  const QuadriRanks = new Set(
    cards.filter(isQuadri).map((c) => c.rank)
  );

  // Piccola requires continuous cards from Ace: 1, 2, and 3
  if (!QuadriRanks.has(1) || !QuadriRanks.has(2) || !QuadriRanks.has(3)) {
    return 0;
  }

  let points = GAME_CONFIG.SCORING.PICCOLA_BASE_POINTS;
  for (let r = 4; r <= 7; r++) {
    if (QuadriRanks.has(r)) {
      points++;
    } else {
      break;
    }
  }
  return points;
}

export function hasGrande(cards: readonly Card[]): boolean {
  const QuadriRanks = new Set(
    cards.filter(isQuadri).map((c) => c.rank)
  );
  return QuadriRanks.has(8) && QuadriRanks.has(9) && QuadriRanks.has(10);
}

function resolvePointWinner(playerCount: number, aiCount: number): ScoringWinner {
  if (playerCount > aiCount) return 'player';
  if (aiCount > playerCount) return 'ai';
  return 'tie';
}

export function evaluateDeal(
  playerCards: readonly Card[],
  aiCards: readonly Card[],
  playerScope: number,
  aiScope: number,
  playerAccusePts: number,
  aiAccusePts: number
): DealScores {
  const cartePlayer = playerCards.length;
  const carteAI = aiCards.length;
  const cartePoint = resolvePointWinner(cartePlayer, carteAI);

  const QuadriPlayer = playerCards.filter(isQuadri).length;
  const QuadriAI = aiCards.filter(isQuadri).length;
  const QuadriPoint = resolvePointWinner(QuadriPlayer, QuadriAI);

  const playerHasSettebello = playerCards.some(isSettebello);
  const aiHasSettebello = aiCards.some(isSettebello);
  let settebelloPoint: PlayerSide | 'none' = 'none';
  if (playerHasSettebello) settebelloPoint = 'player';
  else if (aiHasSettebello) settebelloPoint = 'ai';

  const primieraPlayer = calculatePrimiera(playerCards);
  const primieraAI = calculatePrimiera(aiCards);
  const primieraPoint = resolvePointWinner(primieraPlayer, primieraAI);

  const piccolaPlayerPoints = calculatePiccola(playerCards);
  const piccolaAIPoints = calculatePiccola(aiCards);

  const grandePlayerPoints = hasGrande(playerCards) ? GAME_CONFIG.SCORING.GRANDE_POINTS : 0;
  const grandeAIPoints = hasGrande(aiCards) ? GAME_CONFIG.SCORING.GRANDE_POINTS : 0;

  let totalDealPlayer = playerScope + playerAccusePts;
  if (cartePoint === 'player') totalDealPlayer += 1;
  if (QuadriPoint === 'player') totalDealPlayer += 1;
  if (settebelloPoint === 'player') totalDealPlayer += 1;
  if (primieraPoint === 'player') totalDealPlayer += 1;
  totalDealPlayer += piccolaPlayerPoints + grandePlayerPoints;

  let totalDealAI = aiScope + aiAccusePts;
  if (cartePoint === 'ai') totalDealAI += 1;
  if (QuadriPoint === 'ai') totalDealAI += 1;
  if (settebelloPoint === 'ai') totalDealAI += 1;
  if (primieraPoint === 'ai') totalDealAI += 1;
  totalDealAI += piccolaAIPoints + grandeAIPoints;

  return {
    cartePlayer,
    carteAI,
    cartePoint,
    denariPlayer: QuadriPlayer,
    denariAI: QuadriAI,
    denariPoint: QuadriPoint,
    settebelloPoint,
    primieraPlayer,
    primieraAI,
    primieraPoint,
    piccolaPlayerPoints,
    piccolaAIPoints,
    grandePlayerPoints,
    grandeAIPoints,
    scopePlayer: playerScope,
    scopeAI: aiScope,
    accusePlayerPoints: playerAccusePts,
    accuseAIPoints: aiAccusePts,
    totalDealPlayer,
    totalDealAI,
    isCappottoPlayer: QuadriPlayer === 10,
    isCappottoAI: QuadriAI === 10,
  };
}
