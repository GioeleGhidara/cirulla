export const PRIMIERA_VALUES: Record<number, number> = {
  7: 21,
  6: 18,
  1: 16, // Asso
  5: 15,
  4: 14,
  3: 13,
  2: 12,
  8: 10, // Fante
  9: 10, // Cavallo
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
  8: 'Fante',
  9: 'Cavallo',
  10: 'Re',
};

export const SUIT_NAMES: Record<string, string> = {
  denari: 'Denari',
  coppe: 'Coppe',
  spade: 'Spade',
  bastoni: 'Bastoni',
};

export const CIRULLA_GUIDE = [
  {
    title: '1. Il Monte Iniziale (15 o 30)',
    content:
      'All\'inizio della smazzata vengono poste 4 carte scoperte sul tavolo. Se la somma delle carte è 15, il mazziere prende tutto e segna 1 Scopa! Se la somma è 30, il mazziere segna ben 2 Scope!',
  },
  {
    title: '2. Le Accuse alla Distribuzione',
    content:
      'Ogni volta che vengono distribuite 3 carte in mano, si controllano le combinazioni speciali:\n• "Buona da tre": se la somma dei valori è ≤ 9, guadagni 3 punti!\n• "Buona da dieci": se hai 3 carte dello stesso valore, guadagni 10 punti!\n• Il 7 di Spade è la "Matta": può assumere qualunque valore da 1 a 10 per comporre l\'accusa più vantaggiosa.',
  },
  {
    title: '3. Le Prese: Regola del 15',
    content:
      'Se il valore della carta giocata sommato a una o più carte a terra fa esattamente 15, prendi tutte quelle carte!\nEsempio: giochi un 7 e a terra c\'è un 8 (7+8=15), oppure giochi un 5 e a terra ci sono 3 e 7 (5+3+7=15).',
  },
  {
    title: '4. Presa Diretta e Asso Pigliatutto',
    content:
      '• Puoi sempre prendere una carta di valore uguale a quella giocata (es. Fante prende Fante).\n• Se giochi un Asso e non ci sono Assi a terra, prendi TUTTE le carte sul tavolo e fai Scopa!\n• Se a terra c\'è già un Asso, il tuo Asso prende solo l\'Asso a terra.',
  },
  {
    title: '5. La Scopa',
    content:
      'Ogni volta che con una presa lasci il tavolo completamente vuoto, fai Scopa (+1 punto), tranne con l\'ultima carta dell\'intera smazzata.',
  },
  {
    title: '6. Punteggio Finale di Smazzata',
    content:
      'Al termine del mazzo da 40 carte si assegnano i punti di mazzo:\n• Carte: chi ha più di 20 carte (1 pt)\n• Denari: chi ha più di 5 denari (1 pt)\n• Settebello: chi ha il 7 di Denari (1 pt)\n• Primiera: miglior punteggio di primiera (1 pt)\n• Piccola: Asso, 2 e 3 di Denari (3 pt), +1 pt per ogni carta consecutiva fino al 7 (fino a 7 pt!)\n• Grande: Fante, Cavallo e Re di Denari (5 pt!).\n\nVince chi per primo raggiunge il punteggio obiettivo (51 o 31 punti)!',
  },
];
