import { Card, Suit } from '../types/card';
import { RANK_NAMES, SUIT_NAMES } from '../constants/rules';

const SUITS: Suit[] = ['denari', 'coppe', 'spade', 'bastoni'];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (let rank = 1; rank <= 10; rank++) {
      const name = `${RANK_NAMES[rank]} di ${SUIT_NAMES[suit]}`;
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: rank,
        name,
      });
    }
  }

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
