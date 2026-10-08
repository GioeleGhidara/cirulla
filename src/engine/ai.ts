import { Card, CaptureMove, AIDifficulty } from '../types/card';
import { getCaptureMoves } from './rules';

export interface AIDecision {
  cardToPlay: Card;
  captureMove?: CaptureMove;
}

/**
 * Rates the strategic value of a capture move.
 */
function evaluateMove(move: CaptureMove): number {
  let score = 0;

  // 1. Scopa is paramount (+100)
  if (move.isScopa) {
    score += 100;
  }

  // 2. Settebello (7 di Denari)
  const allCards = [move.cardPlayed, ...move.capturedCards];
  const hasSettebello = allCards.some(
    (c) => c.suit === 'denari' && c.rank === 7
  );
  if (hasSettebello) {
    score += 50;
  }

  // 3. Denari cards
  const denariCount = allCards.filter((c) => c.suit === 'denari').length;
  score += denariCount * 12;

  // 4. Piccola pieces (1, 2, 3 di Denari)
  const piccolaPieces = allCards.filter(
    (c) => c.suit === 'denari' && (c.rank === 1 || c.rank === 2 || c.rank === 3)
  ).length;
  score += piccolaPieces * 15;

  // 5. Grande pieces (8, 9, 10 di Denari)
  const grandePieces = allCards.filter(
    (c) => c.suit === 'denari' && (c.rank === 8 || c.rank === 9 || c.rank === 10)
  ).length;
  score += grandePieces * 12;

  // 6. Total cards captured (quantity helps win 'Carte')
  score += move.capturedCards.length * 4;

  // 7. Primiera value (7s, 6s, Aces)
  for (const c of move.capturedCards) {
    if (c.rank === 7) score += 8;
    else if (c.rank === 6) score += 6;
    else if (c.rank === 1) score += 5;
  }

  return score;
}

/**
 * Assesses the danger of leaving a specific card on the table when no capture is made.
 * A card is dangerous if it easily allows the opponent to make 15 or gives away Denari/Settebello.
 */
function evaluateDiscardSafety(
  card: Card,
  tableCards: Card[],
  difficulty: AIDifficulty
): number {
  let safetyScore = 50;

  // Never willingly discard Settebello
  if (card.suit === 'denari' && card.rank === 7) {
    safetyScore -= 1000;
  }

  // Avoid discarding Denari cards, especially Piccola (1, 2, 3) and Grande (8, 9, 10)
  if (card.suit === 'denari') {
    if (card.rank <= 3) safetyScore -= 100;
    else if (card.rank >= 8) safetyScore -= 80;
    else safetyScore -= 50;
  }

  // Avoid discarding high primiera (7, 6, 1)
  if (card.rank === 7) safetyScore -= 60;
  if (card.rank === 6) safetyScore -= 40;
  if (card.rank === 1) safetyScore -= 70; // Ace is pigliatutto, save it!

  if (difficulty === 'facile') {
    // In easy mode, add random variance
    return safetyScore + (Math.random() * 40 - 20);
  }

  // Check if adding this card creates simple 15 combinations with existing table cards
  for (const tc of tableCards) {
    const combined = tc.value + card.value;
    // If combined is <= 14, an opponent card (15 - combined) can take both for a 15
    if (combined < 15 && combined >= 5) {
      safetyScore -= 15;
    }
  }

  return safetyScore;
}

/**
 * Selects the optimal card and move for the AI.
 */
export function chooseAIMove(
  aiHand: Card[],
  tableCards: Card[],
  isLastPlayOfDeck: boolean,
  difficulty: AIDifficulty
): AIDecision {
  if (aiHand.length === 0) {
    throw new Error('AI hand is empty');
  }

  // Find all possible moves for each card in hand
  const possibleMovesByCard: {
    card: Card;
    moves: CaptureMove[];
  }[] = [];

  for (const card of aiHand) {
    const moves = getCaptureMoves(card, tableCards, isLastPlayOfDeck);
    possibleMovesByCard.push({ card, moves });
  }

  // Check if any card has capture moves
  const cardsWithMoves = possibleMovesByCard.filter((p) => p.moves.length > 0);

  if (cardsWithMoves.length > 0) {
    // Evaluate all capture moves across all playable cards
    const evaluatedMoves: {
      card: Card;
      move: CaptureMove;
      score: number;
    }[] = [];

    for (const { card, moves } of cardsWithMoves) {
      for (const move of moves) {
        let score = evaluateMove(move);

        if (difficulty === 'facile') {
          score += (Math.random() * 30 - 15);
        } else if (difficulty === 'campione') {
          // Campione bonus: prioritize preserving Ace if move takes only 1 tiny non-denari card
          if (
            move.isAceSweep &&
            !move.isScopa &&
            move.capturedCards.length === 1 &&
            move.capturedCards[0].value <= 3 &&
            move.capturedCards[0].suit !== 'denari'
          ) {
            score -= 20; // Save ace for a bigger sweep
          }
        }

        evaluatedMoves.push({ card, move, score });
      }
    }

    // Sort by best score descending
    evaluatedMoves.sort((a, b) => b.score - a.score);
    const best = evaluatedMoves[0];

    return {
      cardToPlay: best.card,
      captureMove: best.move,
    };
  }

  // No capture moves possible: AI must discard a card to the table
  let bestCard = aiHand[0];
  let bestSafety = -Infinity;

  for (const card of aiHand) {
    const safety = evaluateDiscardSafety(card, tableCards, difficulty);
    if (safety > bestSafety) {
      bestSafety = safety;
      bestCard = card;
    }
  }

  return {
    cardToPlay: bestCard,
    captureMove: undefined,
  };
}
