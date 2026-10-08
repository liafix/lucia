# QA REPORT — PROJECT LUCIA V1.1

## Build

- `npm run build:offline` vykonaný úspešne po posledných zmenách.
- `dist/` bol pred buildom kompletne odstránený a vytvorený nanovo.
- WebP assets v `public/photos/` a `dist/photos/` majú identické SHA-256 hashe.
- `BUILD_INFO.txt` v `dist/` dokumentuje aktuálny prebuild.
- React/TypeScript source bol syntakticky prekontrolovaný cez TypeScript transpiler.

Poznámka: pracovný runtime nemá prístup k npm registry, preto tu nebol vykonaný `npm install` + Vite build. Štandardný `npm run build` zostáva pripravený pre Vercel/GitHub prostredie. Fresh prebuilt `dist/` bol generovaný z lokálneho `src/runtime/*` production runtime a následne otestovaný.

## Browser QA — PASS

Produkčné `dist/app.js`, `dist/styles.css` a vendored React súbory boli spustené v headless Chromium. Keďže runtime blokuje lokálnu HTTP navigáciu, presné produkčné súbory boli vložené cez `set_content`; dve lokálne WebP fotografie boli vložené ako data URI iba pre testovanie.

Overené viewporty:

- 390×844 — hlavný mobile QA
- 1440×900 — desktop layout
- 320×568 — small-mobile horizontal overflow smoke test
- 390×844 s `prefers-reduced-motion: reduce`

Overený flow:

- intro → photo experience
- načítanie oboch fotografií
- keyboard Enter na úvodnom CTA
- Heart Collector 1/5 až 5/5
- particle/counter state a 5/5 reveal
- Srdcová bilancia s `Odvaha napísať / Počet pozvaní / Šanca na dobrú kávu`
- finálna otázka a text s `účtovníckym pokecom`
- „Káva & spoznávanie“ ending
- „Účtovnícky pokec“ ending
- „Možno inokedy“ ending
- copy-to-clipboard stav `Skopírované`
- restart aplikácie
- žiadny horizontálny overflow pri 390 px, 320 px ani desktope
- reduced-motion CSS fallback
- žiadne zachytené console/page JavaScript errors

Výsledok: **PASS**.

## Typografická kontrola

Globálny search po poslednom builde:

- `pokecem` → **0 výskytov**
- správny tvar `pokecom` sa nachádza v source aj `dist/app.js`

## Preview screenshots

- `mobile-gallery-v1.1.png`
- `mobile-invite-v1.1.png`
- `desktop-gallery-v1.1.png`
