import { Card, CaptureMove, AccusaInfo, DealScores } from '../types/card';
import { PRIMIERA_VALUES } from '../constants/rules';

export function isMatta(card: Card): boolean {
  return card.suit === 'spade' && card.rank === 7;
}

export function checkMonte(cards: Card[]): { scopeCount: number; sum: number } {
  const sum = cards.reduce((acc, c) => acc + c.value, 0);
  if (sum === 30) {
    return { scopeCount: 2, sum: 30 };
  }
  if (sum === 15) {
    return { scopeCount: 1, sum: 15 };
  }
  return { scopeCount: 0, sum };
}

export function evaluateAccusa(hand: Card[]): AccusaInfo {
  if (hand.length !== 3) {
    return { type: 'nessuna', points: 0, description: '', cards: hand };
  }

  const mattaIndex = hand.findIndex(isMatta);
  const hasMatta = mattaIndex !== -1;

  // 1. Check "Buona da dieci" (three of a kind)
  if (!hasMatta) {
    if (hand[0].rank === hand[1].rank && hand[1].rank === hand[2].rank) {
      return {
        type: 'dieci',
        points: 10,
        description: 'Buona da dieci! Tre carte uguali',
        cards: hand,
      };
    }
  } else {
    // With matta, other 2 cards must be examined
    const others = hand.filter((_, i) => i !== mattaIndex);
    if (others[0].rank === others[1].rank) {
      return {
        type: 'dieci',
        points: 10,
        description: 'Buona da dieci! Tris con la Matta',
        cards: hand,
        usedMatta: true,
      };
    }
  }

  // 2. Check "Buona da tre" (sum <= 9)
  if (!hasMatta) {
    const sum = hand.reduce((acc, c) => acc + c.value, 0);
    if (sum <= 9) {
      return {
        type: 'tre',
        points: 3,
        description: `Buona da tre! Somma delle carte = ${sum}`,
        cards: hand,
      };
    }
  } else {
    // Matta chooses 1 to minimize sum
    const others = hand.filter((_, i) => i !== mattaIndex);
    const sumOthers = others.reduce((acc, c) => acc + c.value, 0);
    const minSum = sumOthers + 1; // Matta counted as 1
    if (minSum <= 9) {
      return {
        type: 'tre',
        points: 3,
        description: `Buona da tre con la Matta! Somma = ${minSum}`,
        cards: hand,
        usedMatta: true,
      };
    }
  }

  return { type: 'nessuna', points: 0, description: '', cards: hand };
}

/**
 * Finds all subsets of tableCards whose sum equals targetSum.
 */
