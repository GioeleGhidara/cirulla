# Cirulla - Gioco Tradizionale Ligure per Mobile

Un'applicazione curata, autentica e pronta per iOS e Android dedicata al gioco tradizionale ligure della **Cirulla**.

Sviluppata con **React Native + Expo**, TypeScript, grafica vettoriale nitida ad alta risoluzione, audio ed effetti sonori realistici, feedback aptico e un motore tattico con intelligenza artificiale calibrato sulle regole autentiche genovesi.

---

## Caratteristiche Principali

- **Regole Autentiche di Cirulla**:
  - **Valori delle Figure**: Fante (Jack) = 8, Donna (Cavallo) = 9, Re = 10.
  - **Il Monte**: Controllo iniziale delle 4 carte a terra (se la somma è 15 assegna 1 Scopa al mazziere, se è 30 assegna 2 Scope).
  - **Bussate di Mano (Accuse)**: Valutazione automatica all'inizio di ogni mano da 3 carte:
    - *Cirulla (Bussata da 3 punti)* (somma $\le 9$): +3 punti immediati con carte scoperte.
    - *Decino (Bussata da 10 punti)* (tris di carte uguali): +10 punti immediati con carte scoperte.
    - *La Matta (7 di Cuori)*: assume il valore più favorevole da 1 a 10 per completare o migliorare la Cirulla o il Decino.
  - **Prese del 15**: Calcolo di tutte le combinazioni a somma 15 con la carta giocata.
  - **Presa d'Uguale**: Possibilità di prendere carte dello stesso valore.
  - **Asso Pigliatutto**: L'Asso prende tutto il tavolo facendo Scopa (oppure somma 15 se presente).
  - **Punti di Mazzo**: Carte (>20), Denari (>5), Settebello (7 di Denari), Primiera completa con valori tradizionali, Piccola Denari (fino a 7 pt) e Grande Denari (8, 9, 10 di Denari = 5 pt).
- **Intelligenza Artificiale Tattica a 3 Livelli**:
  - *Facile*: per principianti, con scelte intuitive.
  - *Normale*: valuta Quadri, Settebello e Scope.
  - *Campione (Maestro Genovese)*: calcola combinazioni pericolose, difende la Piccola, evita scarti che concedono il 15 o l'Asso.
- **Grafica e Stile Curato**:
  - Tavolo in panno verde feltro con sfumature eleganti.
  - Mazzo a scelta tra **Genovesi tradizionali**, **Piacentine** e **Napoletane**.
  - Carte vettoriali nitide con badge dorati per Settebello e Matta.
  - Banner animati per Scope ed Accuse.
- **Audio e Feedback Aptico**:
  - Effetti sonori per giocata carta, presa, scopa, accuse e vittoria.
  - Feedback aptico integrato per iPhone (`expo-haptics`).
- **Statistiche di Carriera**:
  - Partite vinte, perse, percentuale di vittoria, record scope, Grandi e Piccole realizzate (salvate in locale su `AsyncStorage`).

---