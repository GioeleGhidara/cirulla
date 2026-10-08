# 🃏 Cirulla - Gioco di Carte per iOS (App Store)

Un'applicazione completa, autentica e pronta per la pubblicazione su **App Store** (iOS/iPadOS) dedicata al gioco tradizionale ligure della **Cirulla**.

Sviluppata con **React Native + Expo SDK 57**, TypeScript, grafica vettoriale nitida ad alta risoluzione, audio ed effetti sonori realistici, feedback aptico e un motore di Intelligenza Artificiale progettato per competere applicando le vere tattiche genovesi.

---

## 🌟 Caratteristiche Principali

- **Regole Autentiche di Cirulla**:
  - **Il Monte**: Controllo iniziale delle 4 carte a terra (se la somma è 15 assegna 1 Scopa al mazziere, se è 30 assegna 2 Scope!).
  - **Accuse di Mano**: Valutazione automatica all'inizio di ogni mano da 3 carte:
    - *Buona da tre* (somma $\le 9$): +3 punti immediati con carte scoperte.
    - *Buona da dieci* (tris di carte uguali): +10 punti immediati.
    - *La Matta (7 di Spade)*: assume il valore più favorevole da 1 a 10 per completare o migliorare l'accusa.
  - **Prese del 15**: Calcolo di tutte le combinazioni a somma 15 con la carta giocata.
  - **Presa d'Uguale**: Possibilità di prendere carte dello stesso valore.
  - **Asso Pigliatutto**: L'Asso prende tutto il tavolo facendo Scopa (se c'è già un Asso a terra, prende solo l'Asso).
  - **Punti di Mazzo**: Carte (>20), Denari (>5), Settebello (7♦), Primiera completa con valori tradizionali, Piccola Denari (fino a 7 pt) e Grande Denari (8, 9, 10 di Denari = 5 pt).
- **Intelligenza Artificiale Tattica a 3 Livelli**:
  - *Facile*: per principianti, con scelte intuitive.
  - *Normale*: valuta Denari, Settebello e Scope.
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

## 🚀 Come Provare l'App Subito

### Opzione 1: Su iPhone / iPad con Expo Go (Consigliato)
1. Installa l'app gratuita **Expo Go** dall'App Store sul tuo iPhone o iPad.
2. Nel terminale esegui:
   ```bash
   npx expo start
   ```
3. Inquadra il QR code generato nel terminale con la fotocamera del tuo iPhone per aprire l'app all'istante senza bisogno di cavi.

### Opzione 2: Nel Browser Web
Puoi avviare l'anteprima web con:
```bash
npm run web
```
Oppure:
```bash
npx expo start --web
```

---

## 🍏 Come Pubblicare su Apple App Store da Windows (EAS Build)

Grazie a **Expo Application Services (EAS)**, puoi compilare e inviare l'applicazione su App Store direttamente dal tuo PC Windows senza dover possedere un computer Mac:

### 1. Prerequisiti
- Un account sviluppatore Apple Developer ($99/anno su [developer.apple.com](https://developer.apple.com)).
- Un account gratuito su [expo.dev](https://expo.dev).

### 2. Login ad Expo
Esegui nel terminale:
```bash
npx eas-cli login
```

### 3. Configura il progetto EAS
```bash
npx eas-cli project:init
```

### 4. Compila per iOS (Cloud Build)
Per generare la build di produzione per App Store:
```bash
npx eas-cli build --platform ios --profile production
```
EAS gestirà automaticamente certificati, provisioning profile e compilazione sui server cloud di Apple/Expo.

### 5. Invia all'App Store
Al termine della compilazione puoi inviare il binario direttamente a **TestFlight** o **App Store Connect**:
```bash
npx eas-cli submit --platform ios
```

---

## 🛠️ Comandi Utili per lo Sviluppo

```bash
# Controllo integrità TypeScript
npx tsc --noEmit

# Diagnosi dipendenze e configurazioni Expo
npx expo-doctor

# Avvio del server di sviluppo
npx expo start
```
