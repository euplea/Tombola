# 🚀 Guida alla Pubblicazione (Deployment)

Questa guida ti spiegherà come mettere online il tuo gioco **Tombola Royale** in modo che amici e parenti possano accederci da qualsiasi dispositivo.

---

## 1. Preparazione (Build)

Prima di pubblicare su qualsiasi piattaforma, assicurati di aver generato la versione ottimizzata del gioco.

1.  Apri il terminale nella cartella del progetto.
2.  Esegui l'installazione delle dipendenze (da fare solo la prima volta):
    ```bash
    npm install
    ```
3.  Esegui il comando di build:
    ```bash
    npm run build
    ```
4.  Questo comando creerà una cartella chiamata **`dist`** che contiene tutti i file pronti per essere pubblicati.

> **Nota:** Puoi testare questa versione localmente eseguendo `npm run preview`.

---

## 2. Metodo Veloce: Netlify Drop (Gratis)

Il metodo più semplice, non richiede account complicati o configurazioni git.

1.  Genera la cartella `dist` come spiegato nel punto 1.
2.  Vai su [Netlify Drop](https://app.netlify.com/drop).
3.  Trascina la cartella **`dist`** (non tutto il progetto, solo la cartella `dist`) nell'area tratteggiata.
4.  Attendi il caricamento.
5.  Il tuo sito sarà online! Copia l'URL fornito.

---

## 3. Metodo Avanzato: GitHub Pages (Gratis)

Se hai il codice su GitHub, questo metodo automattiza gli aggiornamenti.

Il file `package.json` è già configurato per questo.

### Prerequisiti
*   Il progetto deve essere in un repository GitHub.
*   Devi avere le credenziali git configurate.

### Passaggi
1.  Apri il file `package.json` e trova la riga `"homepage"`. Modificala con il tuo URL GitHub Pages:
    ```json
    "homepage": "https://TUO_USERNAME.github.io/NOME_REPO",
    ```
    *Esempio: se il tuo user è `mario` e la repo è `tombola`, scrivi `https://mario.github.io/tombola`.*

2.  Esegui il comando di deploy incluso:
    ```bash
    npm run deploy
    ```
    *(Questo comando esegue automaticamente la build e carica la cartella `dist` sul ramo `gh-pages`)*.

3.  Vai su GitHub > Settings > Pages.
4.  Assicurati che "Source" sia impostato su "Deploy from a branch" e seleziona il branch `gh-pages`.
5.  Dopo qualche minuto, il sito sarà attivo al link impostato.

---

## 4. Metodo Alternativo: Vercel (Gratis & Veloce)

Vercel è ottimo per progetti React/Vite.

1.  Installa la CLI di Vercel (opzionale) o vai sul sito [Vercel](https://vercel.com/new).
2.  Importa il tuo repository GitHub.
3.  Vercel rileverà automaticamente che è un progetto **Vite**.
4.  Le impostazioni di build predefinite (`npm run build`, output: `dist`) sono corrette.
5.  Clicca **Deploy**.

---

## Risoluzione Problemi Comuni

*   **Pagina bianca online:** Spesso causato da percorsi sbagliati. Assicurati che in `vite.config.ts` sia presente `base: './'` (o il percorso corretto della sottocartella se usi GitHub Pages).
*   **Modifiche non visibili:** Assicurati di aver rieseguito `npm run build` o `npm run deploy` dopo ogni modifica al codice.
