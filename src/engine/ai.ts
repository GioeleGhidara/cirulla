import { Card, CaptureMove, AIDifficulty } from '../types/card';
import { getCaptureMoves, isDenari, isSettebello, isAce } from './rules';

export interface AIDecision {
  readonly cardToPlay: Card;
  readonly captureMove?: CaptureMove;
}

const AI_WEIGHTS = {
  SCOPA: 100,
  SETTEBELLO: 50,
  DENARO_CARD: 12,
  PICCOLA_PIECE: 15,
  GRANDE_PIECE: 12,
  CARD_COUNT: 4,
  PRIMIERA_SEVEN: 8,
  PRIMIERA_SIX: 6,
  PRIMIERA_ACE: 5,
} as const;

function evaluateCaptureMove(move: CaptureMove): number {
  let score = 0;

  if (move.isScopa) {
    score += AI_WEIGHTS.SCOPA;
  }

  const allCapturedCards = [move.cardPlayed, ...move.capturedCards];

  if (allCapturedCards.some(isSettebello)) {
    score += AI_WEIGHTS.SETTEBELLO;
  }

  const denariCount = allCapturedCards.filter(isDenari).length;
  score += denariCount * AI_WEIGHTS.DENARO_CARD;

  const piccolaPieces = allCapturedCards.filter(
    (c) => isDenari(c) && (c.rank === 1 || c.rank === 2 || c.rank === 3)
  ).length;
  score += piccolaPieces * AI_WEIGHTS.PICCOLA_PIECE;

  const grandePieces = allCapturedCards.filter(
    (c) => isDenari(c) && (c.rank === 8 || c.rank === 9 || c.rank === 10)
  ).length;
  score += grandePieces * AI_WEIGHTS.GRANDE_PIECE;

  score += move.capturedCards.length * AI_WEIGHTS.CARD_COUNT;

  for (const card of move.capturedCards) {
    if (card.rank === 7) score += AI_WEIGHTS.PRIMIERA_SEVEN;
    else if (card.rank === 6) score += AI_WEIGHTS.PRIMIERA_SIX;
    else if (card.rank === 1) score += AI_WEIGHTS.PRIMIERA_ACE;
  }

  return score;
}

function evaluateDiscardSafety(
  card: Card,
  tableCards: readonly Card[],
  difficulty: AIDifficulty
): number {
  let safetyScore = 50;

  if (isSettebello(card)) {
    safetyScore -= 1000;
  }

  if (isDenari(card)) {
    if (card.rank <= 3) safetyScore -= 100;
    else if (card.rank >= 8) safetyScore -= 80;
    else safetyScore -= 50;
  }

  if (card.rank === 7) safetyScore -= 60;
  if (card.rank === 6) safetyScore -= 40;
  if (isAce(card)) safetyScore -= 70;

  if (difficulty === 'facile') {
    return safetyScore + (Math.random() * 40 - 20);
  }

  for (const tableCard of tableCards) {
    const combinedSum = tableCard.value + card.value;
    if (combinedSum < 15 && combinedSum >= 5) {
      safetyScore -= 15;
    }
  }

  return safetyScore;
}

export function chooseAIMove(
  aiHand: readonly Card[],
  tableCards: readonly Card[],
  isLastPlayOfDeck: boolean,
  difficulty: AIDifficulty
): AIDecision {
  if (aiHand.length === 0) {
    throw new Error('AI hand is empty');
  }

  const movesByCard = aiHand.map((card) => ({
    card,
    moves: getCaptureMoves(card, tableCards, isLastPlayOfDeck),
  }));

  const cardsWithCaptures = movesByCard.filter((entry) => entry.moves.length > 0);

  if (cardsWithCaptures.length > 0) {
    const scoredMoves: { card: Card; move: CaptureMove; score: number }[] = [];

    for (const { card, moves } of cardsWithCaptures) {
      for (const move of moves) {
        let score = evaluateCaptureMove(move);

        if (difficulty === 'facile') {
          score += Math.random() * 30 - 15;
        } else if (difficulty === 'campione') {
          const isSmallSweep =
            move.isAceSweep &&
            !move.isScopa &&
            move.capturedCards.length === 1 &&
            move.capturedCards[0].value <= 3 &&
            !isDenari(move.capturedCards[0]);

          if (isSmallSweep) {
            score -= 20;
          }
        }

        scoredMoves.push({ card, move, score });
      }
    }

    scoredMoves.sort((a, b) => b.score - a.score);
    const optimal = scoredMoves[0];

    return {
      cardToPlay: optimal.card,
      captureMove: optimal.move,
    };
  }

  let bestDiscardCard = aiHand[0];
  let highestSafety = -Infinity;

  for (const card of aiHand) {
    const safety = evaluateDiscardSafety(card, tableCards, difficulty);
    if (safety > highestSafety) {
      highestSafety = safety;
      bestDiscardCard = card;
    }
  }

  return {
    cardToPlay: bestDiscardCard,
    captureMove: undefined,
  };
}
