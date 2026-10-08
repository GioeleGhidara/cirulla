export type Suit = 'denari' | 'coppe' | 'spade' | 'bastoni';

export type DeckStyle = 'genovesi' | 'piacentine' | 'napoletane';

export type AIDifficulty = 'facile' | 'normale' | 'campione';

export interface Card {
  id: string;             // unique identifier e.g. 'denari-7'
  suit: Suit;
  rank: number;           // 1 to 10
  value: number;          // 1 (Asso) to 10 (Re)
  name: string;           // e.g. 'Sette di Denari'
}

export interface CaptureMove {
  cardPlayed: Card;
  capturedCards: Card[];
  isAceSweep: boolean;
  is15Sum: boolean;
  isDirectMatch: boolean;
  isScopa: boolean;
}

export type AccusaType = 'nessuna' | 'tre' | 'dieci';

export interface AccusaInfo {
  type: AccusaType;
  points: number;
  description: string;
  cards: Card[];
  usedMatta?: boolean;
}

export interface DealScores {
  cartePlayer: number;
  carteAI: number;
  cartePoint: 'player' | 'ai' | 'tie';

  denariPlayer: number;
  denariAI: number;
  denariPoint: 'player' | 'ai' | 'tie';

  settebelloPoint: 'player' | 'ai' | 'none';

  primieraPlayer: number;
  primieraAI: number;
  primieraPoint: 'player' | 'ai' | 'tie';

  piccolaPlayerPoints: number;
  piccolaAIPoints: number;

  grandePlayerPoints: number;
  grandeAIPoints: number;

  scopePlayer: number;
  scopeAI: number;

  accusePlayerPoints: number;
  accuseAIPoints: number;

  totalDealPlayer: number;
  totalDealAI: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalScope: number;
  bestScoreInGame: number;
  piccoleMade: number;
  grandiMade: number;
  accuseTreMade: number;
  accuseDieciMade: number;
}

export interface GameSettings {
  deckStyle: DeckStyle;
  aiDifficulty: AIDifficulty;
  targetScore: 31 | 51;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  autoSelectBestCapture: boolean;
}
