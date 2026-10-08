import { Card, DeckStyle, Suit } from '../types/card';
import { RANK_NAMES, SUIT_NAMES } from '../constants/rules';

const FRENCH_GENOVESI_SUITS: Suit[] = ['denari', 'cuori', 'picche', 'fiori'];
const ITALIAN_REGIONAL_SUITS: Suit[] = ['denari', 'coppe', 'spade', 'bastoni'];

export function createDeck(deckStyle: DeckStyle = 'genovesi'): Card[] {
  const suits =
    deckStyle === 'piacentine' || deckStyle === 'napoletane'
      ? ITALIAN_REGIONAL_SUITS
      : FRENCH_GENOVESI_SUITS;

  const deck: Card[] = [];

  for (const suit of suits) {
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
