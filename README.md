
# 🎲 Tombola Royale

**Tombola Royale** è una moderna reinterpretazione web della classica Tombola napoletana con funzionalità Multiplayer Peer-to-Peer e lista Smorfia tradizionale integrata.

![Tombola Royale Screenshot](https://via.placeholder.com/800x400?text=Tombola+Royale+Preview)

---

## 🚀 Pubblicazione (Deployment)

Per istruzioni dettagliate su come mettere il gioco online usando **Netlify**, **GitHub Pages** o **Vercel**, leggi la guida dedicata:

👉 **[LEGGI LA GUIDA AL DEPLOYMENT](./DEPLOYMENT.md)**

Il metodo più veloce per iniziare resta **Netlify Drop**:
1. Esegui `npm run build`
2. Trascina la cartella `dist` su [Netlify Drop](https://app.netlify.com/drop).

---

## ✨ Caratteristiche Principali

*   **Multiplayer P2P:** Connessione diretta tra Host e Giocatori.
*   **Ruoli Dinamici:** Host (Annunciatore) e Giocatori.
*   **Smorfia Integrata:** Significati tradizionali napoletani.
*   **Sintesi Vocale (TTS):** Lettura automatica dei numeri.
*   **Verifica Vincite:** Ambo, Terno, Quaterna, Cinquina, Tombola.

## 📜 Regole del Gioco

Il sistema applica le regole "severe" della Tombola:
1.  **Vittorie Condivise**: Possibili solo se avvengono sullo **stesso numero estratto**.
2.  **Turni Chiusi**: Se l'host estrae un nuovo numero, i premi del turno precedente sono persi. Bisogna essere veloci a dichiarare!

## 🛠️ Esecuzione Locale (Sviluppo)

1.  **Installa:** `npm install`
2.  **Avvia:** `npm run dev`

