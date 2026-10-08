import { DeckSkinId } from '../assets/deckSkinsRegistry';

export type DeckCategory =
  | 'tutti'
  | 'genovesi'
  | 'regionali_italiane'
  | 'storiche_europee'
  | 'moderne';

export interface DeckSkinInfo {
  readonly id: DeckSkinId;
  readonly code: string;
  readonly name: string;
  readonly origin: string;
  readonly manufacturer: string;
  readonly category: 'genovesi' | 'regionali_italiane' | 'storiche_europee' | 'moderne';
  readonly suitType: 'francesi' | 'italiane';
  readonly isDefault: boolean;
  readonly isPlayableOffline: boolean;
  readonly description: string;
  readonly historyBadge: string;
  readonly previewRank: {
    readonly asso: string;
    readonly jack: string;
    readonly queen: string;
    readonly king: string;
  };
}

export const ALL_DECK_SKINS: readonly DeckSkinInfo[] = [
  // 1. GENOVESI DAL NEGRO (PREDEFINITO)
  {
    id: 'genovesi_dal_negro',
    code: 'A04',
    name: 'Carte Genovesi Dal Negro',
    origin: 'Genova & Liguria',
    manufacturer: 'Dal Negro (Treviso)',
    category: 'genovesi',
    suitType: 'francesi',
    isDefault: true,
    isPlayableOffline: true,
    description:
      'Il mazzo storico per eccellenza per giocare a Cirulla in Liguria. Figure regionali genovesi a due teste con berretto piumato, alabarda e il classico dorso con incisione del castello di Treviso.',
    historyBadge: 'PREDEFINITO CIRULLA',
    previewRank: {
      asso: 'Asso con bollo Dal Negro',
      jack: 'Fante ligure (8)',
      queen: 'Donna con velo (9)',
      king: 'Re barbuto (10)',
    },
  },

  // 2. RAMINO 98 MODIANO
  {
    id: 'ramino_modiano',
    code: 'A01',
    name: 'Ramino 98 Modiano',
    origin: 'Trieste / Italia',
    manufacturer: 'Modiano (Trieste)',
    category: 'regionali_italiane',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Il classico mazzo italiano Modiano per giochi a semi francesi (Ramino, Cirulla, Scala 40). Design elegante, indici angolari chiari e figure tradizionali stampate a Trieste.',
    historyBadge: 'CLASSICO ITALIANO',
    previewRank: {
      asso: 'Asso grande centrale',
      jack: 'Jack Modiano (8)',
      queen: 'Regina con scettro (9)',
      king: 'Re maestoso (10)',
    },
  },

  // 3. BAROQUE PIATNIK VIENNA
  {
    id: 'baroque_piatnik',
    code: 'A05',
    name: 'Baroque N. 2118',
    origin: 'Vienna, Austria',
    manufacturer: 'Ferd. Piatnik & Söhne',
    category: 'storiche_europee',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Capolavoro della manifattura viennese Piatnik del 19° secolo. Figure barocche riccamente ornate, mantelli dorati con ermellino, globi crucigeri imperiali e dettagli aristocratici.',
    historyBadge: 'ARTE BAROCCA',
    previewRank: {
      asso: 'Asso barocco lavorato',
      jack: 'Cavaliere nobile (8)',
      queen: 'Dama con diadema (9)',
      king: 'Imperatore con globo (10)',
    },
  },

  // 4. ANCIENT FRENCH
  {
    id: 'ancient_french',
    code: 'A02',
    name: 'Ancient French',
    origin: 'Francia d’Epoca',
    manufacturer: 'Mazzo Storico Francese',
    category: 'storiche_europee',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Mazzo antico francese con incisioni storiche. Conserva i tratti ancestrali delle corti medievali di Rouen e Parigi, antenate di tutti i mazzi a semi francesi occidentali.',
    historyBadge: 'EPOCA 1800',
    previewRank: {
      asso: 'Asso geometrico antico',
      jack: 'Scudiero in cotta (8)',
      queen: 'Regina con giglio (9)',
      king: 'Sovrano medievale (10)',
    },
  },

  // 5. LOMBARDE - TICINESI DAL NEGRO
  {
    id: 'lombarde_ticinesi',
    code: 'A11',
    name: 'Lombarde - Ticinesi',
    origin: 'Lombardia & Canton Ticino',
    manufacturer: 'Dal Negro (Treviso)',
    category: 'regionali_italiane',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Tipico mazzo dell’area lombardo-svizzera con cornice continua sul bordo carta e figure storiche dal profilo nobile e severo.',
    historyBadge: 'LOMBARDO - SVIZZERO',
    previewRank: {
      asso: 'Asso con cornice',
      jack: 'Fante incorniciato (8)',
      queen: 'Donna lombarda (9)',
      king: 'Re in maestà (10)',
    },
  },

  // 6. GENOVESI MODIANO
  {
    id: 'genovesi_modiano',
    code: 'K06',
    name: 'Carte Genovesi Modiano',
    origin: 'Genova / Trieste',
    manufacturer: 'Modiano (Trieste)',
    category: 'genovesi',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'La variante storica realizzata da Modiano Trieste per il mercato ligure. Celebre per la Regina di Cuori che regge una rosa profumata e la firma Modiano Trieste.',
    historyBadge: 'MODIANO LIGURIA',
    previewRank: {
      asso: 'Asso con firma Modiano',
      jack: 'Fante con asta (8)',
      queen: 'Donna con rosa (9)',
      king: 'Re di Trieste (10)',
    },
  },

  // 7. NAPOLETANE CLASSICHE
  {
    id: 'napoletane_classiche',
    code: 'A06',
    name: 'Napoletane Tradizionali',
    origin: 'Napoli / Mezzogiorno',
    manufacturer: 'Tradizione Campana',
    category: 'regionali_italiane',
    suitType: 'italiane',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Il mazzo a semi italo-spagnoli più diffuso d’Italia (Denari, Coppe, Spade, Bastoni). Ideale per gli appassionati che amano la visuale con figure a figura intera.',
    historyBadge: 'SEMI ITALIANI',
    previewRank: {
      asso: 'Asso d’Uccello / Coppe',
      jack: 'Fante a piedi (8)',
      queen: 'Cavallo / Cavaliere (9)',
      king: 'Re seduto sul trono (10)',
    },
  },

  // 8. RUSSIAN ATLASNYE
  {
    id: 'russian_atlasnye',
    code: 'A03',
    name: 'Russian Atlasnye',
    origin: 'San Pietroburgo, Russia',
    manufacturer: 'Fabbrica Carte Imperiale (1862)',
    category: 'storiche_europee',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Disegnato dal celebre pittore accademico Adolf Charlemagne per la Manifattura Imperiale Russa nel 1862. Il mazzo più famoso e longevo di tutta l’Europa orientale.',
    historyBadge: 'IMPERIALE 1862',
    previewRank: {
      asso: 'Asso satinato',
      jack: 'Valletto da parata (8)',
      queen: 'Zarina con mantello (9)',
      king: 'Zar con corona (10)',
    },
  },

  // 9. FOLKLORE PIATNIK
  {
    id: 'folklore_piatnik',
    code: 'A08',
    name: 'Folklore N. 2169',
    origin: 'Vienna, Austria',
    manufacturer: 'Ferd. Piatnik & Söhne',
    category: 'storiche_europee',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Mazzo illustrato con costumi folkloristici tradizionali delle vallate alpine e danubiane. Figure ricche di ricami, pizzi e cappelli regionali d’epoca.',
    historyBadge: 'COSTUMI ALPINI',
    previewRank: {
      asso: 'Asso rustico',
      jack: 'Giovane in abito tipico (8)',
      queen: 'Contessa con corpetto (9)',
      king: 'Patriarca in festa (10)',
    },
  },

  // 10. KAISER JUBILÄUM PIATNIK
  {
    id: 'kaiser_piatnik',
    code: 'A10',
    name: 'Kaiser Jubiläum N. 2138',
    origin: 'Impero Austro-Ungarico',
    manufacturer: 'Ferd. Piatnik & Söhne',
    category: 'storiche_europee',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Edizione celebrativa per il Giubileo dell’Imperatore Francesco Giuseppe I. Ritratti storici magnifici ispirati all’aristocrazia asburgica del tramonto dell’Impero.',
    historyBadge: 'GIUBILEO IMPERIALE',
    previewRank: {
      asso: 'Asso imperiale aquilato',
      jack: 'Ufficiale della guardia (8)',
      queen: 'Imperatrice Elisabetta (9)',
      king: 'Kaiser Francesco Giuseppe (10)',
    },
  },

  // 11. SALON KARTE NO. 66
  {
    id: 'salon_karte_66',
    code: 'A12',
    name: 'Salon Karte No. 66',
    origin: 'Altenburg, Germania',
    manufacturer: 'Altenburger Spielkartenfabrik',
    category: 'storiche_europee',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Pregiato mazzo da salotto tedesco di inizio Novecento, celebre per le sue figure eleganti dal gusto Biedermeier e la finezza dei dettagli litografici.',
    historyBadge: 'SALOTTO BIEDERMEIER',
    previewRank: {
      asso: 'Asso fine litografia',
      jack: 'Paggio di corte (8)',
      queen: 'Dama di salotto (9)',
      king: 'Monarca illuminato (10)',
    },
  },

  // 12. DONDORF HAUPSTADTE SPIEL
  {
    id: 'dondorf',
    code: 'A07',
    name: 'Dondorf Haupstadte Spiel',
    origin: 'Francoforte, Germania',
    manufacturer: 'B. Dondorf (Frankfurt)',
    category: 'storiche_europee',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Lo storico mazzo delle Capitali Europee della prestigiosa stamperia di lusso Dondorf. Ogni figura di corte indossa costumi regali delle maggiori corti europee.',
    historyBadge: 'DONDORF LUXE',
    previewRank: {
      asso: 'Asso ornato',
      jack: 'Paggio delle capitali (8)',
      queen: 'Regina d’Europa (9)',
      king: 'Re delle capitali (10)',
    },
  },

  // 13. CARTA MUNDI FRANZÖSISCHES BILD
  {
    id: 'carta_mundi',
    code: 'A09',
    name: 'Carta Mundi Bild',
    origin: 'Turnhout, Belgio',
    manufacturer: 'Carta Mundi',
    category: 'storiche_europee',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Il modello standard dell’Europa centro-occidentale prodotto dal gigante belga Carta Mundi. Linee chiare, colori primari vivaci e grande leggibilità a tavola.',
    historyBadge: 'STANDARD EUROPEO',
    previewRank: {
      asso: 'Asso lineare',
      jack: 'Valletto da gioco (8)',
      queen: 'Regina belga (9)',
      king: 'Re dei casinò (10)',
    },
  },

  // 14. CIRULLA FLAT MODERNO
  {
    id: 'moderno',
    code: 'MOD',
    name: 'Vettoriale Moderno (Cirulla Flat)',
    origin: 'Design Digitale',
    manufacturer: 'Cirulla Native Vector',
    category: 'moderne',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Design vettoriale minimale con pips a griglia scalabile e silhouette ad alto contrasto. Pensato per schermi piccoli e massima visibilità delle combinazioni del 15.',
    historyBadge: 'ALTO CONTRASTO',
    previewRank: {
      asso: 'Seme grande centrale',
      jack: 'Silhouette Jack (8)',
      queen: 'Silhouette Donna (9)',
      king: 'Silhouette Re (10)',
    },
  },

  // 15. FRANCESI POKER CLASSICHE
  {
    id: 'classico_poker',
    code: 'POK',
    name: 'Francesi Poker Classiche',
    origin: 'Standard Internazionale',
    manufacturer: 'Deck of Cards Standard',
    category: 'moderne',
    suitType: 'francesi',
    isDefault: false,
    isPlayableOffline: true,
    description:
      'Il mazzo anglo-americano classico da 52 carte riadattato al mazzo da 40 della Cirulla. Familiarità immediata per chi gioca spesso a Poker o Blackjack.',
    historyBadge: 'POKER INTERNAZIONALE',
    previewRank: {
      asso: 'Ace of Spades/Hearts',
      jack: 'Jack inglese (8)',
      queen: 'Queen inglese (9)',
      king: 'King inglese (10)',
    },
  },
];