function findSubsetsWithSum(cards: Card[], targetSum: number): Card[][] {
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

/**
 * Calculates all possible legal capture moves for a card played on tableCards.
 */
export function getCaptureMoves(
  cardPlayed: Card,
  tableCards: Card[],
  isLastPlayOfDeck: boolean
): CaptureMove[] {
  const moves: CaptureMove[] = [];

  // Special Ace rule: Asso pigliatutto
  if (cardPlayed.rank === 1) {
    const acesOnTable = tableCards.filter((c) => c.rank === 1);
    if (acesOnTable.length > 0) {
      // Takes one Ace on table (or multiple if standard matching)
      for (const ace of acesOnTable) {
        const isScopa = !isLastPlayOfDeck && tableCards.length === 1;
        moves.push({
          cardPlayed,
          capturedCards: [ace],
          isAceSweep: false,
          is15Sum: false,
          isDirectMatch: true,
          isScopa,
        });
      }
      return moves;
    } else {
      // Ace sweeps all cards on table!
      if (tableCards.length > 0) {
        const isScopa = !isLastPlayOfDeck;
        moves.push({
          cardPlayed,
          capturedCards: [...tableCards],
          isAceSweep: true,
          is15Sum: false,
          isDirectMatch: false,
          isScopa,
        });
      }
      return moves;
    }
  }

  // 1. Regola del 15: cardPlayed.value + sum(tableSubset) === 15
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

  // 2. Presa d'uguale (direct match with a card of same rank)
  const matchingCards = tableCards.filter((c) => c.rank === cardPlayed.rank);
  for (const match of matchingCards) {
    // Avoid duplicate if already covered by sum 15 (e.g. if rank is 7.5 which doesn't happen)
    const isAlreadyPresent = moves.some(
      (m) => m.capturedCards.length === 1 && m.capturedCards[0].id === match.id
    );
    if (!isAlreadyPresent) {
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

  return moves;
}

/**
 * Calculates Primiera points for a set of cards according to Italian rules.
 */
export function calculatePrimiera(cards: Card[]): number {
  const bestBySuit: Record<string, number> = {
    denari: 0,
    coppe: 0,
    spade: 0,
    bastoni: 0,
  };

  for (const card of cards) {
    const pVal = PRIMIERA_VALUES[card.rank] || 0;
    if (pVal > bestBySuit[card.suit]) {
      bestBySuit[card.suit] = pVal;
    }
  }

  // Must have at least one card in each suit to make a valid Primiera
  const suits = Object.keys(bestBySuit);
  const hasAllSuits = suits.every((s) => bestBySuit[s] > 0);
  if (!hasAllSuits) {
    // Return sum of what's available
    return Object.values(bestBySuit).reduce((a, b) => a + b, 0);
  }

  return Object.values(bestBySuit).reduce((a, b) => a + b, 0);
}

/**
 * Calculates Piccola points: Asso, 2, 3 of Denari = 3 pts, up to 7 (+1 pt each consecutive card).
 */
export function calculatePiccola(cards: Card[]): number {
  const denariRanks = new Set(
    cards.filter((c) => c.suit === 'denari').map((c) => c.rank)
  );

  // Must have 1, 2, and 3
  if (!denariRanks.has(1) || !denariRanks.has(2) || !denariRanks.has(3)) {
    return 0;
  }

  let points = 3;
  for (let r = 4; r <= 7; r++) {
    if (denariRanks.has(r)) {
      points++;
    } else {
      break;
    }
  }
  return points;
}

/**
 * Calculates Grande points: Fante (8), Cavallo (9), Re (10) of Denari = 5 points!
 */
export function hasGrande(cards: Card[]): boolean {
  const denariRanks = new Set(
    cards.filter((c) => c.suit === 'denari').map((c) => c.rank)
  );
  return denariRanks.has(8) && denariRanks.has(9) && denariRanks.has(10);
}

/**
 * Computes deal scoring (end of 40 cards).
 */
export function evaluateDeal(
  playerCards: Card[],
  aiCards: Card[],
  playerScope: number,
  aiScope: number,
  playerAccusePts: number,
  aiAccusePts: number
): DealScores {
  // 1. Carte (> 20)
  const cartePlayer = playerCards.length;
  const carteAI = aiCards.length;
  let cartePoint: 'player' | 'ai' | 'tie' = 'tie';
  if (cartePlayer > carteAI) cartePoint = 'player';
  else if (aiCards.length > cartePlayer) cartePoint = 'ai';

  // 2. Denari (> 5)
  const denariPlayer = playerCards.filter((c) => c.suit === 'denari').length;
  const denariAI = aiCards.filter((c) => c.suit === 'denari').length;
  let denariPoint: 'player' | 'ai' | 'tie' = 'tie';
  if (denariPlayer > denariAI) denariPoint = 'player';
  else if (denariAI > denariPlayer) denariPoint = 'ai';

  // 3. Settebello (7 di Denari)
  const playerHasSettebello = playerCards.some(
    (c) => c.suit === 'denari' && c.rank === 7
  );
  const aiHasSettebello = aiCards.some(
    (c) => c.suit === 'denari' && c.rank === 7
  );
  let settebelloPoint: 'player' | 'ai' | 'none' = 'none';
  if (playerHasSettebello) settebelloPoint = 'player';
  else if (aiHasSettebello) settebelloPoint = 'ai';

  // 4. Primiera
  const primieraPlayer = calculatePrimiera(playerCards);
  const primieraAI = calculatePrimiera(aiCards);
  let primieraPoint: 'player' | 'ai' | 'tie' = 'tie';
  if (primieraPlayer > primieraAI) primieraPoint = 'player';
  else if (primieraAI > primieraPlayer) primieraPoint = 'ai';

  // 5. Piccola (Denari 1, 2, 3...)
  const piccolaPlayerPoints = calculatePiccola(playerCards);
  const piccolaAIPoints = calculatePiccola(aiCards);

  // 6. Grande (Denari 8, 9, 10)
  const grandePlayerPoints = hasGrande(playerCards) ? 5 : 0;
  const grandeAIPoints = hasGrande(aiCards) ? 5 : 0;

  // Totals for this deal:
  let totalDealPlayer = playerScope + playerAccusePts;
  if (cartePoint === 'player') totalDealPlayer += 1;
  if (denariPoint === 'player') totalDealPlayer += 1;
  if (settebelloPoint === 'player') totalDealPlayer += 1;
  if (primieraPoint === 'player') totalDealPlayer += 1;
  totalDealPlayer += piccolaPlayerPoints + grandePlayerPoints;

  let totalDealAI = aiScope + aiAccusePts;
  if (cartePoint === 'ai') totalDealAI += 1;
  if (denariPoint === 'ai') totalDealAI += 1;
  if (settebelloPoint === 'ai') totalDealAI += 1;
  if (primieraPoint === 'ai') totalDealAI += 1;
  totalDealAI += piccolaAIPoints + grandeAIPoints;

  return {
    cartePlayer,
    carteAI,
    cartePoint,
    denariPlayer,
    denariAI,
    denariPoint,
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
  };
}
