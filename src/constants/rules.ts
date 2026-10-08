export const PRIMIERA_VALUES: Record<number, number> = {
  7: 21,
  6: 18,
  1: 16, // Asso
  5: 15,
  4: 14,
  3: 13,
  2: 12,
  8: 10, // Jack
  9: 10, // Donna
  10: 10, // Re
};

export const RANK_NAMES: Record<number, string> = {
  1: 'Asso',
  2: 'Due',
  3: 'Tre',
  4: 'Quattro',
  5: 'Cinque',
  6: 'Sei',
  7: 'Sette',
  8: 'Jack',
  9: 'Donna',
  10: 'Re',
};

export const SUIT_NAMES: Record<string, string> = {
  denari: 'Denari',
  coppe: 'Coppe',
  spade: 'Spade',
  bastoni: 'Bastoni',
  Quadri: 'Quadri',
  Cuori: 'Cuori',
  Picche: 'Picche',
  Fiori: 'Fiori',
  quadri: 'Quadri',
  cuori: 'Cuori',
  picche: 'Picche',
  fiori: 'Fiori',
};

export interface GuideSection {
  title: string;
  badge: string;
  content: string;
  curiosity?: string;
}

export const CIRULLA_GUIDE: GuideSection[] = [
  {
    title: 'Origini e Curiosità: Cos\'è la Cirulla?',
    badge: 'TRADIZIONE',
    content:
      'La Cirulla è il re indiscusso dei giochi di carte della Liguria e del basso Piemonte. Dinamica, spietata e imprevedibile, è una variante della Scopa dove la fortuna e il colpo d\'occhio ribaltano ogni mano.',
    curiosity:
      'In genovese è chiamata "ciammachinze" ("chiama quindici") o "ciapachinze" ("prendi quindici"). Il termine "Cirulla" (o "Cirolla") deriverebbe dallo spagnolo "chirola", moneta antica di poco valore usata in America Latina come posta in gioco.',
  },
  {
    title: 'Il Mazzo e i Valori delle Carte',
    badge: 'LE CARTE',
    content:
      'Si gioca con un mazzo da 40 carte genovesi con i semi francesi (Denari, Cuori, Picche, Fiori) o con carte regionali (Denari, Coppe, Spade, Bastoni).\n\n• Asso = vale 1\n• 2, 3, 4, 5, 6, 7 = valore facciale\n• Jack (Fante) = vale 8\n• Donna (Cavallo) = vale 9\n• Re = vale 10',
    curiosity:
      'Nelle carte genovesi i semi hanno i simboli francesi, dove i quadri sono chiamati "Denari". Si può usare anche un mazzo francese da 52 togliendo 8, 9, 10 e Jolly: le figure mantengono il valore Jack = 8, Donna = 9, Re = 10!',
  },
  {
    title: 'Il Monte Iniziale (15, 30 o Due Assi)',
    badge: 'IL MONTE',
    content:
      'All\'inizio della smazzata, il mazziere pone 4 carte scoperte sul tavolo:\n\n• Somma pari a 15: il mazziere prende tutte e 4 le carte e segna 1 Scopa (+1 pt).\n• Somma pari a 30: il mazziere raccoglie tutto e segna 2 Scope (+2 pt).\n• Due Assi a terra: la smazzata "va a monte" e si deve rimescolare il mazzo.\n• Quattro carte uguali: evento leggendario! Il mazziere si aggiudica istantaneamente la partita.',
  },
  {
    title: 'Le Bussate di Mano: Cirulla e Decino',
    badge: 'LE BUSSATE',
    content:
      'All\'inizio di ogni mano da 3 carte, prima di giocare, controlla bene cosa hai ricevuto:\n\n• Somma ≤ 9 ("Cirulla"): bussa sul tavolo dichiarando "Cirulla"! Guadagni subito 3 Scope (3 punti) e giochi la mano a carte scoperte.\n• Tre carte uguali ("Decino"): bussa forte sul tavolo dichiarando "Decino"! Guadagni subito 10 Scope (10 punti) e giochi a carte scoperte tra i complimenti (e i mugugni) degli avversari.',
    curiosity:
      'La Matta: Il 7 di Cuori è la Matta. Può assumere qualsiasi valore dall\'Asso al Re per realizzare una Cirulla (3 pt) o un Decino (10 pt)!',
  },
  {
    title: 'Le Prese: Regola del 15, Uguale e Somma',
    badge: 'PRESE',
    content:
      'Ad ogni turno cali una carta per raccogliere dal tavolo:\n\n1. Regola del 15 (Ciapachinze): prendi le carte a terra che, sommate alla tua carta in mano, fanno 15 (es. con un 6 in mano prendi 6 e 3 a terra, perché 6+6+3=15; con un 7 prendi un Jack da 8 perché 7+8=15).\n2. Presa d\'uguale: prendi una carta dello stesso valore (es. Donna 9 prende Donna 9, Jack 8 prende Jack 8).\n3. Presa a somma: prendi carte a terra la cui somma equivale al valore della tua carta (es. Donna da 9 prende un 4 e un 5; un 6 prende 2 e 4).\n\nSe più combinazioni sono possibili, sei sempre TU a scegliere cosa prendere!',
  },
  {
    title: 'L\'Asso Pigliatutto e la Regola del 15',
    badge: 'L\'ASSO',
    content:
      'Se giochi un Asso e non ci sono altri Assi sul tavolo, "l\'Asso piglia tutto"! Prendi tutte le carte a terra e realizzi una Scopa (+1 punto).\n\nSe invece sul tavolo c\'è già un Asso, l\'Asso non piglia tutto il tavolo, ma NON sei obbligato a prendere solo l\'Asso a terra: se sul tavolo ci sono carte che sommano a 14, puoi applicare la Regola del 15 (1 + 14 = 15) e scegliere tu liberamente quale presa effettuare!',
    curiosity:
      'Se fai scopa con l\'ultima carta giocata dell\'intera smazzata da 40 carte, per regola tradizionale non viene conteggiato il punto di scopa.',
  },
  {
    title: 'Calcolo dei Punti di Mazzo e Cappotto',
    badge: 'PUNTEGGI',
    content:
      'A fine smazzata si conteggiano:\n\n• Carte: chi ha più di 20 carte guadagna 1 punto.\n• Denari: chi ha più di 5 Denari guadagna 1 punto.\n• Settebello: il 7 di Denari vale 1 punto.\n• Primiera: il miglior punteggio nei 4 semi vale 1 punto.\n• Scope: 1 punto per ogni scopa effettuata.\n• Piccola: Asso, 2 e 3 di Denari = 3 punti. Se hai anche 4, 5, 6, 7 consecutivi vale fino a 7 punti!\n• Grande: Jack (8), Donna (9) e Re (10) di Denari = 5 punti. Se manca una carta è "rotta" (0 pt).\n\nCAPPOTTO DI DENARI: Se un giocatore prende tutti i 10 Denari, fa cappotto e vince immediatamente la partita!',
    curiosity:
      'I Denari ("palanche") sono il seme più prestigioso della Cirulla: chi controlla i Denari controlla il destino della partita.',
  },
  {
    title: 'Vittoria della Partita',
    badge: 'VITTORIA',
    content:
      'Vince chi per primo raggiunge o supera i 51 punti (partita classica) oppure i 31 punti (partita rapida). In caso di parità al traguardo, si gioca una smazzata di spareggio.',
  },
];
