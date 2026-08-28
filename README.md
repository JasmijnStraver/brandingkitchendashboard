# Studio Crave — Skills Dashboard

Klanten-dashboard met de 7-Course Brand Method als menu, plus een bonus-gang
("Digestief") voor groei- en planningstools. Elke Course is een gang, elke
skill een kaart. Klikken op "Open" start een chat die de bijbehorende
skill-instructies gebruikt.

Klanten loggen in met naam + persoonlijke toegangscode (zie "Klanten
beheren" hieronder) voordat ze het menu zien.

## Starten in Claude Code

1. Open deze map in Claude Code (`claude` in de terminal, in deze projectmap).
2. Vraag Claude Code om te installeren en te starten:
   ```
   npm install
   npm run dev
   ```
3. Ga naar de lokale URL die Vite toont (meestal `http://localhost:5173`).
4. Log in met naam `Demo` en toegangscode `PROEFGANG` om het dashboard te zien.

## Klanten beheren

Klanten en hun toegangscode staan in `src/clients.js`. Voeg een regel toe
per klant:

```js
export const CLIENTS = [
  { name: "Demo", code: "PROEFGANG" },
  { name: "Anne", code: "ANNE2024" },
];
```

Er zit geen wachtwoord-hashing of database achter — dit is een lichte
toegangsdrempel voor een klein aantal klanten, geen zware auth-laag. Vraag
Claude Code om dit later uit te breiden (bijv. met Supabase auth) als het
klantenaantal groeit.

## De API laten werken

Dit project praat met Claude via een eigen serverless functie (`api/chat.js`),
zodat je API-key nooit in de browser terechtkomt.

- Lokaal testen met de API vraagt om `vercel dev` in plaats van `vite dev`
  (Vite alleen serveert geen `/api`-routes). Vraag Claude Code hierbij te
  helpen als je dat wilt opzetten.
- In productie (Vercel): zet een environment variable `ANTHROPIC_API_KEY`
  met je key van console.anthropic.com.

## Skills aansluiten

Alle 23 skills staan in het menu (`src/App.jsx`, `COURSES`-array) én zijn
live (`wired: true`), met een systeemprompt in het `SYSTEM_PROMPTS`-object
die gecomprimeerd is uit het bijbehorende `.skill`-bestand.

Ga je een skill finetunen (scherper maken, andere output-regels, etc.)?
1. Pas het `.skill`-bestand aan zoals je gewend bent.
2. Vraag Claude Code om de bijgewerkte tekst te comprimeren tot een nieuwe
   systeemprompt en de bestaande entry in `SYSTEM_PROMPTS` in `src/App.jsx`
   te vervangen (key = skill `id` uit `COURSES`).

Wil je een skill juist tijdelijk uitzetten (bijv. tijdens het herschrijven)?
Zet `wired: false` bij die skill in de `COURSES`-array — de kaart toont dan
weer een "Binnenkort"-badge in plaats van "Open".

## Deployen

Zelfde flow als je andere projecten: push naar GitHub, koppel de repo aan
Vercel, zet de `ANTHROPIC_API_KEY` environment variable in de Vercel
project-instellingen.

## Merkstijl

Bordeaux (`#3E1017` / `#5C1A24`) + rood (`#C21E2C`) op een warme
creme-achtergrond, Barlow Condensed voor koppen (bold/black), Inter voor
body-tekst — consistent met de Studio Crave huisstijl.
