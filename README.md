# Cirulla - Gioco Tradizionale Ligure per Mobile

Un'applicazione curata, autentica e pronta per iOS e Android dedicata al gioco tradizionale ligure della **Cirulla**.

Sviluppata con **React Native + Expo**, TypeScript, grafica vettoriale nitida ad alta risoluzione, audio ed effetti sonori realistici, feedback aptico e un motore tattico con intelligenza artificiale calibrato sulle regole autentiche genovesi.

---

## Caratteristiche Principali

- **Regole Autentiche di Cirulla**:
  - **Valori delle Figure**: Fante (Jack) = 8, Donna (Cavallo) = 9, Re = 10.
  - **Scope in tavola**: Controllo iniziale delle 4 carte a terra: se la somma è 15 assegna 1 Scopa al mazziere, se è 30 assegna 2 Scope.
  - **L'ultima mano**: Chi realizza la presa dell'ultima mano, raccoglie tutte le carte rimaste a terra.
  - **A monte**: ontrollo iniziale delle 4 carte a terra: se sono presenti 2 assi, la smazzata ricomincia e si ridanno le carte.
  - **Bussate di Mano (Accuse)**: Valutazione automatica all'inizio di ogni mano da 3 carte:
    - *Cirulla (Bussata da 3 punti)* (somma $\le 9$): +3 scope.
    - *Decino (Bussata da 10 punti)* (tris di carte uguali): +10 scope.
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
  - Tavolo in panno verde feltro con sfumature eleganti e mazzo fisico (Tallone) tridimensionale con conteggio carte.
  - Indicatore dinamico del **Mazziere** ("Sei Mazziere" / "Mazziere: Avversario") e animazione di mescolamento/distribuzione.
  - **Giocata visibile dell'Avversario**: animazione che mostra la carta calata e le carte a terra catturate prima di riporle nel mucchio.
  - **Presa Manuale Interattiva**: selezione diretta cliccando le carte sul tavolo senza spoiler o suggerimenti automatici, con validazione immediata delle regole e avviso in caso di errore.
  - Carte regionali storiche nitide (**Genovesi Dal Negro**, Piacentine, Napoletane, ecc.) pulite e fedeli alla tradizione.
  - Banner animati per Scope, Cirulla (3 pt), Decino (10 pt) e Monte.
- **Audio e Feedback Aptico**:
  - Effetti sonori per giocata carta, presa, scopa, accuse e vittoria.
  - Feedback aptico integrato per dispositivi mobili (`expo-haptics`).
- **Statistiche di Carriera**:
  - Partite vinte, perse, percentuale di vittoria, record scope, Grandi e Piccole realizzate (salvate in locale su `AsyncStorage`).

---