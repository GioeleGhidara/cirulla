export type Suit =
  | 'denari'
  | 'cuori'
  | 'picche'
  | 'fiori'
  | 'coppe'
  | 'spade'
  | 'bastoni'
  | 'quadri';

export type DeckStyle = 'genovesi' | 'piacentine' | 'napoletane';

export type AIDifficulty = 'facile' | 'normale' | 'campione';

export type PlayerSide = 'player' | 'ai';

export type ScoringWinner = PlayerSide | 'tie';

export interface Card {
  readonly id: string;
  readonly suit: Suit;
  readonly rank: number;
  readonly value: number;
  readonly name: string;
}

export interface CaptureMove {
  readonly cardPlayed: Card;
  readonly capturedCards: readonly Card[];
  readonly isAceSweep: boolean;
  readonly is15Sum: boolean;
  readonly isDirectMatch: boolean;
  readonly isScopa: boolean;
}

export type AccusaType = 'nessuna' | 'tre' | 'dieci';

export interface AccusaInfo {
  readonly type: AccusaType;
  readonly points: number;
  readonly description: string;
  readonly cards: readonly Card[];
  readonly usedMatta?: boolean;
}

export interface DealScores {
  readonly cartePlayer: number;
  readonly carteAI: number;
  readonly cartePoint: ScoringWinner;

  readonly denariPlayer: number;
  readonly denariAI: number;
  readonly denariPoint: ScoringWinner;

  readonly settebelloPoint: PlayerSide | 'none';

  readonly primieraPlayer: number;
  readonly primieraAI: number;
  readonly primieraPoint: ScoringWinner;

  readonly piccolaPlayerPoints: number;
  readonly piccolaAIPoints: number;

  readonly grandePlayerPoints: number;
  readonly grandeAIPoints: number;

  readonly scopePlayer: number;
  readonly scopeAI: number;

  readonly accusePlayerPoints: number;
  readonly accuseAIPoints: number;

  readonly totalDealPlayer: number;
  readonly totalDealAI: number;

  readonly isCappottoPlayer?: boolean;
  readonly isCappottoAI?: boolean;
}

export interface GameStats {
  readonly gamesPlayed: number;
  readonly gamesWon: number;
  readonly gamesLost: number;
  readonly totalScope: number;
  readonly bestScoreInGame: number;
  readonly piccoleMade: number;
  readonly grandiMade: number;
  readonly accuseTreMade: number;
  readonly accuseDieciMade: number;
}

export interface GameSettings {
  readonly deckStyle: DeckStyle;
  readonly aiDifficulty: AIDifficulty;
  readonly targetScore: 31 | 51;
  readonly soundEnabled: boolean;
  readonly hapticsEnabled: boolean;
  readonly autoSelectBestCapture: boolean;
}
